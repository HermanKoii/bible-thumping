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

  /**
   * Fetch coin data by ID
   * @param coinId - The ID of the cryptocurrency
   * @returns Promise with coin data
   */
  async getCoinById(coinId: string): Promise<CoinData> {
    if (!coinId) {
      throw new Error('Coin ID is required');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/coins/${coinId}`);
      return {
        id: response.data.id,
        symbol: response.data.symbol,
        name: response.data.name,
        price: response.data.market_data.current_price.usd,
        marketCap: response.data.market_data.market_cap.usd
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Coin with ID ${coinId} not found`);
        }
        throw new Error(`Error fetching coin data: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * List top cryptocurrencies by market cap
   * @param limit - Number of cryptocurrencies to return (default: 10)
   * @returns Promise with list of top cryptocurrencies
   */
  async getTopCryptocurrencies(limit: number = 10): Promise<CoinData[]> {
    if (limit <= 0) {
      throw new Error('Limit must be a positive number');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1
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
      throw new Error(`Error fetching top cryptocurrencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}