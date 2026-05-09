<?php
/**
 * ExportLogRepository — Queries para export_logs
 */

class ExportLogRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function create(int $userId, string $reportType, string $format): int {
        $stmt = $this->db->prepare(
            "INSERT INTO export_logs (user_id, report_type, format) VALUES (:user_id, :report_type, :format)"
        );
        $stmt->execute([
            'user_id'     => $userId,
            'report_type' => $reportType,
            'format'      => $format,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function findByUserId(int $userId): array {
        $stmt = $this->db->prepare(
            "SELECT * FROM export_logs WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 50"
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function countAll(): int {
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM export_logs");
        return (int) $stmt->fetch()['total'];
    }
}
