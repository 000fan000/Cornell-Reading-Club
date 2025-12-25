
import { GoogleGenAI, Type } from "@google/genai";

// Ensure Gemini API is initialized using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateSummary(text: string): Promise<string> {
    if (!process.env.API_KEY) return "API Key not configured.";
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize the following text in one concise paragraph for a Cornell notes summary section:\n\n${text}`,
      });
      // Directly use .text property
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
      // Directly use .text property and trim for parsing
      const jsonStr = response.text.trim();
      const data = JSON.parse(jsonStr || '{"cues":[]}');
      return data.cues;
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  }
};
