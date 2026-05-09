<?php
/**
 * AnalyticsController — Análise inteligente de mercado
 */

class AnalyticsController {
    private AnalyticsService $service;

    public function __construct() {
        $this->service = new AnalyticsService();
    }

    public function getAnalytics(Request $request): void {
        $coinId = $request->getParam('id');
        if (!$coinId) Response::validationError('ID da moeda é obrigatório');

        $data = $this->service->getAnalytics($coinId);
        Response::success($data);
    }
}
