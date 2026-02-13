<?php
require_once 'db.php';
$pdo = getDBConnection();

$users = ['Frank', 'Pupskopf'];
$newPass = password_hash('password', PASSWORD_DEFAULT);

foreach ($users as $u) {
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = ?");
    $stmt->execute([$newPass, $u]);
    echo "Reset password for $u to 'password'.\n";
}
?>