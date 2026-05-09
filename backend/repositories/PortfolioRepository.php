<?php
/**
 * PortfolioRepository — Queries para portfolio_transactions
 */

class PortfolioRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findByUserId(int $userId): array {
        $stmt = $this->db->prepare(
            "SELECT * FROM portfolio_transactions WHERE user_id = :user_id ORDER BY transaction_date DESC"
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM portfolio_transactions WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            "INSERT INTO portfolio_transactions (user_id, crypto_id, crypto_symbol, crypto_name, type, quantity, price_usd, transaction_date, notes)
             VALUES (:user_id, :crypto_id, :crypto_symbol, :crypto_name, :type, :quantity, :price_usd, :transaction_date, :notes)"
        );
        $stmt->execute([
            'user_id'          => $data['user_id'],
            'crypto_id'        => $data['crypto_id'],
            'crypto_symbol'    => $data['crypto_symbol'],
            'crypto_name'      => $data['crypto_name'],
            'type'             => $data['type'],
            'quantity'         => $data['quantity'],
            'price_usd'        => $data['price_usd'],
            'transaction_date' => $data['transaction_date'],
            'notes'            => $data['notes'] ?? null,
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
        $sql = "UPDATE portfolio_transactions SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM portfolio_transactions WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    /**
     * Calcula holdings agregados por cripto
     */
    public function getHoldings(int $userId): array {
        $stmt = $this->db->prepare(
            "SELECT crypto_id, crypto_symbol, crypto_name,
                    SUM(CASE WHEN type = 'buy' THEN quantity ELSE -quantity END) as total_quantity,
                    SUM(CASE WHEN type = 'buy' THEN quantity * price_usd ELSE -quantity * price_usd END) as total_cost,
                    COUNT(*) as transaction_count
             FROM portfolio_transactions
             WHERE user_id = :user_id
             GROUP BY crypto_id, crypto_symbol, crypto_name
             HAVING total_quantity > 0"
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }
}
