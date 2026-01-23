import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Path;
import java.nio.file.Files;
import java.util.UUID;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class Compress {
    public static void main(String[] args) {
        try {
            HttpClient client = HttpClient.newBuilder().build();
            Path file = Path.of("input.png");
            String boundary = "---boundary" + UUID.randomUUID().toString();

            // Manual multipart body construction for standard Java 11+ HttpClient
            String header = "--" + boundary + "\r\n" +
                    "Content-Disposition: form-data; name=\"image\"; filename=\"input.png\"\r\n" +
                    "Content-Type: image/png\r\n\r\n";
            String footer = "\r\n--" + boundary + "--\r\n";

            byte[] headerBytes = header.getBytes(StandardCharsets.UTF_8);
            byte[] fileBytes = Files.readAllBytes(file);
            byte[] footerBytes = footer.getBytes(StandardCharsets.UTF_8);

            byte[] body = new byte[headerBytes.length + fileBytes.length + footerBytes.length];
            System.arraycopy(headerBytes, 0, body, 0, headerBytes.length);
            System.arraycopy(fileBytes, 0, body, headerBytes.length, fileBytes.length);
            System.arraycopy(footerBytes, 0, body, headerBytes.length + fileBytes.length, footerBytes.length);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.shrinkix.com/compress"))
                    .header("X-API-Key", "YOUR_API_KEY")
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpResponse<Path> response = client.send(request, HttpResponse.BodyHandlers.ofFile(Path.of("output.png")));

            if (response.statusCode() == 200) {
                System.out.println("Compression successful!");
            } else {
                System.out.println("Compression failed. Status: " + response.statusCode());
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
