
import { GoogleGenAI, Type } from "@google/genai";
import { Translation, BookAnnotation, ReaderBook, Book, LLMConfig } from "../types";

/**
 * Robust JSON extraction from LLM text.
 * Finds the first instance of { or [ and the last instance of } or ] to extract valid JSON.
 */
const cleanJsonResponse = (text: string): string => {
  if (!text) return "{}";
  console.log("[LLM Service] Cleaning raw response text...");
  
  const firstObject = text.indexOf('{');
  const firstArray = text.indexOf('[');
  
  let start = -1;
  let end = -1;
  
  if (firstObject !== -1 && (firstArray === -1 || firstObject < firstArray)) {
    start = firstObject;
    end = text.lastIndexOf('}');
  } else if (firstArray !== -1) {
    start = firstArray;
    end = text.lastIndexOf(']');
  }
  
  if (start !== -1 && end !== -1 && end > start) {
    const cleaned = text.substring(start, end + 1);
    console.log("[LLM Service] JSON boundaries identified.");
    return cleaned;
  }
  
  console.warn("[LLM Service] Could not find clear JSON boundaries, using fallback trim.");
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
};

const callOpenAICompatible = async (config: LLMConfig, prompt: string, responseFormat?: "json_object" | "text") => {
  console.log(`[LLM Service] Calling OpenAI-Compatible Bridge: ${config.openaiModel}`);
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
  console.log("[LLM Service] Bridge response received.");
  return data.choices[0].message.content;
};

