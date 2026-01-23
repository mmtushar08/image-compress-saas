import requests
import os

class SmartCompress:
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = "https://api.shrinkix.com/compress"

    def from_file(self, input_path, output_path, options=None):
        if options is None:
            options = {}

        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")

        files = {
            'image': open(input_path, 'rb')
        }
        
        headers = {
            'X-API-Key': self.api_key
        }
        
        # Prepare data for other fields
        data = {}
        if 'quality' in options: data['quality'] = options['quality']
        if 'width' in options: data['width'] = options['width']
        if 'height' in options: data['height'] = options['height']
        if 'format' in options: data['format'] = options['format']

        try:
            response = requests.post(self.api_url, files=files, headers=headers, data=data)
            
            # Close file
            files['image'].close()

            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                return True
            else:
                raise Exception(f"Compression failed: {response.text}")

        except Exception as e:
            if 'image' in files and not files['image'].closed:
                files['image'].close()
            raise e
