<?php
/**
 * PortfolioService — Lógica de negócio do portfólio (P&L, holdings)
 */

class PortfolioService {
    private PortfolioRepository $repo;
    private CryptoService $cryptoService;

    public function __construct() {
        $this->repo = new PortfolioRepository();
        $this->cryptoService = new CryptoService();
    }

    public function getHoldings(int $userId): array {
        $holdings = $this->repo->getHoldings($userId);
        if (empty($holdings)) return ['holdings' => [], 'total_value' => 0, 'total_cost' => 0, 'total_pnl' => 0];

        // Buscar preços atuais
        $coinIds = array_column($holdings, 'crypto_id');
        $prices = $this->cryptoService->getSimplePrice($coinIds);

        $totalValue = 0;
        $totalCost = 0;
        $enriched = [];

        foreach ($holdings as $h) {
            $currentPrice = $prices[$h['crypto_id']]['usd'] ?? 0;
            $currentValue = floatval($h['total_quantity']) * $currentPrice;
            $cost = floatval($h['total_cost']);
            $pnl = $currentValue - $cost;
            $pnlPercent = $cost > 0 ? ($pnl / $cost) * 100 : 0;

            $enriched[] = [
                'crypto_id'     => $h['crypto_id'],
                'crypto_symbol' => $h['crypto_symbol'],
                'crypto_name'   => $h['crypto_name'],
                'quantity'      => floatval($h['total_quantity']),
                'avg_cost'      => $cost / max(floatval($h['total_quantity']), 0.0001),
                'current_price' => $currentPrice,
                'current_value' => round($currentValue, 2),
                'total_cost'    => round($cost, 2),
                'pnl'           => round($pnl, 2),
                'pnl_percent'   => round($pnlPercent, 2),
                'transactions'  => (int) $h['transaction_count'],
            ];

            $totalValue += $currentValue;
            $totalCost += $cost;
        }

        return [
            'holdings'    => $enriched,
            'total_value' => round($totalValue, 2),
            'total_cost'  => round($totalCost, 2),
            'total_pnl'   => round($totalValue - $totalCost, 2),
            'total_pnl_percent' => $totalCost > 0 ? round((($totalValue - $totalCost) / $totalCost) * 100, 2) : 0,
        ];
    }

    public function getTransactions(int $userId): array {
        return $this->repo->findByUserId($userId);
    }

    public function addTransaction(int $userId, array $data): array {
        $id = $this->repo->create([
            'user_id'          => $userId,
            'crypto_id'        => $data['crypto_id'],
            'crypto_symbol'    => $data['crypto_symbol'],
            'crypto_name'      => $data['crypto_name'],
            'type'             => $data['type'],
            'quantity'         => $data['quantity'],
            'price_usd'        => $data['price_usd'],
            'transaction_date' => $data['transaction_date'],
            'notes'            => $data['notes'] ?? null,
        ]);
        return $this->repo->findById($id);
    }

    public function updateTransaction(int $userId, int $id, array $data): array {
        $tx = $this->repo->findById($id);
        if (!$tx || $tx['user_id'] !== $userId) {
            Response::notFound('Transação não encontrada');
        }
        $this->repo->update($id, $data);
        return $this->repo->findById($id);
    }

    public function deleteTransaction(int $userId, int $id): bool {
        $tx = $this->repo->findById($id);
        if (!$tx || $tx['user_id'] !== $userId) {
            Response::notFound('Transação não encontrada');
        }
        return $this->repo->delete($id);
    }
}
