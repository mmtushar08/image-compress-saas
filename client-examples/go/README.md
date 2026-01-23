# SmartCompress Go Client

Official Go client for the SmartCompress API.

## Installation

```bash
go get github.com/username/smartcompress-go
```

## Usage

```go
package main

import (
	"fmt"
	"github.com/username/smartcompress-go"
)

func main() {
	client := smartcompress.NewClient("YOUR_API_KEY")

	err := client.FromFile("input.png", "output.png", &smartcompress.Options{
		Width:   500,
		Quality: 80,
	})

	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("Done!")
	}
}
```