export const geminiService = {
  async testConnection(config: LLMConfig): Promise<string> {
    console.log("[LLM Service] Testing Connection...");
    const prompt = "Reply only with the word 'PONG' and the name of the model you are.";
    if (config.provider === 'openai-compatible') {
      return await callOpenAICompatible(config, prompt);
    }
    
    if (!process.env.API_KEY) throw new Error("Native API Key not configured.");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: config.model,
      contents: prompt
    });
    console.log(`[LLM Service] Connection Success: ${response.text}`);
    return response.text || "No response.";
  },

  async generateSummary(text: string, config: LLMConfig, lang: string = "Chinese"): Promise<string> {
    console.log("[LLM Service] Generating Summary...");
    const prompt = `Summarize in one concise paragraph (in ${lang}):\n\n${text}`;
    
    if (config.provider === 'openai-compatible') {
      return await callOpenAICompatible(config, prompt);
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const isThinkingModel = config.model.includes('gemini-3') || config.model.includes('gemini-2.5');
    const response = await ai.models.generateContent({
      model: config.model,
      contents: prompt,
      config: isThinkingModel ? { thinkingConfig: { thinkingBudget: config.thinkingBudget } } : undefined
    });
    return response.text || "Failed to generate summary.";
  },

  async generateCues(text: string, config: LLMConfig, lang: string = "Chinese"): Promise<string[]> {
    console.log("[LLM Service] Generating Cues...");
    const prompt = `Analyze text and provide 3-5 key concepts/questions as 'cues' array in JSON (in ${lang}).\n\n${text}`;
    
    let resText = "";
    if (config.provider === 'openai-compatible') {
      resText = await callOpenAICompatible(config, prompt, "json_object");
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: config.model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      resText = response.text || "{}";
    }

    try {
      const data = JSON.parse(cleanJsonResponse(resText));
      return data.cues || [];
    } catch (e) {
      console.error("[LLM Service] Cue parse error", e);
      return [];
    }
  },

  async generateTranslation(text: string, config: LLMConfig, targetLang: string = "English"): Promise<Translation> {
    console.log(`[LLM Service] Translating to ${targetLang}...`);
    const prompt = `Translate to ${targetLang}. Maintain tone:\n\n${text}`;
    
    let resText = "";
    if (config.provider === 'openai-compatible') {
      resText = await callOpenAICompatible(config, prompt);
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({ model: config.model, contents: prompt });
      resText = response.text || "";
    }

    return { translator: config.model, text: resText, language: targetLang };
  },

  async generateAnnotations(text: string, config: LLMConfig, lang: string = "Chinese"): Promise<BookAnnotation[]> {
    console.log("[LLM Service] Generating Annotations...");
    const prompt = `Provide scholarly annotations in JSON 'annotations' array with {type, content (in ${lang}), reference_position}.\n\nText: ${text}`;

    let resText = "";
    if (config.provider === 'openai-compatible') {
      resText = await callOpenAICompatible(config, prompt, "json_object");
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: config.model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      resText = response.text || "{}";
    }

    try {
      const data = JSON.parse(cleanJsonResponse(resText));
      return data.annotations || [];
    } catch (e) {
      console.error("[LLM Service] Annotation parse error", e);
      return [];
    }
  },

  async processBookFile(data: string, mimeType: string, fileName: string, config: LLMConfig): Promise<ReaderBook> {
    console.group(`[LLM Service] Book Digitalization Started: ${fileName}`);
    console.log(`[LLM Service] Target Model: ${config.provider === 'google' ? config.model : config.openaiModel}`);
    
    const isText = mimeType === 'text/plain';
    const prompt = `Convert manuscript to structured JSON.
    RULES:
    1. Extract FULL text into chapters. Do not summarize.
    2. chapter_number MUST be an integer (1, 2, 3...).
    3. original_text MUST contain the actual chapter body.
    4. library_card MUST have civilization, region, period.
    
    Return valid JSON.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        author: { type: Type.STRING },
        chapters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              chapter_number: { type: Type.INTEGER },
              chapter_title: { type: Type.STRING },
              original_text: { type: Type.STRING }
            },
            required: ["chapter_number", "chapter_title", "original_text"]
          }
        },
        library_card: {
          type: Type.OBJECT,
          properties: {
            title_original: { type: Type.STRING },
            metadata: { type: Type.OBJECT, properties: { period: { type: Type.STRING }, estimated_date: { type: Type.STRING } } },
            civilization_context: { type: Type.OBJECT, properties: { region: { type: Type.STRING } } }
          }
        }
      },
      required: ["title", "author", "chapters"]
    };

    let rawOutput = "";
    if (config.provider === 'openai-compatible') {
      rawOutput = await callOpenAICompatible(config, `${prompt}\n\nCONTENT:\n${isText ? data : '[PDF STREAM]'}`);
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [{ text: prompt }];
      if (isText) parts.push({ text: data });
      else parts.push({ inlineData: { mimeType: 'application/pdf', data: data } });

      const isThinkingModel = config.model.includes('gemini-3') || config.model.includes('gemini-2.5');
      const response = await ai.models.generateContent({
        model: config.model,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: schema as any,
          thinkingConfig: isThinkingModel ? { thinkingBudget: config.thinkingBudget } : undefined,
          maxOutputTokens: 15000 
        }
      });
      rawOutput = response.text || "{}";
    }

    console.log("[LLM Service] Raw output received. Length:", rawOutput.length);
    const cleanedJson = cleanJsonResponse(rawOutput);
    
    try {
      const parsed = JSON.parse(cleanedJson);
      console.log("[LLM Service] JSON Parsing Successful.");
      
      const normalizeBook = (raw: any): ReaderBook => {
        console.log("[LLM Service] Normalizing book data structure...");
        
        // Ensure chapters are mapped and chapter_number is NEVER undefined
        const chapters = Array.isArray(raw.chapters) ? raw.chapters.map((ch: any, i: number) => {
          // Force integer chapter number
          let num = ch.chapter_number;
          if (typeof num === 'string') num = parseInt(num);
          if (isNaN(num) || num === undefined || num === null) num = i + 1;
          
          return {
            chapter_number: num,
            chapter_title: ch.chapter_title || `Chapter ${num}`,
            original_text: ch.original_text || "CONTENT EMPTY - Extraction failed or text was too long.",
            translations: [],
            book_annotations: []
          };
        }) : [{ 
          chapter_number: 1, 
          chapter_title: "Full Manuscript", 
          original_text: "Failed to segment chapters. Please check logs.", 
          translations: [], 
          book_annotations: [] 
        }];

        const title = raw.title || fileName.replace(/\.[^/.]+$/, "");
        const author = raw.author || "Unknown";

        // Create library card with NO title translation (mirror original)
        const lc = raw.library_card || {};
        lc.title_original = lc.title_original || title;
        lc.title_translations = { en: title, zh: title }; // Do not translate
        lc.author = lc.author || { name_original: author, name_latinized: author };
        lc.id = `vol-${Date.now()}`;
        lc.is_user_uploaded = true;
        lc.metadata = lc.metadata || { period: "Unknown", estimated_date: "Unknown", genre: ["Manuscript"] };
        lc.civilization_context = lc.civilization_context || { region: "Uncharted" };
        lc.thematic_tags = lc.thematic_tags || [];

        return {
          id: lc.id,
          title: title,
          author: author,
          language: raw.language || "Unknown",
          publisher: "Library101 Scriptorium",
          publication_year: raw.publication_year || "Unknown",
          version: "1.0-DIGITAL",
          chapters: chapters,
          metadata: {
            total_chapters: chapters.length,
            annotation_count: 0,
            last_updated: new Date().toISOString(),
            license: "User Data"
          },
          library_card: lc as Book
        };
      };

      const finalBook = normalizeBook(parsed);
      console.log("[LLM Service] Book Normalization Complete.", finalBook);
      console.groupEnd();
      return finalBook;
    } catch (e) {
      console.error("[LLM Service] Failed to process book JSON", e);
      console.log("[LLM Service] Cleaned JSON attempted:", cleanedJson);
      console.groupEnd();
      throw e;
    }
  }
};
