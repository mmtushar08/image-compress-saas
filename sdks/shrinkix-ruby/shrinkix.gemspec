# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "shrinkix"
  spec.version       = "1.0.0"
  spec.authors       = ["Shrinkix"]
  spec.email         = ["support@shrinkix.com"]

  spec.summary       = "Official Ruby SDK for Shrinkix Image Optimization API"
  spec.description   = "Ruby client library for the Shrinkix Image Optimization API"
  spec.homepage      = "https://shrinkix.com"
  spec.license       = "MIT"
  spec.required_ruby_version = ">= 2.6.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/shrinkix/shrinkix-ruby"
  spec.metadata["changelog_uri"] = "https://github.com/shrinkix/shrinkix-ruby/blob/main/CHANGELOG.md"

  spec.files = Dir.glob("{lib}/**/*") + %w[README.md LICENSE]
  spec.require_paths = ["lib"]

  # Dependencies
  spec.add_dependency "faraday", "~> 2.0"
  spec.add_dependency "faraday-multipart", "~> 1.0"

  # Development dependencies
  spec.add_development_dependency "rspec", "~> 3.0"
  spec.add_development_dependency "rubocop", "~> 1.0"
end
