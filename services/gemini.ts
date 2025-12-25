
import { GoogleGenAI, Type } from "@google/genai";
import { Translation, BookAnnotation } from "../types";

/*
 * Gemini API service for the reader application.
 * Note: process.env.API_KEY is assumed to be available in the execution environment.
 */
export const geminiService = {
  async generateSummary(text: string): Promise<string> {
    if (!process.env.API_KEY) return "API Key not configured.";
    try {
      // Create a fresh instance for the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize the following text in one concise paragraph for a Cornell notes summary section:\n\n${text}`,
      });
      // Access text as a property, not a method
      return response.text || "Failed to generate summary.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating summary.";
    }
  },

  async generateCues(text: string): Promise<string[]> {
    if (!process.env.API_KEY) return [];
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      // Extract text safely and handle potential undefined output
      const jsonStr = response.text?.trim() || '{"cues":[]}';
      const data = JSON.parse(jsonStr);
      return data.cues || [];
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  },

  async generateTranslation(text: string, targetLang: string = "English"): Promise<Translation> {
    if (!process.env.API_KEY) return { translator: "Gemini AI", text: "API Key not configured.", language: targetLang };
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use gemini-3-pro-preview for complex literary translation tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Translate the following text into ${targetLang}. Maintain the tone and literary quality:\n\n${text}`,
      });
      return {
        translator: "Gemini AI",
        text: response.text || "Translation failed.",
        language: targetLang
      };
    } catch (error) {
      console.error("Translation Error:", error);
      return { translator: "Gemini AI", text: "Error during translation.", language: targetLang };
    }
  },

  async generateAnnotations(text: string): Promise<BookAnnotation[]> {
    if (!process.env.API_KEY) return [];
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use gemini-3-pro-preview for advanced scholarly reasoning tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
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
      const data = JSON.parse(response.text?.trim() || '{"annotations":[]}');
      return data.annotations || [];
    } catch (error) {
      console.error("Annotation Error:", error);
      return [];
    }
  }
};