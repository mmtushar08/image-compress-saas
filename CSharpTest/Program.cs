using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

class Program
{
    const string API_URL = "http://localhost:5000";
    const string TEST_IMAGE = "test_quality_90.jpg";

    static async Task Main(string[] args)
    {
        Console.WriteLine("Starting API Tests with C#...");
        Console.WriteLine($"API URL: {API_URL}");

        // The instruction implies adding an API key to the HttpClient.
        // Since HttpClient instances are created within each test method,
        // the API key header needs to be added to each client.
        // The instruction's snippet for `Main` is syntactically incorrect
        // as `client` is not defined globally or at that scope.
        // To make the change syntactically correct and fulfill the intent
        // of adding an API key, we will add it to each HttpClient instance.

        bool checkLimit = await TestCheckLimit();
        bool compress = await TestCompressImage();
        bool batch = await TestBatchCompression();

        if (checkLimit && compress && batch)
        {
            Console.WriteLine("\nALL TESTS PASSED");
            Environment.Exit(0);
        }
        else
        {
            Console.WriteLine("\nSOME TESTS FAILED");
            Environment.Exit(1);
        }
    }

    static void PrintResult(bool success, string text)
    {
        if (success)
            Console.WriteLine($"[PASS] {text}");
        else
            Console.WriteLine($"[FAIL] {text}");
    }

    static async Task<bool> TestCheckLimit()
    {
        Console.WriteLine("\n=== Testing Check Limit Endpoint ===");
        try
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("X-API-Key", "sk_test_placeholder");
            var response = await client.GetAsync($"{API_URL}/api/check-limit");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                PrintResult(true, $"Check Limit Response: {content}");
                return true;
            }
            else
            {
                PrintResult(false, $"Status Code: {response.StatusCode}");
                return false;
            }
        }
        catch (Exception ex)
        {
            PrintResult(false, $"Exception: {ex.Message}");
            return false;
        }
    }

    static async Task<bool> TestCompressImage()
    {
        Console.WriteLine("\n=== Testing Image Compression ===");
        try
        {
            if (!File.Exists(TEST_IMAGE))
            {
                PrintResult(false, $"Test image not found: {TEST_IMAGE}");
                return false;
            }

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("X-API-Key", "sk_test_placeholder");
            using var form = new MultipartFormDataContent();
            using var fileStream = File.OpenRead(TEST_IMAGE);
            
            var imageContent = new StreamContent(fileStream);
            imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            
            form.Add(imageContent, "image", TEST_IMAGE);
            form.Add(new StringContent("80"), "quality");

            var response = await client.PostAsync($"{API_URL}/api/compress", form);

            if (response.IsSuccessStatusCode)
            {
                var bytes = await response.Content.ReadAsByteArrayAsync();
                await File.WriteAllBytesAsync("compressed_csharp_test.jpg", bytes);
                
                PrintResult(true, "Compression successful!");
                if (response.Headers.TryGetValues("X-Original-Size", out var original))
                    Console.WriteLine($"  Original Size: {string.Join(",", original)} bytes");
                if (response.Headers.TryGetValues("X-Compressed-Size", out var compressed))
                    Console.WriteLine($"  Compressed Size: {string.Join(",", compressed)} bytes");
                if (response.Headers.TryGetValues("X-Saved-Percent", out var saved))
                    Console.WriteLine($"  Saved: {string.Join(",", saved)}%");
                
                return true;
            }
            else
            {
                PrintResult(false, $"Status Code: {response.StatusCode}");
                return false;
            }
        }
        catch (Exception ex)
        {
            PrintResult(false, $"Exception: {ex.Message}");
            return false;
        }
    }

    static async Task<bool> TestBatchCompression()
    {
        Console.WriteLine("\n=== Testing Batch Compression ===");
        try
        {
            if (!File.Exists("test_quality_90.jpg") || !File.Exists("test_quality_10.jpg"))
            {
                PrintResult(false, "Test images not found");
                return false;
            }

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("X-API-Key", "sk_test_placeholder");
            using var form = new MultipartFormDataContent();
            
            // Image 1
            using var fileStream1 = File.OpenRead("test_quality_90.jpg");
            var imageContent1 = new StreamContent(fileStream1);
            imageContent1.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            form.Add(imageContent1, "images[]", "test_quality_90.jpg");
            
            // Image 2
            using var fileStream2 = File.OpenRead("test_quality_10.jpg");
            var imageContent2 = new StreamContent(fileStream2);
            imageContent2.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            form.Add(imageContent2, "images[]", "test_quality_10.jpg");

            var response = await client.PostAsync($"{API_URL}/api/compress/batch", form);

            if (response.IsSuccessStatusCode)
            {
                var bytes = await response.Content.ReadAsByteArrayAsync();
                await File.WriteAllBytesAsync("compressed_batch_csharp_test.zip", bytes);
                
                PrintResult(true, "Batch Compression successful!");
                Console.WriteLine("  Output file: compressed_batch_csharp_test.zip");
                
                return true;
            }
            else
            {
                PrintResult(false, $"Status Code: {response.StatusCode}");
                return false;
            }
        }
        catch (Exception ex)
        {
            PrintResult(false, $"Exception: {ex.Message}");
            return false;
        }
    }
}
