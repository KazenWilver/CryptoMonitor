<?php
/**
 * PortfolioController — CRUD de transações e holdings
 */

class PortfolioController {
    private PortfolioService $service;

    public function __construct() {
        $this->service = new PortfolioService();
    }

    public function getHoldings(Request $request): void {
        $data = $this->service->getHoldings($request->user['id']);
        Response::success($data);
    }

    public function getTransactions(Request $request): void {
        $data = $this->service->getTransactions($request->user['id']);
        Response::success($data);
    }

    public function storeTransaction(Request $request): void {
        $body = $request->getBody();
        $missing = ValidationHelper::required($body ?? [], [
            'crypto_id', 'crypto_symbol', 'crypto_name', 'type', 'quantity', 'price_usd', 'transaction_date'
        ]);
        if (!empty($missing)) {
            Response::validationError('Campos obrigatórios em falta', $missing);
        }
        if (!ValidationHelper::inEnum($body['type'], ['buy', 'sell'])) {
            Response::validationError('Tipo deve ser buy ou sell');
        }
        if (!ValidationHelper::positiveNumber($body['quantity'])) {
            Response::validationError('Quantidade deve ser positiva');
        }

        $tx = $this->service->addTransaction($request->user['id'], $body);
        Response::created($tx, 'Transação registada');
    }

    public function updateTransaction(Request $request): void {
        $id = (int) $request->getParam('id');
        $body = $request->getBody();
        $tx = $this->service->updateTransaction($request->user['id'], $id, $body);
        Response::success($tx, 'Transação atualizada');
    }

    public function destroyTransaction(Request $request): void {
        $id = (int) $request->getParam('id');
        $this->service->deleteTransaction($request->user['id'], $id);
        Response::success(null, 'Transação eliminada');
    }
}
