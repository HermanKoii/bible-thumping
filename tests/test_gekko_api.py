import pytest
import requests
from unittest.mock import patch
from src.gekko_api import GekkoAPI

class MockResponse:
    def __init__(self, json_data, status_code=200):
        self.json_data = json_data
        self.status_code = status_code
    
    def json(self):
        return self.json_data
    
    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError(f"HTTP Error: {self.status_code}")

def test_gekko_api_initialization():
    api = GekkoAPI()
    assert api.base_url == 'http://localhost:3000'

@patch('requests.get')
def test_get_exchange_info(mock_get):
    mock_get.return_value = MockResponse({
        'name': 'Binance',
        'supported': True,
        'requiredPermissions': ['trade', 'balance']
    })
    
    api = GekkoAPI()
    exchange_info = api.get_exchange_info('Binance')
    
    assert exchange_info['name'] == 'Binance'
    mock_get.assert_called_once_with('http://localhost:3000/exchanges/Binance')

@patch('requests.get')
def test_list_strategies(mock_get):
    mock_get.return_value = MockResponse({
        'strategies': ['MACD', 'RSI', 'EMA']
    })
    
    api = GekkoAPI()
    strategies = api.list_strategies()
    
    assert 'strategies' in strategies
    assert len(strategies['strategies']) == 3
    mock_get.assert_called_once_with('http://localhost:3000/strategies')

@patch('requests.post')
def test_start_trading(mock_post):
    mock_post.return_value = MockResponse({
        'sessionId': 'trade_123456'
    })
    
    api = GekkoAPI()
    config = {
        'exchange': 'Binance',
        'pair': 'BTC/USDT',
        'strategy': 'MACD'
    }
    
    session_id = api.start_trading(config)
    
    assert session_id == 'trade_123456'
    mock_post.assert_called_once_with('http://localhost:3000/trade', json=config)

@patch('requests.post')
def test_start_trading_empty_config(mock_post):
    api = GekkoAPI()
    
    with pytest.raises(ValueError, match="Trading configuration cannot be empty"):
        api.start_trading({})

@patch('requests.delete')
def test_stop_trading(mock_delete):
    mock_delete.return_value = MockResponse({}, status_code=200)
    
    api = GekkoAPI()
    result = api.stop_trading('trade_123456')
    
    assert result is True
    mock_delete.assert_called_once_with('http://localhost:3000/trade/trade_123456')