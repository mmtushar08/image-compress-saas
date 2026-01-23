Gem::Specification.new do |s|
  s.name        = 'smartcompress'
  s.version     = '1.0.0'
  s.summary     = 'Official SmartCompress API Client'
  s.description = 'A Ruby client for the SmartCompress image optimization API'
  s.authors     = ['SmartCompress']
  s.files       = ['lib/smartcompress.rb']
  s.license     = 'MIT'
  s.add_runtime_dependency 'multipart-post', '~> 2.0'
end
