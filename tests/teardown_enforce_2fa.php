<?php
// tests/teardown_enforce_2fa.php
// Directly disables the Enforced 2FA setting to prevent test suite pollution

require_once __DIR__ . '/../api/db.php';

try {
    $pdo = getDBConnection();
    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
        $pdo->exec("PRAGMA busy_timeout = 5000;");
    }

    $stmt = $pdo->prepare("UPDATE system_settings SET setting_value = '0' WHERE setting_key = 'enforce_email_2fa'");
    $stmt->execute();

    echo "Teardown complete: Enforce Email 2FA disabled.\n";
}
catch (Exception $e) {
    echo "Teardown failed: " . $e->getMessage() . "\n";
    exit(1);
}