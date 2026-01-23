import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.Map;
import java.io.IOException;

public class TestApiJava {
    private static final String API_URL = "http://localhost:5000";
    private static final String TEST_IMAGE = "test_quality_90.jpg";
    private static final String API_KEY = "sk_test_b4eb8968065c578f25722b10";

    public static void main(String[] args) {
        System.out.println("Starting API Tests with Java...");
        System.out.println("API URL: " + API_URL);

        boolean checkLimit = testCheckLimit();
        boolean compress = testCompressImage();
        boolean batch = testBatchCompression();
        boolean convert = testFormatConversion();
        boolean resize = testResize();
        boolean metadata = testMetadataPreservation();

        if (checkLimit && compress && batch && convert && resize && metadata) {
            System.out.println("\nALL TESTS PASSED");
            System.exit(0);
        } else {
            System.out.println("\nSOME TESTS FAILED");
            System.exit(1);
        }
    }

    private static void printResult(boolean success, String text) {
        if (success) {
            System.out.println("[PASS] " + text);
        } else {
            System.out.println("[FAIL] " + text);
        }
    }

    private static boolean testCheckLimit() {
        System.out.println("\n=== Testing Check Limit Endpoint ===");
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .header("X-API-Key", API_KEY)
                    .uri(URI.create(API_URL + "/api/check-limit"))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                printResult(true, "Check Limit Response: " + response.body());
                return true;
            } else {
                printResult(false, "Status Code: " + response.statusCode());
                return false;
            }
        } catch (Exception e) {
            printResult(false, "Exception: " + e.getMessage());
            return false;
        }
    }

    private static boolean testCompressImage() {
        System.out.println("\n=== Testing Image Compression ===");
        try {
            Path file = Path.of(TEST_IMAGE);
            if (!Files.exists(file)) {
                printResult(false, "Test image not found: " + TEST_IMAGE);
                return false;
            }

            HttpClient client = HttpClient.newHttpClient();
            String boundary = "JavaBoundary" + System.currentTimeMillis();

            // Build simple multipart body
            // Note: In production you'd use a library or robustness utility, doing this
            // manually for zero-dep test
            String boundaryLine = "--" + boundary;
            byte[] fileBytes = Files.readAllBytes(file);

            StringBuilder headerBuilder = new StringBuilder();
            headerBuilder.append(boundaryLine).append("\r\n");
            headerBuilder.append("Content-Disposition: form-data; name=\"image\"; filename=\"" + TEST_IMAGE + "\"\r\n");
            headerBuilder.append("Content-Type: image/jpeg\r\n\r\n");
            byte[] headerBytes = headerBuilder.toString().getBytes();

            byte[] footerBytes = ("\r\n" + boundaryLine + "--\r\n").getBytes();

            byte[] body = new byte[headerBytes.length + fileBytes.length + footerBytes.length];
            System.arraycopy(headerBytes, 0, body, 0, headerBytes.length);
            System.arraycopy(fileBytes, 0, body, headerBytes.length, fileBytes.length);
            System.arraycopy(footerBytes, 0, body, headerBytes.length + fileBytes.length, footerBytes.length);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + "/api/compress"))
                    .header("X-API-Key", API_KEY)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 200) {
                Files.write(Path.of("compressed_java_test.jpg"), response.body());
                printResult(true, "Compression successful!");
                System.out.println("  Original Size: " + response.headers().firstValue("X-Original-Size").orElse("N/A")
                        + " bytes");
                System.out.println("  Compressed Size: "
                        + response.headers().firstValue("X-Compressed-Size").orElse("N/A") + " bytes");
                System.out.println("  Saved: " + response.headers().firstValue("X-Saved-Percent").orElse("N/A") + "%");
                return true;
            } else {
                printResult(false, "Status Code: " + response.statusCode());
                return false;
            }
        } catch (Exception e) {
            printResult(false, "Exception: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private static boolean testBatchCompression() {
        System.out.println("\n=== Testing Batch Compression ===");
        try {
            Path file1 = Path.of("test_quality_90.jpg");
            Path file2 = Path.of("test_quality_10.jpg");

            if (!Files.exists(file1) || !Files.exists(file2)) {
                printResult(false, "Test images not found");
                return false;
            }

            HttpClient client = HttpClient.newHttpClient();
            String boundary = "JavaBatchBoundary" + System.currentTimeMillis();
            String boundaryLine = "--" + boundary;

            byte[] file1Bytes = Files.readAllBytes(file1);
            byte[] file2Bytes = Files.readAllBytes(file2);

            // Build body
            java.io.ByteArrayOutputStream bodyStream = new java.io.ByteArrayOutputStream();

            // Image 1
            bodyStream.write((boundaryLine + "\r\n").getBytes());
            bodyStream.write(("Content-Disposition: form-data; name=\"images[]\"; filename=\"test_quality_90.jpg\"\r\n")
                    .getBytes());
            bodyStream.write(("Content-Type: image/jpeg\r\n\r\n").getBytes());
            bodyStream.write(file1Bytes);
            bodyStream.write(("\r\n").getBytes());

            // Image 2
            bodyStream.write((boundaryLine + "\r\n").getBytes());
            bodyStream.write(("Content-Disposition: form-data; name=\"images[]\"; filename=\"test_quality_10.jpg\"\r\n")
                    .getBytes());
            bodyStream.write(("Content-Type: image/jpeg\r\n\r\n").getBytes());
            bodyStream.write(file2Bytes);
            bodyStream.write(("\r\n").getBytes());

            // Footer
            bodyStream.write((boundaryLine + "--\r\n").getBytes());

            byte[] body = bodyStream.toByteArray();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + "/api/compress/batch"))
                    .header("X-API-Key", API_KEY)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 200) {
                Files.write(Path.of("compressed_batch_java_test.zip"), response.body());
                printResult(true, "Batch compression successful!");
                System.out.println("  Output file: compressed_batch_java_test.zip");
                return true;
            } else {
                printResult(false, "Status Code: " + response.statusCode());
                return false;
            }
        } catch (Exception e) {
            printResult(false, "Exception: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private static boolean testFormatConversion() {
        System.out.println("\n=== Testing Format Conversion (WebP) ===");
        try {
            Path file = Path.of(TEST_IMAGE);
            if (!Files.exists(file)) {
                printResult(false, "Test image not found: " + TEST_IMAGE);
                return false;
            }

            HttpClient client = HttpClient.newHttpClient();
            String boundary = "JavaBoundary" + System.currentTimeMillis();

            String boundaryLine = "--" + boundary;
            byte[] fileBytes = Files.readAllBytes(file);

            StringBuilder headerBuilder = new StringBuilder();
            headerBuilder.append(boundaryLine).append("\r\n");
            headerBuilder.append("Content-Disposition: form-data; name=\"image\"; filename=\"" + TEST_IMAGE + "\"\r\n");
            headerBuilder.append("Content-Type: image/jpeg\r\n\r\n");
            byte[] headerBytes = headerBuilder.toString().getBytes();

            String formatField = boundaryLine + "\r\n" +
                    "Content-Disposition: form-data; name=\"format\"\r\n\r\n" +
                    "webp\r\n";
            byte[] formatBytes = formatField.getBytes();

            byte[] footerBytes = (boundaryLine + "--\r\n").getBytes();

            byte[] body = new byte[formatBytes.length + headerBytes.length + fileBytes.length + footerBytes.length];
            System.arraycopy(formatBytes, 0, body, 0, formatBytes.length);
            System.arraycopy(headerBytes, 0, body, formatBytes.length, headerBytes.length);
            System.arraycopy(fileBytes, 0, body, formatBytes.length + headerBytes.length, fileBytes.length);
            System.arraycopy(footerBytes, 0, body, formatBytes.length + headerBytes.length + fileBytes.length,
                    footerBytes.length);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + "/api/compress"))
                    .header("X-API-Key", API_KEY)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 200) {
                Files.write(Path.of("converted_java_test.webp"), response.body());
                String contentType = response.headers().firstValue("Content-Type").orElse("unknown");
                if (contentType.equals("image/webp")) {
                    printResult(true, "Format conversion successful!");
                    System.out.println("  Content-Type: " + contentType);
                    System.out.println("  Output file: converted_java_test.webp");
                    return true;
                } else {
                    printResult(false, "Wrong Content-Type: " + contentType);
                    return false;
                }
            } else {
                printResult(false, "Status Code: " + response.statusCode());
                return false;
            }
        } catch (Exception e) {
            printResult(false, "Exception: " + e.getMessage());
            return false;
        }
    }

    private static boolean testResize() {
        System.out.println("\n=== Testing Image Resize ===");
        try {
            Path file = Path.of(TEST_IMAGE);
            if (!Files.exists(file)) {
                printResult(false, "Test image not found: " + TEST_IMAGE);
                return false;
            }

            HttpClient client = HttpClient.newHttpClient();
            String boundary = "JavaBoundary" + System.currentTimeMillis();

            String boundaryLine = "--" + boundary;
            byte[] fileBytes = Files.readAllBytes(file);

            String widthField = boundaryLine + "\r\n" +
                    "Content-Disposition: form-data; name=\"width\"\r\n\r\n" +
                    "100\r\n";
            byte[] widthBytes = widthField.getBytes();

            StringBuilder headerBuilder = new StringBuilder();
            headerBuilder.append(boundaryLine).append("\r\n");
            headerBuilder.append("Content-Disposition: form-data; name=\"image\"; filename=\"" + TEST_IMAGE + "\"\r\n");
            headerBuilder.append("Content-Type: image/jpeg\r\n\r\n");
            byte[] headerBytes = headerBuilder.toString().getBytes();

            byte[] footerBytes = ("\r\n" + boundaryLine + "--\r\n").getBytes();

            byte[] body = new byte[widthBytes.length + headerBytes.length + fileBytes.length + footerBytes.length];
            System.arraycopy(widthBytes, 0, body, 0, widthBytes.length);
            System.arraycopy(headerBytes, 0, body, widthBytes.length, headerBytes.length);
            System.arraycopy(fileBytes, 0, body, widthBytes.length + headerBytes.length, fileBytes.length);
            System.arraycopy(footerBytes, 0, body, widthBytes.length + headerBytes.length + fileBytes.length,
                    footerBytes.length);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + "/api/compress"))
                    .header("X-API-Key", API_KEY)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 200) {
                Files.write(Path.of("resized_java_test.jpg"), response.body());
                int fileSize = response.body().length;
                printResult(true, "Resize successful!");
                System.out.println("  Output Size: " + fileSize + " bytes");
                System.out.println("  Output file: resized_java_test.jpg");
                if (fileSize < 5000) {
                    printResult(true, "Size verification passed (< 5KB)");
                    return true;
                } else {
                    printResult(false, "Size verification failed (>= 5KB)");
                    return false;
                }
            } else {
                printResult(false, "Status Code: " + response.statusCode());
                return false;
            }
        } catch (Exception e) {
            printResult(false, "Exception: " + e.getMessage());
            return false;
        }
    }

    private static boolean testMetadataPreservation() {
        System.out.println("\n=== Testing Metadata Preservation ===");
        try {
            Path file = Path.of(TEST_IMAGE);
            if (!Files.exists(file)) {
                printResult(false, "Test image not found: " + TEST_IMAGE);
                return false;
            }

            HttpClient client = HttpClient.newHttpClient();
            String boundary = "JavaBoundary" + System.currentTimeMillis();

            String boundaryLine = "--" + boundary;
            byte[] fileBytes = Files.readAllBytes(file);

            String metadataField = boundaryLine + "\r\n" +
                    "Content-Disposition: form-data; name=\"preserveMetadata\"\r\n\r\n" +
                    "true\r\n";
            byte[] metadataBytes = metadataField.getBytes();

            StringBuilder headerBuilder = new StringBuilder();
            headerBuilder.append(boundaryLine).append("\r\n");
            headerBuilder.append("Content-Disposition: form-data; name=\"image\"; filename=\"" + TEST_IMAGE + "\"\r\n");
            headerBuilder.append("Content-Type: image/jpeg\r\n\r\n");
            byte[] headerBytes = headerBuilder.toString().getBytes();

            byte[] footerBytes = ("\r\n" + boundaryLine + "--\r\n").getBytes();

            byte[] body = new byte[metadataBytes.length + headerBytes.length + fileBytes.length + footerBytes.length];
            System.arraycopy(metadataBytes, 0, body, 0, metadataBytes.length);
            System.arraycopy(headerBytes, 0, body, metadataBytes.length, headerBytes.length);
            System.arraycopy(fileBytes, 0, body, metadataBytes.length + headerBytes.length, fileBytes.length);
            System.arraycopy(footerBytes, 0, body, metadataBytes.length + headerBytes.length + fileBytes.length,
                    footerBytes.length);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + "/api/compress"))
                    .header("X-API-Key", API_KEY)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 200) {
                Files.write(Path.of("metadata_java_test.jpg"), response.body());
                String metadataPreserved = response.headers().firstValue("X-Metadata-Preserved").orElse("false");
                if (metadataPreserved.equals("true")) {
                    printResult(true, "Metadata preservation successful!");
                    System.out.println("  X-Metadata-Preserved: " + metadataPreserved);
                    System.out.println("  Output file: metadata_java_test.jpg");
                    return true;
                } else {
                    printResult(false, "Metadata header missing or false: " + metadataPreserved);
                    return false;
                }
            } else {
                printResult(false, "Status Code: " + response.statusCode());
                return false;
            }
        } catch (Exception e) {
            printResult(false, "Exception: " + e.getMessage());
            return false;
        }
    }
}
