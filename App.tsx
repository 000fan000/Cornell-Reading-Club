
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReaderPanel from './components/ReaderPanel';
import AnnotationPanel from './components/AnnotationPanel';
import CornellNotesPanel from './components/CornellNotesPanel';
import { DAO_DE_JING } from './constants';
import { UserNotes, Theme, Book, Chapter } from './types';
import { geminiService } from './services/gemini';

const App: React.FC = () => {
  const [currentBook, setCurrentBook] = useState<Book>(DAO_DE_JING);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [showTranslations, setShowTranslations] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  const [isGeneratingTranslation, setIsGeneratingTranslation] = useState(false);
  const [isGeneratingAnnotations, setIsGeneratingAnnotations] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notesStorage, setNotesStorage] = useState<Record<string, Record<number, UserNotes>>>(() => {
    const saved = localStorage.getItem('cornell_notes_db_v2');
    return saved ? JSON.parse(saved) : {};
  });

  const currentChapter = currentBook.chapters[currentChapterIndex];

  // Auto-save logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('cornell_notes_db_v2', JSON.stringify(notesStorage));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [notesStorage]);

  // Logic to generate translation if missing and toggled on
  useEffect(() => {
    if (showTranslations && currentChapter.translations.length === 0 && !isGeneratingTranslation) {
      const fetchTranslation = async () => {
        setIsGeneratingTranslation(true);
        const translation = await geminiService.generateTranslation(currentChapter.original_text);
        
        setCurrentBook(prev => {
          const newChapters = [...prev.chapters];
          newChapters[currentChapterIndex] = {
            ...newChapters[currentChapterIndex],
            translations: [translation]
          };
          return { ...prev, chapters: newChapters };
        });
        setIsGeneratingTranslation(false);
      };
      fetchTranslation();
    }
  }, [showTranslations, currentChapterIndex, currentChapter.translations.length]);

  // Logic to generate annotations if missing and notes panel is open
  useEffect(() => {
    if (showNotes && currentChapter.book_annotations.length === 0 && !isGeneratingAnnotations) {
      const fetchAnnotations = async () => {
        setIsGeneratingAnnotations(true);
        const annotations = await geminiService.generateAnnotations(currentChapter.original_text);
        
        setCurrentBook(prev => {
          const newChapters = [...prev.chapters];
          newChapters[currentChapterIndex] = {
            ...newChapters[currentChapterIndex],
            book_annotations: annotations
          };
          return { ...prev, chapters: newChapters };
        });
        setIsGeneratingAnnotations(false);
      };
      fetchAnnotations();
    }
  }, [showNotes, currentChapterIndex, currentChapter.book_annotations.length]);

  const handleSaveNotes = useCallback((notes: UserNotes) => {
    setNotesStorage(prev => ({
      ...prev,
      [currentBook.id]: {
        ...(prev[currentBook.id] || {}),
        [currentChapter.chapter_number]: notes
      }
    }));
  }, [currentBook.id, currentChapter.chapter_number]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'sepia' : 'light');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const title = file.name.replace('.txt', '');
    
    // Simple chapter splitting logic: search for "Chapter" or split by large blocks
    let chapterTexts = text.split(/\n(?=Chapter|CHAPTER|Section|SECTION|Part|PART)/g);
    
    // If no clear markers, split into roughly 3000-char chunks
    if (chapterTexts.length <= 1) {
      chapterTexts = [];
      const chunkSize = 3000;
      for (let i = 0; i < text.length; i += chunkSize) {
        chapterTexts.push(text.slice(i, i + chunkSize));
      }
    }

    const newChapters: Chapter[] = chapterTexts.map((content, idx) => ({
      chapter_number: idx + 1,
      chapter_title: content.trim().split('\n')[0].slice(0, 40) || `Section ${idx + 1}`,
      original_text: content.trim(),
      translations: [],
      book_annotations: []
    }));

    const newBook: Book = {
      id: `custom-${Date.now()}`,
      title: title,
      author: "Uploaded User Document",
      language: "Auto-detected",
      publisher: "Self-published",
      publication_year: new Date().getFullYear().toString(),
      version: "Original Text",
      chapters: newChapters,
      metadata: {
        total_chapters: newChapters.length,
        annotation_count: 0,
        last_updated: new Date().toISOString().split('T')[0],
        license: "Private"
      }
    };

    setCurrentBook(newBook);
    setCurrentChapterIndex(0);
    setShowTranslations(false);
    setShowNotes(false);
  };

  const exportNotes = () => {
    const bookNotes = notesStorage[currentBook.id] || {};
    const content = Object.entries(bookNotes).map(([chapter, notes]: [string, UserNotes]) => {
      return `### Chapter ${chapter}\n\n**Cues:**\n${notes.cues.join(', ')}\n\n**Notes:**\n${notes.notes}\n\n**Summary:**\n${notes.summary}\n\n---\n\n`;
    }).join('');
    
    const blob = new Blob([`# Notes for ${currentBook.title}\n\n${content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBook.title}_notes.md`;
    a.click();
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#121212] text-gray-200' : 
      theme === 'sepia' ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-slate-50 text-gray-900'
    }`}>
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept=".txt" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload}
      />

      {/* Header */}
      <header className={`flex items-center justify-between px-6 py-3 border-b panel-border z-20 ${
        theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
      } shadow-sm`}>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-black hover:bg-opacity-5 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold font-serif leading-tight">{currentBook.title}</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50">{currentBook.author} • {currentBook.publisher}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Action Buttons */}
          <div className="flex items-center bg-black bg-opacity-5 rounded-lg p-1 mr-2 gap-1">
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-black hover:bg-opacity-5"
                title="Upload Text File"
             >
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="hidden lg:inline">Upload</span>
             </button>

             <div className="w-px h-4 bg-current opacity-10 mx-1"></div>

             <button 
                onClick={() => setShowTranslations(!showTranslations)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                  showTranslations ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-black hover:bg-opacity-5'
                }`}
                title="Toggle Translations"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden lg:inline">Translation</span>
             </button>

             <button 
                onClick={() => setShowNotes(!showNotes)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                  showNotes ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-black hover:bg-opacity-5'
                }`}
                title="Toggle Note-taking"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden lg:inline">Notes</span>
             </button>
          </div>

          <div className="hidden md:flex bg-black bg-opacity-5 rounded-lg p-1 mr-2">
            <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="px-3 py-1 text-sm font-bold hover:bg-white hover:bg-opacity-20 rounded transition-all">A-</button>
            <span className="px-3 py-1 text-xs flex items-center opacity-60 font-mono">{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="px-3 py-1 text-sm font-bold hover:bg-white hover:bg-opacity-20 rounded transition-all">A+</button>
          </div>

          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-lg border panel-border transition-colors ${
              theme === 'dark' ? 'bg-indigo-900/20 border-indigo-500/50' : 
              theme === 'sepia' ? 'bg-orange-900/10 border-orange-500/50' : 'bg-slate-100 border-slate-200'
            }`}
            title="Toggle Theme"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               {theme === 'light' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />}
               {theme === 'dark' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />}
               {theme === 'sepia' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21V3m0 18l-3-3m3 3l3-3M3 12h18M3 12l3-3m-3 3l3 3" />}
             </svg>
          </button>

          <button 
            onClick={exportNotes}
            className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* Top Split */}
        <div className={`flex flex-1 min-h-0 transition-all duration-500 ease-in-out ${showNotes ? 'h-2/3' : 'h-full'}`}>
          {/* Left: Original Text */}
          <div className="w-3/4 h-full relative border-r panel-border">
             <ReaderPanel 
                chapter={currentChapter} 
                theme={theme} 
                fontSize={fontSize} 
                showTranslation={showTranslations}
                isGeneratingTranslation={isGeneratingTranslation}
             />
          </div>

          {/* Right: Annotations */}
          <div className="w-1/4 h-full">
            <AnnotationPanel 
               annotations={currentChapter.book_annotations} 
               theme={theme} 
               isGenerating={isGeneratingAnnotations}
            />
          </div>
        </div>

        {/* Bottom Panel: Cornell Notes */}
        <div className={`transition-all duration-500 ease-in-out border-t-2 panel-border overflow-hidden bg-white dark:bg-[#1a1a1a] ${
          showNotes ? 'h-1/3 min-h-[250px] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-full'
        }`}>
           {showNotes && (
             <CornellNotesPanel 
                chapterId={currentChapter.chapter_number}
                chapterText={currentChapter.original_text}
                theme={theme}
                initialNotes={(notesStorage[currentBook.id] || {})[currentChapter.chapter_number]}
                onSave={handleSaveNotes}
             />
           )}
        </div>
      </main>

      {/* Chapter Sidebar Drawer */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className={`fixed left-0 top-0 bottom-0 w-80 shadow-2xl z-40 flex flex-col transition-transform duration-300 transform translate-x-0 ${
            theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
          }`}>
            <div className="p-6 border-b panel-border flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif">Chapters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 opacity-50 hover:opacity-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {currentBook.chapters.map((chap, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-colors ${
                    currentChapterIndex === idx 
                    ? 'bg-indigo-600 bg-opacity-10 border-r-4 border-indigo-600' 
                    : 'hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  <span className={`text-lg font-serif font-bold ${currentChapterIndex === idx ? 'text-indigo-600' : 'opacity-40'}`}>
                    {chap.chapter_number}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${currentChapterIndex === idx ? 'text-indigo-600' : ''}`}>{chap.chapter_title}</p>
                    <p className="text-[10px] opacity-40 truncate">{chap.original_text.substring(0, 30)}...</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-6 border-t panel-border bg-black bg-opacity-5">
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Book Progress</p>
              <div className="w-full bg-black bg-opacity-10 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentChapterIndex + 1) / currentBook.chapters.length) * 100}%` }}
                />
              </div>
              <p className="text-[10px] mt-2 opacity-60 text-right">{currentChapterIndex + 1} of {currentBook.chapters.length} chapters</p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default App;
