export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_1h_in_currency?: number;
  sparkline_in_7d?: { price: number[] };
  circulating_supply: number;
  total_supply: number;
  ath: number;
  ath_change_percentage: number;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string; thumb: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number;
    ath: { usd: number };
    atl: { usd: number };
  };
  description: { en: string; pt?: string };
}

export interface MarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface GlobalData {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    active_cryptocurrencies: number;
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface Analytics {
  coin_id: string;
  ma7: number;
  ma30: number;
  volatility_7d: number;
  volatility_30d: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  price_range_7d: { min: number; max: number };
  price_range_30d: { min: number; max: number };
  current_price: number;
}
