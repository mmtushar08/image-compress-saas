import os
import requests

class ShrinkixError(Exception):
    pass

class ShrinkixAuthError(ShrinkixError):
    pass

class ShrinkixLimitError(ShrinkixError):
    pass

class Client:
    def __init__(self, api_key: str, base_url: str = 'https://api.shrinkix.com'):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
    
    def _get_headers(self):
        headers = {}
        if self.api_key:
            headers['X-API-Key'] = self.api_key
        return headers

    def account(self):
        """Check usage and limits."""
        try:
            response = requests.get(
                f"{self.base_url}/api/check-limit",
                headers=self._get_headers()
            )
            self._handle_error(response)
            return response.json()
        except requests.RequestException as e:
            raise ShrinkixError(f"Network error: {e}")

    def compress(self, image_path: str, options: dict = None):
        """
        Compress an image.
        
        Args:
            image_path (str): Path to image file.
            options (dict): Options like quality, width, height, format, preserveMetadata, to_file.
        """
        if not options:
            options = {}

        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        data = {}
        if 'quality' in options: data['quality'] = options['quality']
        if 'width' in options: data['width'] = options['width']
        if 'height' in options: data['height'] = options['height']
        if 'format' in options: data['format'] = options['format']
        if options.get('preserveMetadata'): data['preserveMetadata'] = 'true'

        try:
            with open(image_path, 'rb') as f:
                files = {'image': f}
                
                response = requests.post(
                    f"{self.base_url}/api/compress",
                    headers=self._get_headers(),
                    data=data,
                    files=files
                )

            self._handle_error(response)
            
            content = response.content
            
            if 'to_file' in options:
                with open(options['to_file'], 'wb') as out:
                    out.write(content)
                return True
            
            return content

        except requests.RequestException as e:
            raise ShrinkixError(f"Network error: {e}")

    def convert(self, image_path: str, format: str, options: dict = None):
        """Convert image format."""
        if not options:
            options = {}
        options['format'] = format
        return self.compress(image_path, options)

    def _handle_error(self, response):
        if response.status_code >= 400:
            try:
                error_msg = response.json().get('message') or response.json().get('error')
            except:
                error_msg = response.text
            
            if response.status_code == 401:
                raise ShrinkixAuthError(error_msg)
            elif response.status_code == 429:
                raise ShrinkixLimitError(error_msg)
            else:
                raise ShrinkixError(f"API Error ({response.status_code}): {error_msg}")
