package shrinkix

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
)

// RateLimitInfo contains rate limiting information
type RateLimitInfo struct {
	Limit     int
	Remaining int
	Reset     int64
	RequestID string
}

// Transport handles HTTP communication
type Transport struct {
	apiKey  string
	baseURL string
	sandbox bool
	client  *http.Client
}

// NewTransport creates a new transport instance
func NewTransport(apiKey, baseURL string, sandbox bool) *Transport {
	if baseURL == "" {
		baseURL = "https://api.shrinkix.com/v1"
	}

	return &Transport{
		apiKey:  apiKey,
		baseURL: baseURL,
		sandbox: sandbox,
		client:  &http.Client{},
	}
}

// Response represents an API response
type Response struct {
	Data      interface{}
	RateLimit RateLimitInfo
	Headers   http.Header
}

// Get performs a GET request
func (t *Transport) Get(endpoint string) (*Response, error) {
	return t.request("GET", endpoint, nil, nil)
}

// Post performs a POST request
func (t *Transport) Post(endpoint string, body interface{}) (*Response, error) {
	var bodyReader io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		bodyReader = bytes.NewBuffer(jsonData)
	}
	return t.request("POST", endpoint, bodyReader, map[string]string{"Content-Type": "application/json"})
}

// PostMultipart performs a multipart POST request
func (t *Transport) PostMultipart(endpoint string, body io.Reader, contentType string) (*Response, error) {
	return t.request("POST", endpoint, body, map[string]string{"Content-Type": contentType})
}

func (t *Transport) request(method, endpoint string, body io.Reader, headers map[string]string) (*Response, error) {
	url := t.baseURL + endpoint

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, &NetworkError{Message: "failed to create request", OriginalError: err}
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+t.apiKey)
	req.Header.Set("User-Agent", "shrinkix-go/1.0.0")

	if t.sandbox {
		req.Header.Set("X-Mode", "sandbox")
	}

	for key, value := range headers {
		req.Header.Set(key, value)
	}

	// Execute request
	resp, err := t.client.Do(req)
	if err != nil {
		return nil, &NetworkError{Message: "request failed", OriginalError: err}
	}
	defer resp.Body.Close()

	// Extract rate limit info
	rateLimit := RateLimitInfo{
		Limit:     parseInt(resp.Header.Get("X-RateLimit-Limit")),
		Remaining: parseInt(resp.Header.Get("X-RateLimit-Remaining")),
		Reset:     parseInt64(resp.Header.Get("X-RateLimit-Reset")),
		RequestID: resp.Header.Get("X-Request-ID"),
	}

	// Read response body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, &NetworkError{Message: "failed to read response", OriginalError: err}
	}

	// Handle errors
	if resp.StatusCode >= 400 {
		var apiErr ApiError
		if err := json.Unmarshal(bodyBytes, &apiErr); err != nil {
			return nil, &NetworkError{Message: "failed to parse error response", OriginalError: err}
		}

		apiErr.StatusCode = resp.StatusCode
		apiErr.RateLimit = rateLimit
		if retryAfter := resp.Header.Get("Retry-After"); retryAfter != "" {
			apiErr.RetryAfter = parseInt(retryAfter)
		}

		return nil, &apiErr
	}

	// Parse success response
	var data interface{}
	if len(bodyBytes) > 0 {
		if err := json.Unmarshal(bodyBytes, &data); err != nil {
			// If JSON parsing fails, return raw bytes
			data = bodyBytes
		}
	}

	return &Response{
		Data:      data,
		RateLimit: rateLimit,
		Headers:   resp.Header,
	}, nil
}

func parseInt(s string) int {
	i, _ := strconv.Atoi(s)
	return i
}

func parseInt64(s string) int64 {
	i, _ := strconv.ParseInt(s, 10, 64)
	return i
}
