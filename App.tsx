
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LibraryHome from './components/LibraryHome';
import ReaderPanel from './components/ReaderPanel';
import AnnotationPanel from './components/AnnotationPanel';
import CornellNotesPanel from './components/CornellNotesPanel';
import SettingsPanel from './components/SettingsPanel';
import UploadPage from './components/UploadPage';
import AdminPage from './components/AdminPage';
import { LIBRARY_101, DEFAULT_BOOK } from './constants';
import { UserNotes, Theme, Book, ReaderBook, ReaderSettings, SavedTheme, Chapter, LibraryData, LLMConfig, SavedLLMConfig } from './types';
import { geminiService } from './services/gemini';

const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: 'google',
  model: 'gemini-3-flash-preview',
  useSearch: false,
  useMaps: false,
  thinkingBudget: 2048,
};

const App: React.FC = () => {
  const [view, setView] = useState<'library' | 'reader' | 'upload' | 'admin'>('library');
  const [currentBookData, setCurrentBookData] = useState<Book | null>(null);
  const [uiLanguage, setUiLanguage] = useState<'en' | 'zh'>(() => (localStorage.getItem('app_ui_lang') as 'en' | 'zh') || 'zh');
  
  const [activeReaderBook, setActiveReaderBook] = useState<ReaderBook>(DEFAULT_BOOK);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('app_theme') as Theme) || 'light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [showTranslations, setShowTranslations] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(() => uiLanguage === 'zh' ? 'Chinese' : 'English');
  const [showNotes, setShowNotes] = useState(false);
  
  const [isGeneratingTranslation, setIsGeneratingTranslation] = useState(false);
  const [isGeneratingAnnotations, setIsGeneratingAnnotations] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [llmConfig, setLlmConfig] = useState<LLMConfig>(() => {
    const saved = localStorage.getItem('llm_orchestration_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_LLM_CONFIG, ...parsed };
      } catch (e) {
        return DEFAULT_LLM_CONFIG;
      }
    }
    return DEFAULT_LLM_CONFIG;
  });

  const [savedLLMs, setSavedLLMs] = useState<SavedLLMConfig[]>(() => {
    const saved = localStorage.getItem('llm_saved_profiles');
    return saved ? JSON.parse(saved) : [];
  });

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

  const [persistedBooks, setPersistedBooks] = useState<Record<string, ReaderBook>>(() => {
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

  const isDarkMode = theme === 'dark' || theme === 'nord' || theme === 'mocha';

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const currentChapter = activeReaderBook.chapters && activeReaderBook.chapters.length > 0 
    ? activeReaderBook.chapters[currentChapterIndex] 
    : null;

  useEffect(() => {
    if (activeReaderBook && activeReaderBook.id !== "TEMP_ID" && activeReaderBook.id !== DEFAULT_BOOK.id) {
      const bookWithNotes = {
        ...activeReaderBook,
        persisted_notes: notesStorage[activeReaderBook.id] || {}
      };
      if (persistedBooks[activeReaderBook.id]) {
        setPersistedBooks(prev => ({
          ...prev,
          [activeReaderBook.id]: bookWithNotes
        }));
      }
    }
  }, [activeReaderBook, notesStorage]);

  const libraryWithUserBooks = useMemo((): LibraryData => {
    const base = { ...LIBRARY_101 };
    const userUploaded = (Object.values(persistedBooks) as ReaderBook[])
      .filter(rb => rb.library_card?.is_user_uploaded)
      .map(rb => rb.library_card)
      .filter(Boolean) as Book[];
    
    if (userUploaded.length > 0) {
      base.periods = {
        ...base.periods,
        user_uploads: {
          period_name: uiLanguage === 'zh' ? "馆藏手稿" : "Manuscript Archive",
          era: uiLanguage === 'zh' ? "私人典藏" : "Private Collection",
          time_range: uiLanguage === 'zh' ? "永久持久化" : "Permanent Persistence",
          description: uiLanguage === 'zh' ? "这些书卷及其笔记已完整保存在本地 JSON 数据库中。" : "These volumes and their notes are fully persisted in your local JSON database.",
          key_characteristics: uiLanguage === 'zh' ? ["本地持久化", "包含笔记", "AI 索引"] : ["Locally Persisted", "Notes Included", "AI Indexed"],
          total_books: userUploaded.length,
          books: userUploaded
        }
      };
    }
    return base;
  }, [persistedBooks, uiLanguage]);

  useEffect(() => {
    localStorage.setItem('cornell_notes_db_v2', JSON.stringify(notesStorage));
    localStorage.setItem('reader_settings', JSON.stringify(readerSettings));
    localStorage.setItem('user_saved_themes', JSON.stringify(savedThemes));
    localStorage.setItem('user_reader_books', JSON.stringify(persistedBooks));
    localStorage.setItem('llm_orchestration_v1', JSON.stringify(llmConfig));
    localStorage.setItem('llm_saved_profiles', JSON.stringify(savedLLMs));
    localStorage.setItem('app_theme', theme);
    localStorage.setItem('app_ui_lang', uiLanguage);
  }, [notesStorage, readerSettings, savedThemes, persistedBooks, theme, uiLanguage, llmConfig, savedLLMs]);

  const handleExportLibrary = () => {
    const data = {
      version: "1.2",
      exportDate: new Date().toISOString(),
      books: persistedBooks,
      notes: notesStorage
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `library101-complete-archive-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSingleBook = () => {
    if (!activeReaderBook) return;
    const data = {
      ...activeReaderBook,
      persisted_notes: notesStorage[activeReaderBook.id] || {}
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeReaderBook.title.replace(/\s+/g, '_')}-volume-archive.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLibrary = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.books) setPersistedBooks(prev => ({ ...prev, ...data.books }));
        if (data.notes) setNotesStorage(prev => ({ ...prev, ...data.notes }));
        alert(uiLanguage === 'zh' ? '全馆档案合并成功！' : 'Library archive merged successfully!');
      } catch (err) {
        alert(uiLanguage === 'zh' ? '导入失败：文件格式无效。' : 'Import failed: Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteBook = (id: string) => {
    setPersistedBooks(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setNotesStorage(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeReaderBook.id === id) {
      setActiveReaderBook(DEFAULT_BOOK);
      setView('library');
    }
  };

  const handleSelectBook = useCallback((book: Book) => {
    setCurrentBookData(book);
    let targetReaderBook = persistedBooks[book.id];
    if (!targetReaderBook) {
      targetReaderBook = (Object.values(persistedBooks) as ReaderBook[]).find(rb => 
        rb.library_card?.title_original === book.title_original || 
        rb.title === book.title_translations.zh || 
        rb.title === book.title_translations.en
      ) || null;
    }

    if (targetReaderBook) {
      setActiveReaderBook(targetReaderBook);
      if (targetReaderBook.persisted_notes) {
        setNotesStorage(prev => ({ ...prev, [targetReaderBook.id]: targetReaderBook.persisted_notes! }));
      }
    } else {
      const readerBook: ReaderBook = {
        id: book.id,
        title: uiLanguage === 'en' ? (book.title_translations.en || book.title_original) : (book.title_translations.zh || book.title_original),
        author: book.author.name_latinized,
        language: book.metadata.original_language,
        publisher: "Library101",
        publication_year: book.metadata.estimated_date,
        version: "Core Edition",
        chapters: [
          {
            chapter_number: 1,
            chapter_title: uiLanguage === 'zh' ? "载入中" : "Loading Content",
            original_text: uiLanguage === 'zh' ? `正在调取 ${book.title_original} 的数字化卷册...` : `Retrieving digitized volume for ${book.title_original}...`,
            translations: [],
            book_annotations: []
          }
        ],
        metadata: {
          total_chapters: 1,
          annotation_count: 0,
          last_updated: new Date().toISOString(),
          license: "Public Domain"
        },
        library_card: book
      };
      setActiveReaderBook(readerBook);
    }
    setView('reader');
    setCurrentChapterIndex(0);
  }, [persistedBooks, uiLanguage]);

  const handleCommitBook = (book: ReaderBook) => {
    setPersistedBooks(prev => ({ ...prev, [book.id]: book }));
    setCurrentBookData(book.library_card!);
    setActiveReaderBook(book);
    setView('reader');
    setCurrentChapterIndex(0);
  };

  const handleGenerateAnnotations = async () => {
    if (!currentChapter || isGeneratingAnnotations) return;
    const targetIdx = currentChapterIndex;
    const targetBookId = activeReaderBook.id;
    setIsGeneratingAnnotations(true);
    try {
      const annotationLang = uiLanguage === 'zh' ? 'Chinese' : 'English';
      const annotations = await geminiService.generateAnnotations(currentChapter.original_text, llmConfig, annotationLang);
      setActiveReaderBook(prev => {
        if (prev.id !== targetBookId) return prev;
        const newChapters = [...prev.chapters];
        newChapters[targetIdx] = {
          ...newChapters[targetIdx],
          book_annotations: annotations
        };
        return { ...prev, chapters: newChapters };
      });
    } catch (error) {
      console.error("Manual Annotation Error:", error);
    } finally {
      setIsGeneratingAnnotations(false);
    }
  };

  useEffect(() => {
    if (showTranslations && currentChapter && !currentChapter.translations.find(t => t.language === targetLanguage) && !isGeneratingTranslation) {
      const targetIdx = currentChapterIndex;
      const targetBookId = activeReaderBook.id;
      const fetchTranslation = async () => {
        setIsGeneratingTranslation(true);
        try {
          const translation = await geminiService.generateTranslation(currentChapter.original_text, llmConfig, targetLanguage);
          setActiveReaderBook(prev => {
            if (prev.id !== targetBookId) return prev;
            const newChapters = [...prev.chapters];
            newChapters[targetIdx] = {
              ...newChapters[targetIdx],
              translations: [...(newChapters[targetIdx].translations || []), translation]
            };
            return { ...prev, chapters: newChapters };
          });
        } catch (error) { console.error(error); } finally { setIsGeneratingTranslation(false); }
      };
      fetchTranslation();
    }
  }, [showTranslations, targetLanguage, currentChapter, currentChapterIndex, activeReaderBook.id, isGeneratingTranslation, llmConfig]);

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), []);
  const toggleLanguage = useCallback(() => {
    const nextLang = uiLanguage === 'zh' ? 'en' : 'zh';
    setUiLanguage(nextLang);
    setTargetLanguage(nextLang === 'zh' ? 'Chinese' : 'English');
  }, [uiLanguage]);

  const handleSaveNotes = useCallback((notes: UserNotes) => {
    if (!activeReaderBook || !currentChapter) return;
    setIsSaving(true);
    setNotesStorage(prev => ({
      ...prev,
      [activeReaderBook.id]: {
        ...(prev[activeReaderBook.id] || {}),
        [currentChapter.chapter_number]: notes
      }
    }));
    setTimeout(() => setIsSaving(false), 800);
  }, [activeReaderBook, currentChapter]);

  const handleNextChapter = useCallback(() => {
    if (currentChapterIndex < activeReaderBook.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  }, [currentChapterIndex, activeReaderBook.chapters.length]);

  const handlePrevChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  }, [currentChapterIndex]);

  if (view === 'upload') {
    return <UploadPage onBack={() => setView('library')} onCommit={handleCommitBook} theme={theme} uiLanguage={uiLanguage} llmConfig={llmConfig} />;
  }

  if (view === 'admin') {
    return (
      <AdminPage 
        onBack={() => setView('library')} 
        persistedBooks={persistedBooks} 
        notesStorage={notesStorage} 
        onDeleteBook={handleDeleteBook}
        onCommitBook={handleCommitBook}
        llmConfig={llmConfig}
        onLlmConfigChange={setLlmConfig}
        savedLLMs={savedLLMs}
        onSaveLLM={(name) => {
          const newProfile = { id: `llm-${Date.now()}`, name, config: { ...llmConfig } };
          setSavedLLMs(prev => [...prev, newProfile]);
        }}
        onDeleteLLM={(id) => setSavedLLMs(prev => prev.filter(p => p.id !== id))}
        theme={theme} 
        uiLanguage={uiLanguage} 
      />
    );
  }

  if (view === 'library') {
    return (
      <LibraryHome 
        data={libraryWithUserBooks} 
        onSelectBook={handleSelectBook} 
        theme={theme} 
        uiLanguage={uiLanguage}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
        onAcquireVolume={() => setView('upload')}
        onOpenAdmin={() => setView('admin')}
        onExportArchive={handleExportLibrary}
        onImportArchive={handleImportLibrary}
      />
    );
  }

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-[#121212] text-gray-100' : 
      theme === 'sepia' || theme === 'solarized' ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-slate-50 text-gray-900'
    }`}>
      <header className={`flex items-center justify-between px-6 py-3 border-b panel-border z-30 ${
        isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'
      } shadow-sm`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setView('library')} className="flex items-center gap-2 p-2 hover:bg-black hover:bg-opacity-5 rounded-lg transition-colors text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {uiLanguage === 'zh' ? '图书馆' : 'Library'}
          </button>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${
              isSidebarOpen 
                ? 'bg-indigo-600 text-white border-transparent' 
                : (isDarkMode ? 'bg-white/10 text-white border-transparent' : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100')
            }`}
            title={uiLanguage === 'zh' ? '目录' : 'Index'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">{uiLanguage === 'zh' ? '卷册目录' : 'Index'}</span>
          </button>

          <div className="hidden lg:block ml-2 border-l pl-4 panel-border">
            <h1 className="text-sm font-bold font-serif leading-tight">{activeReaderBook.title}</h1>
            <div className="flex items-center gap-2">
               <p className="text-[9px] uppercase tracking-widest opacity-50">{activeReaderBook.author}</p>
               {isSaving && <span className="text-[9px] text-emerald-500 font-bold animate-pulse">● {uiLanguage === 'zh' ? '同步中' : 'Syncing'}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
             <button onClick={handleExportSingleBook} title={uiLanguage === 'zh' ? '导出' : 'Export'} className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5 transition-colors opacity-60">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </button>
             <button onClick={toggleLanguage} className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-colors">
               {uiLanguage === 'zh' ? 'CHS' : 'ENG'}
             </button>
             <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5">
                {isDarkMode ? '🌞' : '🌙'}
             </button>
             <div className="w-px h-6 bg-current opacity-10 mx-1"></div>
             <button onClick={() => setShowTranslations(!showTranslations)} className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${showTranslations ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-10'}`}>
               {uiLanguage === 'zh' ? '译' : 'TR'}
             </button>
             <button onClick={() => setShowNotes(!showNotes)} className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${showNotes ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-10'}`}>
               {uiLanguage === 'zh' ? '笔记' : 'NOTE'}
             </button>
             <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-lg bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-10"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
        </div>
      </header>

      <main className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Left Sidebar Table of Contents */}
        <aside className={`transition-all duration-500 ease-in-out border-r panel-border flex flex-col ${
          isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        } ${isDarkMode ? 'bg-[#181818] text-gray-100' : 'bg-white text-gray-900'}`}>
          <div className={`p-6 border-b panel-border ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              {uiLanguage === 'zh' ? '手稿架构' : 'Manuscript Map'}
            </h3>
            <div className="flex items-center justify-between">
               <span className={`text-xs font-serif italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                 {activeReaderBook.chapters.length} {uiLanguage === 'zh' ? '个章节' : 'Sections'}
               </span>
               <span className={`text-[9px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Ver: {activeReaderBook.version}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {activeReaderBook.chapters.map((ch, idx) => (
              <button 
                key={ch.chapter_number} 
                onClick={() => setCurrentChapterIndex(idx)} 
                className={`w-full text-left px-6 py-5 transition-all border-l-4 flex flex-col gap-1 relative group ${
                  currentChapterIndex === idx 
                  ? (isDarkMode ? 'bg-indigo-600/10 border-amber-400' : 'bg-indigo-50 border-indigo-600') 
                  : `border-transparent ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'}`
                }`}
              >
                <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-mono font-black ${currentChapterIndex === idx ? 'text-indigo-600 dark:text-amber-400' : (isDarkMode ? 'text-gray-600' : 'opacity-40')}`}>
                     {ch.chapter_number.toString().padStart(2, '0')}
                   </span>
                   <span className={`text-sm font-bold font-serif leading-tight ${currentChapterIndex === idx ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-300' : '')}`}>
                     {ch.chapter_title}
                   </span>
                </div>
                {currentChapterIndex === idx && (
                   <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
                   </div>
                )}
              </button>
            ))}
          </div>
          <div className="p-4 border-t panel-border text-center">
             <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Library101 Scriptorium</p>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className={`flex flex-1 min-h-0 ${showNotes ? 'h-2/3' : 'h-full'}`}>
            <div className="flex-1 h-full relative flex flex-col min-w-0">
               <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
                 <div className="flex-1 overflow-hidden relative">
                    {currentChapter ? (
                        <ReaderPanel 
                          chapter={currentChapter} 
                          theme={theme} 
                          settings={readerSettings} 
                          showTranslation={showTranslations} 
                          targetLanguage={targetLanguage} 
                          isGeneratingTranslation={isGeneratingTranslation} 
                          uiLanguage={uiLanguage} 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full opacity-30 italic text-lg">
                          {uiLanguage === 'zh' ? '此书卷暂无内容。' : 'No content available.'}
                        </div>
                      )}
                 </div>

                  {/* Improved Navigation Dock at bottom of Reader area */}
                  <div className={`flex items-center justify-between px-8 py-4 border-t panel-border ${isDarkMode ? 'bg-black/40 text-white' : 'bg-gray-50/80 text-gray-900'}`}>
                    <button 
                      onClick={handlePrevChapter}
                      disabled={currentChapterIndex === 0}
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                        currentChapterIndex === 0 
                        ? 'opacity-10 cursor-not-allowed' 
                        : (isDarkMode ? 'hover:bg-white/10 text-white opacity-90 hover:opacity-100' : 'hover:bg-black/5 text-gray-700 opacity-80 hover:opacity-100')
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                      <div className="text-left hidden sm:block">
                         <div className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '上一章' : 'PREVIOUS'}</div>
                         {currentChapterIndex > 0 && <div className={`text-xs font-bold truncate max-w-[150px] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{activeReaderBook.chapters[currentChapterIndex-1].chapter_title}</div>}
                      </div>
                    </button>

                    <div className="flex items-center gap-4">
                       <div className="h-1 w-24 rounded-full bg-current opacity-10 relative overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-500" 
                            style={{ width: `${((currentChapterIndex + 1) / activeReaderBook.chapters.length) * 100}%` }}
                          ></div>
                       </div>
                       <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                         {currentChapterIndex + 1} / {activeReaderBook.chapters.length}
                       </span>
                    </div>
                    
                    <button 
                      onClick={handleNextChapter}
                      disabled={currentChapterIndex === activeReaderBook.chapters.length - 1}
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                        currentChapterIndex === activeReaderBook.chapters.length - 1 
                        ? 'opacity-10 cursor-not-allowed' 
                        : (isDarkMode ? 'hover:bg-white/10 text-white opacity-90 hover:opacity-100' : 'hover:bg-black/5 text-gray-700 opacity-80 hover:opacity-100')
                      }`}
                    >
                      <div className="text-right hidden sm:block">
                         <div className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '下一章' : 'NEXT'}</div>
                         {currentChapterIndex < activeReaderBook.chapters.length - 1 && <div className={`text-xs font-bold truncate max-w-[150px] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{activeReaderBook.chapters[currentChapterIndex+1].chapter_title}</div>}
                      </div>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
               </div>
            </div>
            <div className="w-1/4 h-full hidden xl:block border-l panel-border">
              <AnnotationPanel annotations={currentChapter?.book_annotations || []} theme={theme} isGenerating={isGeneratingAnnotations} uiLanguage={uiLanguage} onGenerate={handleGenerateAnnotations} />
            </div>
          </div>
          {showNotes && currentChapter && <div className="h-1/3 border-t panel-border"><CornellNotesPanel chapterId={currentChapter.chapter_number} chapterText={currentChapter.original_text} theme={theme} initialNotes={(notesStorage[activeReaderBook.id] || {})[currentChapter.chapter_number]} onSave={handleSaveNotes} uiLanguage={uiLanguage} llmConfig={llmConfig} /></div>}
        </div>
      </main>

      {isSettingsOpen && <SettingsPanel settings={readerSettings} theme={theme} savedThemes={savedThemes} uiLanguage={uiLanguage} onSettingsChange={setReaderSettings} onThemeChange={setTheme} onSaveTheme={(name) => { const newTheme = { id: `t-${Date.now()}`, name, settings: {...readerSettings} }; setSavedThemes(p => [...p, newTheme]); setTheme(newTheme.id); }} onDeleteTheme={(id) => setSavedThemes(p => p.filter(t => t.id !== id))} onClose={() => setIsSettingsOpen(false)} />}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default App;
