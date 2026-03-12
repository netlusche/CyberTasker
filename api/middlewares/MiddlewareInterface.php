<?php
declare(strict_types=1);

interface MiddlewareInterface
{
    public function handle(string $method, string $route, callable $next): void;
}