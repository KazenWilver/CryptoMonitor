<?php
/**
 * UserRepository — Queries para a tabela users e password_resets
 */

class UserRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            "INSERT INTO users (name, email, password_hash, role, language, theme)
             VALUES (:name, :email, :password_hash, :role, :language, :theme)"
        );
        $stmt->execute([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password_hash' => $data['password_hash'],
            'role'          => $data['role'] ?? 'user',
            'language'      => $data['language'] ?? 'pt',
            'theme'         => $data['theme'] ?? 'dark',
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
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function findAll(int $page = 1, int $perPage = 20): array {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT id, name, email, role, language, theme, is_active, created_at
             FROM users ORDER BY created_at DESC LIMIT :limit OFFSET :offset"
        );
        $stmt->bindValue('limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue('offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function count(): int {
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM users");
        return (int) $stmt->fetch()['total'];
    }

    // Password Reset
    public function createResetToken(int $userId, string $token, string $expiresAt): int {
        $stmt = $this->db->prepare(
            "INSERT INTO password_resets (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)"
        );
        $stmt->execute(['user_id' => $userId, 'token' => $token, 'expires_at' => $expiresAt]);
        return (int) $this->db->lastInsertId();
    }

    public function findResetToken(string $token): ?array {
        $stmt = $this->db->prepare(
            "SELECT * FROM password_resets WHERE token = :token AND used = 0 AND expires_at > NOW()"
        );
        $stmt->execute(['token' => $token]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function markTokenUsed(int $id): bool {
        $stmt = $this->db->prepare("UPDATE password_resets SET used = 1 WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
