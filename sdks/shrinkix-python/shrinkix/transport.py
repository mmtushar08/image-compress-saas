"""
HTTP Transport Layer
"""
import requests
from typing import Dict, Any, Optional
from .errors import ApiError, NetworkError


class Transport:
    """Handles all API communication"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.shrinkix.com/v1", sandbox: bool = False):
        self.api_key = api_key
        self.base_url = base_url
        self.sandbox = sandbox
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "User-Agent": "shrinkix-python/1.0.0"
        })
        
        if sandbox:
            self.session.headers.update({"X-Mode": "sandbox"})
    
    def request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        files: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make HTTP request"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                data=data,
                files=files,
                json=json
            )
            
            # Extract rate limit headers
            rate_limit = {
                "limit": response.headers.get("x-ratelimit-limit"),
                "remaining": response.headers.get("x-ratelimit-remaining"),
                "reset": response.headers.get("x-ratelimit-reset"),
                "request_id": response.headers.get("x-request-id")
            }
            
            # Handle errors
            if not response.ok:
                body = response.json()
                raise ApiError(
                    message=body.get("message", "API Error"),
                    code=body.get("error", "UNKNOWN_ERROR"),
                    status_code=response.status_code,
                    request_id=body.get("request_id"),
                    details=body.get("details", {}),
                    docs_url=body.get("docs_url"),
                    rate_limit=rate_limit,
                    retry_after=response.headers.get("retry-after")
                )
            
            # Return response with metadata
            return {
                "data": response.content if files else response.json(),
                "rate_limit": rate_limit,
                "headers": dict(response.headers)
            }
            
        except requests.RequestException as e:
            raise NetworkError("Network request failed", e)
    
    def get(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        """GET request"""
        return self.request("GET", endpoint, **kwargs)
    
    def post(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        """POST request"""
        return self.request("POST", endpoint, **kwargs)
