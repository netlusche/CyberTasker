<?php
// install_sqlite.php
// SQLite specific installer for local development
require_once 'db.php';

echo "Installing CyberTasker Database (SQLite)...<br>\n";

try {
    $pdo = getDBConnection();

    // SQLite doesn't support SHOW COLUMNS or complex ALTER TABLE in the same way,
    // so for this local dev script, we'll focus on creating tables if they don't exist.
    // Schema updates might need manual handling or recreation of the DB file during dev.

    // Create Users Table
    $sqlUsers = "CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        role TEXT DEFAULT 'user',
        two_factor_enabled INTEGER DEFAULT 0,
        two_factor_secret TEXT,
        email TEXT UNIQUE DEFAULT NULL,
        is_verified INTEGER DEFAULT 1,
        verification_token TEXT DEFAULT NULL,
        reset_token TEXT DEFAULT NULL,
        reset_expires DATETIME DEFAULT NULL
    )";
    $pdo->exec($sqlUsers);
    echo "Table 'users' check/create complete.<br>\n";

    // Create Tasks Table
    $sqlTasks = "CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        priority INTEGER DEFAULT 2,
        status INTEGER DEFAULT 0,
        points_value INTEGER DEFAULT 10,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlTasks);
    echo "Table 'tasks' check/create complete.<br>\n";

    // Create User Stats Table
    $sqlUserStats = "CREATE TABLE IF NOT EXISTS user_stats (
        id INTEGER PRIMARY KEY,
        total_points INTEGER DEFAULT 0,
        current_level INTEGER DEFAULT 1,
        badges_json TEXT
    )";
    $pdo->exec($sqlUserStats);
    echo "Table 'user_stats' check/create complete.<br>\n";

    // --- DEFAULT ADMIN USER ---
    $adminUsername = 'admin';
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$adminUsername]);
    if (!$stmt->fetch()) {
        $adminPassword = password_hash('password', PASSWORD_DEFAULT);
        // SQLite uses 1 for true
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role, is_verified) VALUES (?, ?, 'admin', 1)");
        $stmt->execute([$adminUsername, $adminPassword]);
        $adminId = $pdo->lastInsertId();

        $stmtStats = $pdo->prepare("INSERT INTO user_stats (id, total_points, current_level, badges_json) VALUES (?, 0, 1, '[]')");
        $stmtStats->execute([$adminId]);

        echo "Default Admin user 'admin' created.<br>\n";
    }
    else {
        echo "Admin user already exists.<br>\n";
    }

    echo "Installation Complete!";

}
catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
    exit(1);
}
?>