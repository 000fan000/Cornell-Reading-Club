
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LibraryData, Book, LibraryPeriod, Theme } from '../types';

interface LibraryHomeProps {
  data: LibraryData;
  onSelectBook: (book: Book) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const COVER_PALETTES = [
  { bg: 'bg-[#f4f1ea]', text: 'text-[#5d544b]', accent: 'border-[#d4af37]', hex: '#d4af37' }, // Linen
  { bg: 'bg-[#e8efea]', text: 'text-[#4a5d52]', accent: 'border-[#8fbc8f]', hex: '#8fbc8f' }, // Soft Sage
  { bg: 'bg-[#e3e9f0]', text: 'text-[#4a5568]', accent: 'border-[#4682b4]', hex: '#4682b4' }, // Pale Sky
  { bg: 'bg-[#f4e9e9]', text: 'text-[#6b4a4a]', accent: 'border-[#cd5c5c]', hex: '#cd5c5c' }, // Dusty Rose
  { bg: 'bg-[#f2efe8]', text: 'text-[#5d5a4b]', accent: 'border-[#b69f84]', hex: '#b69f84' }, // Warm Sand
  { bg: 'bg-[#ede9f4]', text: 'text-[#554a6b]', accent: 'border-[#9f84b6]', hex: '#9f84b6' }, // Soft Lavender
  { bg: 'bg-[#fcfaf2]', text: 'text-[#2c241e]', accent: 'border-[#d4af37]', hex: '#d4af37' }, // Ivory
];

const parseYear = (dateStr: string): number => {
  if (!dateStr) return 0;
  const cleaned = dateStr.replace('约', '').replace('世纪', '00');
  const isBCE = cleaned.includes('前');
  const match = cleaned.match(/\d+/);
  if (!match) return 0;
  let year = parseInt(match[0]);
  if (dateStr.includes('世纪')) year = (year - 1) * 100;
  return isBCE ? -year : year;
};

const LibraryHome: React.FC<LibraryHomeProps> = ({ data, onSelectBook, theme, onToggleTheme }) => {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(Object.keys(data.periods)[0]);
  const [organizationMode, setOrganizationMode] = useState<'region' | 'genre'>('region');
  const [activeCategoryName, setActiveCategoryName] = useState<string>('');
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const isDarkMode = theme === 'dark' || theme === 'nord' || theme === 'mocha';
  const activePeriod = data.periods[activePeriodKey];

  const groupedData = useMemo(() => {
    const groups: Record<string, { rows: Book[][]; count: number; books: Book[] }> = {};
    const sortedBooks = [...activePeriod.books].sort((a, b) => parseYear(a.metadata.estimated_date) - parseYear(b.metadata.estimated_date));

    sortedBooks.forEach(book => {
      const category = organizationMode === 'region' 
        ? (book.civilization_context.region || 'Uncharted')
        : (book.metadata.genre[0] || 'Miscellaneous');
      if (!groups[category]) groups[category] = { rows: [], count: 0, books: [] };
      groups[category].books.push(book);
      groups[category].count++;
    });

    const entries = Object.entries(groups).map(([name, g]) => {
      const rows: Book[][] = [];
      for (let i = 0; i < g.books.length; i += 5) rows.push(g.books.slice(i, i + 5));
      return [name, { ...g, rows }] as [string, { rows: Book[][]; count: number }];
    });
    return entries.sort((a, b) => a[0].localeCompare(b[0]));
  }, [activePeriod, organizationMode]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const category = entry.target.getAttribute('data-category');
          if (category) setActiveCategoryName(category);
        }
      });
    }, { root: container, threshold: 0.2 });
    container.querySelectorAll('.category-section').forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [groupedData, activePeriodKey, organizationMode]);

  const scrollToCategory = (category: string) => {
    categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navContent = (
    <>
      <div className="mb-8">
        <h4 className={`text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mb-2 ${isDarkMode ? 'text-white' : ''}`}>
          {organizationMode === 'region' ? 'Cultural Domain' : 'Genre Index'}
        </h4>
        <div className={`h-[1px] w-full bg-current opacity-[0.05]`}></div>
      </div>
      <nav className="flex-1 flex flex-col gap-5 overflow-y-auto no-scrollbar">
        {groupedData.map(([category, groupData]) => {
          const isActive = activeCategoryName === category;
          return (
            <button
              key={category}
              onClick={() => scrollToCategory(category)}
              className={`group flex items-center justify-between text-left transition-all duration-300 ${
                isActive ? (organizationMode === 'region' ? 'translate-x-2' : '-translate-x-2') : 'opacity-40 hover:opacity-100'
              }`}
            >
              <span className={`text-[13px] font-black font-zh tracking-wide transition-colors duration-500 ${
                isActive ? (isDarkMode ? 'text-amber-400' : 'text-amber-700') : (isDarkMode ? 'text-white' : 'text-[#2c241e]')
              }`}>
                {category}
              </span>
              <span className={`text-[10px] font-bold opacity-30 transition-all ${isActive ? (isDarkMode ? 'text-amber-400 opacity-100' : 'text-amber-600 opacity-100') : ''}`}>
                {groupData.count}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className={`h-screen transition-colors duration-500 overflow-hidden flex flex-col font-serif relative ${
      isDarkMode ? 'bg-[#121212] text-[#e5e5e5]' : 'bg-[#fcfbf9] text-[#2c241e]'
    }`}>
      {/* Detail Overlay */}
      {previewBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setPreviewBook(null)}></div>
          <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-8 duration-500 ${
            isDarkMode ? 'bg-[#1a1a1a] text-white border border-white/10' : 'bg-[#fdfcfb] text-[#2c241e]'
          }`}>
            <button 
              onClick={() => setPreviewBook(null)}
              className="absolute top-6 right-6 z-20 p-2 rounded-full hover:bg-black/5 transition-colors opacity-40 hover:opacity-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Left: Visual Representation */}
            <div className="w-full md:w-2/5 p-12 flex flex-col items-center justify-center relative overflow-hidden bg-black/5">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                <div className={`w-[220px] h-[320px] rounded-r-md shadow-2xl border-l-[8px] border-black/20 flex flex-col p-8 transition-transform hover:scale-105 duration-700 ${
                   COVER_PALETTES[0].bg
                }`}>
                   <span className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40 mb-4 border-b border-black/10 pb-2">
                     {previewBook.author.name_latinized}
                   </span>
                   <h3 className="text-2xl font-black font-zh leading-tight mb-2 text-black/80">
                     {previewBook.title_translations.zh}
                   </h3>
                   <p className="text-xs font-bold italic opacity-40 text-black/60">
                     {previewBook.title_translations.en}
                   </p>
                   <div className="mt-auto pt-4 border-t border-black/5">
                      <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">{previewBook.metadata.genre[0]}</span>
                   </div>
                </div>
            </div>

            {/* Right: Content & Context */}
            <div className="flex-1 overflow-y-auto p-8 md:p-14 space-y-10 no-scrollbar">
              <header>
                <div className="flex items-center gap-3 mb-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${isDarkMode ? 'bg-amber-400/20 text-amber-400' : 'bg-amber-100 text-amber-900'}`}>
                     {previewBook.metadata.estimated_date}
                   </span>
                   <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                     {previewBook.metadata.original_language}
                   </span>
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-2">{previewBook.title_original}</h2>
                <div className="flex items-center gap-2 opacity-60">
                   <span className="text-sm font-bold uppercase tracking-widest">{previewBook.author.name_latinized}</span>
                   <span className="text-xs italic">— {previewBook.author.civilization}</span>
                </div>
              </header>

              <section className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-3">Historical Tapestry</h4>
                  <p className="text-lg leading-relaxed font-serif italic opacity-80">
                    "{previewBook.civilization_context.historical_context}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Sphere of Influence</h4>
                    <p className="text-sm font-bold">{previewBook.civilization_context.cultural_sphere}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Heritage Region</h4>
                    <p className="text-sm font-bold">{previewBook.civilization_context.region}</p>
                  </div>
                </div>

                <div className="pt-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-4">Thematic Constellation</h4>
                   <div className="flex flex-wrap gap-2">
                     {previewBook.thematic_tags.map(t => (
                       <span key={t.tag} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                         isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
                       }`} style={{ opacity: 0.4 + (t.weight * 0.6) }}>
                         #{t.tag}
                       </span>
                     ))}
                   </div>
                </div>
              </section>

              <footer className="pt-10 flex items-center justify-between border-t border-current border-opacity-5">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1">Civilization Linkage</span>
                    <div className="flex items-center gap-2 text-[11px] font-bold">
                       <span className="opacity-40">{previewBook.civilization_context.predecessors[0] || 'Origin'}</span>
                       <svg className="w-3 h-3 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
                       <span className="text-amber-500">{previewBook.title_translations.en}</span>
                       <svg className="w-3 h-3 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
                       <span className="opacity-40">{previewBook.civilization_context.successors[0] || 'Legacy'}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => {
                    onSelectBook(previewBook);
                    setPreviewBook(null);
                  }}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                 >
                   Begin Reading
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </button>
              </footer>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`flex flex-col items-center text-center pt-8 pb-4 relative z-30 w-full px-6 transition-colors duration-500 border-b ${
        isDarkMode ? 'bg-black/40 border-white/5 backdrop-blur-md' : 'bg-white/40 border-black/5 backdrop-blur-sm'
      }`}>
        <div className="absolute right-8 top-10 flex items-center gap-4">
          <div className={`flex items-center gap-1 p-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
            <button onClick={() => setOrganizationMode('region')} className={`px-3 py-1 rounded-full transition-all ${organizationMode === 'region' ? (isDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white text-amber-700 shadow-sm') : 'opacity-40'}`}>Region</button>
            <button onClick={() => setOrganizationMode('genre')} className={`px-3 py-1 rounded-full transition-all ${organizationMode === 'genre' ? (isDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white text-amber-700 shadow-sm') : 'opacity-40'}`}>Genre</button>
          </div>
          <button onClick={onToggleTheme} className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-amber-400' : 'bg-black/5 text-indigo-600'}`}>
            {isDarkMode ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg> : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
          </button>
        </div>
        <h1 className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#3a322b]'}`}>{data.library.name}</h1>
        <p className={`text-[11px] opacity-30 italic mt-1 max-w-lg mx-auto ${isDarkMode ? 'text-white' : ''}`}>"{activePeriod.description}"</p>
      </header>

      <div className={`flex-1 flex w-full overflow-hidden relative ${organizationMode === 'genre' ? 'flex-row-reverse' : 'flex-row'}`}>
        <aside className={`w-56 h-full flex flex-col py-10 px-8 z-20 border-current border-opacity-[0.05] ${isDarkMode ? 'bg-[#1a1a1a]/80 backdrop-blur-md' : 'bg-white/20 backdrop-blur-md'} ${organizationMode === 'region' ? 'border-r' : 'border-l'}`}>
          {navContent}
        </aside>

        <main className="flex-1 w-full overflow-hidden relative">
          <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto no-scrollbar pt-[2vh] pb-[40vh]">
            {groupedData.map(([category, groupData], groupIndex) => (
              <section key={category} data-category={category} ref={(el) => { categoryRefs.current[category] = el; }} className={`category-section w-full flex flex-col items-center py-20 px-[5vw] transition-all duration-1000 ${activeCategoryName === category ? 'opacity-100 scale-100' : 'opacity-10 blur-sm scale-98 pointer-events-none'}`}>
                <div className="mb-24 text-center">
                  <span className={`text-[9px] font-black uppercase tracking-[0.6em] mb-3 block ${isDarkMode ? 'text-amber-400/60' : 'text-amber-700/60'}`}>{organizationMode === 'region' ? 'CULTURAL DOMAIN' : 'LITERARY GENRE'}</span>
                  <h2 className={`text-4xl font-black font-zh tracking-tight border-b pb-5 px-16 inline-block ${isDarkMode ? 'text-white border-white/10' : 'text-[#4a423b] border-amber-900/10'}`}>{category}</h2>
                </div>

                <div className="space-y-32 w-full flex flex-col items-center">
                  {groupData.rows.map((rowBooks, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center items-end gap-10 pt-12">
                      {rowBooks.map((book, bookIdx) => {
                        const palette = COVER_PALETTES[(groupIndex + rowIndex + bookIdx) % COVER_PALETTES.length];
                        return (
                          <div key={book.id} className="relative group">
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20">
                              <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-sm border ${isDarkMode ? 'bg-[#252525] border-white/10 text-amber-400' : 'bg-white border-black/5 text-amber-800'}`}>
                                {book.metadata.estimated_date}
                              </div>
                            </div>
                            <button onClick={() => setPreviewBook(book)} className="flex flex-col items-center transition-transform duration-500 hover:-translate-y-6">
                              <div className={`w-[155px] h-[225px] ${palette.bg} ${palette.text} shadow-xl rounded-r-sm border-l-[6px] border-black/10 p-4 text-left overflow-hidden relative`}>
                                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/linen.png')]"></div>
                                <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-40 mb-3 block border-b border-current/10 pb-1.5 truncate">{book.author.name_latinized}</span>
                                <h3 className="text-base font-black leading-tight mb-1 font-zh text-current/90 line-clamp-2">{book.title_translations.zh}</h3>
                                <p className="text-[8px] font-bold opacity-40 italic line-clamp-2">{book.title_translations.en}</p>
                                <div className="absolute -bottom-2 -right-2 text-[40px] font-black opacity-[0.05] italic">{book.id}</div>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>

      <nav className={`h-20 flex items-center overflow-x-auto no-scrollbar border-t shadow-inner ${isDarkMode ? 'bg-black/80 border-white/5 backdrop-blur-xl' : 'bg-white/60 border-black/5 backdrop-blur-md'}`}>
        <div className="flex h-full min-w-full px-[5vw]">
          {Object.entries(data.periods).map(([key, period]) => {
            const isActive = activePeriodKey === key;
            return (
              <button key={key} onClick={() => setActivePeriodKey(key)} className={`flex-shrink-0 w-52 h-full flex flex-col justify-center px-8 border-r relative group transition-all ${isActive ? (isDarkMode ? 'bg-white/5' : 'bg-amber-50/40') : ''} ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                <span className={`text-[8px] uppercase tracking-[0.4em] font-black ${isActive ? (isDarkMode ? 'text-amber-400' : 'text-amber-700') : 'opacity-20'}`}>{period.era}</span>
                <h4 className={`text-[13px] font-bold ${isDarkMode ? 'text-white/90' : 'text-[#4a423b]'} ${isActive ? '' : 'opacity-60'}`}>{period.period_name}</h4>
                <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-700 ${isDarkMode ? 'bg-amber-400/60' : 'bg-amber-600/60'} ${isActive ? 'w-full' : 'w-0'}`} />
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LibraryHome;
