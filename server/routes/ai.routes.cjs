// server/routes/ai.routes.cjs
const express = require("express");
const { GoogleGenAI, Type } = require("@google/genai");

const router = express.Router();

// ---- Gemini client ----
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("[ai] WARNING: GEMINI_API_KEY is not set. AI endpoints will fail.");
}

const ai = new GoogleGenAI({ apiKey });

// ---- helpers ----
function mustHave(body, key) {
  if (!body || body[key] == null || body[key] === "") {
    const err = new Error(`Missing required field: ${key}`);
    err.status = 400;
    throw err;
  }
}

function dataUrlToInlineData(dataUrl) {
  // accepts "data:image/png;base64,...." OR raw base64
  if (!dataUrl) return null;

  if (typeof dataUrl !== "string") return null;

  if (dataUrl.startsWith("data:")) {
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!match) return null;
    return { mimeType: match[1], data: match[2] };
  }

  // assume jpeg base64 if raw
  return { mimeType: "image/jpeg", data: dataUrl };
}

function pickInlineImage(response) {
  const parts = response?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part?.inlineData?.data) {
      const mime = part.inlineData.mimeType || "image/png";
      return `data:${mime};base64,${part.inlineData.data}`;
    }
  }
  return null;
}

function safeJsonParse(text) {
  if (!text) return null;

  // Some models wrap JSON in ```json ... ```
  const cleaned = String(text)
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

function assertKey() {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error("GEMINI_API_KEY is missing on the server");
    err.status = 500;
    throw err;
  }
}

// ---- routes ----

router.post("/coloring-page", async (req, res, next) => {
  try {
    assertKey();
    mustHave(req.body, "topic");
    const topic = String(req.body.topic);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text:
              `Create a simple black and white kids coloring page about: ${topic}. ` +
              `White background, thick clean outlines, no shading, no gray, no colors.`,
          },
        ],
      },
    });

    const imageDataUrl = pickInlineImage(response);
    if (!imageDataUrl) return res.status(502).json({ error: "No image returned from Gemini" });

    res.json({ imageDataUrl });
  } catch (e) {
    next(e);
  }
});

router.post("/transform-sketch", async (req, res, next) => {
  try {
    assertKey();
    mustHave(req.body, "imageDataUrl");

    const inline = dataUrlToInlineData(String(req.body.imageDataUrl));
    if (!inline) return res.status(400).json({ error: "Invalid imageDataUrl" });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { inlineData: inline },
          {
            text:
              "Transform this sketch into a high-quality, kid-friendly 3D rendered image. " +
              "Keep it clean and bright.",
          },
        ],
      },
    });

    const imageDataUrl = pickInlineImage(response);
    if (!imageDataUrl) return res.status(502).json({ error: "No image returned from Gemini" });

    res.json({ imageDataUrl });
  } catch (e) {
    next(e);
  }
});

router.post("/cleanup-drawing", async (req, res, next) => {
  try {
    assertKey();
    mustHave(req.body, "imageDataUrl");

    const inline = dataUrlToInlineData(String(req.body.imageDataUrl));
    if (!inline) return res.status(400).json({ error: "Invalid imageDataUrl" });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { inlineData: inline },
          {
            text:
              "Redraw this sketch as clean black and white cartoon line art. " +
              "White background, thick smooth outlines.",
          },
        ],
      },
    });

    const imageDataUrl = pickInlineImage(response);
    if (!imageDataUrl) return res.status(502).json({ error: "No image returned from Gemini" });

    res.json({ imageDataUrl });
  } catch (e) {
    next(e);
  }
});

router.post("/story-from-assets", async (req, res, next) => {
  try {
    assertKey();
    mustHave(req.body, "drawings");

    const drawings = Array.isArray(req.body.drawings) ? req.body.drawings : [];
    if (drawings.length === 0) {
      return res.status(400).json({ error: "drawings must be a non-empty array" });
    }

    const parts = drawings.map((d) => {
      const inline = dataUrlToInlineData(String(d));
      if (!inline) throw Object.assign(new Error("Invalid drawings item"), { status: 400 });
      return { inlineData: inline };
    });

    parts.push({
      text:
        "Write a short, fun kids adventure story inspired by these character drawings. " +
        'Return JSON: {"title":"...","content":"..."}. Keep it age-appropriate.',
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ["title", "content"],
        },
      },
    });

    const obj = safeJsonParse(response.text);
    if (!obj?.title || !obj?.content) {
      return res.status(502).json({
        error: "Gemini returned invalid JSON for story",
        raw: response.text || "",
      });
    }

    res.json({ title: obj.title, content: obj.content });
  } catch (e) {
    next(e);
  }
});

router.post("/quiz", async (req, res, next) => {
  try {
    assertKey();

    const category = String(req.body.category || "general");
    const level = Number(req.body.level || 1);
    const world = req.body.world ? String(req.body.world) : "";
    const age = Number(req.body.age || 6);

    const context = world ? `Theme: ${world}.` : `Category: ${category}.`;
    const prompt =
      `Generate 5 multiple-choice questions for a ${age}-year-old. ${context} Level: ${level}. ` +
      `Return JSON array with objects: {question, options (4 strings), correctIndex (0-3), explanation}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }] },
      config: { responseMimeType: "application/json" },
    });

    const parsed = safeJsonParse(response.text);
    const questions = Array.isArray(parsed) ? parsed : [];

    res.json({ questions });
  } catch (e) {
    next(e);
  }
});

// ---- error handler (improved logging) ----
router.use((err, req, res, next) => {
  const status = err.status || 500;

  // Log full error server-side (super useful on Render logs)
  console.error("[ai] error:", {
    status,
    message: err.message,
    stack: err.stack,
  });

  res.status(status).json({
    error: err.message || "Server error",
  });
});

module.exports = router;
// also support accidental ESM consumers
//module.exports.router = router;
//module.exports.default = router;


