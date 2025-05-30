import requests
from typing import Dict, Any, Optional

class GekkoAPI:
    """
    A client for interacting with the Gekko trading platform API.
    
    Supports basic operations like fetching exchange info, trading strategies,
    and managing trade configurations.
    """
    
    def __init__(self, base_url: str = 'http://localhost:3000'):
        """
        Initialize the Gekko API client.
        
        :param base_url: Base URL of the Gekko API server
        """
        self.base_url = base_url
    
    def get_exchange_info(self, exchange: str) -> Dict[str, Any]:
        """
        Retrieve information about a specific exchange.
        
        :param exchange: Name of the exchange
        :return: Exchange information dictionary
        :raises ValueError: If exchange is not found or API request fails
        """
        try:
            response = requests.get(f'{self.base_url}/exchanges/{exchange}')
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise ValueError(f"Failed to retrieve exchange info: {str(e)}")
    
    def list_strategies(self) -> Dict[str, Any]:
        """
        List available trading strategies.
        
        :return: Dictionary of available trading strategies
        :raises RuntimeError: If API request fails
        """
        try:
            response = requests.get(f'{self.base_url}/strategies')
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise RuntimeError(f"Failed to list strategies: {str(e)}")
    
    def start_trading(self, config: Dict[str, Any]) -> Optional[str]:
        """
        Start a trading session with the given configuration.
        
        :param config: Trading configuration dictionary
        :return: Trading session ID or None
        :raises ValueError: If configuration is invalid or start fails
        """
        if not config:
            raise ValueError("Trading configuration cannot be empty")
        
        try:
            response = requests.post(f'{self.base_url}/trade', json=config)
            response.raise_for_status()
            return response.json().get('sessionId')
        except requests.RequestException as e:
            raise ValueError(f"Failed to start trading: {str(e)}")
    
    def stop_trading(self, session_id: str) -> bool:
        """
        Stop a specific trading session.
        
        :param session_id: ID of the trading session to stop
        :return: True if trading stopped successfully, False otherwise
        """
        try:
            response = requests.delete(f'{self.base_url}/trade/{session_id}')
            return response.status_code == 200
        except requests.RequestException:
            return False