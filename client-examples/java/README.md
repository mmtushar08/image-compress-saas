# SmartCompress Java Client

Official Java client for the SmartCompress API.

## Installation

Add to `pom.xml`:

```xml
<dependency>
    <groupId>com.shrinkix</groupId>
    <artifactId>smartcompress-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Usage

```java
import com.shrinkix.SmartCompress;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        SmartCompress client = new SmartCompress("YOUR_API_KEY");
        
        try {
            client.fromFile("input.png", "output.png", Map.of(
                "quality", 80,
                "width", 500
            ));
            System.out.println("Done!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
