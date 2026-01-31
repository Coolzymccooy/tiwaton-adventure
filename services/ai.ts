// src/services/ai.ts
// Frontend AI client: calls your backend (NOT Gemini directly)

type StoryResult = { title: string; content: string };

// NOTE:
// - Keep this NON-sensitive (Vite exposes VITE_* vars to the browser bundle).
// - In dev, you can omit it and rely on a Vite proxy for /api.
const RAW_API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.toString()?.trim() || "";

// Avoid accidental double-slashes when you set something like
// VITE_API_BASE_URL=https://api.example.com/
const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

/**
 * If VITE_API_BASE_URL is empty:
 * - dev: use Vite proxy (recommended)
 * - prod: same-origin (/api/...)
 */
function apiUrl(path: string) {
  if (!path.startsWith("/")) path = "/" + path;
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function postJson<T>(path: string, body: any): Promise<T> {
  // Abort fetch if it hangs (common when prod base URL is wrong or backend is down)
  const controller = new AbortController();
  const timeoutMs = Number((import.meta as any).env?.VITE_API_TIMEOUT_MS || 30000);
  const t = window.setTimeout(() => controller.abort(), timeoutMs);

  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // If you ever add session cookies, this keeps it working.
    credentials: "include",
    signal: controller.signal,
  });

  window.clearTimeout(t);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = text?.slice(0, 500) || "";
    throw new Error(`API ${path} failed: ${res.status} ${msg}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Optional: shrink big drawings before upload (keeps your app snappy + avoids 413 errors).
 * Accepts data URLs like "data:image/png;base64,..."
 */
const optimizeImage = (dataUrl: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const MAX_WIDTH = 768; // safer than 512 for sketches, still lightweight
      const scale = MAX_WIDTH / img.width;

      if (scale >= 1) return resolve(dataUrl);

      const canvas = document.createElement("canvas");
      canvas.width = MAX_WIDTH;
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // jpeg is much smaller than png for transport
      const out = canvas.toDataURL("image/jpeg", 0.9);
      resolve(out);
    };
    img.onerror = () => resolve(dataUrl);
  });

export const AIService = {
  async generateColoringPage(topic: string): Promise<string | null> {
    try {
      const data = await postJson<{ imageDataUrl: string }>("/api/ai/coloring-page", {
        topic,
      });
      return data.imageDataUrl || null;
    } catch (e) {
      console.error("generateColoringPage error", e);
      return null;
    }
  },

  async transformSketch(imageBase64: string): Promise<string | null> {
    try {
      const optimized = await optimizeImage(imageBase64);
      const data = await postJson<{ imageDataUrl: string }>("/api/ai/transform-sketch", {
        imageDataUrl: optimized,
      });
      return data.imageDataUrl || null;
    } catch (e) {
      console.error("transformSketch error", e);
      return null;
    }
  },

  async cleanupDrawing(imageBase64: string): Promise<string | null> {
    try {
      const optimized = await optimizeImage(imageBase64);
      const data = await postJson<{ imageDataUrl: string }>("/api/ai/cleanup-drawing", {
        imageDataUrl: optimized,
      });
      return data.imageDataUrl || null;
    } catch (e) {
      console.error("cleanupDrawing error", e);
      return null;
    }
  },

  async generateStoryFromAssets(drawings: string[]): Promise<StoryResult | null> {
    try {
      const optimized = await Promise.all(drawings.map(optimizeImage));
      const data = await postJson<StoryResult>("/api/ai/story-from-assets", {
        drawings: optimized,
      });
      if (!data?.title || !data?.content) return null;
      return data;
    } catch (e) {
      console.error("generateStoryFromAssets error", e);
      return null;
    }
  },

  async generateQuiz(
    category: string,
    level: number,
    world?: string,
    age: number = 6
  ): Promise<any[]> {
    try {
      const data = await postJson<{ questions: any[] }>("/api/ai/quiz", {
        category,
        level,
        world,
        age,
      });
      return Array.isArray(data.questions) ? data.questions : [];
    } catch (e) {
      console.error("generateQuiz error", e);
      return [];
    }
  },
};
