<?php
require 'api/db.php';
require 'api/repositories/TaskRepository.php';
$pdo = getDBConnection();
$repo = new TaskRepository($pdo);
try {
    $res = $repo->getFilteredTasks(1, '', null, null, false, 25, 0);
    print_r($res);
} catch (Exception $e) {
    echo $e->getMessage();
}
