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

        $filename = $reportType . '_' . date('Y-m-d_His') . '.pdf';

        // Gerar HTML para PDF
        $html = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
        $html .= '<style>body{font-family:Arial,sans-serif;font-size:12px;color:#333}';
        $html .= 'h1{color:#5E6AD2;font-size:20px;margin-bottom:20px}';
        $html .= 'table{width:100%;border-collapse:collapse;margin-top:10px}';
        $html .= 'th{background:#5E6AD2;color:#fff;padding:8px;text-align:left;font-size:11px}';
        $html .= 'td{padding:6px 8px;border-bottom:1px solid #eee;font-size:11px}';
        $html .= 'tr:nth-child(even){background:#f9f9f9}';
        $html .= '.footer{margin-top:20px;font-size:10px;color:#888;text-align:center}';
        $html .= '</style></head><body>';
        $html .= "<h1>$title</h1>";
        $html .= '<p>Gerado em: ' . date('d/m/Y H:i:s') . '</p>';
        $html .= '<table><thead><tr>';

        foreach ($headers as $h) {
            $html .= "<th>$h</th>";
        }
        $html .= '</tr></thead><tbody>';

        foreach ($data as $row) {
            $html .= '<tr>';
            foreach ($row as $cell) {
                $html .= "<td>$cell</td>";
            }
            $html .= '</tr>';
        }

        $html .= '</tbody></table>';
        $html .= '<div class="footer">CryptoMonitor &copy; ' . date('Y') . '</div>';
        $html .= '</body></html>';

        // Servir como HTML (para impressão/PDF do browser)
        header('Content-Type: text/html; charset=UTF-8');
        header('Content-Disposition: inline; filename="' . $filename . '"');
        echo $html;
        exit;
    }
}
