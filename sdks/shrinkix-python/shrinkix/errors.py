"""
Shrinkix API Errors
"""
from typing import Dict, Any, Optional


class ApiError(Exception):
    """Raised when API returns an error response"""
    
    def __init__(
        self,
        message: str,
        code: str,
        status_code: int,
        request_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        docs_url: Optional[str] = None,
        rate_limit: Optional[Dict[str, Any]] = None,
        retry_after: Optional[int] = None
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.request_id = request_id
        self.details = details or {}
        self.docs_url = docs_url
        self.rate_limit = rate_limit or {}
        self.retry_after = retry_after
    
    def __str__(self):
        return f"{self.code}: {self.message} (request_id: {self.request_id})"


class NetworkError(Exception):
    """Raised when network request fails"""
    
    def __init__(self, message: str, original_error: Optional[Exception] = None):
        super().__init__(message)
        self.message = message
        self.original_error = original_error
