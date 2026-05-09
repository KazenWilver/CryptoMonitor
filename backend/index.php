<?php
/**
 * Entry Point — Bootstrap do Backend
 * Carrega config, CORS, e despacha via Router.
 */

// Autoload composer (JWT, PHPMailer, FPDF)
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Carregar .env
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($key) . '=' . trim($value));
    }
}

// Config
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/cors.php';

// Core
require_once __DIR__ . '/core/Database.php';
require_once __DIR__ . '/core/Request.php';
require_once __DIR__ . '/core/Response.php';
require_once __DIR__ . '/core/JWTHelper.php';
require_once __DIR__ . '/core/Router.php';

// Helpers
require_once __DIR__ . '/helpers/ValidationHelper.php';
require_once __DIR__ . '/helpers/CacheHelper.php';

// Middleware
require_once __DIR__ . '/middleware/AuthMiddleware.php';
require_once __DIR__ . '/middleware/AdminMiddleware.php';

// Repositories
require_once __DIR__ . '/repositories/UserRepository.php';
require_once __DIR__ . '/repositories/WatchlistRepository.php';
require_once __DIR__ . '/repositories/PortfolioRepository.php';
require_once __DIR__ . '/repositories/AlertRepository.php';
require_once __DIR__ . '/repositories/ExportLogRepository.php';

// Services
require_once __DIR__ . '/services/AuthService.php';
require_once __DIR__ . '/services/CryptoService.php';
require_once __DIR__ . '/services/WatchlistService.php';
require_once __DIR__ . '/services/PortfolioService.php';
require_once __DIR__ . '/services/AlertService.php';
require_once __DIR__ . '/services/AnalyticsService.php';
require_once __DIR__ . '/services/ExportService.php';

// Controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/CryptoController.php';
require_once __DIR__ . '/controllers/WatchlistController.php';
require_once __DIR__ . '/controllers/PortfolioController.php';
require_once __DIR__ . '/controllers/AlertController.php';
require_once __DIR__ . '/controllers/AnalyticsController.php';
require_once __DIR__ . '/controllers/ExportController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/AdminController.php';

// Aplicar CORS
cors_headers();

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Carregar rotas e despachar
$router = new Router();
require_once __DIR__ . '/routes/api.php';
$router->dispatch();
