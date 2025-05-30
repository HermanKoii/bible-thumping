import { describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { CoinGekkoApi } from './coinGekkoApi';

// Mock axios
vi.mock('axios');

describe('CoinGekkoApi', () => {
  let coinGekkoApi: CoinGekkoApi;

  beforeEach(() => {
    coinGekkoApi = new CoinGekkoApi();
  });

  describe('getCoinById', () => {
    it('should fetch coin data successfully', async () => {
      const mockCoinData = {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        market_data: {
          current_price: { usd: 50000 },
          market_cap: { usd: 1000000000000 }
        }
      };

      vi.mocked(axios.get).mockResolvedValue({ data: mockCoinData });

      const result = await coinGekkoApi.getCoinById('bitcoin');
      expect(result).toEqual({
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        price: 50000,
        marketCap: 1000000000000
      });
    });

    it('should throw an error if coin ID is not provided', async () => {
      await expect(coinGekkoApi.getCoinById('')).rejects.toThrow('Coin ID is required');
    });

    it('should throw an error if coin is not found', async () => {
      vi.mocked(axios.get).mockRejectedValue({
        response: { status: 404 },
        isAxiosError: true
      });

      await expect(coinGekkoApi.getCoinById('nonexistent')).rejects.toThrow('Coin with ID nonexistent not found');
    });
  });

  describe('getTopCryptocurrencies', () => {
    it('should fetch top cryptocurrencies successfully', async () => {
      const mockTopCoins = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 50000,
          market_cap: 1000000000000
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          current_price: 4000,
          market_cap: 500000000000
        }
      ];

      vi.mocked(axios.get).mockResolvedValue({ data: mockTopCoins });

      const result = await coinGekkoApi.getTopCryptocurrencies(2);
      expect(result).toEqual([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          price: 50000,
          marketCap: 1000000000000
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          price: 4000,
          marketCap: 500000000000
        }
      ]);
    });

    it('should throw an error if limit is not positive', async () => {
      await expect(coinGekkoApi.getTopCryptocurrencies(0)).rejects.toThrow('Limit must be a positive number');
      await expect(coinGekkoApi.getTopCryptocurrencies(-1)).rejects.toThrow('Limit must be a positive number');
    });
  });
});