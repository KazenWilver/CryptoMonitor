<?php
/**
 * ExportController — Exportação de dados (CSV/PDF)
 */

class ExportController {
    private ExportService $exportService;
    private PortfolioRepository $portfolioRepo;
    private WatchlistRepository $watchlistRepo;

    public function __construct() {
        $this->exportService  = new ExportService();
        $this->portfolioRepo  = new PortfolioRepository();
        $this->watchlistRepo  = new WatchlistRepository();
    }

    public function exportPortfolio(Request $request): void {
        $format = $request->getQuery('format', 'csv');
        $userId = $request->user['id'];

        $holdings = $this->portfolioRepo->getHoldings($userId);
        $headers = ['Moeda', 'Símbolo', 'Quantidade', 'Custo Total (USD)', 'Nº Transações'];
        $rows = [];
        foreach ($holdings as $h) {
            $rows[] = [
                $h['crypto_name'],
                $h['crypto_symbol'],
                $h['total_quantity'],
                $h['total_cost'],
                $h['transaction_count'],
            ];
        }

        if ($format === 'pdf') {
            $this->exportService->exportPDF($userId, 'portfolio', $rows, $headers, 'Relatório de Portfólio');
        } else {
            $this->exportService->exportCSV($userId, 'portfolio', $rows, $headers);
        }
    }

    public function exportWatchlist(Request $request): void {
        $userId = $request->user['id'];
        $items = $this->watchlistRepo->findByUserId($userId);

        $headers = ['Moeda', 'Símbolo', 'ID CoinGecko', 'Data Adição'];
        $rows = [];
        foreach ($items as $item) {
            $rows[] = [$item['crypto_name'], $item['crypto_symbol'], $item['crypto_id'], $item['added_at']];
        }

        $this->exportService->exportCSV($userId, 'watchlist', $rows, $headers);
    }

    public function exportTransactions(Request $request): void {
        $userId = $request->user['id'];
        $txs = $this->portfolioRepo->findByUserId($userId);

        $headers = ['Data', 'Moeda', 'Tipo', 'Quantidade', 'Preço (USD)', 'Total (USD)', 'Notas'];
        $rows = [];
        foreach ($txs as $tx) {
            $rows[] = [
                $tx['transaction_date'],
                $tx['crypto_name'] . ' (' . $tx['crypto_symbol'] . ')',
                strtoupper($tx['type']),
                $tx['quantity'],
                $tx['price_usd'],
                round(floatval($tx['quantity']) * floatval($tx['price_usd']), 2),
                $tx['notes'] ?? '',
            ];
        }

        $this->exportService->exportCSV($userId, 'transactions', $rows, $headers);
    }
}
