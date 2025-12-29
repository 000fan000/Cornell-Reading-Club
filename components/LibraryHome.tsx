
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LibraryData, Book, LibraryPeriod, Theme } from '../types';

interface LibraryHomeProps {
  data: LibraryData;
  onSelectBook: (book: Book) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onAcquireVolume?: () => void;
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

const ERA_ICONS: Record<string, React.ReactNode> = {
  ancient_axial: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15.5a2.5 2.5 0 0 1-2.5 2.5H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  ),
  classical_empire: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M3 7h18M6 21V7M10 21V7M14 21V7M18 21V7M3 7l9-5 9 5" />
    </svg>
  ),
  medieval_transition: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 11c0-4.418-3.582-8-8-8-3.14 0-5.85 1.808-7.143 4.457L3 11v9a1 1 0 0 0 1 1h5l1-4h4l1 4h5a1 1 0 0 0 1-1v-9z" />
      <path d="M9 11h6" />
    </svg>
  ),
  modern_turn: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
      <path d="M12 2v2M12 20v2M20 12h2M2 12h2" />
    </svg>
  ),
  contemporary_pluralism: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  user_uploads: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
       <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
       <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
};

const parseYear = (dateStr: string): number => {
  if (!dateStr) return 0;
  const cleaned = dateStr.replace('约', '').replace('世纪', '00');
  const isBCE = cleaned.includes('前');
  const match = cleaned.match(/\d+/);
  if (!match) return 0;
  let year = parseInt(match[0]);
  if (dateStr.includes('世纪')) {
    year = (year - 1) * 100;
  }
  return isBCE ? -year : year;
};

