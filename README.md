# Gekko API Client

A Python client for interacting with the Gekko trading platform API.

## Features

- Retrieve exchange information
- List available trading strategies
- Start and stop trading sessions
- Flexible configuration options

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

```python
from src.gekko_api import GekkoAPI

# Initialize the API client
api = GekkoAPI(base_url='http://localhost:3000')

# Get exchange information
exchange_info = api.get_exchange_info('Binance')

# List available strategies
strategies = api.list_strategies()

# Start a trading session
config = {
    'exchange': 'Binance',
    'pair': 'BTC/USDT',
    'strategy': 'MACD'
}
session_id = api.start_trading(config)

# Stop trading
api.stop_trading(session_id)
```

## Running Tests

```
pytest tests/
```

## Contributing

Please read the guidelines for contributing to this project.

## License

[Insert License Information]