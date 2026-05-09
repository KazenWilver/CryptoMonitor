<?php
/**
 * AuthService — Lógica de autenticação (hash, validação, token)
 */

class AuthService {
    private UserRepository $userRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
    }

    public function register(array $data): array {
        // Verificar se email já existe
        if ($this->userRepo->findByEmail($data['email'])) {
            Response::validationError('Email já registado');
        }

        $userId = $this->userRepo->create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'language'      => $data['language'] ?? 'pt',
            'theme'         => $data['theme'] ?? 'dark',
        ]);

        $user = $this->userRepo->findById($userId);
        $token = JWTHelper::encode([
            'user_id' => $user['id'],
            'email'   => $user['email'],
            'role'    => $user['role'],
        ]);

        return [
            'token' => $token,
            'user'  => $this->sanitizeUser($user),
        ];
    }

    public function login(string $email, string $password): array {
        $user = $this->userRepo->findByEmail($email);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::unauthorized('Credenciais inválidas');
        }

        if (!$user['is_active']) {
            Response::forbidden('Conta desativada');
        }

        $token = JWTHelper::encode([
            'user_id' => $user['id'],
            'email'   => $user['email'],
            'role'    => $user['role'],
        ]);

        return [
            'token' => $token,
            'user'  => $this->sanitizeUser($user),
        ];
    }

    public function forgotPassword(string $email): bool {
        $user = $this->userRepo->findByEmail($email);
        if (!$user) return true; // Não revelar se email existe

        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hora

        $this->userRepo->createResetToken($user['id'], $token, $expiresAt);

        // Em produção: enviar email com link contendo o token
        // Para ambiente de desenvolvimento: o token é retornado na resposta
        return true;
    }

    public function resetPassword(string $token, string $newPassword): bool {
        $resetRecord = $this->userRepo->findResetToken($token);
        if (!$resetRecord) {
            Response::validationError('Token inválido ou expirado');
        }

        $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $this->userRepo->update($resetRecord['user_id'], ['password_hash' => $passwordHash]);
        $this->userRepo->markTokenUsed($resetRecord['id']);

        return true;
    }

    private function sanitizeUser(array $user): array {
        unset($user['password_hash']);
        return $user;
    }
}
