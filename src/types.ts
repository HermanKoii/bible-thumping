export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
}

export interface CoinGekkoApiOptions {
  apiKey?: string;
  baseUrl?: string;
}

export interface FetchResult<T> {
  data: T;
  success: boolean;
  error?: string;
}