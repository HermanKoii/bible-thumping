import axios from 'axios';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
}

export class CoinGekkoApi {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.coingecko.com/api/v3') {
    this.baseUrl = baseUrl;
  }

  async getCoinList(limit: number = 100): Promise<CoinData[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false
        }
      });

      return response.data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.current_price,
        marketCap: coin.market_cap
      }));
    } catch (error) {
      console.error('Error fetching coin list:', error);
      throw new Error('Failed to fetch coin list');
    }
  }

  async getCoinById(id: string): Promise<CoinData | null> {
    if (!id) {
      throw new Error('Coin ID is required');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/coins/${id}`);
      const coin = response.data;

      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.market_data.current_price.usd,
        marketCap: coin.market_data.market_cap.usd
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching coin details:', error);
      throw new Error('Failed to fetch coin details');
    }
  }
}