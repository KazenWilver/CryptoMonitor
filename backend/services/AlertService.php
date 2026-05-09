<?php
/**
 * AlertService — Lógica de negócio dos alertas de preço
 */

class AlertService {
    private AlertRepository $repo;

    public function __construct() {
        $this->repo = new AlertRepository();
    }

    public function getUserAlerts(int $userId): array {
        return $this->repo->findByUserId($userId);
    }

    public function createAlert(int $userId, array $data): array {
        $id = $this->repo->create([
            'user_id'        => $userId,
            'crypto_id'      => $data['crypto_id'],
            'crypto_symbol'  => $data['crypto_symbol'],
            'condition_type' => $data['condition_type'],
            'target_price'   => $data['target_price'],
        ]);
        return $this->repo->findById($id);
    }

    public function updateAlert(int $userId, int $id, array $data): array {
        $alert = $this->repo->findById($id);
        if (!$alert || $alert['user_id'] !== $userId) {
            Response::notFound('Alerta não encontrado');
        }
        $this->repo->update($id, $data);
        return $this->repo->findById($id);
    }

    public function deleteAlert(int $userId, int $id): bool {
        $alert = $this->repo->findById($id);
        if (!$alert || $alert['user_id'] !== $userId) {
            Response::notFound('Alerta não encontrado');
        }
        return $this->repo->delete($id);
    }
}
