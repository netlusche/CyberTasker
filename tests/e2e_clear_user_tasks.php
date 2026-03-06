<?php
/**
 * e2e_clear_user_tasks.php
 * Script to delete all tasks for a specific user.
 * Used exclusively by E2E tests (like 17-focus-mode.spec.js) to ensure
 * a clean state instead of relying on fragile UI loops or DB-specific CLI commands.
 */

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.");
}

require_once __DIR__ . '/../api/db.php';
$pdo = getDBConnection();

$username = $argv[1] ?? '';

if (empty($username)) {
    echo "Error: Username parameter is required.\n";
    exit(1);
}

// Ensure the user actually exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$stmt->execute([$username]);
$userId = $stmt->fetchColumn();

if (!$userId) {
    echo "Error: User '$username' not found.\n";
    exit(1);
}

// Delete tasks
$stmt = $pdo->prepare("DELETE FROM tasks WHERE user_id = ?");
$stmt->execute([$userId]);
$deletedCount = $stmt->rowCount();

echo "e2e_clear_user_tasks.php: Deleted $deletedCount seeded tasks for user '$username' (ID: $userId).\n";
