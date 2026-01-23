# frozen_string_literal: true

require_relative 'shrinkix/version'
require_relative 'shrinkix/errors'
require_relative 'shrinkix/transport'
require_relative 'shrinkix/resources/optimize'
require_relative 'shrinkix/resources/usage'

module Shrinkix
  # Main Client
  class Client
    attr_reader :optimize, :usage, :limits, :validate

    def initialize(api_key:, base_url: 'https://api.shrinkix.com/v1', sandbox: false)
      raise ArgumentError, 'API key is required' if api_key.nil? || api_key.empty?

      @api_key = api_key
      @base_url = base_url
      @sandbox = sandbox

      # Initialize transport
      @transport = Transport.new(api_key: api_key, base_url: base_url, sandbox: sandbox)

      # Initialize resources
      @optimize = Resources::Optimize.new(@transport)
      @usage = Resources::Usage.new(@transport)
      @limits = Resources::Limits.new(@transport)
      @validate = Resources::Validate.new(@transport)
    end
  end
end
