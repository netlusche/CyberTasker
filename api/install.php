<?php
// install.php
// Universal Installer for both MySQL/MariaDB and SQLite with Diagnostics

// Initialize session immediately before any HTML output to allow HTTP headers to transmit Session Cookies
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(['path' => '/']);
    session_start();
}

// Enable error reporting explicitly for installer troubleshooting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db.php';
require_once __DIR__ . '/Response.php';

$dbType = defined('DB_TYPE') ? DB_TYPE : 'mysql';

ob_start();

echo "<h3>CyberTasker Installer Diagnostic Mode</h3>\n";
echo "PHP Version: " . phpversion() . "<br>\n";
echo "PDO Drivers: " . implode(', ', PDO::getAvailableDrivers()) . "<br>\n";

echo "<h4>Checking config constants...</h4>\n";
echo "DB_TYPE: " . (defined('DB_TYPE') ? DB_TYPE : "NOT DEFINED (defaulting to mysql)") . "<br>\n";
echo "DB_HOST: " . (defined('DB_HOST') ? DB_HOST : "NOT DEFINED") . "<br>\n";
echo "DB_NAME: " . (defined('DB_NAME') ? DB_NAME : "NOT DEFINED") . "<br>\n";
echo "DB_USER: " . (defined('DB_USER') ? substr(DB_USER, 0, 1) . "****" : "NOT DEFINED") . "<br>\n";


