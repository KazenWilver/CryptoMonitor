<?php
/**
 * ExportService — Geração de CSV e PDF
 */

class ExportService {
    private ExportLogRepository $logRepo;

    public function __construct() {
        $this->logRepo = new ExportLogRepository();
    }

    /**
     * Exportar dados em CSV
     */
    public function exportCSV(int $userId, string $reportType, array $data, array $headers): void {
        $this->logRepo->create($userId, $reportType, 'csv');

        $filename = $reportType . '_' . date('Y-m-d_His') . '.csv';

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        // BOM para UTF-8 no Excel
        echo "\xEF\xBB\xBF";

        $output = fopen('php://output', 'w');
        fputcsv($output, $headers, ';');

        foreach ($data as $row) {
            fputcsv($output, $row, ';');
        }

        fclose($output);
        exit;
    }

    /**
     * Exportar dados em PDF (HTML simples)
     */
    public function exportPDF(int $userId, string $reportType, array $data, array $headers, string $title): void {
        $this->logRepo->create($userId, $reportType, 'pdf');

        $filename = $reportType . '_' . date('Y-m-d_His') . '.html';
        $totalRows = count($data);

        // Gerar HTML para PDF (formatado para impressão)
        $html = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
        $html .= '<title>' . $title . ' — CryptoMonitor</title>';
        $html .= '<style>';
        $html .= '@page { margin: 20mm; }';
        $html .= '@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } }';
        $html .= 'body { font-family: "Segoe UI", Arial, sans-serif; font-size: 12px; color: #333; margin: 20px; }';
        $html .= 'h1 { color: #5E6AD2; font-size: 22px; margin-bottom: 4px; }';
        $html .= '.subtitle { color: #888; font-size: 12px; margin-bottom: 20px; }';
        $html .= '.summary { background: #f4f4f8; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; }';
        $html .= 'table { width: 100%; border-collapse: collapse; margin-top: 10px; }';
        $html .= 'th { background: #5E6AD2; color: #fff; padding: 10px 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }';
        $html .= 'td { padding: 8px; border-bottom: 1px solid #e8e8ec; font-size: 11px; }';
        $html .= 'tr:nth-child(even) { background: #fafafc; }';
        $html .= '.footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #e8e8ec; font-size: 10px; color: #888; text-align: center; }';
        $html .= '.print-btn { background: #5E6AD2; color: #fff; border: none; padding: 10px 24px; border-radius: 6px; font-size: 13px; cursor: pointer; margin-bottom: 20px; }';
        $html .= '.print-btn:hover { background: #4A56B8; }';
        $html .= '</style></head><body>';
        $html .= '<button class="print-btn no-print" onclick="window.print()">⬇ Imprimir / Guardar como PDF</button>';
        $html .= "<h1>◈ $title</h1>";
        $html .= '<div class="subtitle">Gerado em: ' . date('d/m/Y H:i:s') . ' · ' . $totalRows . ' registos</div>';
        $html .= '<div class="summary"><strong>Relatório:</strong> ' . ucfirst($reportType) . ' · <strong>Formato:</strong> PDF · <strong>Total:</strong> ' . $totalRows . ' linhas</div>';
        $html .= '<table><thead><tr>';

        foreach ($headers as $h) {
            $html .= "<th>$h</th>";
        }
        $html .= '</tr></thead><tbody>';

        foreach ($data as $row) {
            $html .= '<tr>';
            foreach ($row as $cell) {
                $html .= "<td>" . htmlspecialchars((string)$cell) . "</td>";
            }
            $html .= '</tr>';
        }

        if ($totalRows === 0) {
            $html .= '<tr><td colspan="' . count($headers) . '" style="text-align:center;padding:20px;color:#888;">Sem dados para exibir</td></tr>';
        }

        $html .= '</tbody></table>';
        $html .= '<div class="footer">CryptoMonitor &copy; ' . date('Y') . ' · Este documento foi gerado automaticamente</div>';
        $html .= '</body></html>';

        // Servir como HTML para impressão/guardar como PDF
        header('Content-Type: text/html; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $html;
        exit;
    }
}
