<?php
declare(strict_types=1);

require_once __DIR__ . '/MiddlewareInterface.php';

class CsrfMiddleware implements MiddlewareInterface
{
    private array $exemptRoutes;

    public function __construct(array $exemptRoutes = [])
    {
        $this->exemptRoutes = $exemptRoutes;
    }

    public function handle(string $method, string $route, callable $next): void
    {
        if (!in_array($route, $this->exemptRoutes)) {
            if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
                $headers = function_exists('getallheaders') ? getallheaders() : [];
                $token = $headers['X-CSRF-Token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

                if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
                    http_response_code(403);
                    header("Content-Type: application/json");
                    echo json_encode(['error' => 'CSRF Token Mismatch / Security Invalid']);
                    exit;
                }
            }
        }

        $next();
    }
}