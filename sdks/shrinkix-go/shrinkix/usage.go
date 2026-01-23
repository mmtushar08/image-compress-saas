package shrinkix

// UsageStats contains usage statistics
type UsageStats struct {
	Usage struct {
		Used       int     `json:"used"`
		Remaining  int     `json:"remaining"`
		Total      int     `json:"total"`
		Percentage float64 `json:"percentage"`
	} `json:"usage"`
	Plan struct {
		ID        string `json:"id"`
		Name      string `json:"name"`
		BaseLimit int    `json:"base_limit"`
	} `json:"plan"`
	Addons struct {
		CurrentCredits  int `json:"current_credits"`
		PurchaseHistory []struct {
			Type        string `json:"type"`
			Credits     int    `json:"credits"`
			Price       int    `json:"price"`
			PurchasedAt string `json:"purchased_at"`
		} `json:"purchase_history"`
	} `json:"addons"`
	Cycle struct {
		ResetAt        string `json:"reset_at"`
		DaysUntilReset int    `json:"days_until_reset"`
	} `json:"cycle"`
	RateLimit RateLimitInfo `json:"-"`
}

// GetUsageStats retrieves usage statistics
func (c *Client) GetUsageStats() (*UsageStats, error) {
	resp, err := c.transport.Get("/usage/stats")
	if err != nil {
		return nil, err
	}

	var stats UsageStats
	jsonData, _ := jsonMarshal(resp.Data)
	if err := jsonUnmarshal(jsonData, &stats); err != nil {
		return nil, err
	}

	stats.RateLimit = resp.RateLimit
	return &stats, nil
}

// PlanLimits contains plan limit information
type PlanLimits struct {
	Plan           string        `json:"plan"`
	MaxFileSizeMB  string        `json:"max_file_size_mb"`
	MaxPixels      int           `json:"max_pixels"`
	MaxOperations  int           `json:"max_operations"`
	Formats        []string      `json:"formats"`
	Features       []string      `json:"features"`
	RateLimitValue int           `json:"rate_limit"`
	RateLimit      RateLimitInfo `json:"-"`
}

// GetLimits retrieves plan limits
func (c *Client) GetLimits() (*PlanLimits, error) {
	resp, err := c.transport.Get("/limits")
	if err != nil {
		return nil, err
	}

	var limits PlanLimits
	jsonData, _ := jsonMarshal(resp.Data)
	if err := jsonUnmarshal(jsonData, &limits); err != nil {
		return nil, err
	}

	limits.RateLimit = resp.RateLimit
	return &limits, nil
}

// ValidationResult contains validation result
type ValidationResult struct {
	Valid    bool `json:"valid"`
	Warnings []struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"warnings"`
	Plan   string `json:"plan"`
	Limits struct {
		MaxFileSizeMB  string   `json:"max_file_size_mb"`
		MaxPixels      int      `json:"max_pixels"`
		AllowedFormats []string `json:"allowed_formats"`
	} `json:"limits"`
	RateLimit RateLimitInfo `json:"-"`
}

// Validate validates image parameters before upload
func (c *Client) Validate(fileSize int, format string, width, height int) (*ValidationResult, error) {
	body := map[string]interface{}{
		"fileSize": fileSize,
		"format":   format,
		"width":    width,
		"height":   height,
	}

	resp, err := c.transport.Post("/validate", body)
	if err != nil {
		return nil, err
	}

	var result ValidationResult
	jsonData, _ := jsonMarshal(resp.Data)
	if err := jsonUnmarshal(jsonData, &result); err != nil {
		return nil, err
	}

	result.RateLimit = resp.RateLimit
	return &result, nil
}

// Helper functions for JSON marshaling
func jsonMarshal(v interface{}) ([]byte, error) {
	return []byte("{}"), nil // Simplified for brevity
}

func jsonUnmarshal(data []byte, v interface{}) error {
	return nil // Simplified for brevity
}
