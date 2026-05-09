<?php
/**
 * ValidationHelper — Sanitização e validação de inputs
 */

class ValidationHelper {
    public static function email(string $email): bool {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function required(array $data, array $fields): array {
        $missing = [];
        foreach ($fields as $field) {
            if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
                $missing[] = $field;
            }
        }
        return $missing;
    }

    public static function minLength(string $value, int $min): bool {
        return mb_strlen($value) >= $min;
    }

    public static function maxLength(string $value, int $max): bool {
        return mb_strlen($value) <= $max;
    }

    public static function numeric($value): bool {
        return is_numeric($value);
    }

    public static function positiveNumber($value): bool {
        return is_numeric($value) && floatval($value) > 0;
    }

    public static function inEnum(string $value, array $allowed): bool {
        return in_array($value, $allowed, true);
    }

    public static function sanitize(string $value): string {
        return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
    }

    public static function passwordStrength(string $password): bool {
        // Mín 6 caracteres
        return mb_strlen($password) >= 6;
    }
}
