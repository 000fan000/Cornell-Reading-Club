
import React, { useState, useEffect, useCallback } from 'react';
import ReaderPanel from './components/ReaderPanel';
import AnnotationPanel from './components/AnnotationPanel';
import CornellNotesPanel from './components/CornellNotesPanel';
import { DAO_DE_JING } from './constants';
import { UserNotes, Theme } from './types';

const App: React.FC = () => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notesStorage, setNotesStorage] = useState<Record<number, UserNotes>>(() => {
    const saved = localStorage.getItem('cornell_notes_db');
    return saved ? JSON.parse(saved) : {};
  });

  const currentChapter = DAO_DE_JING.chapters[currentChapterIndex];

  // Auto-save logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('cornell_notes_db', JSON.stringify(notesStorage));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [notesStorage]);

  const handleSaveNotes = useCallback((notes: UserNotes) => {
    setNotesStorage(prev => ({
      ...prev,
      [currentChapter.chapter_number]: notes
    }));
  }, [currentChapter.chapter_number]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'sepia' : 'light');
  };

  const exportNotes = () => {
    // Explicitly typed the notes in the map to resolve 'unknown' type error
    const content = Object.entries(notesStorage).map(([chapter, notes]: [string, UserNotes]) => {
      return `### Chapter ${chapter}\n\n**Cues:**\n${notes.cues.join(', ')}\n\n**Notes:**\n${notes.notes}\n\n**Summary:**\n${notes.summary}\n\n---\n\n`;
    }).join('');
    
    // Updated property access from DAO_DE_JING.book.title to DAO_DE_JING.title
    const blob = new Blob([`# Notes for ${DAO_DE_JING.title}\n\n${content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${DAO_DE_JING.title}_notes.md`;
    a.click();
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#121212] text-gray-200' : 
      theme === 'sepia' ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-slate-50 text-gray-900'
    }`}>
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
          <div>
            {/* Updated property accesses from .book */}
            <h1 className="text-lg font-bold font-serif leading-tight">{DAO_DE_JING.title}</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50">{DAO_DE_JING.author} • {DAO_DE_JING.publisher}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-black bg-opacity-5 rounded-lg p-1 mr-4">
            <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="px-3 py-1 text-sm font-bold hover:bg-white hover:bg-opacity-20 rounded transition-all">A-</button>
            <span className="px-3 py-1 text-xs flex items-center opacity-60">{fontSize}px</span>
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
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* Top Split */}
        <div className="flex-1 flex min-h-0">
          {/* Left: Original Text */}
          <div className="w-3/4 h-full relative">
             <ReaderPanel 
                chapter={currentChapter} 
                theme={theme} 
                fontSize={fontSize} 
             />
          </div>

          {/* Right: Publisher Annotations */}
          <div className="w-1/4 h-full">
            <AnnotationPanel 
               annotations={currentChapter.book_annotations} 
               theme={theme} 
            />
          </div>
        </div>

        {/* Bottom Panel: Cornell Notes */}
        <div className="h-1/3 min-h-[250px] z-10">
           <CornellNotesPanel 
              chapterId={currentChapter.chapter_number}
              chapterText={currentChapter.original_text}
              theme={theme}
              initialNotes={notesStorage[currentChapter.chapter_number]}
              onSave={handleSaveNotes}
           />
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
              {DAO_DE_JING.chapters.map((chap, idx) => (
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
                  style={{ width: `${((currentChapterIndex + 1) / DAO_DE_JING.chapters.length) * 100}%` }}
                />
              </div>
              <p className="text-[10px] mt-2 opacity-60 text-right">{currentChapterIndex + 1} of {DAO_DE_JING.chapters.length} chapters</p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default App;
