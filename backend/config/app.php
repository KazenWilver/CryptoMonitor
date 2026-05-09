<?php
/**
 * Configuração da aplicação
 */

define('APP_NAME', 'CryptoMonitor');
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'crypto_monitor_secret_key_2026');
define('JWT_EXPIRY', 86400); // 24 horas
define('COINGECKO_BASE_URL', 'https://api.coingecko.com/api/v3');
define('COINGECKO_API_KEY', $_ENV['COINGECKO_API_KEY'] ?? '');
define('CACHE_DIR', __DIR__ . '/../storage/cache/');
define('EXPORTS_DIR', __DIR__ . '/../storage/exports/');
define('LOGS_DIR', __DIR__ . '/../storage/logs/');

// Criar diretórios se não existirem
foreach ([CACHE_DIR, EXPORTS_DIR, LOGS_DIR] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}
