<?php
/**
 * API Routes — Mapeamento completo
 */

$auth  = [AuthMiddleware::class, 'handle'];
$admin = [AdminMiddleware::class, 'handle'];

// AUTH (público)
$router->post('/api/auth/register',        [new AuthController(), 'register']);
$router->post('/api/auth/login',           [new AuthController(), 'login']);
$router->post('/api/auth/logout',          [new AuthController(), 'logout'], [$auth]);
$router->post('/api/auth/forgot-password', [new AuthController(), 'forgotPassword']);
$router->post('/api/auth/reset-password',  [new AuthController(), 'resetPassword']);

// USER PROFILE (autenticado)
$router->get('/api/user/profile',       [new UserController(), 'getProfile'], [$auth]);
$router->put('/api/user/profile',       [new UserController(), 'updateProfile'], [$auth]);
$router->put('/api/user/password',      [new UserController(), 'updatePassword'], [$auth]);
$router->put('/api/user/preferences',   [new UserController(), 'updatePreferences'], [$auth]);

// CRYPTO (autenticado)
$router->get('/api/crypto/markets',     [new CryptoController(), 'getMarkets'], [$auth]);
$router->get('/api/crypto/trending',    [new CryptoController(), 'getTrending'], [$auth]);
$router->get('/api/crypto/global',      [new CryptoController(), 'getGlobal'], [$auth]);
$router->get('/api/crypto/search',      [new CryptoController(), 'search'], [$auth]);
$router->get('/api/crypto/{id}',        [new CryptoController(), 'getDetail'], [$auth]);
$router->get('/api/crypto/{id}/history', [new CryptoController(), 'getHistory'], [$auth]);
$router->get('/api/crypto/{id}/analytics', [new AnalyticsController(), 'getAnalytics'], [$auth]);

// WATCHLIST (autenticado)
$router->get('/api/watchlist',          [new WatchlistController(), 'index'], [$auth]);
$router->post('/api/watchlist',         [new WatchlistController(), 'store'], [$auth]);
$router->delete('/api/watchlist/{id}',  [new WatchlistController(), 'destroy'], [$auth]);

// PORTFOLIO (autenticado)
$router->get('/api/portfolio',                  [new PortfolioController(), 'getHoldings'], [$auth]);
$router->get('/api/portfolio/transactions',     [new PortfolioController(), 'getTransactions'], [$auth]);
$router->post('/api/portfolio/transactions',    [new PortfolioController(), 'storeTransaction'], [$auth]);
$router->put('/api/portfolio/transactions/{id}', [new PortfolioController(), 'updateTransaction'], [$auth]);
$router->delete('/api/portfolio/transactions/{id}', [new PortfolioController(), 'destroyTransaction'], [$auth]);

// ALERTS (autenticado)
$router->get('/api/alerts',             [new AlertController(), 'index'], [$auth]);
$router->post('/api/alerts',            [new AlertController(), 'store'], [$auth]);
$router->put('/api/alerts/{id}',        [new AlertController(), 'update'], [$auth]);
$router->delete('/api/alerts/{id}',     [new AlertController(), 'destroy'], [$auth]);

// EXPORT (autenticado)
$router->get('/api/export/portfolio',    [new ExportController(), 'exportPortfolio'], [$auth]);
$router->get('/api/export/watchlist',    [new ExportController(), 'exportWatchlist'], [$auth]);
$router->get('/api/export/transactions', [new ExportController(), 'exportTransactions'], [$auth]);

// ADMIN (autenticado + admin)
$router->get('/api/admin/users',        [new AdminController(), 'listUsers'], [$auth, $admin]);
$router->put('/api/admin/users/{id}',   [new AdminController(), 'updateUser'], [$auth, $admin]);
$router->delete('/api/admin/users/{id}',[new AdminController(), 'deleteUser'], [$auth, $admin]);
$router->get('/api/admin/stats',        [new AdminController(), 'getStats'], [$auth, $admin]);
