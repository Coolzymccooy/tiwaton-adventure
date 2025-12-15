import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

  const { category, level } = req.body ?? {};
  if (!category || typeof level !== "number") {
    return res.status(400).json({ error: "category (string) and level (number) are required" });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate 5 multiple choice trivia questions about "${category}" suitable for children.
Difficulty level: ${level} out of 10.
Make the questions fun and slightly funny/sarcastic.
Return JSON ONLY (no markdown).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              funnyComment: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex"]
          }
        }
      }
    });

    const text =
      (response as any).text ??
      (response as any).candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ??
      "";

    if (!text) return res.status(200).json([]);

    return res.status(200).json(JSON.parse(text));
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Quiz generation failed" });
  }
}
