require 'net/http'
require 'uri'
require 'json'

# Use the 'multipart-post' gem for easier file uploads
# gem install multipart-post
require 'net/http/post/multipart'

url = URI.parse('https://api.shrinkix.com/compress')

begin
  File.open('input.png') do |png|
    req = Net::HTTP::Post::Multipart.new(
      url.path,
      "image" => UploadIO.new(png, "image/png", "input.png")
    )
    req['X-API-Key'] = 'YOUR_API_KEY'

    res = Net::HTTP.start(url.host, url.port, use_ssl: true) do |http|
      http.request(req)
    end
    
    if res.code == '200'
      File.binwrite('output.png', res.body)
      puts "Compression successful!"
    else
      puts "Compression failed: #{res.body}"
    end
  end
rescue => e
  puts "Error: #{e.message}"
end
