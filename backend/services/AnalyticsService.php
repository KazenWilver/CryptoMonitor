<?php
/**
 * AnalyticsService — Moving Average, Volatilidade
 */

class AnalyticsService {
    private CryptoService $cryptoService;

    public function __construct() {
        $this->cryptoService = new CryptoService();
    }

    /**
     * Análise completa de uma moeda
     */
    public function getAnalytics(string $coinId): array {
        // Buscar dados de 30 dias
        $history = $this->cryptoService->getCoinHistory($coinId, 30);
        $prices = array_column($history['prices'] ?? [], 1);

        if (count($prices) < 7) {
            return ['error' => 'Dados insuficientes para análise'];
        }

        return [
            'coin_id'          => $coinId,
            'ma7'              => $this->movingAverage($prices, 7),
            'ma30'             => $this->movingAverage($prices, 30),
            'volatility_7d'    => $this->volatility(array_slice($prices, -7)),
            'volatility_30d'   => $this->volatility($prices),
            'trend'            => $this->detectTrend($prices),
            'price_range_7d'   => [
                'min' => round(min(array_slice($prices, -7)), 2),
                'max' => round(max(array_slice($prices, -7)), 2),
            ],
            'price_range_30d'  => [
                'min' => round(min($prices), 2),
                'max' => round(max($prices), 2),
            ],
            'current_price'    => round(end($prices), 2),
            'data_points'      => count($prices),
        ];
    }

    /**
     * Média Móvel Simples
     */
    private function movingAverage(array $prices, int $period): float {
        $slice = array_slice($prices, -$period);
        return round(array_sum($slice) / count($slice), 2);
    }

    /**
     * Volatilidade (desvio padrão percentual)
     */
    private function volatility(array $prices): float {
        $n = count($prices);
        if ($n < 2) return 0;

        $mean = array_sum($prices) / $n;
        $variance = 0;
        foreach ($prices as $p) {
            $variance += pow($p - $mean, 2);
        }
        $stdDev = sqrt($variance / ($n - 1));

        // Retornar como percentual da média
        return round(($stdDev / $mean) * 100, 2);
    }

    /**
     * Detetar tendência (bullish/bearish/neutral)
     */
    private function detectTrend(array $prices): string {
        $ma7 = $this->movingAverage($prices, 7);
        $ma30 = $this->movingAverage($prices, min(count($prices), 30));
        $current = end($prices);

        if ($current > $ma7 && $ma7 > $ma30) return 'bullish';
        if ($current < $ma7 && $ma7 < $ma30) return 'bearish';
        return 'neutral';
    }
}
