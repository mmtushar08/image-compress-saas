using System;
using System.Net.Http;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SmartCompress
{
    public class Client
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public Client(string apiKey)
        {
            _apiKey = apiKey;
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("X-API-Key", _apiKey);
        }

        public async Task FromFileAsync(string inputPath, string outputPath, Dictionary<string, object> options = null)
        {
            using var form = new MultipartFormDataContent();
            using var fileStream = File.OpenRead(inputPath);
            form.Add(new StreamContent(fileStream), "image", Path.GetFileName(inputPath));

            if (options != null)
            {
                foreach (var kvp in options)
                {
                    form.Add(new StringContent(kvp.Value.ToString()), kvp.Key);
                }
            }

            var response = await _httpClient.PostAsync("https://shrinkix.com/api/compress", form);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Compression failed: {response.StatusCode} - {error}");
            }

            using var outputStream = await response.Content.ReadAsStreamAsync();
            using var outputFile = File.Create(outputPath);
            await outputStream.CopyToAsync(outputFile);
        }
    }
}
