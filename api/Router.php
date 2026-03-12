<?php
declare(strict_types=1);

// api/Router.php
require_once __DIR__ . '/middlewares/MiddlewareInterface.php';

class Router
{
    private array $routes = [];
    private array $globalMiddlewares = [];

    public function addMiddleware(MiddlewareInterface $middleware): void
    {
        $this->globalMiddlewares[] = $middleware;
    }

    public function get(string $path, array |callable $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, array |callable $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    public function put(string $path, array |callable $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete(string $path, array |callable $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute(string $method, string $path, array |callable $handler): void
    {
        // Normalize path
        $path = trim($path, '/');
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch(string $method, string $requestRoute): void
    {
        $requestRoute = trim($requestRoute, '/');
        $routeMatched = null;

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $route['path'] === $requestRoute) {
                $routeMatched = $route;
                break;
            }
        }

        if (!$routeMatched) {
            http_response_code(404);
            header("Content-Type: application/json");
            echo json_encode(['error' => 'Route not found: ' . ($requestRoute ?: '/')]);
            exit;
        }

        $handler = $routeMatched['handler'];

        // Core Callable
        $coreCallable = function () use ($handler) {
            if (is_array($handler) && count($handler) === 2) {
                $class = $handler[0];
                $methodName = $handler[1];
                $controller = new $class();
                $controller->$methodName();
            }
            else if (is_callable($handler)) {
                call_user_func($handler);
            }
        };

        // Middlewares Form Pipeline (Reverse Order for closure wrapping)
        $pipeline = $coreCallable;
        $allMiddlewares = array_reverse($this->globalMiddlewares);

        foreach ($allMiddlewares as $middleware) {
            $next = $pipeline;
            $pipeline = function () use ($middleware, $method, $requestRoute, $next) {
                $middleware->handle($method, $requestRoute, $next);
            };
        }

        // Execute Pipeline
        $pipeline();
    }
}