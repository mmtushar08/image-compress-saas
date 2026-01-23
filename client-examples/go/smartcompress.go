package smartcompress

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
)

type Client struct {
	ApiKey string
	ApiUrl string
}

type Options struct {
	Quality int
	Width   int
	Height  int
	Format  string
}

func NewClient(apiKey string) *Client {
	return &Client{
		ApiKey: apiKey,
		ApiUrl: "https://api.shrinkix.com/compress",
	}
}

func (c *Client) FromFile(inputPath string, outputPath string, opts *Options) error {
	file, err := os.Open(inputPath)
	if err != nil {
		return err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", inputPath)
	if err != nil {
		return err
	}
	io.Copy(part, file)

	if opts != nil {
		if opts.Quality > 0 {
			writer.WriteField("quality", strconv.Itoa(opts.Quality))
		}
		if opts.Width > 0 {
			writer.WriteField("width", strconv.Itoa(opts.Width))
		}
		if opts.Height > 0 {
			writer.WriteField("height", strconv.Itoa(opts.Height))
		}
		if opts.Format != "" {
			writer.WriteField("format", opts.Format)
		}
	}

	writer.Close()

	req, err := http.NewRequest("POST", c.ApiUrl, body)
	if err != nil {
		return err
	}
	req.Header.Set("X-API-Key", c.ApiKey)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("Compression failed with status: %s", resp.Status)
	}

	out, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer out.Close()
	io.Copy(out, resp.Body)

	return nil
}
