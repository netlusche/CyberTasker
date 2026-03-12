<?php
declare(strict_types=1);
// api/Response.php

class Response
{
    public static function json(array $data, int $status = 200): void
    {
        while (ob_get_level()) {
            ob_end_clean();
        }
        http_response_code($status);
        header("Content-Type: application/json");
        echo json_encode($data);
        exit;
    }

    public static function error(string $message, int $status = 400): void
    {
        self::json(['error' => $message], $status);
    }
}