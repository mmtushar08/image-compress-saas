export default function CodeExamples() {
    return (
        <section className="dev-section">
            <div className="dev-container">
                <h2>Getting started</h2>
                <div className="code-examples">
                    <div className="code-block">
                        <h4>Node.js</h4>
                        <pre><code>{`npm install --save shrinkix

const shrinkix = require("shrinkix");
shrinkix.key = "YOUR_API_KEY";

const source = shrinkix.fromFile("input.jpg");
source.toFile("output.jpg");`}</code></pre>
                    </div>

                    <div className="code-block">
                        <h4>Python</h4>
                        <pre><code>{`pip install shrinkix

import shrinkix
shrinkix.key = "YOUR_API_KEY"

source = shrinkix.from_file("input.jpg")
source.to_file("output.jpg")`}</code></pre>
                    </div>

                    <div className="code-block">
                        <h4>PHP</h4>
                        <pre><code>{`composer require shrinkix/shrinkix-php

\\Shrinkix\\setKey("YOUR_API_KEY");

$source = \\Shrinkix\\fromFile("input.jpg");
$source->toFile("output.jpg");`}</code></pre>
                    </div>

                    <div className="code-block">
                        <h4>cURL</h4>
                        <pre><code>{`curl -X POST https://api.shrinkix.com/compress \\
  --user api:YOUR_API_KEY \\
  --data-binary @input.png \\
  -o output.png`}</code></pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
