<?php
/**
 * WatchlistRepository — Queries para a tabela watchlist
 */

class WatchlistRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findByUserId(int $userId): array {
        $stmt = $this->db->prepare(
            "SELECT * FROM watchlist WHERE user_id = :user_id ORDER BY added_at DESC"
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM watchlist WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function exists(int $userId, string $cryptoId): bool {
        $stmt = $this->db->prepare(
            "SELECT COUNT(*) as count FROM watchlist WHERE user_id = :user_id AND crypto_id = :crypto_id"
        );
        $stmt->execute(['user_id' => $userId, 'crypto_id' => $cryptoId]);
        return (int) $stmt->fetch()['count'] > 0;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            "INSERT INTO watchlist (user_id, crypto_id, crypto_symbol, crypto_name)
             VALUES (:user_id, :crypto_id, :crypto_symbol, :crypto_name)"
        );
        $stmt->execute([
            'user_id'       => $data['user_id'],
            'crypto_id'     => $data['crypto_id'],
            'crypto_symbol' => $data['crypto_symbol'],
            'crypto_name'   => $data['crypto_name'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM watchlist WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function countByUser(int $userId): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM watchlist WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        return (int) $stmt->fetch()['total'];
    }
}
