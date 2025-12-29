
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LibraryHome from './components/LibraryHome';
import ReaderPanel from './components/ReaderPanel';
import AnnotationPanel from './components/AnnotationPanel';
import CornellNotesPanel from './components/CornellNotesPanel';
import SettingsPanel from './components/SettingsPanel';
import UploadPage from './components/UploadPage';
import { LIBRARY_101, DEFAULT_BOOK } from './constants';
import { UserNotes, Theme, Book, ReaderBook, ReaderSettings, SavedTheme, Chapter, LibraryData } from './types';
import { geminiService } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<'library' | 'reader' | 'upload'>('library');
  const [currentBookData, setCurrentBookData] = useState<Book | null>(null);
  
  const [activeReaderBook, setActiveReaderBook] = useState<ReaderBook>(DEFAULT_BOOK);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('app_theme') as Theme) || 'light');
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

  const [userReaderBooks, setUserReaderBooks] = useState<Record<string, ReaderBook>>(() => {
    const saved = localStorage.getItem('user_reader_books');
    return saved ? JSON.parse(saved) : {};
  });

  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(() => {
    const saved = localStorage.getItem('user_saved_themes');
    return saved ? JSON.parse(saved) : [];
  });

  const [notesStorage, setNotesStorage] = useState<Record<string, Record<number, UserNotes>>>(() => {
    const saved = localStorage.getItem('cornell_notes_db_v2');
    return saved ? JSON.parse(saved) : {};
  });

  const currentChapter = activeReaderBook.chapters && activeReaderBook.chapters.length > 0 
    ? activeReaderBook.chapters[currentChapterIndex] 
    : null;

  const libraryWithUserBooks = useMemo((): LibraryData => {
    const base = { ...LIBRARY_101 };
    const userBooks = Object.values(userReaderBooks).map(rb => rb.library_card).filter(Boolean) as Book[];
    
    if (userBooks.length > 0) {
      base.periods = {
        ...base.periods,
        user_uploads: {
          period_name: "Personal Archive",
          era: "My Library",
          time_range: "User Collected",
          description: "Volumes acquired and processed via AI digitization.",
          key_characteristics: ["Personal Interest", "AI Processed", "Private Collection"],
          total_books: userBooks.length,
          books: userBooks
        }
      };
    }
    return base;
  }, [userReaderBooks]);

  useEffect(() => {
    localStorage.setItem('cornell_notes_db_v2', JSON.stringify(notesStorage));
    localStorage.setItem('reader_settings', JSON.stringify(readerSettings));
    localStorage.setItem('user_saved_themes', JSON.stringify(savedThemes));
    localStorage.setItem('user_reader_books', JSON.stringify(userReaderBooks));
    localStorage.setItem('app_theme', theme);
  }, [notesStorage, readerSettings, savedThemes, userReaderBooks, theme]);

  const handleSelectBook = useCallback((book: Book) => {
    setCurrentBookData(book);
    
    if (book.is_user_uploaded && userReaderBooks[book.id]) {
      setActiveReaderBook(userReaderBooks[book.id]);
    } else {
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
            original_text: `[The digitized transcript for ${book.title_original} is currently being indexed. AI-powered summary and cues are available below.]`,
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
    }
    
    setView('reader');
    setCurrentChapterIndex(0);
  }, [userReaderBooks]);

  const handleCommitBook = (book: ReaderBook) => {
    setUserReaderBooks(prev => ({ ...prev, [book.id]: book }));
    setCurrentBookData(book.library_card!);
    setActiveReaderBook(book);
    setView('reader');
    setCurrentChapterIndex(0);
  };

  useEffect(() => {
    if (showTranslations && currentChapter && !currentChapter.translations.find(t => t.language === targetLanguage) && !isGeneratingTranslation) {
      const fetchTranslation = async () => {
        setIsGeneratingTranslation(true);
        try {
          const translation = await geminiService.generateTranslation(currentChapter.original_text, targetLanguage);
          setActiveReaderBook(prev => {
            const newChapters = [...prev.chapters];
            newChapters[currentChapterIndex] = {
              ...newChapters[currentChapterIndex],
              translations: [...(newChapters[currentChapterIndex].translations || []), translation]
            };
            return { ...prev, chapters: newChapters };
          });
        } catch (error) {
          console.error("Translation error", error);
        } finally {
          setIsGeneratingTranslation(false);
        }
      };
      fetchTranslation();
    }
  }, [showTranslations, targetLanguage, currentChapter, currentChapterIndex, isGeneratingTranslation]);

  useEffect(() => {
    if (currentChapter && (!currentChapter.book_annotations || currentChapter.book_annotations.length === 0) && !isGeneratingAnnotations) {
      const fetchAnnotations = async () => {
        setIsGeneratingAnnotations(true);
        try {
          const annotations = await geminiService.generateAnnotations(currentChapter.original_text);
          setActiveReaderBook(prev => {
            const newChapters = [...prev.chapters];
            newChapters[currentChapterIndex] = {
              ...newChapters[currentChapterIndex],
              book_annotations: annotations
            };
            return { ...prev, chapters: newChapters };
          });
        } catch (error) {
          console.error("Annotation error", error);
        } finally {
          setIsGeneratingAnnotations(false);
        }
      };
      fetchAnnotations();
    }
  }, [currentChapter, currentChapterIndex, isGeneratingAnnotations]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [theme]);

  const handleSaveNotes = useCallback((notes: UserNotes) => {
    if (!activeReaderBook || !currentChapter) return;
    setNotesStorage(prev => ({
      ...prev,
      [activeReaderBook.id]: {
        ...(prev[activeReaderBook.id] || {}),
        [currentChapter.chapter_number]: notes
      }
    }));
  }, [activeReaderBook, currentChapter]);

  if (view === 'upload') {
    return (
      <UploadPage 
        onBack={() => setView('library')} 
        onCommit={handleCommitBook}
        theme={theme}
      />
    );
  }

  if (view === 'library') {
    return (
      <LibraryHome 
        data={libraryWithUserBooks} 
        onSelectBook={handleSelectBook} 
        theme={theme} 
        onToggleTheme={toggleTheme}
        onAcquireVolume={() => setView('upload')}
      />
    );
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
             <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5 transition-colors">
                {isDarkMode ? <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg> : <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
             </button>
             <button onClick={() => setShowTranslations(!showTranslations)} className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${showTranslations ? 'bg-indigo-600 text-white' : 'bg-black bg-opacity-5'}`}>Translation</button>
             <button onClick={() => setShowNotes(!showNotes)} className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${showNotes ? 'bg-indigo-600 text-white' : 'bg-black bg-opacity-5'}`}>Notes</button>
             <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-lg bg-black bg-opacity-5"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className={`flex flex-1 min-h-0 ${showNotes ? 'h-2/3' : 'h-full'}`}>
          <div className="w-3/4 h-full relative border-r panel-border flex flex-col">
             <div className="flex-1 min-h-0 overflow-hidden relative">
               {currentChapter ? (
                 <ReaderPanel chapter={currentChapter} theme={theme} settings={readerSettings} showTranslation={showTranslations} targetLanguage={targetLanguage} isGeneratingTranslation={isGeneratingTranslation} />
               ) : (
                 <div className="flex items-center justify-center h-full opacity-30 italic">No content available in this volume.</div>
               )}
             </div>
             {/* Chapter Navigation Bar */}
             <div className={`h-14 flex-shrink-0 border-t panel-border flex items-center px-6 overflow-x-auto no-scrollbar gap-4 ${isDarkMode ? 'bg-[#151515]' : 'bg-slate-100/50'}`}>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 whitespace-nowrap">Manuscript Sections</span>
                <div className="flex items-center gap-2 pr-4">
                  {activeReaderBook.chapters.map((ch, idx) => (
                    <button
                      key={ch.chapter_number}
                      onClick={() => setCurrentChapterIndex(idx)}
                      title={ch.chapter_title}
                      className={`h-8 px-4 rounded-full text-[10px] font-bold transition-all whitespace-nowrap border ${
                        currentChapterIndex === idx 
                          ? (isDarkMode ? 'bg-amber-400 text-black border-transparent shadow-lg scale-105' : 'bg-indigo-600 text-white border-transparent shadow-md scale-105')
                          : (isDarkMode ? 'bg-white/5 border-white/10 text-white/40 hover:text-white/80' : 'bg-white border-black/5 text-black/40 hover:text-black/80')
                      }`}
                    >
                      {ch.chapter_number}. {ch.chapter_title}
                    </button>
                  ))}
                </div>
             </div>
          </div>
          <div className="w-1/4 h-full">
            <AnnotationPanel annotations={currentChapter?.book_annotations || []} theme={theme} isGenerating={isGeneratingAnnotations} />
          </div>
        </div>
        {showNotes && currentChapter && (
          <div className="h-1/3 border-t panel-border">
             <CornellNotesPanel chapterId={currentChapter.chapter_number} chapterText={currentChapter.original_text} theme={theme} initialNotes={(notesStorage[activeReaderBook.id] || {})[currentChapter.chapter_number]} onSave={handleSaveNotes} />
          </div>
        )}
      </main>

      {isSettingsOpen && (
        <SettingsPanel settings={readerSettings} theme={theme} savedThemes={savedThemes} onSettingsChange={setReaderSettings} onThemeChange={setTheme} onSaveTheme={(name) => {
            const newTheme = { id: `t-${Date.now()}`, name, settings: {...readerSettings} };
            setSavedThemes(p => [...p, newTheme]);
            setTheme(newTheme.id);
          }}
          onDeleteTheme={(id) => setSavedThemes(p => p.filter(t => t.id !== id))}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
