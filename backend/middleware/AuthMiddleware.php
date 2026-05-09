<?php
/**
 * AuthMiddleware — Valida JWT e injeta $user no request
 */

class AuthMiddleware {
    public static function handle(Request $request): void {
        $token = $request->getBearerToken();
        if (!$token) {
            Response::unauthorized('Token não fornecido');
        }

        $payload = JWTHelper::decode($token);
        if (!$payload) {
            Response::unauthorized('Token inválido ou expirado');
        }

        // Verificar se utilizador existe e está ativo
        $userRepo = new UserRepository();
        $user = $userRepo->findById($payload['user_id']);
        if (!$user || !$user['is_active']) {
            Response::unauthorized('Utilizador não encontrado ou inativo');
        }

        $request->user = $user;
    }
}
