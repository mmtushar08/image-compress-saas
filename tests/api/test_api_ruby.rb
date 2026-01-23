require 'net/http'
require 'uri'
require 'json'
require 'openssl'
require 'fileutils'

API_URL = "http://localhost:5000"
TEST_IMAGE = "test_quality_90.jpg"

def print_result(success, text)
  if success
    puts "[PASS] #{text}"
  else
    puts "[FAIL] #{text}"
  end
end

def test_check_limit
  puts "\n=== Testing Check Limit Endpoint ==="
  uri = URI.parse("#{API_URL}/api/check-limit")
  response = Net::HTTP.get_response(uri)

  if response.is_a?(Net::HTTPSuccess)
    print_result(true, "Response received: #{response.body}")
    return true
  else
    print_result(false, "Status Code: #{response.code}")
    return false
  end
rescue => e
  print_result(false, "Exception: #{e.message}")
  return false
end

def compress_file(input_path, output_path, options = {})
  uri = URI.parse("#{API_URL}/api/compress")
  
  boundary = "RubyBoundary#{Time.now.to_i}"
  post_body = []

  # Add Options (Metadata MUST be before file for some streaming parsers)
  if options[:preserveMetadata]
    post_body << "--#{boundary}\r\n"
    post_body << "Content-Disposition: form-data; name=\"preserveMetadata\"\r\n\r\n"
    post_body << "true\r\n"
  end

  if options[:width]
    post_body << "--#{boundary}\r\n"
    post_body << "Content-Disposition: form-data; name=\"width\"\r\n\r\n"
    post_body << "#{options[:width]}\r\n"
  end

  if options[:quality]
    post_body << "--#{boundary}\r\n"
    post_body << "Content-Disposition: form-data; name=\"quality\"\r\n\r\n"
    post_body << "#{options[:quality]}\r\n"
  end

  if options[:format]
    post_body << "--#{boundary}\r\n"
    post_body << "Content-Disposition: form-data; name=\"format\"\r\n\r\n"
    post_body << "#{options[:format]}\r\n"
  end

  # Add File
  post_body << "--#{boundary}\r\n"
  post_body << "Content-Disposition: form-data; name=\"image\"; filename=\"#{File.basename(input_path)}\"\r\n"
  post_body << "Content-Type: image/jpeg\r\n\r\n"
  post_body << File.binread(input_path)
  post_body << "\r\n--#{boundary}--\r\n"

  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Post.new(uri.request_uri)
  request.body = post_body.join
  request["Content-Type"] = "multipart/form-data; boundary=#{boundary}"
  request['X-API-Key'] = 'sk_test_b4eb8968065c578f25722b10'

  response = http.request(request)
  
  if response.is_a?(Net::HTTPSuccess)
    File.binwrite(output_path, response.body)
    return response
  else
    puts "Error: #{response.code} - #{response.body}"
    return nil
  end
end

def test_full_suite
  puts "Starting Full Ruby Verification Suite..."
  
  # 1. Limit Check
  test_check_limit

  # 2. Standard Compression
  puts "\n=== Testing Standard Compression ==="
  resp = compress_file(TEST_IMAGE, "output_ruby.jpg", { quality: 80 })
  if resp
    print_result(true, "Saved output_ruby.jpg (#{resp['X-Compressed-Size']} bytes)")
    puts "   Saved: #{resp['X-Saved-Percent']}%"
  end

  # 3. Conversion (WebP)
  puts "\n=== Testing Conversion (to WebP) ==="
  resp = compress_file(TEST_IMAGE, "output_ruby.webp", { format: 'webp' })
  if resp
    print_result(true, "Saved output_ruby.webp")
    if resp['Content-Type'] == 'image/webp'
      print_result(true, "Content-Type Verified: image/webp")
    else
      print_result(false, "Wrong Content-Type: #{resp['Content-Type']}")
    end
  end

  # 4. Resize
  puts "\n=== Testing Resize (Width=100) ==="
  resp = compress_file(TEST_IMAGE, "output_ruby_resize.jpg", { width: 100 })
  if resp
    size = File.size("output_ruby_resize.jpg")
    print_result(true, "Saved output_ruby_resize.jpg (#{size} bytes)")
    if size < 5000
      print_result(true, "Resize confirmed (Small file size)")
    else
      print_result(false, "Resize might have failed (Size large)")
    end
  end

  # 5. Metadata
  puts "\n=== Testing Metadata Preservation ==="
  resp = compress_file(TEST_IMAGE, "output_ruby_meta.jpg", { preserveMetadata: true })
  if resp
    print_result(true, "Request successful")
    if resp['X-Metadata-Preserved'] == 'true'
      print_result(true, "Header Found: X-Metadata-Preserved: true")
    else
      print_result(false, "Metadata Header MISSING")
    end
  end
end

test_full_suite
