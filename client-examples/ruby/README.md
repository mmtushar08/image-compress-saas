# SmartCompress Ruby Client

Official Ruby client for the SmartCompress API.

## Installation

```bash
gem install smartcompress
```

## Usage

```ruby
require 'smartcompress'

client = SmartCompress.new('YOUR_API_KEY')

begin
  client.from_file('input.png', 'output.png', {
    width: 500,
    quality: 80
  })
  puts "Done!"
rescue => e
  puts e
end
```
