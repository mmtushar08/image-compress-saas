const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const authMiddleware = require("./middleware/auth");
const compressRoutes = require("./routes/compress");

const app = express();

// Trust proxy for accurate IP addresses (set to 1 for first proxy)
app.set('trust proxy', 1);

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow file downloads
}));

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  exposedHeaders: ["X-Original-Size", "X-Compressed-Size", "X-Saved-Percent", "X-Compression-Ratio", "X-Output-Format", "X-Compression-Count"]
}));

// Body parser with size limits
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// General rate limiter (protects all endpoints)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

// Auth Middleware
app.use(authMiddleware);

// 2. HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "trimixo-api",
    uptime: process.uptime()
  });
});

app.get("/api/check-limit", async (req, res) => {
  const { PLANS } = require("./controllers/userController");

  // If user is authenticated via authMiddleware
  if (req.user) {
    const planConfig = PLANS[req.user.plan] || PLANS.free;
    const remaining = req.user.plan === 'free' || req.user.plan === 'starter'
      ? 10 - (req.user.dailyUsage || 0)
      : planConfig.credits - (req.user.usage || 0);

    return res.json({
      remaining: Math.max(0, remaining),
      plan: req.user.plan,
      total: req.user.plan === 'free' || req.user.plan === 'starter' ? 10 : planConfig.credits,
      usage: req.user.plan === 'free' || req.user.plan === 'starter' ? (req.user.dailyUsage || 0) : (req.user.usage || 0),
      maxFileSize: planConfig.maxFileSize
    });
  }

  // Fallback for Guests
  const { checkGuestLimit } = require("./controllers/userController");
  const guestStats = checkGuestLimit(req.ip);

  res.json({
    remaining: guestStats.remaining,
    plan: 'guest',
    total: guestStats.limit,
    usage: guestStats.usage,
    maxFileSize: PLANS.free.maxFileSize
  });
});

app.use(express.static(path.join(__dirname, "../client/dist")));

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes); // Mount before compress

// Mount Compression Routes
app.use("/api/compress", compressRoutes);

// Mount Payment Routes
const paymentRoutes = require("./routes/payments");
app.use("/api/payments", paymentRoutes);

// Fix for React Router refresh - Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Environment variable validation
function validateEnv() {
  const required = [];
  const optional = ['PORT', 'CORS_ORIGIN', 'NODE_ENV'];

  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`⚠️  Missing optional environment variables: ${missing.join(', ')}`);
  }

  // Set defaults
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.PORT = process.env.PORT || '5000';
}

validateEnv();

// 5. GLOBAL ERROR HANDLING
app.use((err, req, res, next) => {
  // Don't log sensitive error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Multer Error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success: false, error: "File too large" });
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ success: false, error: "Too many files" });
  }
  if (err.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({ success: false, error: "Invalid file type" });
  }

  // Log error (sanitized in production)
  if (isDevelopment) {
    console.error("Unhandled error:", err);
  } else {
    console.error("Unhandled error:", err.message);
  }

  if (res.headersSent) {
    return next(err);
  }

  // Don't expose internal error details in production
  const errorMessage = isDevelopment
    ? (err.message || "Internal Server Error")
    : "Internal Server Error";

  res.status(err.status || 500).json({
    success: false,
    error: errorMessage,
    ...(isDevelopment && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);

  // Safety Net: Cleanup old files every 1 hour
  setInterval(() => {
    console.log("🧹 Running scheduled cleanup...");
    const dirs = [
      path.join(__dirname, "uploads"),
      path.join(__dirname, "output")
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) return;
      fs.readdir(dir, (err, files) => {
        if (err) return console.error(`Failed to read ${dir}:`, err);

        const now = Date.now();
        files.forEach(file => {
          const filePath = path.join(dir, file);
          fs.stat(filePath, (err, stats) => {
            if (err) return;
            // Delete files older than 30 minutes
            if (now - stats.mtimeMs > 30 * 60 * 1000) {
              fs.unlink(filePath, () => console.log(`Deleted stale file: ${file}`));
            }
          });
        });
      });
    });
  }, 60 * 60 * 1000); // 1 hour
});
