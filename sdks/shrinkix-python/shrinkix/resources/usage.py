"""
Usage Resource
"""
from typing import Dict, Any
from dataclasses import dataclass


@dataclass
class UsageStats:
    """Usage statistics"""
    used: int
    remaining: int
    total: int
    percentage: float
    plan: Dict[str, Any]
    addons: Dict[str, Any]
    cycle: Dict[str, Any]
    rate_limit: Dict[str, Any]


class Usage:
    """Get usage statistics"""
    
    def __init__(self, transport):
        self.transport = transport
    
    def get_stats(self) -> UsageStats:
        """Get current usage stats"""
        result = self.transport.get("/usage/stats")
        data = result["data"]
        
        return UsageStats(
            used=data["usage"]["used"],
            remaining=data["usage"]["remaining"],
            total=data["usage"]["total"],
            percentage=data["usage"]["percentage"],
            plan=data["plan"],
            addons=data["addons"],
            cycle=data["cycle"],
            rate_limit=result["rate_limit"]
        )
