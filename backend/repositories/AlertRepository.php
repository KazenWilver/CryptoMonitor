<?php
/**
 * AlertRepository — Queries para price_alerts
 */

class AlertRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findByUserId(int $userId): array {
        $stmt = $this->db->prepare(
            "SELECT * FROM price_alerts WHERE user_id = :user_id ORDER BY created_at DESC"
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM price_alerts WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            "INSERT INTO price_alerts (user_id, crypto_id, crypto_symbol, condition_type, target_price)
             VALUES (:user_id, :crypto_id, :crypto_symbol, :condition_type, :target_price)"
        );
        $stmt->execute([
            'user_id'        => $data['user_id'],
            'crypto_id'      => $data['crypto_id'],
            'crypto_symbol'  => $data['crypto_symbol'],
            'condition_type' => $data['condition_type'],
            'target_price'   => $data['target_price'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $fields = [];
        $params = ['id' => $id];
        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
            $params[$key] = $value;
        }
        $sql = "UPDATE price_alerts SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM price_alerts WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function getActiveAlerts(): array {
        $stmt = $this->db->query("SELECT * FROM price_alerts WHERE is_active = 1");
        return $stmt->fetchAll();
    }

    public function countByUser(int $userId): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM price_alerts WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        return (int) $stmt->fetch()['total'];
    }
}
