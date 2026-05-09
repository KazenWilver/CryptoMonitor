<?php
/**
 * AlertController — CRUD de alertas de preço
 */

class AlertController {
    private AlertService $service;

    public function __construct() {
        $this->service = new AlertService();
    }

    public function index(Request $request): void {
        $data = $this->service->getUserAlerts($request->user['id']);
        Response::success($data);
    }

    public function store(Request $request): void {
        $body = $request->getBody();
        $missing = ValidationHelper::required($body ?? [], ['crypto_id', 'crypto_symbol', 'condition_type', 'target_price']);
        if (!empty($missing)) {
            Response::validationError('Campos obrigatórios em falta', $missing);
        }
        if (!ValidationHelper::inEnum($body['condition_type'], ['above', 'below'])) {
            Response::validationError('Condição deve ser above ou below');
        }
        if (!ValidationHelper::positiveNumber($body['target_price'])) {
            Response::validationError('Preço alvo deve ser positivo');
        }

        $alert = $this->service->createAlert($request->user['id'], $body);
        Response::created($alert, 'Alerta criado');
    }

    public function update(Request $request): void {
        $id = (int) $request->getParam('id');
        $body = $request->getBody();
        $alert = $this->service->updateAlert($request->user['id'], $id, $body);
        Response::success($alert, 'Alerta atualizado');
    }

    public function destroy(Request $request): void {
        $id = (int) $request->getParam('id');
        $this->service->deleteAlert($request->user['id'], $id);
        Response::success(null, 'Alerta eliminado');
    }
}
