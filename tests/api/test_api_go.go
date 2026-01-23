package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

const (
	API_URL    = "http://localhost:5000"
	TEST_IMAGE = "test_quality_90.jpg"
)

func printRsult(success bool, text string) {
	if success {
		fmt.Printf("[PASS] %s\n", text)
	} else {
		fmt.Printf("[FAIL] %s\n", text)
	}
}

func testCheckLimit() bool {
	fmt.Println("\n=== Testing Check Limit Endpoint ===")

	resp, err := http.Get(API_URL + "/api/check-limit")
	if err != nil {
		printRsult(false, fmt.Sprintf("Request failed: %v", err))
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		printRsult(true, fmt.Sprintf("Response received"))
		return true
	} else {
		printRsult(false, fmt.Sprintf("Status Code: %d", resp.StatusCode))
		return false
	}
}

func testCompressImage() bool {
	fmt.Println("\n=== Testing Image Compression ===")

	file, err := os.Open(TEST_IMAGE)
	if err != nil {
		printRsult(false, fmt.Sprintf("Test image not found: %s", TEST_IMAGE))
		return false
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("image", TEST_IMAGE)
	if err != nil {
		printRsult(false, "Failed to create form file")
		return false
	}
	io.Copy(part, file)
	writer.WriteField("quality", "80")
	writer.Close()

	req, err := http.NewRequest("POST", API_URL+"/api/compress", body)
	if err != nil {
		printRsult(false, "Failed to create request")
		return false
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("X-API-Key", "sk_test_b4eb8968065c578f25722b10")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		printRsult(false, fmt.Sprintf("Request failed: %v", err))
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		out, _ := os.Create("compressed_go_test.jpg")
		defer out.Close()
		io.Copy(out, resp.Body)

		printRsult(true, "Compression successful!")
		fmt.Printf("  Original Size: %s bytes\n", resp.Header.Get("X-Original-Size"))
		fmt.Printf("  Compressed Size: %s bytes\n", resp.Header.Get("X-Compressed-Size"))
		fmt.Printf("  Saved: %s%%\n", resp.Header.Get("X-Saved-Percent"))
		return true
	} else {
		printRsult(false, fmt.Sprintf("Status Code: %d", resp.StatusCode))
		return false
	}
}

func testAllConversions() bool {
	fmt.Println("\n=== Testing Format Conversions (webp, png, jpg) ===")

	formats := []string{"webp", "png", "jpg"}
	allOk := true

	for _, fmtName := range formats {
		file, _ := os.Open(TEST_IMAGE)

		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		part, _ := writer.CreateFormFile("image", TEST_IMAGE)
		io.Copy(part, file)
		writer.WriteField("format", fmtName)
		writer.Close()
		file.Close()

		req, _ := http.NewRequest("POST", API_URL+"/api/compress", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())
		req.Header.Set("X-API-Key", "sk_test_b4eb8968065c578f25722b10")

		client := &http.Client{}
		resp, err := client.Do(req)

		if err != nil || resp.StatusCode != 200 {
			printRsult(false, fmt.Sprintf("Format %s failed (Status: %d)", fmtName, resp.StatusCode))
			allOk = false
			continue
		}

		defer resp.Body.Close()

		// Map 'jpg' to 'jpeg' for MIME type check
		expectedMime := "image/" + fmtName
		if fmtName == "jpg" {
			expectedMime = "image/jpeg"
		}

		actualMime := resp.Header.Get("Content-Type")

		// Use file implementation of MIME sniffer logic sometimes differing slightly
		// But here we rely on server Content-Type header
		if actualMime == expectedMime {
			printRsult(true, fmt.Sprintf("Converted to %s (MIME: %s)", fmtName, actualMime))
		} else {
			printRsult(false, fmt.Sprintf("Format %s mismatch. Got: %s", fmtName, actualMime))
			allOk = false
		}
	}
	return allOk
}

func testPreserveMetadata() bool {
	fmt.Println("\n=== Testing Metadata Preservation ===")

	file, _ := os.Open(TEST_IMAGE)
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Write field BEFORE file to ensure multer parses it if streaming
	writer.WriteField("preserveMetadata", "true")

	part, _ := writer.CreateFormFile("image", TEST_IMAGE)
	io.Copy(part, file)
	writer.Close()

	req, _ := http.NewRequest("POST", API_URL+"/api/compress", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("X-API-Key", "sk_test_b4eb8968065c578f25722b10")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	preservedHeader := resp.Header.Get("X-Metadata-Preserved")

	if preservedHeader == "true" {
		printRsult(true, "Metadata Header Found: X-Metadata-Preserved: true")
		return true
	} else {
		printRsult(false, fmt.Sprintf("Metadata Header MISSING. Got: '%s'", preservedHeader))
		return false
	}
}

func main() {
	fmt.Println("Starting API Tests with Go...")
	fmt.Printf("API URL: %s\n", API_URL)

	checkLimit := testCheckLimit()
	compress := testCompressImage()
	conversions := testAllConversions()
	metadata := testPreserveMetadata()

	if checkLimit && compress && conversions && metadata {
		fmt.Println("\nALL TESTS PASSED")
		os.Exit(0)
	} else {
		fmt.Println("\nSOME TESTS FAILED")
		os.Exit(1)
	}
}
