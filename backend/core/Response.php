<?php
/**
 * Response — Helpers para respostas JSON padronizadas
 */

class Response {
    public static function json($data, int $code = 200, string $message = ''): void {
        http_response_code($code);
        $response = ['success' => $code >= 200 && $code < 300, 'data' => $data];
        if ($message) $response['message'] = $message;
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success($data = null, string $message = '', int $code = 200): void {
        http_response_code($code);
        $response = ['success' => true];
        if ($data !== null) $response['data'] = $data;
        if ($message) $response['message'] = $message;
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function error(string $message, int $code = 400, $errors = null): void {
        http_response_code($code);
        $response = ['success' => false, 'error' => $message, 'code' => $code];
        if ($errors !== null) $response['errors'] = $errors;
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function created($data = null, string $message = 'Recurso criado com sucesso'): void {
        self::success($data, $message, 201);
    }

    public static function noContent(): void {
        http_response_code(204);
        exit;
    }

    public static function unauthorized(string $message = 'Não autorizado'): void {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'Acesso negado'): void {
        self::error($message, 403);
    }

    public static function notFound(string $message = 'Recurso não encontrado'): void {
        self::error($message, 404);
    }

    public static function validationError(string $message = 'Dados inválidos', $errors = null): void {
        self::error($message, 422, $errors);
    }
}
