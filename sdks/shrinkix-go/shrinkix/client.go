package shrinkix

import "errors"

// Client is the main Shrinkix SDK client
type Client struct {
	apiKey    string
	baseURL   string
	sandbox   bool
	transport *Transport
}

// Config contains client configuration
type Config struct {
	APIKey  string
	BaseURL string
	Sandbox bool
}

// NewClient creates a new Shrinkix client
func NewClient(config Config) (*Client, error) {
	if config.APIKey == "" {
		return nil, errors.New("API key is required")
	}

	if config.BaseURL == "" {
		config.BaseURL = "https://api.shrinkix.com/v1"
	}

	transport := NewTransport(config.APIKey, config.BaseURL, config.Sandbox)

	return &Client{
		apiKey:    config.APIKey,
		baseURL:   config.BaseURL,
		sandbox:   config.Sandbox,
		transport: transport,
	}, nil
}

// WithAPIKey is a functional option for setting API key
func WithAPIKey(apiKey string) func(*Config) {
	return func(c *Config) {
		c.APIKey = apiKey
	}
}

// WithSandbox is a functional option for enabling sandbox mode
func WithSandbox(sandbox bool) func(*Config) {
	return func(c *Config) {
		c.Sandbox = sandbox
	}
}

// WithBaseURL is a functional option for setting base URL
func WithBaseURL(baseURL string) func(*Config) {
	return func(c *Config) {
		c.BaseURL = baseURL
	}
}
