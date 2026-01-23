package shrinkix

import "fmt"

// ApiError represents an API error response
type ApiError struct {
	Message    string                 `json:"message"`
	Code       string                 `json:"error"`
	StatusCode int                    `json:"-"`
	RequestID  string                 `json:"request_id"`
	Details    map[string]interface{} `json:"details"`
	DocsURL    string                 `json:"docs_url"`
	RateLimit  RateLimitInfo          `json:"-"`
	RetryAfter int                    `json:"-"`
}

func (e *ApiError) Error() string {
	return fmt.Sprintf("%s: %s (request_id: %s)", e.Code, e.Message, e.RequestID)
}

// NetworkError represents a network-level error
type NetworkError struct {
	Message       string
	OriginalError error
}

func (e *NetworkError) Error() string {
	return fmt.Sprintf("network error: %s", e.Message)
}

func (e *NetworkError) Unwrap() error {
	return e.OriginalError
}
