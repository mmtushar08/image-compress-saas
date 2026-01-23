# Shrinkix Go SDK

Official Go SDK for the Shrinkix Image Optimization API.

## Installation

```bash
go get github.com/shrinkix/shrinkix-go/shrinkix
```

## Quick Start

```go
package main

import (
    "fmt"
    "log"
    "os"
    
    "github.com/shrinkix/shrinkix-go/shrinkix"
)

func main() {
    client, err := shrinkix.NewClient(shrinkix.Config{
        APIKey: os.Getenv("SHRINKIX_API_KEY"),
    })
    if err != nil {
        log.Fatal(err)
    }

    result, err := client.Optimize(shrinkix.OptimizeParams{
        FilePath: "photo.jpg",
        Quality:  80,
        Format:   "webp",
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Optimized! Request ID: %s\n", result.RequestID)
}
```

## Usage

### Initialize Client

```go
client, err := shrinkix.NewClient(shrinkix.Config{
    APIKey:  "YOUR_API_KEY",
    Sandbox: false, // Set to true for testing
})
if err != nil {
    log.Fatal(err)
}
```

### Optimize Image

```go
result, err := client.Optimize(shrinkix.OptimizeParams{
    FilePath: "photo.jpg",
    Resize: &shrinkix.ResizeParams{
        Width:  1200,
        Height: 800,
        Fit:    "contain",
    },
    Format:   "webp",
    Quality:  80,
    Metadata: "strip",
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Rate limit: %d/%d\n", result.RateLimit.Remaining, result.RateLimit.Limit)
```

### Get Usage Stats

```go
stats, err := client.GetUsageStats()
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Used: %d/%d\n", stats.Usage.Used, stats.Usage.Total)
fmt.Printf("Remaining: %d\n", stats.Usage.Remaining)
fmt.Printf("Plan: %s\n", stats.Plan.Name)
fmt.Printf("Resets in: %d days\n", stats.Cycle.DaysUntilReset)
```

### Get Plan Limits

```go
limits, err := client.GetLimits()
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Plan: %s\n", limits.Plan)
fmt.Printf("Max file size: %s MB\n", limits.MaxFileSizeMB)
fmt.Printf("Max operations: %d\n", limits.MaxOperations)
fmt.Printf("Formats: %v\n", limits.Formats)
```

### Validate Before Upload

```go
validation, err := client.Validate(5000000, "jpg", 2000, 1500)
if err != nil {
    log.Fatal(err)
}

if !validation.Valid {
    for _, warning := range validation.Warnings {
        fmt.Printf("Warning: %s\n", warning.Message)
    }
}
```

## Sandbox Mode

Test without consuming quota:

```go
client, _ := shrinkix.NewClient(shrinkix.Config{
    APIKey:  "YOUR_API_KEY",
    Sandbox: true,
})

// This won't count against your quota
result, _ := client.Optimize(shrinkix.OptimizeParams{
    FilePath: "test.jpg",
    Quality:  80,
})
```

## Error Handling

```go
result, err := client.Optimize(shrinkix.OptimizeParams{
    FilePath: "photo.jpg",
})

if err != nil {
    switch e := err.(type) {
    case *shrinkix.ApiError:
        fmt.Printf("API Error: %s\n", e.Code)
        fmt.Printf("Message: %s\n", e.Message)
        fmt.Printf("Request ID: %s\n", e.RequestID)
        fmt.Printf("Details: %v\n", e.Details)
        fmt.Printf("Docs: %s\n", e.DocsURL)
        
        // Rate limit info
        fmt.Printf("Rate limit: %v\n", e.RateLimit)
        
        // Retry after (for 429 errors)
        if e.RetryAfter > 0 {
            fmt.Printf("Retry after: %d seconds\n", e.RetryAfter)
        }
        
    case *shrinkix.NetworkError:
        fmt.Printf("Network error: %s\n", e.Message)
        
    default:
        fmt.Printf("Unknown error: %v\n", err)
    }
}
```

## Functional Options

Use functional options for cleaner configuration:

```go
client, _ := shrinkix.NewClient(shrinkix.Config{
    APIKey:  os.Getenv("SHRINKIX_API_KEY"),
    Sandbox: true,
})
```

## Rate Limiting

All responses include rate limit information:

```go
result, _ := client.Optimize(shrinkix.OptimizeParams{
    FilePath: "photo.jpg",
})

fmt.Printf("Rate limit: %d\n", result.RateLimit.Limit)
fmt.Printf("Remaining: %d\n", result.RateLimit.Remaining)
fmt.Printf("Reset: %d\n", result.RateLimit.Reset)
fmt.Printf("Request ID: %s\n", result.RateLimit.RequestID)
```

## Requirements

- Go >= 1.19
- No external dependencies (uses only standard library)

## API Reference

See full documentation at: https://docs.shrinkix.com

## Support

- Documentation: https://docs.shrinkix.com
- Email: support@shrinkix.com
- GitHub: https://github.com/shrinkix/shrinkix-go

## License

MIT
