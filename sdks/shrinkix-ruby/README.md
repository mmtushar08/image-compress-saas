# Shrinkix Ruby SDK

Official Ruby SDK for the Shrinkix Image Optimization API.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'shrinkix'
```

And then execute:

```bash
bundle install
```

Or install it yourself:

```bash
gem install shrinkix
```

## Quick Start

```ruby
require 'shrinkix'

client = Shrinkix::Client.new(api_key: ENV['SHRINKIX_API_KEY'])

# Optimize an image
result = client.optimize.optimize(
  file: 'photo.jpg',
  quality: 80,
  format: 'webp'
)

puts "Saved #{result[:savings][:percent]}%"
```

## Usage

### Initialize Client

```ruby
client = Shrinkix::Client.new(
  api_key: 'YOUR_API_KEY',
  sandbox: false  # Set to true for testing
)
```

### Optimize Image

```ruby
result = client.optimize.optimize(
  file: 'photo.jpg',
  resize: { width: 1200, height: 800, fit: 'contain' },
  format: 'webp',
  quality: 80,
  metadata: 'strip'
)

puts result[:savings]
puts result[:operations]
puts result[:usage]
puts result[:rate_limit]
```

### Get Usage Stats

```ruby
stats = client.usage.get_stats

puts "Used: #{stats[:usage][:used]}/#{stats[:usage][:total]}"
puts "Remaining: #{stats[:usage][:remaining]}"
puts "Plan: #{stats[:plan][:name]}"
puts "Resets in: #{stats[:cycle][:days_until_reset]} days"
```

### Get Plan Limits

```ruby
limits = client.limits.get

puts "Plan: #{limits[:plan]}"
puts "Max file size: #{limits[:max_file_size_mb]}MB"
puts "Max operations: #{limits[:max_operations]}"
puts "Formats: #{limits[:formats]}"
```

### Validate Before Upload

```ruby
validation = client.validate.validate(
  file_size: 5_000_000,
  format: 'jpg',
  width: 2000,
  height: 1500
)

unless validation[:valid]
  validation[:warnings].each do |warning|
    puts "Warning: #{warning[:message]}"
  end
end
```

## Sandbox Mode

Test without consuming quota:

```ruby
client = Shrinkix::Client.new(
  api_key: 'YOUR_API_KEY',
  sandbox: true
)

# This won't count against your quota
result = client.optimize.optimize(file: 'test.jpg', quality: 80)
```

## Error Handling

```ruby
begin
  result = client.optimize.optimize(file: 'photo.jpg')
rescue Shrinkix::ApiError => e
  puts "API Error: #{e.code}"
  puts "Message: #{e.message}"
  puts "Request ID: #{e.request_id}"
  puts "Details: #{e.details}"
  puts "Docs: #{e.docs_url}"
  
  # Rate limit info
  puts "Rate limit: #{e.rate_limit}"
  
  # Retry after (for 429 errors)
  puts "Retry after: #{e.retry_after} seconds" if e.retry_after
  
rescue Shrinkix::NetworkError => e
  puts "Network error: #{e.message}"
end
```

## Rails Integration

In your Rails app:

```ruby
# config/initializers/shrinkix.rb
SHRINKIX_CLIENT = Shrinkix::Client.new(
  api_key: Rails.application.credentials.shrinkix_api_key
)

# app/services/image_optimizer.rb
class ImageOptimizer
  def self.optimize(file_path)
    SHRINKIX_CLIENT.optimize.optimize(
      file: file_path,
      quality: 80,
      format: 'webp'
    )
  end
end
```

## Rate Limiting

All responses include rate limit information:

```ruby
result = client.optimize.optimize(file: 'photo.jpg')

puts result[:rate_limit]
# {
#   limit: '2',
#   remaining: '1',
#   reset: '1700000000',
#   request_id: 'req_abc123'
# }
```

## API Reference

See full documentation at: https://docs.shrinkix.com

## Support

- Documentation: https://docs.shrinkix.com
- Email: support@shrinkix.com
- GitHub: https://github.com/shrinkix/shrinkix-ruby

## License

MIT
