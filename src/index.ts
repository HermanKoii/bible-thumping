import axios from 'axios';
import { CoinData, CoinGekkoApiOptions, FetchResult } from './types';

export class CoinGekkoApi {
  private baseUrl: string;
  private apiKey?: string;

  constructor(options: CoinGekkoApiOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://api.coingecko.com/api/v3';
    this.apiKey = options.apiKey;
  }

  async fetchCoinData(coinId: string): Promise<FetchResult<CoinData>> {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/${coinId}`);
      
      if (response.status !== 200) {
        return {
          success: false,
          data: {} as CoinData,
          error: 'Failed to fetch coin data'
        };
      }

      const data = response.data;
      return {
        success: true,
        data: {
          id: data.id,
          symbol: data.symbol,
          name: data.name,
          price: data.market_data.current_price.usd,
          marketCap: data.market_data.market_cap.usd,
          volume24h: data.market_data.total_volume.usd
        }
      };
    } catch (error) {
      return {
        success: false,
        data: {} as CoinData,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async listCoins(limit: number = 100): Promise<FetchResult<CoinData[]>> {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1
        }
      });

      if (response.status !== 200) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch coin list'
        };
      }

      const coins: CoinData[] = response.data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.current_price,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume
      }));

      return {
        success: true,
        data: coins
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}