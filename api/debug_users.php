<?php
require_once 'db.php';
$pdo = getDBConnection();
$stmt = $pdo->query("SELECT id, username, email FROM users");
$users = $stmt->fetchAll();
echo "<pre>" . print_r($users, true) . "</pre>";
?>