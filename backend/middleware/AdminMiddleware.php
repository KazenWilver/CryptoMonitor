<?php
/**
 * AdminMiddleware — Verifica role = admin (requer AuthMiddleware antes)
 */

class AdminMiddleware {
    public static function handle(Request $request): void {
        // AuthMiddleware já deve ter sido chamado
        if (!$request->user || $request->user['role'] !== 'admin') {
            Response::forbidden('Acesso restrito a administradores');
        }
    }
}