try {
    echo "<h4>Attempting database connection...</h4>\n";
    $pdo = getDBConnection();
    echo "Database connection successful.<br>\n";

    if ($dbType === 'sqlite') {
        echo "SQLite DB File: " . DB_NAME . "<br>\n";
        echo "Writable: " . (is_writable(DB_NAME) ? 'YES' : 'NO') . "<br>\n";
    }
    else {
        echo "MySQL Host: " . DB_HOST . "<br>\n";
        echo "MySQL DB Name: " . DB_NAME . "<br>\n";
    }

    echo "<h4>Checking Database Lock Status...</h4>\n";
    require_once __DIR__ . '/DatabaseMigrator.php';
    $migratorForLock = new DatabaseMigrator($pdo, $dbType);
    if ($migratorForLock->tableExists('users')) {
        // Security 1.0: Zero-Config Auto-Lock
        // If the 'users' table exists, the system is considered initialized. 
        // To proceed with schema updates, the operative MUST be logged in as an Admin.
        // BYPASS for CLI (tests, automated deployments)
        if (php_sapi_name() !== 'cli' && (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin')) {
            ob_clean();
            ob_clean();
            Response::error('[ ACCESS DENIED: SECURITY AUTO-LOCK ] The grid operates under Admin lock. Only registered administrators may execute schema updates.', 403);
        }
        echo "<span style='color: green;'>ACCESS GRANTED. Proceeding with schema update...</span><br>\n";
    }
    else {
        echo "<span style='color: #ff8c00;'>SYSTEM EMPTY: First-time initialization detected. Auto-Lock bypassed.</span><br>\n";
    }

    $isCli = (php_sapi_name() === 'cli');
    $initEmail = null;
    $initPassword = 'password';
    $initUsername = 'admin';
    $initLanguage = 'en';

    if (!$isCli) {
        if (!$migratorForLock->tableExists('users')) {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                // Redirect to the frontend installer
                header("Location: ../install.html");
                exit;
            }

            // Handle POST credentials
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            if (!$data || empty($data['username']) || empty($data['email']) || empty($data['password'])) {
                ob_clean();
                ob_clean();
                Response::error('Username, Email, and Password are required.', 400);
            }

            $initUsername = trim($data['username']);
            if (strlen($initUsername) < 3 || !preg_match('/^[a-zA-Z0-9_\-]+$/', $initUsername)) {
                ob_clean();
                ob_clean();
                Response::error('Invalid username format. Must be at least 3 alphanumeric characters.', 400);
            }

            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                ob_clean();
                ob_clean();
                Response::error('Invalid email address.', 400);
            }
            $initEmail = trim($data['email']);
            $initPassword = $data['password'];
            $initLanguage = $data['language'] ?? 'en';
        }
        else {
            // CRITICAL FIX: If the table exists, NEVER allow a POST request to proceed.
            // This prevents a malicious user from reloading the installer to inject a default 'admin' account
            // while the site is already initialized with a custom username.
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                ob_clean();
                ob_clean();
                Response::error('ACCESS DENIED: SYSTEM ALREADY INITIALIZED.', 403);
            }
        }
    }


    require_once __DIR__ . '/DatabaseMigrator.php';

    $schema = [
        'users' => [
            'columns' => [
                'id' => '{AUTO_INCREMENT}',
                'username' => 'VARCHAR(50) NOT NULL UNIQUE',
                'password' => 'VARCHAR(255) NOT NULL',
                'role' => "VARCHAR(20) DEFAULT 'user'",
                'two_factor_enabled' => "BOOLEAN DEFAULT 0",
                'two_factor_secret' => "VARCHAR(32) NULL",
                'two_factor_method' => "VARCHAR(20) DEFAULT 'totp'",
                'two_factor_backup_codes' => "TEXT NULL",
                'email' => "VARCHAR(255) UNIQUE DEFAULT NULL",
                'is_verified' => "BOOLEAN DEFAULT 1",
                'verification_token' => "VARCHAR(64) DEFAULT NULL",
                'reset_token' => "VARCHAR(64) DEFAULT NULL",
                'reset_expires' => "DATETIME DEFAULT NULL",
                'last_login' => "TIMESTAMP NULL DEFAULT NULL",
                'theme' => "VARCHAR(20) DEFAULT 'cyberpunk'",
                'language' => "VARCHAR(10) DEFAULT 'en'",
                'calendar_token' => "VARCHAR(64) DEFAULT NULL",
                'created_at' => "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
            ],
            'indexes' => [
                "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_calendar_token ON users(calendar_token) WHERE calendar_token IS NOT NULL"
            ]
        ],
        'tasks' => [
            'columns' => [
                'id' => '{AUTO_INCREMENT}',
                'user_id' => 'INT',
                'title' => 'VARCHAR(255) NOT NULL',
                'category' => "VARCHAR(50) DEFAULT 'General'",
                'priority' => "INT DEFAULT 2",
                'status' => "BOOLEAN DEFAULT 0",
                'points_value' => "INT DEFAULT 10",
                'due_date' => "DATETIME DEFAULT NULL",
                'description' => "TEXT NULL",
                'attachments' => "TEXT NULL",
                'files' => "TEXT NULL",
                'subroutines_json' => "TEXT NULL",
                'recurrence_interval' => "VARCHAR(20) DEFAULT NULL",
                'recurrence_end_date' => "DATETIME DEFAULT NULL",
                'created_at' => "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
                'workflow_status' => "VARCHAR(50) DEFAULT 'open'"
            ],
            'post_column_scripts' => [
                'workflow_status' => "UPDATE tasks SET workflow_status = 'completed' WHERE status = 1"
            ]
        ],
        'task_notes' => [
            'columns' => [
                'id' => '{AUTO_INCREMENT}',
                'task_id' => 'INT NOT NULL',
                'user_id' => 'INT NOT NULL',
                'note_text' => 'TEXT NOT NULL',
                'created_at' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                'updated_at' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            ],
            'constraints' => [
                'FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE',
                'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
            ]
        ],
        'user_task_statuses' => [
            'columns' => [
                'id' => '{AUTO_INCREMENT}',
                'user_id' => 'INT NOT NULL',
                'name' => 'VARCHAR(50) NOT NULL',
                'is_system' => 'BOOLEAN DEFAULT 0',
                'sort_order' => 'INT DEFAULT 0'
            ],
            'constraints' => [
                'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
            ]
        ],
        'user_categories' => [
            'columns' => [
                'id' => '{AUTO_INCREMENT}',
                'user_id' => 'INT NOT NULL',
                'name' => 'VARCHAR(50) NOT NULL',
                'is_default' => 'BOOLEAN DEFAULT 0'
            ],
            'constraints' => [
                'UNIQUE(user_id, name)',
                'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
            ]
        ],
        'user_stats' => [
            'columns' => [
                'id' => 'INT PRIMARY KEY',
                'total_points' => 'INT DEFAULT 0',
                'current_level' => 'INT DEFAULT 1',
                'badges_json' => '{JSON}'
            ]
        ],
        'auth_logs' => [
            'columns' => [
                'id' => '{AUTO_INCREMENT}',
                'ip_address' => 'VARCHAR(45) NOT NULL',
                'endpoint' => 'VARCHAR(50) NOT NULL',
                'success' => 'BOOLEAN NOT NULL',
                'created_at' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            ]
        ],
        'system_settings' => [
            'columns' => [
                'setting_key' => 'VARCHAR(50) PRIMARY KEY',
                'setting_value' => 'VARCHAR(255)'
            ]
        ]
    ];

    $migrator = new DatabaseMigrator($pdo, $dbType);
    $migrationLogs = $migrator->migrate($schema);

    foreach ($migrationLogs as $log) {
        echo $log . "<br>\n";
    }

    // --- DEFAULT ADMIN USER ---
    $adminUsername = $initUsername;
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$adminUsername]);

    if (!$stmt->fetch()) {
        $adminPassword = password_hash($initPassword, PASSWORD_DEFAULT);

        // Insert Admin
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role, is_verified, email, language) VALUES (?, ?, 'admin', 1, ?, ?)");
        $stmt->execute([$adminUsername, $adminPassword, $initEmail, $initLanguage]);
        $adminId = $pdo->lastInsertId();

        // Initialize Stats
        $stmtStats = $pdo->prepare("INSERT INTO user_stats (id, total_points, current_level, badges_json) VALUES (?, 0, 1, '[]')");
        $stmtStats->execute([$adminId]);

        // Initialize Default Statuses
        $stmtStatus = $pdo->prepare("INSERT INTO user_task_statuses (user_id, name, is_system, sort_order) VALUES (?, ?, ?, ?)");
        $stmtStatus->execute([$adminId, 'open', 1, 1]);
        $stmtStatus->execute([$adminId, 'in progress', 0, 2]);
        $stmtStatus->execute([$adminId, 'under review', 0, 3]);
        $stmtStatus->execute([$adminId, 'completed', 1, 4]);

        echo "Master Admin account '$adminUsername' created.<br>\n";

        // --- INJECT SECURITY DIRECTIVES ---
        // Seed Admin Manual PDF
        $manualSource = __DIR__ . '/../manuals/CyberTasker_Admin_Guide.pdf';
        $uploadDir = __DIR__ . '/uploads/';
        $pdfAttachment = null;

        if (file_exists($manualSource)) {
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $uniqueName = uniqid('task_file_', true) . '.pdf';
            $destination = $uploadDir . $uniqueName;

            if (copy($manualSource, $destination)) {
                $pdfAttachment = json_encode([[
                        "name" => "CyberTasker_Admin_Guide.pdf",
                        "path" => "api/index.php?route=tasks/download&file=" . $uniqueName,
                        "size" => filesize($destination),
                        "type" => "application/pdf",
                        "uploaded_at" => date('Y-m-d H:i:s')
                    ]]);
            }
        }
        $directives = [
            ['i18n:initial_tasks.enforce_2fa_title', 'Work', 1, 15, 'i18n:initial_tasks.enforce_2fa_desc'],
            ['OVERRIDE DEFAULT ACCESS: Update Access Key or initialize new Operative ID and terminate \'admin\' account.', 'Work', 1, 15, 'CRITICAL: The default administrator credentials represent a severe security vulnerability. You must immediately provision a personalized operative account with elevated privileges, or change the default access key to a high-entropy passphrase.'],
            ['PURGE INSTALLER CORE: Terminate \'install.php\' from the server grid immediately.', 'Work', 1, 10, 'Leaving the installation script active on a production grid allows unauthorized entities to re-initialize the database, potentially exposing or destroying all operational data. Delete the file immediately.'],
            ['ACTIVATE NEURAL ENCRYPTION: Navigate to Admin Console and toggle \'STRICT_PASSWORD_POLICY\' to Level 1.', 'Work', 1, 10, 'Activating the strict password policy ensures all new operatives utilize cryptographic-grade access keys, preventing brute-force neural intrusions. Go to the Admin Panel and enforce this setting.'],
            ['SCRUB RESIDUAL TRACES: Remove \'install_test_user.php\' and other leftover test nodes.', 'Work', 2, 5, 'Clean up any leftover testing scripts that were used to validate the system deployment. These unmonitored endpoints are prime vectors for exploitation.'],
            ['CALIBRATE NEURAL LINK: Perform a System Reset to optimize your ocular data stream.', 'Work', 3, 5, 'The initial boot sequence may leave fragmented data packets in your visual buffer. A quick system refresh will align your UI components correctly and ensure everything is loaded cleanly into RAM.'],
            ['UPGRADE COFFEE PROTOCOL: Ensure Operative Fuel levels are at maximum stability.', 'Work', 3, 5, 'The most critical variable in any system architecture is the biological component. Maintain optimal hydration and caffeine levels to ensure peak performance.']
        ];

        $stmtTask = $pdo->prepare("INSERT INTO tasks (user_id, title, category, priority, points_value, files, description) VALUES (?, ?, ?, ?, ?, ?, ?)");

        $first = true;
        foreach ($directives as $d) {
            $files = null;
            if ($first && $pdfAttachment) {
                $files = $pdfAttachment;
                $first = false;
            }
            $stmtTask->execute([$adminId, $d[0], $d[1], $d[2], $d[3], $files, $d[4]]);
        }
        echo "Initial Admin security directives deployed.<br>\n";
    }
    else {
        echo "Admin user already exists.<br>\n";
    }

    // Default Settings
    $stmt = $pdo->prepare("SELECT setting_value FROM system_settings WHERE setting_key = ?");
    $stmt->execute(['strict_password_policy']);
    if (!$stmt->fetch()) {
        $pdo->prepare("INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?)")
            ->execute(['strict_password_policy', '0']);
        echo "Default setting 'strict_password_policy' initialized to '0'.<br>\n";
    }

    $stmt = $pdo->prepare("SELECT setting_value FROM system_settings WHERE setting_key = ?");
    $stmt->execute(['enforce_email_2fa']);
    if (!$stmt->fetch()) {
        $pdo->prepare("INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?)")
            ->execute(['enforce_email_2fa', '0']);
        echo "Default setting 'enforce_email_2fa' initialized to '0'.<br>\n";
    }

    echo "<h4>Installation/Update Final Verification:</h4>";
    $tables = ['users', 'tasks', 'user_categories', 'user_task_statuses', 'user_stats', 'system_settings'];
    foreach ($tables as $t) {
        $count = $pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn();
        echo "Table '$t' row count: <b>$count</b><br>\n";
    }

    echo "Installation/Update Complete!";
    ob_end_flush();
}
catch (PDOException $e) {
    ob_clean();
    ob_clean();
    Response::error("CRITICAL ERROR: " . $e->getMessage() . " (SQL State: " . $e->getCode() . ")", 500);
}
catch (Throwable $t) {
    ob_clean();
    ob_clean();
    Response::error("GENERAL ERROR: " . $t->getMessage() . " in " . $t->getFile() . ":" . $t->getLine(), 500);
}
?>