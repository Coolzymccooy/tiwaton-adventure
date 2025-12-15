const toBase64Payload = (dataUrl: string) => {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header?.match(/data:(.*?);base64/);
  return {
    mimeType: mimeMatch?.[1] || "image/jpeg",
    base64Data: data || ""
  };
};

// Optional: keep your optimizeImage in the browser (good idea)
// so uploads are smaller before sending to /api.
export const optimizeImage = (base64Str: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 512;
      const scale = MAX_WIDTH / img.width;

      if (scale >= 1) return resolve(base64Str);

      canvas.width = MAX_WIDTH;
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => resolve(base64Str);
  });

export const AIService = {
  async generateColoringPage(topic: string): Promise<string | null> {
    const r = await fetch("/api/coloring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });
     if (!r.ok) return null;           // ← ADD THIS LINE
  const data = await r.json();      // ← KEEP THIS
    return data.imageDataUrl ?? null;
  },

  async generateLineArt(imageDataUrl: string): Promise<string | null> {
    const optimized = await optimizeImage(imageDataUrl);
    const payload = toBase64Payload(optimized);

    const r = await fetch("/api/lineart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) return null; 
    const data = await r.json();
    return data.imageDataUrl ?? null;
  },

  async transformSketch(imageDataUrl: string): Promise<string | null> {
    const optimized = await optimizeImage(imageDataUrl);
    const payload = toBase64Payload(optimized);

    const r = await fetch("/api/transform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    return data.imageDataUrl ?? null;
  },

  async generateQuiz(category: string, level: number): Promise<any[]> {
    const r = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, level })
    });
    if (!r.ok) return [];
    return await r.json();
  }
};
