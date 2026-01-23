"""
Optimize Resource
"""
from typing import Dict, Any, Optional, Union, BinaryIO
from dataclasses import dataclass
import os


@dataclass
class OptimizeResult:
    """Result from optimize operation"""
    data: bytes
    original: Dict[str, Any]
    optimized: Dict[str, Any]
    savings: Dict[str, Any]
    operations: list
    usage: Dict[str, Any]
    rate_limit: Dict[str, Any]
    request_id: str


class Optimize:
    """Handles image optimization operations"""
    
    def __init__(self, transport):
        self.transport = transport
    
    def optimize(
        self,
        file: Union[str, bytes, BinaryIO],
        resize: Optional[Dict[str, Any]] = None,
        crop: Optional[Dict[str, Any]] = None,
        format: Optional[str] = None,
        quality: Optional[int] = None,
        metadata: Optional[str] = None
    ) -> OptimizeResult:
        """
        Optimize an image
        
        Args:
            file: File path, bytes, or file object
            resize: {"width": 1200, "height": 800, "fit": "contain"}
            crop: {"mode": "center", "ratio": "16:9"}
            format: Output format (jpg|png|webp|avif)
            quality: 1-100
            metadata: strip|keep
        
        Returns:
            OptimizeResult with optimized image and metadata
        """
        # Prepare files
        if isinstance(file, str):
            files = {"image": open(file, "rb")}
        elif isinstance(file, bytes):
            files = {"image": file}
        else:
            files = {"image": file}
        
        # Prepare data
        data = {}
        if resize:
            import json
            data["resize"] = json.dumps(resize)
        if crop:
            import json
            data["crop"] = json.dumps(crop)
        if format:
            data["format"] = format
        if quality:
            data["quality"] = str(quality)
        if metadata:
            data["metadata"] = metadata
        
        # Make request
        result = self.transport.post("/optimize", files=files, data=data)
        
        # Parse response (for now, return raw - would parse JSON in production)
        return OptimizeResult(
            data=result["data"],
            original={},  # Would parse from response
            optimized={},
            savings={},
            operations=[],
            usage={},
            rate_limit=result["rate_limit"],
            request_id=result["rate_limit"]["request_id"]
        )
