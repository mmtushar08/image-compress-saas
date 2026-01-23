# frozen_string_literal: true

module Shrinkix
  module Resources
    # Usage Resource
    class Usage
      def initialize(transport)
        @transport = transport
      end

      def get_stats
        result = @transport.get('/usage/stats')
        result[:data].merge(rate_limit: result[:rate_limit])
      end
    end

    # Limits Resource
    class Limits
      def initialize(transport)
        @transport = transport
      end

      def get
        result = @transport.get('/limits')
        result[:data].merge(rate_limit: result[:rate_limit])
      end
    end

    # Validate Resource
    class Validate
      def initialize(transport)
        @transport = transport
      end

      def validate(file_size:, format:, width:, height:)
        result = @transport.post('/validate', body: {
          fileSize: file_size,
          format: format,
          width: width,
          height: height
        }.to_json)

        result[:data].merge(rate_limit: result[:rate_limit])
      end
    end
  end
end
