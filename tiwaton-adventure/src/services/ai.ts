import { GoogleGenAI, Type } from "@google/genai";

// Support both Vite (import.meta.env) and standard Node (process.env)
const apiKey = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Helper to downscale images before sending to AI to prevent timeouts/errors.
 */
const optimizeImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 512; // Sufficient for AI reference, significantly smaller payload
      const scaleSize = MAX_WIDTH / img.width;
      
      if (scaleSize >= 1) {
          resolve(base64Str); // No resize needed
          return;
      }
      
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // Use JPEG for smaller size
    };
    img.onerror = () => resolve(base64Str); // Fallback
  });
};

export const AIService = {
  /**
   * Generates a line-art coloring page from text prompt.
   */
  async generateColoringPage(topic: string): Promise<string | null> {
    if (!apiKey) {
      console.error("API Key missing");
      return null;
    }
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Create a simple black and white line art coloring page for children about: ${topic}. White background, thick lines, no shading.` }]
        }
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("AI Gen Error:", error);
      return null;
    }
  },

  /**
   * Converts an existing image (photo/sketch) into clean line art.
   */
  async generateLineArt(imageBase64: string): Promise<string | null> {
    if (!apiKey) return null;
    try {
      const optimizedBase64 = await optimizeImage(imageBase64);
      const base64Data = optimizedBase64.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
              }
            },
            { text: 'Convert this image into a clean, black and white line art coloring page suitable for children. Remove all background details, shading, and colors. Just keep the main subject as clear, bold outlines on a white background.' }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("AI Line Art Error:", error);
      return null;
    }
  },

  /**
   * Transforms a sketch into a high-quality image.
   * Includes optimization step.
   */
  async transformSketch(imageBase64: string): Promise<string | null> {
    if (!apiKey) return null;
    try {
      // 1. Optimize image size first to avoid "stopped working" / timeouts
      const optimizedBase64 = await optimizeImage(imageBase64);
      const base64Data = optimizedBase64.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
              }
            },
            { text: 'Transform this image into a high-quality, 3D rendered masterpiece. If it is a sketch, bring it to life in a Pixar style. If it is a photo, enhance it to look like a vibrant, magical movie poster while keeping the subject recognizable.' }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("AI Transform Error:", error);
      return null;
    }
  },

  /**
   * Generates Quiz Questions
   */
  async generateQuiz(category: string, level: number): Promise<any[]> {
    if (!apiKey) return [];
    
    const prompt = `Generate 5 multiple choice trivia questions about "${category}" suitable for children. 
    Difficulty level: ${level} out of 10. 
    Make the questions fun and slightly funny/sarcastic. 
    Return JSON format.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
                funnyComment: { type: Type.STRING, description: "A short funny comment if they get it right" }
              }
            }
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
      return [];
    } catch (e) {
      console.error("Quiz Gen Error", e);
      return [];
    }
  }
};