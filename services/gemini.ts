
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
  // Test the connection to the configured LLM provider
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
        model: config.model,
        contents: prompt
      });
      return response.text || "No response from Gemini.";
    } catch (e: any) {
      throw new Error(`Gemini Test Failed: ${e.message}`);
    }
  },

  // Generate a summary for a specific block of text
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
      const modelName = config.model;
      const isThinkingModel = modelName.includes('gemini-3') || modelName.includes('gemini-2.5');
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: isThinkingModel ? { 
          thinkingConfig: { thinkingBudget: config.thinkingBudget },
          maxOutputTokens: config.thinkingBudget > 0 ? (config.thinkingBudget + 2048) : undefined
        } : undefined
      });
      return response.text || "Failed to generate summary.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating summary.";
    }
  },

  // Extract key cues and questions from text for Cornell note taking
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
      const modelName = config.model;
      const isThinkingModel = modelName.includes('gemini-3') || modelName.includes('gemini-2.5');

      const response = await ai.models.generateContent({
        model: modelName,
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
          thinkingConfig: isThinkingModel ? { thinkingBudget: config.thinkingBudget } : undefined,
          maxOutputTokens: (isThinkingModel && config.thinkingBudget > 0) ? (config.thinkingBudget + 2048) : undefined
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

  // Perform a literary translation of the text
  async generateTranslation(text: string, config: LLMConfig, targetLang: string = "English"): Promise<Translation> {
    const prompt = `Translate the following text into ${targetLang}. Maintain the tone and literary quality:\n\n${text}`;
    
    if (config.provider === 'openai-compatible') {
      try {
        const res = await callOpenAICompatible(config, prompt);
        return { translator: "External Bridge", text: res, language: targetLang };
      } catch (e) {
        console.error(e);
        return { translator: "Error", text: "Translation failed", language: targetLang };
      }
    }

    if (!process.env.API_KEY) throw new Error("API Key not configured.");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = config.model;
      const isThinkingModel = modelName.includes('gemini-3') || modelName.includes('gemini-2.5');

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: isThinkingModel ? { 
          thinkingConfig: { thinkingBudget: config.thinkingBudget },
          maxOutputTokens: config.thinkingBudget > 0 ? (config.thinkingBudget + 4096) : undefined
        } : undefined
      });
      return {
        translator: config.model,
        text: response.text || "No translation generated",
        language: targetLang
      };
    } catch (error) {
      console.error("Gemini Error:", error);
      return { translator: "Error", text: "Error during translation", language: targetLang };
    }
  },

  // Provide scholarly annotations and contextual insights for a text block
  async generateAnnotations(text: string, config: LLMConfig, lang: string = "Chinese"): Promise<BookAnnotation[]> {
    const prompt = `Analyze this literary text and provide scholarly annotations. 
    Include key concepts, cultural context, and philosophical interpretations.
    Return a JSON object with an 'annotations' array. Each item should have:
    - type: string (e.g., 'concept', 'interpretation', 'context')
    - content: string (the annotation in ${lang})
    - reference_position: string (e.g., 'Verse 1')
    
    Text: ${text}`;

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
      const modelName = config.model;
      const isThinkingModel = modelName.includes('gemini-3') || modelName.includes('gemini-2.5');

      const response = await ai.models.generateContent({
        model: modelName,
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
          thinkingConfig: isThinkingModel ? { thinkingBudget: config.thinkingBudget } : undefined,
          maxOutputTokens: (isThinkingModel && config.thinkingBudget > 0) ? (config.thinkingBudget + 4096) : undefined
        }
      });
      const data = JSON.parse(response.text || '{"annotations":[]}');
      return data.annotations || [];
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  },

  // Process a raw file or text manuscript into a structured ReaderBook object
  async processBookFile(data: string, mimeType: string, fileName: string, config: LLMConfig): Promise<ReaderBook> {
    const isText = mimeType === 'text/plain';
    const prompt = `Process this manuscript into a structured library-ready JSON format.
    Extract title, author, and split the content into logical chapters.
    Provide a full library_card with genre, period, and thematic tags.
    
    You must follow this schema exactly.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        author: { type: Type.STRING },
        language: { type: Type.STRING },
        publication_year: { type: Type.STRING },
        chapters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              chapter_number: { type: Type.INTEGER },
              chapter_title: { type: Type.STRING },
              original_text: { type: Type.STRING },
              translations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { translator: { type: Type.STRING }, text: { type: Type.STRING }, language: { type: Type.STRING } } } },
              book_annotations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, content: { type: Type.STRING }, reference_position: { type: Type.STRING } } } }
            },
            required: ["chapter_number", "chapter_title", "original_text"]
          }
        },
        metadata: {
          type: Type.OBJECT,
          properties: {
            total_chapters: { type: Type.INTEGER },
            annotation_count: { type: Type.INTEGER },
            last_updated: { type: Type.STRING },
            license: { type: Type.STRING }
          }
        },
        library_card: {
          type: Type.OBJECT,
          properties: {
            title_original: { type: Type.STRING },
            author: { type: Type.OBJECT, properties: { name_original: { type: Type.STRING }, name_latinized: { type: Type.STRING } } },
            metadata: { type: Type.OBJECT, properties: { period: { type: Type.STRING }, estimated_date: { type: Type.STRING }, original_language: { type: Type.STRING }, genre: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            civilization_context: { type: Type.OBJECT, properties: { region: { type: Type.STRING }, cultural_sphere: { type: Type.STRING }, historical_context: { type: Type.STRING } } },
            thematic_tags: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { tag: { type: Type.STRING }, weight: { type: Type.NUMBER } } } }
          }
        }
      },
      required: ["title", "author", "chapters", "library_card"]
    };

    const normalizeBook = (book: any): ReaderBook => {
      // Ensure chapters are initialized
      if (book.chapters) {
        book.chapters = book.chapters.map((ch: any) => ({
          ...ch,
          translations: ch.translations || [],
          book_annotations: ch.book_annotations || []
        }));
      } else {
        book.chapters = [];
      }

      // Ensure library_card and its nested structures are initialized to prevent UI crashes
      if (!book.library_card) book.library_card = {};
      const lc = book.library_card;
      
      lc.author = lc.author || { name_original: book.author || "Unknown", name_latinized: book.author || "Unknown" };
      lc.metadata = lc.metadata || { period: "Unknown", estimated_date: book.publication_year || "Unknown", original_language: book.language || "Unknown", genre: ["Manuscript"] };
      lc.civilization_context = lc.civilization_context || { region: "Uncharted", cultural_sphere: "Global", historical_context: "User Uploaded" };
      lc.thematic_tags = lc.thematic_tags || [];
      lc.title_original = lc.title_original || book.title || "Untitled";
      lc.title_translations = lc.title_translations || { en: book.title || "Untitled", zh: book.title || "未命名" };
      
      book.id = book.id || `vol-${Date.now()}`;
      lc.id = book.id;
      lc.is_user_uploaded = true;
      book.publisher = book.publisher || "Library101";
      book.version = book.version || "1.0";
      
      return book as ReaderBook;
    };

    if (config.provider === 'openai-compatible') {
      const res = await callOpenAICompatible(config, `${prompt}\n\nCONTENT:\n${isText ? data : '[PDF Content]'}`);
      const book = JSON.parse(res);
      return normalizeBook(book);
    }

    if (!process.env.API_KEY) throw new Error("API Key not configured.");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = config.model;
      const isThinkingModel = modelName.includes('gemini-3') || modelName.includes('gemini-2.5');

      const parts: any[] = [{ text: prompt }];
      if (isText) {
        parts.push({ text: data });
      } else {
        parts.push({ inlineData: { mimeType: 'application/pdf', data: data } });
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: schema as any,
          thinkingConfig: isThinkingModel ? { thinkingBudget: config.thinkingBudget } : undefined,
          maxOutputTokens: (isThinkingModel && config.thinkingBudget > 0) ? (config.thinkingBudget + 8192) : 8192
        }
      });

      const book = JSON.parse(response.text || '{}');
      return normalizeBook(book);
    } catch (error: any) {
      console.error("Manuscript Error Details:", error);
      throw new Error(`Manuscript Analysis Failed: ${error.message || 'Unknown Error'}`);
    }
  }
};
