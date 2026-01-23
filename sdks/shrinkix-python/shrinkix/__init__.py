"""
Shrinkix Python SDK
Official Python client for Shrinkix Image Optimization API
"""
from .transport import Transport
from .resources import Optimize, Usage, Limits, Validate
from .errors import ApiError, NetworkError


class Shrinkix:
    """
    Shrinkix Client
    
    Example:
        client = Shrinkix(api_key="sk_live_xxx")
        result = client.optimize.optimize(file="photo.jpg", quality=80)
    """
    
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.shrinkix.com/v1",
        sandbox: bool = False
    ):
        """
        Initialize Shrinkix client
        
        Args:
            api_key: Your API key
            base_url: API base URL (optional)
            sandbox: Enable sandbox mode (optional)
        """
        if not api_key:
            raise ValueError("API key is required")
        
        self.api_key = api_key
        self.base_url = base_url
        self.sandbox = sandbox
        
        # Initialize transport
        self.transport = Transport(api_key, base_url, sandbox)
        
        # Initialize resources
        self.optimize = Optimize(self.transport)
        self.usage = Usage(self.transport)
        self.limits = Limits(self.transport)
        self.validate = Validate(self.transport)


__version__ = "1.0.0"
__all__ = ["Shrinkix", "ApiError", "NetworkError"]
