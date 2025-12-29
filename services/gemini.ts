
import { GoogleGenAI, Type } from "@google/genai";
import { Translation, BookAnnotation, ReaderBook, Book } from "../types";

export const geminiService = {
  async generateSummary(text: string): Promise<string> {
    if (!process.env.API_KEY) return "API Key not configured.";
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  },

  async processBookFile(fileData: string, mimeType: string, fileName: string): Promise<ReaderBook> {
    if (!process.env.API_KEY) throw new Error("API Key not configured.");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Task: Convert the provided ${mimeType === 'application/pdf' ? 'PDF document' : 'text file'} into a structured digital library asset.

Strict Requirements:
1. Extract the Title and Author correctly.
2. Break the content into logical Chapters. For very large files, extract at least the first 5 major sections/chapters.
3. For each chapter, extract the full available text.
4. Provide cultural and civilization context.
5. Generate 5-8 relevant thematic tags.

Output MUST be a single JSON object matching the following schema:
{
  "title": "string",
  "author": "string",
  "language": "string",
  "chapters": [{"chapter_number": number, "chapter_title": "string", "original_text": "string"}],
  "metadata_context": {
    "estimated_date": "string",
    "genre": ["string"],
    "region": "string",
    "historical_context": "string",
    "thematic_tags": [{"tag": "string", "weight": number}]
  }
}`;

    const contentPart = mimeType === 'application/pdf' 
      ? { inlineData: { data: fileData, mimeType: 'application/pdf' } }
      : { text: fileData };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [contentPart, { text: prompt }] },
        config: {
          responseMimeType: "application/json"
        }
      });

      const rawText = response.text || "{}";
      const raw = JSON.parse(rawText.trim());
      
      const bookId = `usr-${Date.now()}`;
      const title = raw.title || fileName.replace(/\.[^/.]+$/, "");
      const author = raw.author || "Unknown Collector";

      const chapters = (raw.chapters || []).map((ch: any, index: number) => ({
        chapter_number: ch.chapter_number || (index + 1),
        chapter_title: ch.chapter_title || `Section ${index + 1}`,
        original_text: ch.original_text || "Transcript unavailable for this section.",
        translations: [],
        book_annotations: []
      }));

      // If no chapters were extracted, create a default one with the raw file name
      if (chapters.length === 0) {
        chapters.push({
          chapter_number: 1,
          chapter_title: "Full Text",
          original_text: "Processing yielded no specific chapter breaks. The content may be non-textual or malformed.",
          translations: [],
          book_annotations: []
        });
      }

      const libraryCard: Book = {
        id: bookId,
        title_original: title,
        title_translations: { en: title, zh: title },
        author: {
          name_original: author,
          name_latinized: author,
          lifespan: "Contemporary",
          civilization: raw.metadata_context?.region || "Personal Archive"
        },
        metadata: {
          period: "user_uploads",
          estimated_date: raw.metadata_context?.estimated_date || "Present",
          original_language: raw.language || "Unknown",
          genre: raw.metadata_context?.genre || ["Private Volume"],
          length_category: "User Uploaded",
          difficulty_level: 5,
          babel_rating: 0
        },
        civilization_context: {
          region: raw.metadata_context?.region || "User Library",
          cultural_sphere: "Private Collection",
          historical_context: raw.metadata_context?.historical_context || "Digitized from personal file upload.",
          contemporary_works: [],
          predecessors: [],
          successors: []
        },
        thematic_tags: raw.metadata_context?.thematic_tags || [{ tag: "Personal", weight: 1 }],
        is_user_uploaded: true
      };

      return {
        id: bookId,
        title: title,
        author: author,
        language: raw.language || "Unknown",
        publisher: "Personal Archive",
        publication_year: raw.metadata_context?.estimated_date || "Unknown",
        version: "Digital Transcript",
        chapters: chapters,
        metadata: {
          total_chapters: chapters.length,
          annotation_count: 0,
          last_updated: new Date().toISOString(),
          license: "Private"
        },
        library_card: libraryCard
      };
    } catch (error) {
      console.error("Gemini File Processing Failed:", error);
      throw error;
    }
  }
};
