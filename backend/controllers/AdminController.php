<?php
class AdminController {
    private UserRepository $userRepo;
    private ExportLogRepository $exportLogRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
        $this->exportLogRepo = new ExportLogRepository();
    }

    public function listUsers(Request $request): void {
        $page = (int) $request->getQuery('page', 1);
        $perPage = (int) $request->getQuery('per_page', 20);
        $users = $this->userRepo->findAll($page, $perPage);
        $total = $this->userRepo->count();
        Response::success(['users' => $users, 'total' => $total, 'page' => $page, 'pages' => ceil($total / $perPage)]);
    }

    public function updateUser(Request $request): void {
        $id = (int) $request->getParam('id');
        $body = $request->getBody();
        $user = $this->userRepo->findById($id);
        if (!$user) Response::notFound('Utilizador não encontrado');
        $allowed = [];
        if (isset($body['role'])) $allowed['role'] = $body['role'];
        if (isset($body['is_active'])) $allowed['is_active'] = $body['is_active'] ? 1 : 0;
        if (isset($body['name'])) $allowed['name'] = $body['name'];
        if (empty($allowed)) Response::validationError('Nada para atualizar');
        $this->userRepo->update($id, $allowed);
        $u = $this->userRepo->findById($id);
        unset($u['password_hash']);
        Response::success($u, 'Utilizador atualizado');
    }

    public function deleteUser(Request $request): void {
        $id = (int) $request->getParam('id');
        if ($id === $request->user['id']) Response::validationError('Não pode eliminar-se');
        $this->userRepo->update($id, ['is_active' => 0]);
        Response::success(null, 'Utilizador desativado');
    }

    public function getStats(Request $request): void {
        Response::success([
            'total_users' => $this->userRepo->count(),
            'total_exports' => $this->exportLogRepo->countAll(),
        ]);
    }
}
