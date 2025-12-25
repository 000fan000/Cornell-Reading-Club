
import { GoogleGenAI, Type } from "@google/genai";
import { Translation, BookAnnotation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateSummary(text: string): Promise<string> {
    if (!process.env.API_KEY) return "API Key not configured.";
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize the following text in one concise paragraph for a Cornell notes summary section:\n\n${text}`,
      });
      return response.text || "Failed to generate summary.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating summary.";
    }
  },

  async generateCues(text: string): Promise<string[]> {
    if (!process.env.API_KEY) return [];
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this text and provide 3-5 key concepts or questions as 'Cues' for Cornell note-taking. Return them as a simple list. \n\n${text}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cues: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });
      const jsonStr = response.text.trim();
      const data = JSON.parse(jsonStr || '{"cues":[]}');
      return data.cues;
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  },

  async generateTranslation(text: string, targetLang: string = "English"): Promise<Translation> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following text into ${targetLang}. Maintain the tone and literary quality:\n\n${text}`,
      });
      return {
        translator: "Gemini AI",
        text: response.text || "Translation failed."
      };
    } catch (error) {
      console.error("Translation Error:", error);
      return { translator: "Gemini AI", text: "Error during translation." };
    }
  },

  async generateAnnotations(text: string): Promise<BookAnnotation[]> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide 3-5 scholarly annotations for the following text. Include philosophical interpretations, linguistic notes, or historical context. \n\n${text}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              annotations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    content: { type: Type.STRING },
                    reference_position: { type: Type.STRING }
                  },
                  required: ["type", "content", "reference_position"]
                }
              }
            }
          }
        }
      });
      const data = JSON.parse(response.text.trim() || '{"annotations":[]}');
      return data.annotations;
    } catch (error) {
      console.error("Annotation Error:", error);
      return [];
    }
  }
};
