<?php
/**
 * CryptoService — Proxy para CoinGecko API com cache
 */

class CryptoService {
    private const CACHE_TTL = 120; // 2 minutos

    /**
     * Chamada genérica à CoinGecko
     */
    private function fetchFromCoinGecko(string $endpoint, array $params = []): array {
        $cacheKey = $endpoint . '?' . http_build_query($params);
        $cached = CacheHelper::get($cacheKey, self::CACHE_TTL);
        if ($cached) {
            return json_decode($cached, true);
        }

        $url = COINGECKO_BASE_URL . $endpoint;
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_HTTPHEADER     => [
                'Accept: application/json',
                'User-Agent: CryptoMonitor/1.0',
            ],
        ]);

        // Adicionar API key se disponível
        if (COINGECKO_API_KEY) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json',
                'User-Agent: CryptoMonitor/1.0',
                'x-cg-demo-api-key: ' . COINGECKO_API_KEY,
            ]);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {
            Response::error('Erro ao consultar API externa', 502);
        }

        $data = json_decode($response, true);
        if ($data === null) {
            Response::error('Resposta inválida da API externa', 502);
        }

        CacheHelper::set($cacheKey, $response);
        return $data;
    }

    /**
     * Listar criptomoedas por market cap
     */
    public function getMarkets(string $currency = 'usd', int $page = 1, int $perPage = 50): array {
        return $this->fetchFromCoinGecko('/coins/markets', [
            'vs_currency'            => $currency,
            'order'                  => 'market_cap_desc',
            'per_page'               => min($perPage, 100),
            'page'                   => $page,
            'sparkline'              => 'true',
            'price_change_percentage' => '1h,24h,7d',
        ]);
    }

    /**
     * Moedas em tendência
     */
    public function getTrending(): array {
        return $this->fetchFromCoinGecko('/search/trending');
    }

    /**
     * Estatísticas globais do mercado
     */
    public function getGlobal(): array {
        return $this->fetchFromCoinGecko('/global');
    }

    /**
     * Detalhe de uma moeda
     */
    public function getCoinDetail(string $coinId): array {
        return $this->fetchFromCoinGecko("/coins/$coinId", [
            'localization'  => 'false',
            'tickers'       => 'false',
            'community_data' => 'false',
            'developer_data' => 'false',
        ]);
    }

    /**
     * Histórico de preços
     */
    public function getCoinHistory(string $coinId, int $days = 7, string $currency = 'usd'): array {
        return $this->fetchFromCoinGecko("/coins/$coinId/market_chart", [
            'vs_currency' => $currency,
            'days'        => $days,
        ]);
    }

    /**
     * Pesquisa de moedas
     */
    public function search(string $query): array {
        return $this->fetchFromCoinGecko('/search', ['query' => $query]);
    }

    /**
     * Preços simples de múltiplas moedas
     */
    public function getSimplePrice(array $coinIds, string $currency = 'usd'): array {
        return $this->fetchFromCoinGecko('/simple/price', [
            'ids'                    => implode(',', $coinIds),
            'vs_currencies'          => $currency,
            'include_24hr_change'    => 'true',
            'include_market_cap'     => 'true',
        ]);
    }
}
