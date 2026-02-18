<?php
require_once 'db.php';
$pdo = getDBConnection();

echo "USERS:\n";
$stmt = $pdo->query("SELECT id, username, role FROM users");
while ($row = $stmt->fetch()) {
    echo "ID: {$row['id']} | Username: {$row['username']} | Role: {$row['role']}\n";
}

echo "\nTASKS (Sample/Count):\n";
$stmt = $pdo->query("SELECT user_id, COUNT(*) as count FROM tasks GROUP BY user_id");
while ($row = $stmt->fetch()) {
    echo "User ID: {$row['user_id']} | Task Count: {$row['count']}\n";
}

echo "\nOVERDUE SAMPLE:\n";
$stmt = $pdo->query("SELECT id, user_id, title, due_date, status FROM tasks WHERE due_date < date('now') AND status = 0 LIMIT 5");
while ($row = $stmt->fetch()) {
    echo "ID: {$row['id']} | User: {$row['user_id']} | Title: {$row['title']} | Due: {$row['due_date']} | Status: {$row['status']}\n";
}
?>