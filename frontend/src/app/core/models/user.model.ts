export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  language: string;
  theme: string;
  base_currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  language?: string;
  theme?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
