
import React, { useState, useEffect, useCallback, useRef } from 'react';
import LibraryHome from './components/LibraryHome';
import ReaderPanel from './components/ReaderPanel';
import AnnotationPanel from './components/AnnotationPanel';
import CornellNotesPanel from './components/CornellNotesPanel';
import SettingsPanel from './components/SettingsPanel';
import { LIBRARY_101, DEFAULT_BOOK } from './constants';
import { UserNotes, Theme, Book, ReaderBook, ReaderSettings, SavedTheme, Chapter } from './types';
import { geminiService } from './services/gemini';

const SUPPORTED_LANGUAGES = [
  "English", "Chinese (Simplified)", "Chinese (Traditional)", 
  "Japanese", "Korean", "Spanish", "French", "German", 
  "Italian", "Russian", "Portuguese", "Vietnamese"
];

const App: React.FC = () => {
  const [view, setView] = useState<'library' | 'reader'>('library');
  const [currentBookData, setCurrentBookData] = useState<Book | null>(null);
  
  // The actual reader-compatible book object
  const [activeReaderBook, setActiveReaderBook] = useState<ReaderBook>(DEFAULT_BOOK);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [showTranslations, setShowTranslations] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [showNotes, setShowNotes] = useState(false);
  
  const [isGeneratingTranslation, setIsGeneratingTranslation] = useState(false);
  const [isGeneratingAnnotations, setIsGeneratingAnnotations] = useState(false);

  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('reader_settings');
    return saved ? JSON.parse(saved) : {
      fontSize: 18,
      fontFamily: '"Merriweather", serif',
      lineHeight: 1.6,
      letterSpacing: 0,
      wordSpacing: 0,
      paragraphSpacing: 1.5,
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      maxWidth: 800,
    };
  });

  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(() => {
    const saved = localStorage.getItem('user_saved_themes');
    return saved ? JSON.parse(saved) : [];
  });

  const [notesStorage, setNotesStorage] = useState<Record<string, Record<number, UserNotes>>>(() => {
    const saved = localStorage.getItem('cornell_notes_db_v2');
    return saved ? JSON.parse(saved) : {};
  });

  const currentChapter = activeReaderBook.chapters[currentChapterIndex];

  // Logic to handle book selection from library
  const handleSelectBook = (book: Book) => {
    setCurrentBookData(book);
    // Convert Library Book into a ReaderBook with initial data
    const readerBook: ReaderBook = {
      id: book.id,
      title: book.title_translations.en || book.title_original,
      author: book.author.name_latinized,
      language: book.metadata.original_language,
      publisher: "Library101",
      publication_year: book.metadata.estimated_date,
      version: "Core Edition",
      chapters: [
        {
          chapter_number: 1,
          chapter_title: "Introduction",
          original_text: `[Preparing core text for ${book.title_original}...]`,
          translations: [],
          book_annotations: []
        }
      ],
      metadata: {
        total_chapters: 1,
        annotation_count: 0,
        last_updated: new Date().toISOString(),
        license: "Public Domain"
      }
    };
    setActiveReaderBook(readerBook);
    setView('reader');
    setCurrentChapterIndex(0);
  };

  // Auto-save logic
  useEffect(() => {
    localStorage.setItem('cornell_notes_db_v2', JSON.stringify(notesStorage));
    localStorage.setItem('reader_settings', JSON.stringify(readerSettings));
    localStorage.setItem('user_saved_themes', JSON.stringify(savedThemes));
  }, [notesStorage, readerSettings, savedThemes]);

  const handleSaveNotes = useCallback((notes: UserNotes) => {
    setNotesStorage(prev => ({
      ...prev,
      [activeReaderBook.id]: {
        ...(prev[activeReaderBook.id] || {}),
        [currentChapter.chapter_number]: notes
      }
    }));
  }, [activeReaderBook.id, currentChapter.chapter_number]);

  if (view === 'library') {
    return <LibraryHome data={LIBRARY_101} onSelectBook={handleSelectBook} />;
  }

  const isDarkMode = theme === 'dark' || theme === 'nord' || theme === 'mocha';

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-[#121212] text-gray-200' : 
      theme === 'sepia' || theme === 'solarized' ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-slate-50 text-gray-900'
    }`}>
      <header className={`flex items-center justify-between px-6 py-3 border-b panel-border z-20 ${
        isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'
      } shadow-sm`}>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('library')}
            className="flex items-center gap-2 p-2 hover:bg-black hover:bg-opacity-5 rounded-lg transition-colors text-indigo-600 font-bold text-xs uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Library
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold font-serif leading-tight">{activeReaderBook.title}</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50">{activeReaderBook.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
             <button 
                onClick={() => setShowTranslations(!showTranslations)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                  showTranslations ? 'bg-indigo-600 text-white' : 'bg-black bg-opacity-5'
                }`}
             >
                Translation
             </button>
             <button 
                onClick={() => setShowNotes(!showNotes)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                  showNotes ? 'bg-indigo-600 text-white shadow-sm' : 'bg-black bg-opacity-5'
                }`}
             >
                Notes
             </button>
             <button 
               onClick={() => setIsSettingsOpen(true)}
               className="p-2 rounded-lg bg-black bg-opacity-5"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
               </svg>
             </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className={`flex flex-1 min-h-0 ${showNotes ? 'h-2/3' : 'h-full'}`}>
          <div className="w-3/4 h-full relative border-r panel-border">
             <ReaderPanel 
                chapter={currentChapter} 
                theme={theme} 
                settings={readerSettings} 
                showTranslation={showTranslations}
                targetLanguage={targetLanguage}
                isGeneratingTranslation={isGeneratingTranslation}
             />
          </div>
          <div className="w-1/4 h-full">
            <AnnotationPanel 
               annotations={currentChapter.book_annotations} 
               theme={theme} 
               isGenerating={isGeneratingAnnotations}
            />
          </div>
        </div>
        {showNotes && (
          <div className="h-1/3 border-t panel-border">
             <CornellNotesPanel 
                chapterId={currentChapter.chapter_number}
                chapterText={currentChapter.original_text}
                theme={theme}
                initialNotes={(notesStorage[activeReaderBook.id] || {})[currentChapter.chapter_number]}
                onSave={handleSaveNotes}
             />
          </div>
        )}
      </main>

      {isSettingsOpen && (
        <SettingsPanel 
          settings={readerSettings}
          theme={theme}
          savedThemes={savedThemes}
          onSettingsChange={setReaderSettings}
          onThemeChange={setTheme}
          onSaveTheme={(name) => {
            const newTheme = { id: `t-${Date.now()}`, name, settings: {...readerSettings} };
            setSavedThemes(p => [...p, newTheme]);
            setTheme(newTheme.id);
          }}
          onDeleteTheme={(id) => setSavedThemes(p => p.filter(t => t.id !== id))}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
