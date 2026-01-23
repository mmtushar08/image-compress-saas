# SmartCompress C# Client

Official C# client for the SmartCompress API.

## Installation

```bash
dotnet add package SmartCompress
```

## Usage

```csharp
using SmartCompress;
using System.Collections.Generic;

var client = new Client("YOUR_API_KEY");

try 
{
    await client.FromFileAsync("input.png", "output.png", new Dictionary<string, object>
    {
        { "quality", 80 },
        { "width", 500 }
    });
    Console.WriteLine("Done!");
}
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
}
```
