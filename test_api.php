<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
$_GET['route'] = 'tasks';
session_start();
$_SESSION['user_id'] = 1;
require 'api/index.php';
