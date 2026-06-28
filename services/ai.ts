// src/services/ai.ts
// Frontend AI client: calls your backend (NOT Gemini directly)

type StoryResult = { title: string; content: string };
type ChallengeJudgeResult = {
  matchedPrompt: boolean;
  creativityScore: number;
  missionScore: number;
  feedback: string;
  highlights: string[];
};

import { apiUrl, postJson } from './api';

const IMAGE_API_BASE =
  (import.meta as any).env?.VITE_IMAGE_API_BASE_URL?.toString()?.trim() || undefined;

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
    const optimized = await optimizeImage(imageBase64);
    const data = await postJson<{ imageDataUrl: string }>("/api/ai/transform-sketch", {
      imageDataUrl: optimized,
    }, IMAGE_API_BASE);
    return data.imageDataUrl || null;
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

  async generateStoryFromPrompt(topic: string, age: number = 6): Promise<StoryResult | null> {
    try {
      const data = await postJson<StoryResult>("/api/ai/story-from-prompt", {
        topic,
        age,
      });
      if (!data?.title || !data?.content) throw new Error("Empty response");
      return data;
    } catch (e) {
      console.error("generateStoryFromPrompt error", e);
      return {
        title: `The Magic of ${topic.substring(0, 20)}`,
        content: `Once upon a time, there was a wonderful adventure involving ${topic}. The stars twinkled and magic filled the air as the journey unfolded. Remember, the true magic is the imagination you bring to it! Keep dreaming big, little explorer.`
      };
    }
  },

  async generateQuizForStory(title: string, content: string, age: number = 6): Promise<any[]> {
    try {
      const data = await postJson<{ questions: any[] }>("/api/ai/story-quiz", {
        title,
        content,
        age,
      });
      if (!data?.questions || data.questions.length === 0) throw new Error("Empty quiz");
      return Array.isArray(data.questions) ? data.questions : [];
    } catch (e) {
      console.error("generateQuizForStory error", e);
      return [
        {
          question: `Did you discover the magic in ${title}?`,
          options: ["Yes!", "Absolutely!", "Of course!", "It was wonderful!"],
          correctIndex: 0
        }
      ];
    }
  },

  async judgeChallengeDrawing(
    imageBase64: string,
    challenge: { title: string; prompt: string; setup: string; goals: string[] }
  ): Promise<ChallengeJudgeResult | null> {
    try {
      const optimized = await optimizeImage(imageBase64);
      const data = await postJson<ChallengeJudgeResult>("/api/ai/judge-challenge", {
        imageDataUrl: optimized,
        challenge,
      });

      if (!data?.feedback) return null;

      return {
        matchedPrompt: Boolean(data.matchedPrompt),
        creativityScore: Number(data.creativityScore || 0),
        missionScore: Number(data.missionScore || 0),
        feedback: String(data.feedback || ''),
        highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
      };
    } catch (e) {
      console.error("judgeChallengeDrawing error", e);
      return null;
    }
  },
};
