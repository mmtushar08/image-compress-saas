# frozen_string_literal: true

require 'faraday'
require 'faraday/multipart'
require_relative 'errors'

module Shrinkix
  # HTTP Transport Layer
  class Transport
    def initialize(api_key:, base_url: 'https://api.shrinkix.com/v1', sandbox: false)
      @api_key = api_key
      @base_url = base_url
      @sandbox = sandbox
      @connection = build_connection
    end

    def get(endpoint, params: {})
      request(:get, endpoint, params: params)
    end

    def post(endpoint, body: nil, multipart: false)
      request(:post, endpoint, body: body, multipart: multipart)
    end

    private

    def build_connection
      Faraday.new(url: @base_url) do |conn|
        conn.request :multipart if @sandbox
        conn.request :url_encoded
        conn.response :json, content_type: /\bjson$/
        conn.adapter Faraday.default_adapter

        conn.headers['Authorization'] = "Bearer #{@api_key}"
        conn.headers['User-Agent'] = 'shrinkix-ruby/1.0.0'
        conn.headers['X-Mode'] = 'sandbox' if @sandbox
      end
    end

    def request(method, endpoint, params: {}, body: nil, multipart: false)
      response = @connection.public_send(method) do |req|
        req.url endpoint
        req.params = params if params.any?
        req.body = body if body

        if multipart
          req.headers['Content-Type'] = 'multipart/form-data'
        end
      end

      # Extract rate limit headers
      rate_limit = {
        limit: response.headers['x-ratelimit-limit'],
        remaining: response.headers['x-ratelimit-remaining'],
        reset: response.headers['x-ratelimit-reset'],
        request_id: response.headers['x-request-id']
      }

      # Handle errors
      unless response.success?
        body = response.body
        raise ApiError.new(
          body['message'] || 'API Error',
          code: body['error'] || 'UNKNOWN_ERROR',
          status_code: response.status,
          request_id: body['request_id'],
          details: body['details'] || {},
          docs_url: body['docs_url'],
          rate_limit: rate_limit,
          retry_after: response.headers['retry-after']
        )
      end

      {
        data: response.body,
        rate_limit: rate_limit,
        headers: response.headers
      }
    rescue Faraday::Error => e
      raise NetworkError.new('Network request failed', original_error: e)
    end
  end
end
