<?php
/**
 * CryptoController — Proxy para dados de criptomoedas
 */

class CryptoController {
    private CryptoService $service;

    public function __construct() {
        $this->service = new CryptoService();
    }

    public function getMarkets(Request $request): void {
        $currency = $request->getQuery('currency', 'usd');
        $page     = (int) $request->getQuery('page', 1);
        $perPage  = (int) $request->getQuery('per_page', 50);

        $data = $this->service->getMarkets($currency, $page, $perPage);
        Response::success($data);
    }

    public function getTrending(Request $request): void {
        $data = $this->service->getTrending();
        Response::success($data);
    }

    public function getGlobal(Request $request): void {
        $data = $this->service->getGlobal();
        Response::success($data);
    }

    public function getDetail(Request $request): void {
        $coinId = $request->getParam('id');
        if (!$coinId) Response::validationError('ID da moeda é obrigatório');

        $data = $this->service->getCoinDetail($coinId);
        Response::success($data);
    }

    public function getHistory(Request $request): void {
        $coinId  = $request->getParam('id');
        $days    = (int) $request->getQuery('days', 7);
        $currency = $request->getQuery('currency', 'usd');

        $data = $this->service->getCoinHistory($coinId, $days, $currency);
        Response::success($data);
    }

    public function search(Request $request): void {
        $query = $request->getQuery('q', '');
        if (empty($query)) Response::validationError('Parâmetro de pesquisa é obrigatório');

        $data = $this->service->search($query);
        Response::success($data);
    }
}
