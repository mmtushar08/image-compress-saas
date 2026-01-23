const multer = require("multer");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { sanitizeFilename } = require("../utils/fileValidation");

// Configure Multer Storage (Standard Multipart)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${sanitizeFilename(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 }
}).single("image"); // Single file 'image' field

// Helper to Download URL
const downloadFromUrl = (url, dest) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? https : http;
        client.get(url, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to download image: Status ${response.statusCode}`));
            }
            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on("finish", () => {
                file.close(() => resolve({ size: fs.statSync(dest).size, mimetype: response.headers['content-type'] }));
            });
            file.on("error", (err) => {
                fs.unlink(dest, () => { }); // Cleanup
                reject(err);
            });
        }).on("error", (err) => reject(err));
    });
};

/**
 * Universal Input Parser
 * Handles:
 * 1. Multipart/Form-Data (via Multer)
 * 2. Raw Binary (Image Content-Type)
 * 3. JSON with Source URL
 */
exports.universalParser = async (req, res, next) => {
    const contentType = req.headers["content-type"] || "";

    // 1. Multipart Form Data (Browser / Standard API)
    if (contentType.includes("multipart/form-data")) {
        return upload(req, res, (err) => {
            if (err) return next(err);
            if (!req.file && !req.body.source) {
                // If no file in 'image' field, check if we might parse other fields later? 
                // For now, if multer passes without error but no file, we continue and let Controller catch it,
                // OR check logic below.
            }
            next();
        });
    }

    // Ensure uploads directory exists (use absolute path)
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    // 2. JSON Input (Source URL)
    if (contentType.includes("application/json")) {
        // Body is not parsed yet if we didn't use bodyParser.json() globally or if we bypassed it.
        // Express typically parses JSON if configured in server.js.
        // Assuming server.js has app.use(express.json())

        // We handle the case where body might be empty if raw stream was expected but json sent
        if (!req.body || Object.keys(req.body).length === 0) {
            // Try to read stream if body empty? No, express.json() usually handles it.
        }

        const source = req.body.source;
        if (source && source.url) {
            try {
                const ext = path.extname(source.url).split(/[?#]/)[0] || ".jpg"; // Default to jpg if unknown
                const filename = `url-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
                const filePath = path.join(uploadDir, filename);

                const stats = await downloadFromUrl(source.url, filePath);

                // Mock req.file
                req.file = {
                    path: filePath,
                    filename: filename,
                    originalname: path.basename(source.url),
                    mimetype: stats.mimetype || "image/jpeg",
                    size: stats.size
                };

                // Map other TinyPNG parameters (resize, etc) to req.body
                if (req.body.resize) {
                    req.body.method = req.body.resize.method;
                    req.body.width = req.body.resize.width;
                    req.body.height = req.body.resize.height;
                }

                return next();
            } catch (err) {
                return res.status(400).json({ success: false, error: "Failed to download image from URL: " + err.message });
            }
        }
    }

    // 3. Raw Binary Upload
    if (contentType.startsWith("image/")) {
        const extRaw = contentType.split("/")[1];
        const ext = extRaw === "jpeg" ? ".jpg" : `.${extRaw}`;
        const filename = `raw-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        const filePath = path.join(uploadDir, filename);

        const writeStream = fs.createWriteStream(filePath);

        req.pipe(writeStream);

        writeStream.on("finish", () => {
            req.file = {
                path: filePath,
                filename: filename,
                originalname: "raw_image" + ext,
                mimetype: contentType,
                size: fs.statSync(filePath).size
            };

            // Force JSON response for raw uploads (TinyPNG Compatibility)
            req.headers['accept'] = 'application/json';

            next();
        });

        writeStream.on("error", (err) => {
            next(err);
        });
        return;
    }

    // Fallback / Unknown
    next();
};
