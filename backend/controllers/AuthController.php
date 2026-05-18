<?php
/**
 * AuthController — Endpoints de autenticação
 */

class AuthController {
    private AuthService $service;

    public function __construct() {
        $this->service = new AuthService();
    }

    public function register(Request $request): void {
        $body = $request->getBody();
        $missing = ValidationHelper::required($body ?? [], ['name', 'email', 'password']);
        if (!empty($missing)) {
            Response::validationError('Campos obrigatórios em falta', $missing);
        }

        if (!ValidationHelper::email($body['email'])) {
            Response::validationError('Email inválido');
        }
        if (!ValidationHelper::passwordStrength($body['password'])) {
            Response::validationError('Password deve ter pelo menos 6 caracteres');
        }

        $result = $this->service->register($body);
        Response::created($result, 'Conta criada com sucesso');
    }

    public function login(Request $request): void {
        $body = $request->getBody();
        $missing = ValidationHelper::required($body ?? [], ['email', 'password']);
        if (!empty($missing)) {
            Response::validationError('Email e password são obrigatórios', $missing);
        }

        $result = $this->service->login($body['email'], $body['password']);
        Response::success($result, 'Login efetuado com sucesso');
    }

    public function logout(Request $request): void {
        // JWT é stateless — o frontend remove o token
        Response::success(null, 'Logout efetuado com sucesso');
    }

    public function forgotPassword(Request $request): void {
        $body = $request->getBody();
        if (empty($body['email'])) {
            Response::validationError('Email é obrigatório');
        }
        $token = $this->service->forgotPassword($body['email']);
        $message = 'Se o email existir, receberá instruções de recuperação';
        
        // Em dev env, retornar token na payload.
        Response::success(['reset_token' => $token], $message);
    }

    public function resetPassword(Request $request): void {
        $body = $request->getBody();
        $missing = ValidationHelper::required($body ?? [], ['token', 'password']);
        if (!empty($missing)) {
            Response::validationError('Token e nova password são obrigatórios', $missing);
        }
        if (!ValidationHelper::passwordStrength($body['password'])) {
            Response::validationError('Password deve ter pelo menos 6 caracteres');
        }
        $this->service->resetPassword($body['token'], $body['password']);
        Response::success(null, 'Password redefinida com sucesso');
    }
}
