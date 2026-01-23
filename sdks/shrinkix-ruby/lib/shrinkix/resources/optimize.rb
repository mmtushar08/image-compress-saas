# frozen_string_literal: true

require 'json'

module Shrinkix
  module Resources
    # Optimize Resource
    class Optimize
      def initialize(transport)
        @transport = transport
      end

      def optimize(file:, resize: nil, crop: nil, format: nil, quality: nil, metadata: nil)
        # Build multipart payload
        payload = { image: Faraday::UploadIO.new(file, 'image/jpeg') }
        
        payload[:resize] = resize.to_json if resize
        payload[:crop] = crop.to_json if crop
        payload[:format] = format if format
        payload[:quality] = quality.to_s if quality
        payload[:metadata] = metadata if metadata

        result = @transport.post('/optimize', body: payload, multipart: true)

        {
          data: result[:data],
          rate_limit: result[:rate_limit],
          request_id: result[:rate_limit][:request_id]
        }
      end
    end
  end
end
