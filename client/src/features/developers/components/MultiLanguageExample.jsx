import CodeExample from './CodeExample';

export default function MultiLanguageExample() {
    const examples = {
        'cURL': `curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -o compressed.jpg`,

        'Node.js': `const shrinkix = require("shrinkix");
shrinkix.key = "YOUR_API_KEY";

const source = shrinkix.fromFile("photo.jpg");
source.toFile("compressed.jpg");`,

        'Python': `import shrinkix
shrinkix.key = "YOUR_API_KEY"

source = shrinkix.from_file("photo.jpg")
source.to_file("compressed.jpg")`,

        'PHP': `\\Shrinkix\\setKey("YOUR_API_KEY");

\\Shrinkix\\fromFile("photo.jpg")
    ->toFile("compressed.jpg");`
    };

    return <CodeExample examples={examples} />;
}