const LibraryHome: React.FC<LibraryHomeProps> = ({ data, onSelectBook, theme, onToggleTheme, onAcquireVolume }) => {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(Object.keys(data.periods)[0]);
  const [organizationMode, setOrganizationMode] = useState<'region' | 'genre'>('region');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('');
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const isDarkMode = theme === 'dark' || theme === 'nord' || theme === 'mocha';
  const activePeriod = data.periods[activePeriodKey] || Object.values(data.periods)[0];

  const tagStats = useMemo(() => {
    const stats: Record<string, { weight: number; count: number }> = {};
    activePeriod.books.forEach(book => {
      book.thematic_tags.forEach(t => {
        if (!stats[t.tag]) stats[t.tag] = { weight: 0, count: 0 };
        stats[t.tag].weight += t.weight;
        stats[t.tag].count += 1;
      });
    });
    const entries = Object.entries(stats).map(([tag, data]) => ({ 
      tag, 
      score: data.weight * data.count,
    }));
    if (entries.length === 0) return [];
    const maxScore = Math.max(...entries.map(e => e.score));
    return entries.map(e => ({
      ...e,
      normalizedScore: maxScore > 0 ? e.score / maxScore : 0
    })).sort((a, b) => b.score - a.score);
  }, [activePeriod]);

  const groupedData = useMemo(() => {
    const groups: Record<string, { rows: Book[][]; count: number; books: Book[] }> = {};
    let filteredBooks = [...activePeriod.books];
    if (activeTag) {
      filteredBooks = filteredBooks.filter(book => 
        book.thematic_tags.some(t => t.tag === activeTag)
      );
    }
    const sortedBooks = filteredBooks.sort((a, b) => parseYear(a.metadata.estimated_date) - parseYear(b.metadata.estimated_date));
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
      for (let i = 0; i < g.books.length; i += 4) {
        rows.push(g.books.slice(i, i + 4));
      }
      return [name, { ...g, rows }] as [string, { rows: Book[][]; count: number }];
    });
    return entries.sort((a, b) => a[0].localeCompare(b[0]));
  }, [activePeriod, organizationMode, activeTag]);

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
    }, { 
      root: container, 
      threshold: 0.1,
      rootMargin: '-10% 0% -10% 0%'
    });
    const sections = container.querySelectorAll('.category-section');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [groupedData, activePeriodKey, organizationMode, activeTag]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' as any });
    }
    if (groupedData.length > 0) {
      setActiveCategoryName(groupedData[0][0]);
    }
  }, [activePeriodKey, organizationMode, activeTag]);

  const scrollToCategory = (category: string) => {
    categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navContent = (
    <div className="h-full flex flex-col">
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
              <span className={`text-[10px] font-bold opacity-30 transition-all ${
                isActive ? (isDarkMode ? 'opacity-100 text-amber-400' : 'opacity-100 text-amber-600') : ''
              }`}>
                {groupData.count}
              </span>
            </button>
          );
        })}
      </nav>
      <div className={`mt-auto pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center justify-between opacity-20">
           <span className="text-[8px] font-black uppercase tracking-widest">Showing</span>
           <span className="text-[10px] font-bold uppercase">{groupedData.reduce((acc, curr) => acc + curr[1].count, 0)} VOL</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`h-screen transition-colors duration-700 overflow-hidden flex flex-col font-serif relative ${
      isDarkMode ? 'bg-[#121212] text-[#e5e5e5]' : 'bg-[#fcfbf9] text-[#2c241e]'
    }`}>
      <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden transition-opacity duration-1000 ${
        isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.012]'
      }`}>
        <div className="absolute top-0 left-0 text-[600px] leading-none font-bold rotate-12 -translate-x-1/2 -translate-y-1/2">
          {activePeriod.books.length}
        </div>
      </div>

      <header className={`flex flex-col items-center text-center pt-8 pb-4 relative z-30 w-full px-6 transition-colors duration-500 border-b ${
        isDarkMode ? 'bg-black/40 border-white/5 backdrop-blur-md' : 'bg-white/40 border-black/5 backdrop-blur-sm'
      }`}>
        <div className="absolute left-8 top-10 flex items-center gap-4">
           <button 
             onClick={onAcquireVolume}
             className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm border ${
              isDarkMode ? 'bg-amber-400 text-black border-transparent hover:bg-amber-300' : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'
             }`}
           >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
             Acquire Volume
           </button>
        </div>

        <div className="absolute right-8 top-10 flex items-center gap-4">
          <div className={`flex items-center gap-1 p-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
            isDarkMode ? 'bg-white/5' : 'bg-black/5'
          }`}>
            <button 
              onClick={() => setOrganizationMode('region')} 
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${organizationMode === 'region' ? (isDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white text-amber-700 shadow-sm') : 'opacity-40 hover:opacity-100'}`}
            >
              Region
            </button>
            <button 
              onClick={() => setOrganizationMode('genre')} 
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${organizationMode === 'genre' ? (isDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white text-amber-700 shadow-sm') : 'opacity-40 hover:opacity-100'}`}
            >
              Genre
            </button>
          </div>
          <button onClick={onToggleTheme} className={`p-2.5 rounded-full transition-all duration-300 ${
            isDarkMode ? 'bg-white/5 hover:bg-white/10 text-amber-400' : 'bg-black/5 hover:bg-black/10 text-indigo-600'
          }`}>
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className={`h-px w-6 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
          <span className={`text-[9px] uppercase tracking-[0.6em] font-black opacity-30 ${isDarkMode ? 'text-white' : 'text-[#2c241e]'}`}>{data.library.concept}</span>
          <div className={`h-px w-6 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
        </div>
        <h1 className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#3a322b]'}`}>{data.library.name}</h1>
        <p className={`text-[11px] opacity-30 italic mt-1 max-w-lg mx-auto ${isDarkMode ? 'text-white' : 'text-[#2c241e]'}`}>"{activePeriod.description}"</p>
      </header>

      <div className={`z-20 px-10 py-4 border-b transition-colors duration-500 overflow-x-auto no-scrollbar flex items-center gap-6 ${
        isDarkMode ? 'bg-[#151515] border-white/5' : 'bg-[#faf9f6] border-black/5'
      }`}>
        <div className="flex-shrink-0 flex items-center gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Thematic Filter:</span>
          {activeTag && (
            <button 
              onClick={() => setActiveTag(null)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all shadow-sm border ${
                isDarkMode ? 'bg-amber-400 text-black border-transparent' : 'bg-amber-700 text-white border-transparent'
              }`}
            >
              Clear
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-x-8 gap-y-2 whitespace-nowrap overflow-visible py-2">
          {tagStats.slice(0, 15).map((stat) => (
            <button
              key={stat.tag}
              onClick={() => setActiveTag(activeTag === stat.tag ? null : stat.tag)}
              className={`transition-all duration-500 font-zh font-black hover:scale-110 relative group ${
                activeTag === stat.tag 
                  ? (isDarkMode ? 'text-amber-400 opacity-100 scale-110' : 'text-amber-800 opacity-100 scale-110') 
                  : 'opacity-30 hover:opacity-100'
              }`}
              style={{ fontSize: `${Math.max(12, 28 * stat.normalizedScore)}px` }}
            >
              {stat.tag}
              {activeTag === stat.tag && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex w-full overflow-hidden relative ${organizationMode === 'genre' ? 'flex-row-reverse' : 'flex-row'}`}>
        <aside className={`w-56 h-full py-10 px-8 z-20 transition-all duration-500 border-current border-opacity-[0.05] ${
          isDarkMode ? 'bg-[#1a1a1a]/80 backdrop-blur-md' : 'bg-white/20 backdrop-blur-md'
        } ${organizationMode === 'region' ? 'border-r' : 'border-l'}`}>
          {navContent}
        </aside>

        <main className="flex-1 w-full overflow-hidden relative">
          <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto no-scrollbar relative pt-[2vh] pb-[40vh]">
            {groupedData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 px-10 text-center space-y-4">
                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 <p className="text-xl font-bold font-serif italic">No volumes found within this conceptual intersection.</p>
                 <button onClick={() => setActiveTag(null)} className="text-[10px] font-black uppercase tracking-widest border-b border-current">Reset Concept Filter</button>
              </div>
            ) : groupedData.map(([category, groupData], groupIndex) => (
              <section 
                key={`${activePeriodKey}-${category}-${activeTag}`}
                data-category={category}
                ref={(el) => { categoryRefs.current[category] = el; }}
                className={`category-section w-full flex flex-col items-center transition-all duration-700 ease-out py-20 px-[5vw] ${
                  activeCategoryName === category 
                    ? 'opacity-100 blur-0 scale-100 pointer-events-auto' 
                    : 'opacity-20 blur-[2px] scale-98 pointer-events-none'
                }`}
              >
                <div className="mb-24 text-center">
                  <span className={`text-[9px] font-black uppercase tracking-[0.6em] mb-3 block ${isDarkMode ? 'text-amber-400/60' : 'text-amber-700/60'}`}>{organizationMode === 'region' ? 'CULTURAL DOMAIN' : 'LITERARY GENRE'}</span>
                  <h2 className={`text-4xl font-black font-zh tracking-tight border-b pb-5 px-16 inline-block transition-colors duration-500 ${
                    isDarkMode ? 'text-white border-white/10' : 'text-[#4a423b] border-amber-900/10'
                  }`}>{category}</h2>
                </div>

                <div className="space-y-48 w-full flex flex-col items-center">
                  {groupData.rows.map((rowBooks, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center items-end gap-10 md:gap-16 snap-center relative pt-12">
                      {rowBooks.map((book, bookIdx) => {
                        const palette = COVER_PALETTES[(groupIndex + rowIndex + bookIdx) % COVER_PALETTES.length];
                        const isNotLast = bookIdx < rowBooks.length - 1;
                        const isHovered = hoveredBookId === book.id;
                        return (
                          <div 
                            key={book.id} 
                            className="relative flex flex-col items-center group"
                            onMouseEnter={() => setHoveredBookId(book.id)}
                            onMouseLeave={() => setHoveredBookId(null)}
                          >
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 flex items-center">
                              <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider whitespace-nowrap shadow-sm border transition-all duration-500 ${
                                isDarkMode ? 'bg-[#252525] border-white/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-black' : 'bg-white border-black/5 text-amber-800 group-hover:bg-amber-800 group-hover:text-white'
                              }`}>
                                {book.metadata.estimated_date}
                              </div>
                              {isNotLast && (
                                <div className={`absolute left-[50%] top-1/2 -translate-y-1/2 w-[calc(100%+2.5rem)] md:w-[calc(100%+4.5rem)] h-[1.5px] -z-10 opacity-20 pointer-events-none ${isDarkMode ? 'bg-amber-400' : 'bg-amber-800'}`}>
                                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse" />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => onSelectBook(book)}
                              className="flex flex-col items-center transition-transform duration-500 hover:-translate-y-8"
                            >
                              <div className={`w-[160px] h-[230px] md:w-[200px] md:h-[290px] ${palette.bg} ${palette.text} shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] rounded-r-md border-l-[8px] border-black/10 relative flex flex-col p-6 text-left group-hover:shadow-[0_35px_70px_-20px_rgba(0,0,0,0.3)] transition-all overflow-hidden ${
                                isDarkMode ? 'brightness-90 contrast-110' : ''
                              }`}>
                                <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/linen.png')]"></div>
                                <div className="relative z-10 flex-1 flex flex-col pt-2">
                                  <span className="text-[10px] md:text-[13px] tracking-[0.1em] font-black font-zh opacity-60 mb-4 block border-b border-current/10 pb-2 truncate">
                                    {book.author.name_chinese || book.author.name_original}
                                  </span>
                                  <h3 className="text-base md:text-xl font-black leading-tight mb-2 font-zh text-current/90 line-clamp-2">{book.title_translations.zh}</h3>
                                  <p className="text-[8px] md:text-[10px] font-bold opacity-40 italic font-serif leading-tight line-clamp-2">{book.title_translations.en}</p>
                                </div>
                                <div className="relative z-10 pt-3 border-t border-current/10 flex items-center justify-between">
                                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-30 truncate">{book.metadata.genre[0]}</span>
                                </div>
                                <div className="absolute -bottom-4 -right-4 text-[60px] font-black opacity-[0.05] italic pointer-events-none select-none">{book.id}</div>
                              </div>
                            </button>
                            <div className={`absolute top-0 left-[110%] z-[60] w-[340px] p-8 rounded-2xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] border pointer-events-none transition-all duration-500 transform origin-left ${
                              isHovered ? 'opacity-100 translate-x-4 scale-100' : 'opacity-0 -translate-x-4 scale-95'
                            } ${isDarkMode ? 'bg-[#1a1a1a]/98 border-white/10 text-white backdrop-blur-xl' : 'bg-white/98 border-black/5 text-[#2c241e] backdrop-blur-xl'}`}>
                               <div className="space-y-6">
                                  <div>
                                     <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">Historical Tapestry</span>
                                     <p className="text-sm md:text-base leading-relaxed font-serif italic opacity-90">
                                       "{book.civilization_context.historical_context}"
                                     </p>
                                  </div>
                                  <div className="pt-5 border-t border-current/10 grid grid-cols-2 gap-4">
                                     <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">Cultural Sphere</span>
                                        <span className="text-xs font-bold block truncate">{book.civilization_context.cultural_sphere}</span>
                                     </div>
                                     <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">Region</span>
                                        <span className="text-xs font-bold block truncate">{book.civilization_context.region}</span>
                                     </div>
                                  </div>
                                  <div className="pt-3 flex flex-wrap gap-2">
                                     {book.thematic_tags.slice(0, 4).map(tag => (
                                       <span key={tag.tag} className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>#{tag.tag}</span>
                                     ))}
                                  </div>
                               </div>
                            </div>
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

      <nav className={`h-28 transition-all duration-500 relative z-40 flex items-center overflow-x-auto no-scrollbar border-t shadow-[0_-8px_30px_rgba(0,0,0,0.06)] ${
        isDarkMode ? 'bg-black/80 border-white/5 backdrop-blur-2xl' : 'bg-white/80 border-black/5 backdrop-blur-2xl'
      }`}>
        <div className="flex h-full min-w-full px-6 gap-2">
          {Object.entries(data.periods).map(([key, period]) => {
            const p = period as LibraryPeriod;
            const isActive = activePeriodKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActivePeriodKey(key);
                  setActiveTag(null);
                }}
                className={`flex-shrink-0 w-64 h-full flex items-center px-6 transition-all duration-500 relative group overflow-hidden ${
                  isActive 
                    ? (isDarkMode ? 'bg-white/5 shadow-inner' : 'bg-amber-50/40 shadow-inner') 
                    : 'hover:bg-black/5'
                }`}
              >
                <div className={`flex items-center gap-4 relative z-10 transition-transform duration-500 ${isActive ? 'translate-x-1' : ''}`}>
                  <div className={`p-3 rounded-2xl transition-all duration-500 ${
                    isActive 
                      ? (isDarkMode ? 'bg-amber-400 text-black scale-110 shadow-lg' : 'bg-amber-700 text-white scale-110 shadow-lg') 
                      : (isDarkMode ? 'bg-white/5 text-white/20 group-hover:text-white/40' : 'bg-black/5 text-black/20 group-hover:text-black/40')
                  }`}>
                    {ERA_ICONS[key] || ERA_ICONS.ancient_axial}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className={`text-[8px] uppercase tracking-[0.4em] font-black transition-all duration-500 ${
                      isActive ? (isDarkMode ? 'text-amber-400' : 'text-amber-700') : 'opacity-20'
                    }`}>{p.era}</span>
                    <h4 className={`text-[15px] font-black font-serif leading-tight transition-all duration-500 ${
                      isDarkMode ? 'text-white/90' : 'text-[#4a423b]'
                    } ${isActive ? 'opacity-100' : 'opacity-40'}`}>{p.period_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-bold opacity-30 transition-all ${isActive ? 'opacity-100' : ''}`}>{p.time_range}</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col items-end">
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all duration-500 ${
                    isActive 
                      ? (isDarkMode ? 'bg-amber-400/20 text-amber-400' : 'bg-amber-700/10 text-amber-700') 
                      : 'bg-black/5 text-black/20 opacity-0 group-hover:opacity-100'
                  }`}>
                    {p.total_books} VOL
                  </div>
                </div>

                <div className={`absolute bottom-0 left-0 h-1 transition-all duration-700 ease-out ${
                  isDarkMode ? 'bg-amber-400' : 'bg-amber-600'
                } ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default LibraryHome;
