<?php
/**
 * Request — Abstração do HTTP Request
 */

class Request {
    private string $method;
    private string $uri;
    private array $params;
    private array $query;
    private ?array $body;
    private array $headers;
    public ?array $user = null; // Injetado pelo AuthMiddleware

    public function __construct() {
        $this->method  = strtoupper($_SERVER['REQUEST_METHOD']);
        $this->uri     = $this->parseUri();
        $this->params  = [];
        $this->query   = $_GET;
        $this->body    = $this->parseBody();
        $this->headers = $this->parseHeaders();
    }

    private function parseUri(): string {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        // Remover query string
        $uri = strtok($uri, '?');
        // Remover base path (caso backend esteja em subdiretório)
        $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
        if ($scriptDir !== '/' && $scriptDir !== '\\') {
            $uri = substr($uri, strlen($scriptDir));
        }
        return '/' . trim($uri, '/');
    }

    private function parseBody(): ?array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) return null;
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : null;
    }

    private function parseHeaders(): array {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $name = str_replace('_', '-', substr($key, 5));
                $headers[strtolower($name)] = $value;
            }
        }
        // Apache CGI strips Authorization — read from env var set by .htaccess
        if (!isset($headers['authorization'])) {
            if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
                $headers['authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
            } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
                $headers['authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
            } elseif (function_exists('apache_request_headers')) {
                $apacheHeaders = apache_request_headers();
                if (isset($apacheHeaders['Authorization'])) {
                    $headers['authorization'] = $apacheHeaders['Authorization'];
                }
            }
        }
        return $headers;
    }

    public function getMethod(): string { return $this->method; }
    public function getUri(): string { return $this->uri; }
    public function getQuery(string $key, $default = null) { return $this->query[$key] ?? $default; }
    public function getBody(string $key = null, $default = null) {
        if ($key === null) return $this->body;
        return $this->body[$key] ?? $default;
    }
    public function getHeader(string $name): ?string { return $this->headers[strtolower($name)] ?? null; }
    public function getParam(string $key, $default = null) { return $this->params[$key] ?? $default; }
    public function setParams(array $params): void { $this->params = $params; }
    public function getBearerToken(): ?string {
        $auth = $this->getHeader('authorization');
        if ($auth && preg_match('/Bearer\s+(.+)$/i', $auth, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
