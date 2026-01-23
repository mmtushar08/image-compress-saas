package shrinkix

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
)

// OptimizeParams contains parameters for image optimization
type OptimizeParams struct {
	FilePath string
	File     io.Reader
	Resize   *ResizeParams
	Crop     *CropParams
	Format   string
	Quality  int
	Metadata string
}

// ResizeParams contains resize parameters
type ResizeParams struct {
	Width  int    `json:"width,omitempty"`
	Height int    `json:"height,omitempty"`
	Fit    string `json:"fit,omitempty"`
}

// CropParams contains crop parameters
type CropParams struct {
	Mode  string `json:"mode,omitempty"`
	Ratio string `json:"ratio,omitempty"`
}

// OptimizeResult contains the optimization result
type OptimizeResult struct {
	Data      []byte
	RateLimit RateLimitInfo
	RequestID string
}

// Optimize performs image optimization
func (c *Client) Optimize(params OptimizeParams) (*OptimizeResult, error) {
	// Create multipart form
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add file
	var fileReader io.Reader
	if params.FilePath != "" {
		file, err := os.Open(params.FilePath)
		if err != nil {
			return nil, err
		}
		defer file.Close()
		fileReader = file
	} else {
		fileReader = params.File
	}

	part, err := writer.CreateFormFile("image", filepath.Base(params.FilePath))
	if err != nil {
		return nil, err
	}
	if _, err := io.Copy(part, fileReader); err != nil {
		return nil, err
	}

	// Add optional parameters
	if params.Resize != nil {
		resizeJSON, _ := json.Marshal(params.Resize)
		writer.WriteField("resize", string(resizeJSON))
	}

	if params.Crop != nil {
		cropJSON, _ := json.Marshal(params.Crop)
		writer.WriteField("crop", string(cropJSON))
	}

	if params.Format != "" {
		writer.WriteField("format", params.Format)
	}

	if params.Quality > 0 {
		writer.WriteField("quality", string(rune(params.Quality)))
	}

	if params.Metadata != "" {
		writer.WriteField("metadata", params.Metadata)
	}

	writer.Close()

	// Make request
	resp, err := c.transport.PostMultipart("/optimize", body, writer.FormDataContentType())
	if err != nil {
		return nil, err
	}

	// Extract data
	data, ok := resp.Data.([]byte)
	if !ok {
		// Convert to bytes if needed
		jsonData, _ := json.Marshal(resp.Data)
		data = jsonData
	}

	return &OptimizeResult{
		Data:      data,
		RateLimit: resp.RateLimit,
		RequestID: resp.RateLimit.RequestID,
	}, nil
}
