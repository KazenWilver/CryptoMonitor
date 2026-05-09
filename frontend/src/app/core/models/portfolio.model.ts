export interface WatchlistItem {
  id: number;
  user_id: number;
  crypto_id: string;
  crypto_symbol: string;
  crypto_name: string;
  added_at: string;
}

export interface PortfolioTransaction {
  id: number;
  user_id: number;
  crypto_id: string;
  crypto_symbol: string;
  crypto_name: string;
  type: 'buy' | 'sell';
  quantity: number;
  price_usd: number;
  transaction_date: string;
  notes?: string;
  created_at: string;
}

export interface Holding {
  crypto_id: string;
  crypto_symbol: string;
  crypto_name: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  current_value: number;
  total_cost: number;
  pnl: number;
  pnl_percent: number;
  transactions: number;
}

export interface PortfolioSummary {
  holdings: Holding[];
  total_value: number;
  total_cost: number;
  total_pnl: number;
  total_pnl_percent: number;
}

export interface PriceAlert {
  id: number;
  user_id: number;
  crypto_id: string;
  crypto_symbol: string;
  condition_type: 'above' | 'below';
  target_price: number;
  is_active: boolean;
  triggered_at?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}
