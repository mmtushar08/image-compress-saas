package com.shrinkix;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Path;
import java.nio.file.Files;
import java.util.UUID;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class SmartCompress {
    private String apiKey;
    private String apiUrl = "https://shrinkix.com/api/compress";
    private HttpClient client;

    public SmartCompress(String apiKey) {
        this.apiKey = apiKey;
        this.client = HttpClient.newBuilder().build();
    }

    public void fromFile(String inputPath, String outputPath, Map<String, Object> options) throws IOException, InterruptedException {
        Path file = Path.of(inputPath);
        String boundary = "---boundary" + UUID.randomUUID().toString();
        
        // Construct multipart body (simplified)
        // In a real SDK, consider using Apache HttpClient MultipartEntityBuilder
        
        StringBuilder preBody = new StringBuilder();
        preBody.append("--").append(boundary).append("\r\n");
        preBody.append("Content-Disposition: form-data; name=\"image\"; filename=\"").append(file.getFileName()).append("\"\r\n");
        preBody.append("Content-Type: image/png\r\n\r\n"); // Basic assumption
        
        byte[] preBytes = preBody.toString().getBytes(StandardCharsets.UTF_8);
        byte[] fileBytes = Files.readAllBytes(file);
        
        // Add options
        StringBuilder postBody = new StringBuilder();
        postBody.append("\r\n");
        
        if (options != null) {
            for (Map.Entry<String, Object> entry : options.entrySet()) {
                postBody.append("--").append(boundary).append("\r\n");
                postBody.append("Content-Disposition: form-data; name=\"").append(entry.getKey()).append("\"\r\n\r\n");
                postBody.append(entry.getValue()).append("\r\n");
            }
        }
        
        postBody.append("--").append(boundary).append("--\r\n");
        byte[] postBytes = postBody.toString().getBytes(StandardCharsets.UTF_8);

        byte[] body = new byte[preBytes.length + fileBytes.length + postBytes.length];
        System.arraycopy(preBytes, 0, body, 0, preBytes.length);
        System.arraycopy(fileBytes, 0, body, preBytes.length, fileBytes.length);
        System.arraycopy(postBytes, 0, body, preBytes.length + fileBytes.length, postBytes.length);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(this.apiUrl))
                .header("X-API-Key", this.apiKey)
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                .build();

        HttpResponse<Path> response = client.send(request, HttpResponse.BodyHandlers.ofFile(Path.of(outputPath)));
        
        if (response.statusCode() != 200) {
            throw new IOException("Compression failed with status: " + response.statusCode());
        }
    }
}
