"""
Limits and Validate Resources
"""
from typing import Dict, Any, List
from dataclasses import dataclass


@dataclass
class PlanLimits:
    """Plan limits"""
    plan: str
    max_file_size_mb: str
    max_pixels: int
    max_operations: int
    formats: List[str]
    features: List[str]
    rate_limit: int
    rate_limit_info: Dict[str, Any]


@dataclass
class ValidationResult:
    """Validation result"""
    valid: bool
    warnings: List[Dict[str, str]]
    plan: str
    limits: Dict[str, Any]
    rate_limit: Dict[str, Any]


class Limits:
    """Get plan limits"""
    
    def __init__(self, transport):
        self.transport = transport
    
    def get(self) -> PlanLimits:
        """Get plan limits"""
        result = self.transport.get("/limits")
        data = result["data"]
        
        return PlanLimits(
            plan=data["plan"],
            max_file_size_mb=data["max_file_size_mb"],
            max_pixels=data["max_pixels"],
            max_operations=data["max_operations"],
            formats=data["formats"],
            features=data["features"],
            rate_limit=data["rate_limit"],
            rate_limit_info=result["rate_limit"]
        )


class Validate:
    """Validate images before upload"""
    
    def __init__(self, transport):
        self.transport = transport
    
    def validate(
        self,
        file_size: int,
        format: str,
        width: int,
        height: int
    ) -> ValidationResult:
        """Validate image parameters"""
        result = self.transport.post("/validate", json={
            "fileSize": file_size,
            "format": format,
            "width": width,
            "height": height
        })
        
        data = result["data"]
        
        return ValidationResult(
            valid=data["valid"],
            warnings=data["warnings"],
            plan=data["plan"],
            limits=data["limits"],
            rate_limit=result["rate_limit"]
        )
