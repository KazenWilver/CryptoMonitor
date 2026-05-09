<?php
/**
 * WatchlistController — CRUD da watchlist
 */

class WatchlistController {
    private WatchlistService $service;

    public function __construct() {
        $this->service = new WatchlistService();
    }

    public function index(Request $request): void {
        $data = $this->service->getUserWatchlist($request->user['id']);
        Response::success($data);
    }

    public function store(Request $request): void {
        $body = $request->getBody();
        $missing = ValidationHelper::required($body ?? [], ['crypto_id', 'crypto_symbol', 'crypto_name']);
        if (!empty($missing)) {
            Response::validationError('Campos obrigatórios em falta', $missing);
        }

        $item = $this->service->addToWatchlist($request->user['id'], $body);
        Response::created($item, 'Adicionado à watchlist');
    }

    public function destroy(Request $request): void {
        $id = (int) $request->getParam('id');
        $this->service->removeFromWatchlist($request->user['id'], $id);
        Response::success(null, 'Removido da watchlist');
    }
}
