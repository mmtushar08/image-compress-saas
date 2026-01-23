using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("X-API-Key", "YOUR_API_KEY");

        try
        {
            using var form = new MultipartFormDataContent();
            using var fileStream = File.OpenRead("input.png");
            // "image" is the form field name, "input.png" is the filename
            form.Add(new StreamContent(fileStream), "image", "input.png");

            var response = await client.PostAsync("https://api.shrinkix.com/compress", form);
            
            if (response.IsSuccessStatusCode)
            {
                using var output = await response.Content.ReadAsStreamAsync();
                using var file = File.Create("output.png");
                await output.CopyToAsync(file);
                Console.WriteLine("Compression successful!");
            }
            else
            {
                string error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Compression failed. Status: {response.StatusCode}, Error: {error}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
