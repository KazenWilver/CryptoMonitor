<?php
/**
 * Router — Roteador HTTP simples (Front Controller Pattern)
 * Despacha METHOD + URI → Controller::method
 */

class Router {
    private array $routes = [];
    private Request $request;

    public function __construct() {
        $this->request = new Request();
    }

    public function get(string $pattern, callable $handler, array $middleware = []): void {
        $this->addRoute('GET', $pattern, $handler, $middleware);
    }

    public function post(string $pattern, callable $handler, array $middleware = []): void {
        $this->addRoute('POST', $pattern, $handler, $middleware);
    }

    public function put(string $pattern, callable $handler, array $middleware = []): void {
        $this->addRoute('PUT', $pattern, $handler, $middleware);
    }

    public function delete(string $pattern, callable $handler, array $middleware = []): void {
        $this->addRoute('DELETE', $pattern, $handler, $middleware);
    }

    private function addRoute(string $method, string $pattern, callable $handler, array $middleware): void {
        $this->routes[] = [
            'method'     => $method,
            'pattern'    => $pattern,
            'handler'    => $handler,
            'middleware'  => $middleware
        ];
    }

    public function dispatch(): void {
        $method = $this->request->getMethod();
        $uri    = $this->request->getUri();

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;

            $params = $this->matchRoute($route['pattern'], $uri);
            if ($params === false) continue;

            $this->request->setParams($params);

            // Executar middleware
            foreach ($route['middleware'] as $mw) {
                $mw($this->request);
            }

            // Executar handler
            call_user_func($route['handler'], $this->request);
            return;
        }

        Response::notFound('Endpoint não encontrado');
    }

    private function matchRoute(string $pattern, string $uri): array|false {
        // Converter {param} para regex
        $regex = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $pattern);
        $regex = '#^' . $regex . '$#';

        if (preg_match($regex, $uri, $matches)) {
            $params = [];
            foreach ($matches as $key => $value) {
                if (is_string($key)) {
                    $params[$key] = $value;
                }
            }
            return $params;
        }

        return false;
    }
}
