<?php
/**
 * UserController — Perfil e preferências do utilizador
 */

class UserController {
    private UserRepository $userRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
    }

    public function getProfile(Request $request): void {
        $user = $request->user;
        unset($user['password_hash']);
        Response::success($user);
    }

    public function updateProfile(Request $request): void {
        $body = $request->getBody();
        $userId = $request->user['id'];

        $allowed = [];
        if (isset($body['name'])) $allowed['name'] = ValidationHelper::sanitize($body['name']);
        if (isset($body['email'])) {
            if (!ValidationHelper::email($body['email'])) {
                Response::validationError('Email inválido');
            }
            $existing = $this->userRepo->findByEmail($body['email']);
            if ($existing && $existing['id'] !== $userId) {
                Response::validationError('Email já está em uso');
            }
            $allowed['email'] = $body['email'];
        }

        if (empty($allowed)) Response::validationError('Nenhum campo para atualizar');

        $this->userRepo->update($userId, $allowed);
        $user = $this->userRepo->findById($userId);
        unset($user['password_hash']);
        Response::success($user, 'Perfil atualizado');
    }

    public function updatePassword(Request $request): void {
        $body = $request->getBody();
        $userId = $request->user['id'];

        $missing = ValidationHelper::required($body ?? [], ['current_password', 'new_password']);
        if (!empty($missing)) Response::validationError('Campos obrigatórios em falta', $missing);

        $user = $this->userRepo->findById($userId);
        if (!password_verify($body['current_password'], $user['password_hash'])) {
            Response::validationError('Password atual incorreta');
        }
        if (!ValidationHelper::passwordStrength($body['new_password'])) {
            Response::validationError('Nova password deve ter pelo menos 6 caracteres');
        }

        $this->userRepo->update($userId, ['password_hash' => password_hash($body['new_password'], PASSWORD_BCRYPT)]);
        Response::success(null, 'Password alterada com sucesso');
    }

    public function updatePreferences(Request $request): void {
        $body = $request->getBody();
        $userId = $request->user['id'];

        $allowed = [];
        if (isset($body['theme']) && ValidationHelper::inEnum($body['theme'], ['light', 'dark'])) {
            $allowed['theme'] = $body['theme'];
        }
        if (isset($body['language']) && ValidationHelper::inEnum($body['language'], ['pt', 'en'])) {
            $allowed['language'] = $body['language'];
        }
        if (isset($body['base_currency'])) {
            $allowed['base_currency'] = strtoupper(substr($body['base_currency'], 0, 10));
        }

        if (empty($allowed)) Response::validationError('Nenhuma preferência para atualizar');

        $this->userRepo->update($userId, $allowed);
        $user = $this->userRepo->findById($userId);
        unset($user['password_hash']);
        Response::success($user, 'Preferências atualizadas');
    }
}
