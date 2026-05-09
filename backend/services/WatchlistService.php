<?php
/**
 * WatchlistService — Lógica de negócio da watchlist
 */

class WatchlistService {
    private WatchlistRepository $repo;

    public function __construct() {
        $this->repo = new WatchlistRepository();
    }

    public function getUserWatchlist(int $userId): array {
        return $this->repo->findByUserId($userId);
    }

    public function addToWatchlist(int $userId, array $data): array {
        if ($this->repo->exists($userId, $data['crypto_id'])) {
            Response::validationError('Criptomoeda já está na watchlist');
        }

        $id = $this->repo->create([
            'user_id'       => $userId,
            'crypto_id'     => $data['crypto_id'],
            'crypto_symbol' => $data['crypto_symbol'],
            'crypto_name'   => $data['crypto_name'],
        ]);

        return $this->repo->findById($id);
    }

    public function removeFromWatchlist(int $userId, int $id): bool {
        $item = $this->repo->findById($id);
        if (!$item || $item['user_id'] !== $userId) {
            Response::notFound('Item não encontrado na watchlist');
        }
        return $this->repo->delete($id);
    }
}
