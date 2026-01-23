import useDocsNavigation from '../../../hooks/useDocsNavigation';
import DocsSidebar from '../../../components/docs/DocsSidebar';
import DocsSection from '../../../components/docs/DocsSection';
import CodePane from '../../../components/docs/CodePane';
import '../../../styles/api-docs.css';

export default function ApiDocs() {
    const { activeSection, language, setLanguage, scrollToSection } = useDocsNavigation();

    // Code Samples Configuration
    const codeSamples = {
        authentication: {
            nodejs: `const shrinkix = require("shrinkix");\nshrinkix.key = "YOUR_API_KEY";\n\n// Validate your key\nawait shrinkix.validate();`,
            python: `import shrinkix\nshrinkix.key = "YOUR_API_KEY"\n\n# Validate your key\nshrinkix.validate()`,
            php: `\\Shrinkix\\setKey("YOUR_API_KEY");\n\n// Validate your key\n\\Shrinkix\\validate();`,
            curl: `curl https://api.shrinkix.com/validate \\\n  --user api:YOUR_API_KEY`
        },
        compress: {
            nodejs: `const shrinkix = require("shrinkix");\nconst source = shrinkix.fromFile("large.jpg");\nsource.toFile("optimized.jpg");`,
            python: `import shrinkix\nsource = shrinkix.from_file("large.jpg")\nsource.to_file("optimized.jpg")`,
            php: `\\Shrinkix\\fromFile("large.jpg")\n    ->toFile("optimized.jpg");`,
            curl: `curl https://api.shrinkix.com/compress \\\n  --user api:YOUR_API_KEY \\\n  --data-binary @large.jpg \\\n  --output optimized.jpg`
        },
        resize: {
            nodejs: `const source = shrinkix.fromFile("large.jpg");\nconst resized = source.resize({\n  method: "fit",\n  width: 150,\n  height: 100\n});\nresized.toFile("thumbnail.jpg");`,
            python: `source = shrinkix.from_file("large.jpg")\nresized = source.resize(\n    method="fit",\n    width=150,\n    height=100\n)\nresized.to_file("thumbnail.jpg")`,
            php: `$source = \\Shrinkix\\fromFile("large.jpg");\n$resized = $source->resize(array(\n    "method" => "fit",\n    "width" => 150,\n    "height" => 100\n));\n$resized->toFile("thumbnail.jpg");`,
            curl: `curl https://api.shrinkix.com/resize \\\n  --user api:YOUR_API_KEY \\\n  --data-binary @large.jpg \\\n  --data '{"resize":{"method":"fit","width":150,"height":100}}' \\\n  --output thumbnail.jpg`
        },
        account: {
            nodejs: `const compressionCount = shrinkix.compressionCount;\nconsole.log(compressionCount);`,
            python: `compression_count = shrinkix.compression_count\nprint(compression_count)`,
            php: `$count = \\Shrinkix\\compressionCount();\nprint($count);`,
            curl: `curl https://api.shrinkix.com/usage \\\n  --user api:YOUR_API_KEY`
        }
    };

    return (
        <div className="api-docs-container">
            <DocsSidebar activeSection={activeSection} scrollToSection={scrollToSection} />

            <main className="docs-content">
                <DocsSection
                    id="authentication"
                    title="Authentication"
                    description="Authenticate your requests by providing your API key. You can find your API key in the developer dashboard."
                >
                    <p>All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.</p>
                    <CodePane language={language} setLanguage={setLanguage} codeSamples={codeSamples.authentication} />
                </DocsSection>

                <DocsSection
                    id="compress"
                    title="Compress Image"
                    description="Upload an image to the Shrinkix API to compress it. We support JPEG, PNG, and WebP images."
                >
                    <CodePane language={language} setLanguage={setLanguage} codeSamples={codeSamples.compress} />
                </DocsSection>

                <DocsSection
                    id="resize"
                    title="Resize Image"
                    description="Create thumbnails or resize your images to fit your website design perfectly using our smart resizing API."
                >
                    <CodePane language={language} setLanguage={setLanguage} codeSamples={codeSamples.resize} />
                </DocsSection>

                <DocsSection
                    id="account"
                    title="Account Usage"
                    description="Retrieve the number of compressions your account has performed this month."
                >
                    <CodePane language={language} setLanguage={setLanguage} codeSamples={codeSamples.account} />
                </DocsSection>
            </main>
        </div>
    );
}
