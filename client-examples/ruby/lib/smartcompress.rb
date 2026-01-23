require 'net/http'
require 'uri'
require 'json'
require 'net/http/post/multipart'

class SmartCompress
  def initialize(api_key)
    @api_key = api_key
    @url = URI.parse('https://api.shrinkix.com/compress')
  end

  def from_file(input_path, output_path, options = {})
    File.open(input_path) do |file|
      params = {
        "image" => UploadIO.new(file, "image/#{File.extname(input_path).delete('.')}", File.basename(input_path))
      }
      
      params["quality"] = options[:quality].to_s if options[:quality]
      params["width"] = options[:width].to_s if options[:width]
      params["height"] = options[:height].to_s if options[:height]
      
      req = Net::HTTP::Post::Multipart.new(@url.path, params)
      req['X-API-Key'] = @api_key

      res = Net::HTTP.start(@url.host, @url.port, use_ssl: true) do |http|
        http.request(req)
      end

      if res.code == '200'
        File.binwrite(output_path, res.body)
        return true
      else
        raise "Compression failed: #{res.body}"
      end
    end
  end
end
