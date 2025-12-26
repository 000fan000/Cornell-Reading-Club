
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
  title_original: string;
  title_translations: Record<string, string>;
  author: {
    name_original: string;
    name_latinized: string;
    lifespan: string;
    civilization: string;
    role?: string;
    school?: string;
  };
  metadata: {
    period: string;
    estimated_date: string;
    original_language: string;
    genre: string[];
    length_category: string;
    difficulty_level: number;
    babel_rating: number;
  };
  civilization_context: {
    region: string;
    cultural_sphere: string;
    historical_context: string;
    contemporary_works: string[];
    predecessors: string[];
    successors: string[];
  };
  thematic_tags: Array<{ tag: string; weight: number }>;
}

// Interface for the reader-specific book structure
export interface ReaderBook {
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

export type Theme = 'light' | 'dark' | 'sepia' | 'nord' | 'solarized' | 'matcha' | 'mocha' | 'custom' | string;

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

export interface LibraryPeriod {
  period_name: string;
  era: string;
  time_range: string;
  description: string;
  key_characteristics: string[];
  total_books: number;
  books: Book[];
}

export interface LibraryData {
  library: {
    name: string;
    concept: string;
    total_books: number;
    curation_date: string;
    description: string;
  };
  periods: Record<string, LibraryPeriod>;
}
