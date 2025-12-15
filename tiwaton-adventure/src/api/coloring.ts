import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

  const { topic } = req.body ?? {};
  if (!topic) return res.status(400).json({ error: "topic is required" });

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { text: `Create a simple black and white line art coloring page for children about: ${topic}. White background, thick lines, no shading.` }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const inline = parts.find((p: any) => p.inlineData)?.inlineData;

    if (!inline?.data) return res.status(200).json({ imageDataUrl: null });

    return res.status(200).json({ imageDataUrl: `data:image/png;base64,${inline.data}` });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Image generation failed" });
  }
}
