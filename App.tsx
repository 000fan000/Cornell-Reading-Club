
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LibraryHome from './components/LibraryHome';
import ReaderPanel from './components/ReaderPanel';
import AnnotationPanel from './components/AnnotationPanel';
import CornellNotesPanel from './components/CornellNotesPanel';
import SettingsPanel from './components/SettingsPanel';
import UploadPage from './components/UploadPage';
import AdminPage from './components/AdminPage';
import { LIBRARY_101, DEFAULT_BOOK } from './constants';
import { UserNotes, Theme, Book, ReaderBook, ReaderSettings, SavedTheme, Chapter, LibraryData, LLMConfig } from './types';
import { geminiService } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<'library' | 'reader' | 'upload' | 'admin'>('library');
  const [currentBookData, setCurrentBookData] = useState<Book | null>(null);
  const [uiLanguage, setUiLanguage] = useState<'en' | 'zh'>(() => (localStorage.getItem('app_ui_lang') as 'en' | 'zh') || 'zh');
  
  const [activeReaderBook, setActiveReaderBook] = useState<ReaderBook>(DEFAULT_BOOK);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('app_theme') as Theme) || 'light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [showTranslations, setShowTranslations] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(() => uiLanguage === 'zh' ? 'Chinese' : 'English');
  const [showNotes, setShowNotes] = useState(false);
  
  const [isGeneratingTranslation, setIsGeneratingTranslation] = useState(false);
  const [isGeneratingAnnotations, setIsGeneratingAnnotations] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [llmConfig, setLlmConfig] = useState<LLMConfig>(() => {
    const saved = localStorage.getItem('llm_orchestration_v1');
    return saved ? JSON.parse(saved) : {
      model: 'gemini-3-flash-preview',
      useSearch: false,
      useMaps: false,
      thinkingBudget: 2048,
    };
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
    const userUploaded = Object.values(persistedBooks)
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
    localStorage.setItem('app_theme', theme);
    localStorage.setItem('app_ui_lang', uiLanguage);
  }, [notesStorage, readerSettings, savedThemes, persistedBooks, theme, uiLanguage, llmConfig]);

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
    if (persistedBooks[book.id]) {
      const rb = persistedBooks[book.id];
      setActiveReaderBook(rb);
      if (rb.persisted_notes) {
        setNotesStorage(prev => ({ ...prev, [rb.id]: rb.persisted_notes! }));
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
      isDarkMode ? 'bg-[#121212] text-gray-200' : 
      theme === 'sepia' || theme === 'solarized' ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-slate-50 text-gray-900'
    }`}>
      <header className={`flex items-center justify-between px-6 py-3 border-b panel-border z-20 ${
        isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'
      } shadow-sm`}>
        <div className="flex items-center gap-6">
          <button onClick={() => setView('library')} className="flex items-center gap-2 p-2 hover:bg-black hover:bg-opacity-5 rounded-lg transition-colors text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {uiLanguage === 'zh' ? '图书馆' : 'Library'}
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold font-serif leading-tight">{activeReaderBook.title}</h1>
            <div className="flex items-center gap-2">
               <p className="text-[10px] uppercase tracking-widest opacity-50">{activeReaderBook.author}</p>
               {isSaving && <span className="text-[9px] text-emerald-500 font-bold animate-pulse">● {uiLanguage === 'zh' ? '正在保存至持久层...' : 'Persisting to archive...'}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
             <button onClick={handleExportSingleBook} title={uiLanguage === 'zh' ? '将本卷及笔记导出为 JSON' : 'Export this Volume + Notes as JSON'} className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5 transition-colors opacity-60 hover:opacity-100">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </button>
             <div className="w-px h-6 bg-current opacity-10 mx-1"></div>
             <button onClick={toggleLanguage} className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-colors border border-transparent hover:border-current">
               {uiLanguage === 'zh' ? 'CHS' : 'ENG'}
             </button>
             <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5 transition-colors">
                {isDarkMode ? <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg> : <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
             </button>
             <button onClick={() => setShowTranslations(!showTranslations)} className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${showTranslations ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-10'}`}>
               {uiLanguage === 'zh' ? '翻译' : 'Translation'}
             </button>
             <button onClick={() => setShowNotes(!showNotes)} className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${showNotes ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-10'}`}>
               {uiLanguage === 'zh' ? '笔记' : 'Notes'}
             </button>
             <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-lg bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-10"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
        </div>
      </header>
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className={`flex flex-1 min-h-0 ${showNotes ? 'h-2/3' : 'h-full'}`}>
          <div className="w-3/4 h-full relative border-r panel-border flex flex-col">
             <div className="flex-1 min-h-0 overflow-hidden relative">
               {currentChapter ? <ReaderPanel chapter={currentChapter} theme={theme} settings={readerSettings} showTranslation={showTranslations} targetLanguage={targetLanguage} isGeneratingTranslation={isGeneratingTranslation} uiLanguage={uiLanguage} /> : <div className="flex items-center justify-center h-full opacity-30 italic text-lg">{uiLanguage === 'zh' ? '此书卷暂无内容。' : 'No content available.'}</div>}
             </div>
             <div className={`h-14 flex-shrink-0 border-t panel-border flex items-center px-6 overflow-x-auto no-scrollbar gap-4 ${isDarkMode ? 'bg-[#151515]' : 'bg-slate-100/50'}`}>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 whitespace-nowrap">{uiLanguage === 'zh' ? '手稿章节' : 'Manuscript Sections'}</span>
                <div className="flex items-center gap-2 pr-4">
                  {activeReaderBook.chapters.map((ch, idx) => (
                    <button key={ch.chapter_number} onClick={() => setCurrentChapterIndex(idx)} className={`h-8 px-4 rounded-full text-[10px] font-bold transition-all whitespace-nowrap border ${currentChapterIndex === idx ? (isDarkMode ? 'bg-amber-400 text-black border-transparent shadow-lg scale-105' : 'bg-indigo-600 text-white border-transparent shadow-md scale-105') : (isDarkMode ? 'bg-white/5 border-white/10 text-white/40 hover:text-white/80' : 'bg-white border-black/5 text-black/40 hover:text-black/80')}`}>{ch.chapter_number}. {ch.chapter_title}</button>
                  ))}
                </div>
             </div>
          </div>
          <div className="w-1/4 h-full"><AnnotationPanel annotations={currentChapter?.book_annotations || []} theme={theme} isGenerating={isGeneratingAnnotations} uiLanguage={uiLanguage} onGenerate={handleGenerateAnnotations} /></div>
        </div>
        {showNotes && currentChapter && <div className="h-1/3 border-t panel-border"><CornellNotesPanel chapterId={currentChapter.chapter_number} chapterText={currentChapter.original_text} theme={theme} initialNotes={(notesStorage[activeReaderBook.id] || {})[currentChapter.chapter_number]} onSave={handleSaveNotes} uiLanguage={uiLanguage} llmConfig={llmConfig} /></div>}
      </main>
      {isSettingsOpen && <SettingsPanel settings={readerSettings} theme={theme} savedThemes={savedThemes} uiLanguage={uiLanguage} onSettingsChange={setReaderSettings} onThemeChange={setTheme} onSaveTheme={(name) => { const newTheme = { id: `t-${Date.now()}`, name, settings: {...readerSettings} }; setSavedThemes(p => [...p, newTheme]); setTheme(newTheme.id); }} onDeleteTheme={(id) => setSavedThemes(p => p.filter(t => t.id !== id))} onClose={() => setIsSettingsOpen(false)} />}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default App;
