const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const compressRoutes = require("./routes/compress");

const app = express();

app.use(cors({
  exposedHeaders: ["X-Original-Size", "X-Compressed-Size", "X-Saved-Percent"]
}));
app.use(express.json());

// Simple in-memory rate limiter (resets on restart)
const usage = {}; // { ip: { count: 0, date: 'YYYY-MM-DD' } }

app.use((req, res, next) => {
  if (req.path.startsWith("/api/compress") && req.method === "POST") {
    const ip = req.ip;
    const today = new Date().toISOString().split("T")[0];

    if (!usage[ip]) {
      usage[ip] = { count: 0, date: today };
    }

    // Reset loop if day changed
    if (usage[ip].date !== today) {
      usage[ip] = { count: 0, date: today };
    }

    if (usage[ip].count >= 100) {
      return res.status(429).json({ error: "Daily limit reached. Please upgrade to Pro." });
    }

    usage[ip].count++;
  }
  next();
});

app.use(express.static(path.join(__dirname, "../web")));
app.get("/api/check-limit", (req, res) => {
  const ip = req.ip;
  const today = new Date().toISOString().split("T")[0];
  const currentUsage = usage[ip];

  const remaining = currentUsage && currentUsage.date === today
    ? Math.max(0, 100 - currentUsage.count)
    : 100;

  res.json({ remaining });
});

app.use("/api/compress", compressRoutes);

// Global error handler (must be BEFORE listen)
app.use((err, req, res, next) => {
  if (err.message && err.message.includes("Only PNG and JPG")) {
    return res.status(400).json({ error: err.message });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
