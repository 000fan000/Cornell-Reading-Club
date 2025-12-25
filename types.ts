
export interface Translation {
  translator: string;
  text: string;
  language: string;
}

export interface BookAnnotation {
  type: string;
  content: string;
  reference_position: string;
}

export interface UserNotes {
  cues: string[];
  notes: string;
  summary: string;
}

export interface Chapter {
  chapter_number: number;
  chapter_title: string;
  original_text: string;
  translations: Translation[];
  book_annotations: BookAnnotation[];
  user_notes_template?: UserNotes;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  language: string;
  publisher: string;
  publication_year: string;
  version: string;
  chapters: Chapter[];
  metadata: {
    total_chapters: number;
    annotation_count: number;
    last_updated: string;
    license: string;
  };
}

export type Theme = 'light' | 'dark' | 'sepia' | 'custom' | string;

export interface SavedTheme {
  id: string;
  name: string;
  settings: ReaderSettings;
}

export interface ReaderSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  paragraphSpacing: number;
  backgroundColor: string;
  textColor: string;
  maxWidth: number;
}
