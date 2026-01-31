// server/index.cjs
const express = require("express");
const cors = require("cors");
const path = require("path");

// ---- load env (local dev) ----
try {
  const path = require("path");
  require("dotenv").config({ path: path.join(__dirname, ".env") });
} catch (_) {}



const app = express();

// base64 images are big → increase limits
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// ---- CORS ----
// Example: CORS_ORIGIN=http://localhost:3010,http://192.168.0.22:3010


const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman / server-to-server
      if (allowedOrigins.length === 0) return cb(null, true); // dev-friendly
      return cb(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  })
);

// ---- health ----
app.get("/api/health", (_, res) => res.json({ ok: true }));

// ---- routes ----
const aiRouter = require("./routes/ai.routes.cjs");
app.use("/api/ai", aiRouter);


// ---- global error handler ----
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error("[server] error:", {
    status,
    message: err.message,
    stack: err.stack,
    path: req.path,
  });
  res.status(status).json({ error: err.message || "Server error" });
});

// ---- listen ----
const port = Number(process.env.PORT || 3600);
app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`);
  console.log("[backend] env:", {
    hasGemini: Boolean(process.env.GEMINI_API_KEY),
    cors: process.env.CORS_ORIGIN || "",
    nodeEnv: process.env.NODE_ENV || "",
  });
});
