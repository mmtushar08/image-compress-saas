# frozen_string_literal: true

module Shrinkix
  # API Error
  class ApiError < StandardError
    attr_reader :code, :status_code, :request_id, :details, :docs_url, :rate_limit, :retry_after

    def initialize(message, code:, status_code:, request_id: nil, details: {}, docs_url: nil, rate_limit: {}, retry_after: nil)
      super(message)
      @code = code
      @status_code = status_code
      @request_id = request_id
      @details = details
      @docs_url = docs_url
      @rate_limit = rate_limit
      @retry_after = retry_after
    end

    def to_s
      "#{@code}: #{message} (request_id: #{@request_id})"
    end
  end

  # Network Error
  class NetworkError < StandardError
    attr_reader :original_error

    def initialize(message, original_error: nil)
      super(message)
      @original_error = original_error
    end
  end
end
