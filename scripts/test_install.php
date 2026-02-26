<?php
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['SERVER_PORT'] = 8000;
// Mock php://input
function mock_input() {
    return json_encode(["username"=>"klingon_ruler", "email"=>"klingon_ruler@user.local", "password"=>"password", "language"=>"tlh"]);
}
// We can't mock php://input easily without stream wrappers.
// Instead, let's just use php -S localhost:8080 and curl it!
