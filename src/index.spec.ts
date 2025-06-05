import { describe, it, expect } from 'vitest';
import { CoinGekkoApi } from './index';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('CoinGekkoApi', () => {
  const mock = new MockAdapter(axios);
  const api = new CoinGekkoApi();

  afterEach(() => {
    mock.reset();
  });

  describe('getCoinList', () => {
    it('should fetch coin list successfully', async () => {
      const mockCoins = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 50000,
          market_cap: 1000000000000
        }
      ];

      mock.onGet(/coins\/markets/).reply(200, mockCoins);

      const coins = await api.getCoinList(1);
      expect(coins).toHaveLength(1);
      expect(coins[0]).toEqual({
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        price: 50000,
        marketCap: 1000000000000
      });
    });

    it('should handle error when fetching coin list fails', async () => {
      mock.onGet(/coins\/markets/).reply(500);

      await expect(api.getCoinList()).rejects.toThrow('Failed to fetch coin list');
    });
  });

  describe('getCoinById', () => {
    it('should fetch coin details successfully', async () => {
      const mockCoin = {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        market_data: {
          current_price: { usd: 50000 },
          market_cap: { usd: 1000000000000 }
        }
      };

      mock.onGet(/coins\/bitcoin/).reply(200, mockCoin);

      const coin = await api.getCoinById('bitcoin');
      expect(coin).toEqual({
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        price: 50000,
        marketCap: 1000000000000
      });
    });

    it('should return null for non-existent coin', async () => {
      mock.onGet(/coins\/nonexistent/).reply(404);

      const coin = await api.getCoinById('nonexistent');
      expect(coin).toBeNull();
    });

    it('should throw error for invalid coin id', async () => {
      await expect(api.getCoinById('')).rejects.toThrow('Coin ID is required');
    });
  });
});