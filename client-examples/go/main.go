package main

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

func main() {
	file, err := os.Open("input.png")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", "input.png")
	if err != nil {
		fmt.Println("Error creating form file:", err)
		return
	}
	io.Copy(part, file)
	writer.Close()

	req, err := http.NewRequest("POST", "https://api.shrinkix.com/compress", body)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
	req.Header.Set("X-API-Key", "YOUR_API_KEY")
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		out, err := os.Create("output.png")
		if err != nil {
			fmt.Println("Error creating output file:", err)
			return
		}
		defer out.Close()
		io.Copy(out, resp.Body)
		fmt.Println("Compression successful!")
	} else {
		fmt.Println("Compression failed. Status:", resp.Status)
	}
}
