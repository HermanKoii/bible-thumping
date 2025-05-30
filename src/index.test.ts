import { describe, it, expect } from 'vitest';
import { CoinGekkoApi } from './index';

describe('CoinGekkoApi', () => {
  const api = new CoinGekkoApi();

  it('should fetch coin data for bitcoin', async () => {
    const result = await api.fetchCoinData('bitcoin');
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id', 'bitcoin');
    expect(result.data).toHaveProperty('symbol');
    expect(result.data).toHaveProperty('name');
    expect(result.data.price).toBeGreaterThan(0);
  });

  it('should list top coins', async () => {
    const result = await api.listCoins(10);
    
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(10);
    
    result.data.forEach(coin => {
      expect(coin).toHaveProperty('id');
      expect(coin).toHaveProperty('symbol');
      expect(coin).toHaveProperty('name');
      expect(coin.price).toBeGreaterThan(0);
    });
  });

  it('should handle invalid coin id', async () => {
    const result = await api.fetchCoinData('non_existent_coin');
    
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});