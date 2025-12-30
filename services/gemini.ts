
import { GoogleGenAI, Type } from "@google/genai";
import { Translation, BookAnnotation, ReaderBook, Book, LLMConfig } from "../types";

const callOpenAICompatible = async (config: LLMConfig, prompt: string, responseFormat?: "json_object" | "text") => {
  const url = config.openaiApiUrl?.endsWith('/') ? config.openaiApiUrl : (config.openaiApiUrl + '/');
  const response = await fetch(`${url}chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openaiApiKey || ''}`
    },
    body: JSON.stringify({
      model: config.openaiModel || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: responseFormat ? { type: responseFormat } : undefined
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`External API Error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const geminiService = {
  async testConnection(config: LLMConfig): Promise<string> {
    const prompt = "Reply only with the word 'PONG' and the name of the model you are.";
    if (config.provider === 'openai-compatible') {
      try {
        return await callOpenAICompatible(config, prompt);
      } catch (e: any) {
        throw new Error(`OpenAI Bridge Test Failed: ${e.message}`);
      }
    }
    
    if (!process.env.API_KEY) throw new Error("Native API Key not configured in environment.");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: config.model as any,
        contents: prompt
      });
      return response.text || "No response from Gemini.";
    } catch (e: any) {
      throw new Error(`Gemini Test Failed: ${e.message}`);
    }
  },

  async generateSummary(text: string, config: LLMConfig, lang: string = "Chinese"): Promise<string> {
    const prompt = `Summarize the following text in one concise paragraph for a Cornell notes summary section. The summary MUST be in ${lang}:\n\n${text}`;
    
    if (config.provider === 'openai-compatible') {
      try {
        return await callOpenAICompatible(config, prompt);
      } catch (e) {
        console.error(e);
        return "Failed to generate summary via Bridge.";
      }
    }

    if (!process.env.API_KEY) return "API Key not configured.";
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: config.model as any,
        contents: prompt,
        config: config.model === 'gemini-3-pro-preview' ? { thinkingConfig: { thinkingBudget: config.thinkingBudget } } : undefined
      });
      return response.text || "Failed to generate summary.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating summary.";
    }
  },

  async generateCues(text: string, config: LLMConfig, lang: string = "Chinese"): Promise<string[]> {
    const prompt = `Analyze this text and provide 3-5 key concepts or questions as 'Cues' for Cornell note-taking. Return a JSON object with a 'cues' array of strings. The cues MUST be in ${lang}. \n\n${text}`;
    
    if (config.provider === 'openai-compatible') {
      try {
        const res = await callOpenAICompatible(config, prompt, "json_object");
        const data = JSON.parse(res);
        return data.cues || [];
      } catch (e) {
        console.error(e);
        return [];
      }
    }

    if (!process.env.API_KEY) return [];
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: config.model as any,
        contents: prompt,
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
          },
          thinkingConfig: config.model === 'gemini-3-pro-preview' ? { thinkingBudget: config.thinkingBudget } : undefined
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

  async generateTranslation(text: string, config: LLMConfig, targetLang: string = "English"): Promise<Translation> {
    const prompt = `Translate the following text into ${targetLang}. Maintain the tone and literary quality:\n\n${text}`;
    
    if (config.provider === 'openai-compatible') {
      try {
        const res = await callOpenAICompatible(config, prompt);
        return { translator: "External Bridge", text: res, language: targetLang };
      } catch (e) {
        console.error(e);
        return { translator: "External Bridge", text: "Translation failed.", language: targetLang };
      }
    }

    if (!process.env.API_KEY) return { translator: "Gemini AI", text: "API Key not configured.", language: targetLang };
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: config.model as any,
        contents: prompt,
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

  async generateAnnotations(text: string, config: LLMConfig, lang: string = "Chinese"): Promise<BookAnnotation[]> {
    const prompt = `Provide 3-5 scholarly annotations for the following text. Include philosophical interpretations, linguistic notes, or historical context. Return a JSON object with an 'annotations' array. The annotations MUST be in ${lang}.\n\n${text}`;
    
    if (config.provider === 'openai-compatible') {
      try {
        const res = await callOpenAICompatible(config, prompt, "json_object");
        const data = JSON.parse(res);
        return data.annotations || [];
      } catch (e) {
        console.error(e);
        return [];
      }
    }

    if (!process.env.API_KEY) return [];
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const tools = [];
      if (config.useSearch) tools.push({ googleSearch: {} });

      const response = await ai.models.generateContent({
        model: config.model as any,
        contents: prompt,
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
          },
          tools: tools.length > 0 ? tools : undefined,
          thinkingConfig: config.model === 'gemini-3-pro-preview' ? { thinkingBudget: config.thinkingBudget } : undefined
        }
      });
      const data = JSON.parse(response.text?.trim() || '{"annotations":[]}');
      return data.annotations || [];
    } catch (error) {
      console.error("Annotation Error:", error);
      return [];
    }
  },

  async processBookFile(fileData: string, mimeType: string, fileName: string, config: LLMConfig): Promise<ReaderBook> {
    const prompt = `Task: Convert the provided ${mimeType === 'text/plain' ? 'text content' : 'manuscript'} into a structured digital library asset.
Output MUST be a single JSON object matching this schema:
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
}
Content:\n\n${fileData.substring(0, 50000)}`;

    if (config.provider === 'openai-compatible') {
      try {
        const res = await callOpenAICompatible(config, prompt, "json_object");
        const raw = JSON.parse(res.trim());
        return this.mapToReaderBook(raw, fileName);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    if (!process.env.API_KEY) throw new Error("API Key not configured.");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const contentPart = mimeType === 'application/pdf' 
      ? { inlineData: { data: fileData, mimeType: 'application/pdf' } }
      : { text: fileData };

    try {
      const response = await ai.models.generateContent({
        model: config.model as any,
        contents: { parts: [contentPart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          thinkingConfig: config.model === 'gemini-3-pro-preview' ? { thinkingBudget: config.thinkingBudget } : undefined
        }
      });

      const rawText = response.text || "{}";
      const raw = JSON.parse(rawText.trim());
      return this.mapToReaderBook(raw, fileName);
    } catch (error) {
      console.error("Gemini File Processing Failed:", error);
      throw error;
    }
  },

  mapToReaderBook(raw: any, fileName: string): ReaderBook {
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

    if (chapters.length === 0) {
      chapters.push({
        chapter_number: 1,
        chapter_title: "Full Text",
        original_text: "Processing yielded no specific chapter breaks.",
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
  }
};
