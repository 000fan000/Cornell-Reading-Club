
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LibraryData, Book, LibraryPeriod, Theme } from '../types';

interface LibraryHomeProps {
  data: LibraryData;
  onSelectBook: (book: Book) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const COVER_PALETTES = [
  { bg: 'bg-[#f4f1ea]', text: 'text-[#5d544b]', accent: 'border-[#d4af37]' }, // Linen
  { bg: 'bg-[#e8efea]', text: 'text-[#4a5d52]', accent: 'border-[#8fbc8f]' }, // Soft Sage
  { bg: 'bg-[#e3e9f0]', text: 'text-[#4a5568]', accent: 'border-[#4682b4]' }, // Pale Sky
  { bg: 'bg-[#f4e9e9]', text: 'text-[#6b4a4a]', accent: 'border-[#cd5c5c]' }, // Dusty Rose
  { bg: 'bg-[#f2efe8]', text: 'text-[#5d5a4b]', accent: 'border-[#b69f84]' }, // Warm Sand
  { bg: 'bg-[#ede9f4]', text: 'text-[#554a6b]', accent: 'border-[#9f84b6]' }, // Soft Lavender
  { bg: 'bg-[#fcfaf2]', text: 'text-[#2c241e]', accent: 'border-[#d4af37]' }, // Ivory
];

const LibraryHome: React.FC<LibraryHomeProps> = ({ data, onSelectBook, theme, onToggleTheme }) => {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(Object.keys(data.periods)[0]);
  const [organizationMode, setOrganizationMode] = useState<'region' | 'genre'>('region');
  const [activeCategoryName, setActiveCategoryName] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const isDarkMode = theme === 'dark' || theme === 'nord' || theme === 'mocha';
  const activePeriod = data.periods[activePeriodKey];

  const groupedData = useMemo(() => {
    const groups: Record<string, { rows: Book[][]; count: number }> = {};
    
    activePeriod.books.forEach(book => {
      const category = organizationMode === 'region' 
        ? (book.civilization_context.region || 'Uncharted')
        : (book.metadata.genre[0] || 'Miscellaneous');
        
      if (!groups[category]) groups[category] = { rows: [], count: 0 };
      
      groups[category].count++;
      const rows = groups[category].rows;
      const lastRow = rows[rows.length - 1];
      
      if (!lastRow || lastRow.length === 6) {
        rows.push([book]);
      } else {
        lastRow.push(book);
      }
    });

    const sorted = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    return sorted;
  }, [activePeriod, organizationMode]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const category = entry.target.getAttribute('data-category');
          if (category) {
            setActiveCategoryName(category);
          }
        }
      });
    }, observerOptions);

    const sections = container.querySelectorAll('.category-section');
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [groupedData, activePeriodKey, organizationMode]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (groupedData.length > 0) {
      setActiveCategoryName(groupedData[0][0]);
    }
  }, [activePeriodKey, organizationMode]);

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
              <span className={`text-[10px] font-bold opacity-30 transition-all ${
                isActive ? (isDarkMode ? 'opacity-100 text-amber-400' : 'opacity-100 text-amber-600') : ''
              }`}>
                {groupData.count}
              </span>
            </button>
          );
        })}
      </nav>
      
      <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center justify-between opacity-20">
           <span className="text-[8px] font-black uppercase tracking-widest">Library Density</span>
           <span className="text-[10px] font-bold uppercase">{activePeriod.books.length} VOL</span>
        </div>
      </div>
    </>
  );

  return (
    <div className={`h-screen transition-colors duration-500 overflow-hidden flex flex-col font-serif relative ${
      isDarkMode ? 'bg-[#121212] text-[#e5e5e5]' : 'bg-[#fcfbf9] text-[#2c241e]'
    }`}>
      {/* Background decoration */}
      <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden transition-opacity duration-1000 ${
        isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.012]'
      }`}>
        <div className="absolute top-0 left-0 text-[600px] leading-none font-bold rotate-12 -translate-x-1/2 -translate-y-1/2">
          {activePeriod.books.length}
        </div>
      </div>

      {/* Header */}
      <header className={`flex flex-col items-center text-center pt-8 pb-4 relative z-30 w-full px-6 transition-colors duration-500 border-b ${
        isDarkMode ? 'bg-black/40 border-white/5 backdrop-blur-md' : 'bg-white/40 border-black/5 backdrop-blur-sm'
      }`}>
        <div className="absolute right-8 top-10 flex items-center gap-4">
          {/* Organization Toggle */}
          <div className={`flex items-center gap-1 p-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
            isDarkMode ? 'bg-white/5' : 'bg-black/5'
          }`}>
            <button 
              onClick={() => setOrganizationMode('region')}
              className={`px-3 py-1 rounded-full transition-all ${organizationMode === 'region' ? (isDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white text-amber-700 shadow-sm') : 'opacity-40'}`}
            >
              Region
            </button>
            <button 
              onClick={() => setOrganizationMode('genre')}
              className={`px-3 py-1 rounded-full transition-all ${organizationMode === 'genre' ? (isDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white text-amber-700 shadow-sm') : 'opacity-40'}`}
            >
              Genre
            </button>
          </div>

          <button 
            onClick={onToggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10 text-amber-400' : 'bg-black/5 hover:bg-black/10 text-indigo-600'
            }`}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className={`h-px w-6 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
          <span className={`text-[9px] uppercase tracking-[0.6em] font-black opacity-30 ${isDarkMode ? 'text-white' : 'text-[#2c241e]'}`}>
            {data.library.concept}
          </span>
          <div className={`h-px w-6 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
        </div>
        <h1 className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#3a322b]'}`}>
          {data.library.name}
        </h1>
        <p className={`text-[11px] opacity-30 italic mt-1 max-w-lg mx-auto ${isDarkMode ? 'text-white' : 'text-[#2c241e]'}`}>
          "{activePeriod.description}"
        </p>
      </header>

      <div className={`flex-1 flex w-full overflow-hidden relative ${organizationMode === 'genre' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Navigation Sidebar (Flipped based on mode) */}
        <aside className={`w-56 h-full flex flex-col py-10 px-8 z-20 transition-all duration-500 border-current border-opacity-[0.05] ${
          isDarkMode ? 'bg-[#1a1a1a]/80 backdrop-blur-md' : 'bg-white/20 backdrop-blur-md'
        } ${organizationMode === 'region' ? 'border-r' : 'border-l'}`}>
          {navContent}
        </aside>

        {/* Main Vertical Scroll Area */}
        <main className="flex-1 w-full overflow-hidden relative">
          <div 
            ref={scrollContainerRef}
            className="h-full w-full overflow-y-auto snap-y snap-proximity no-scrollbar relative pt-[2vh] pb-[40vh]"
          >
            {groupedData.map(([category, groupData], groupIndex) => (
              <section 
                key={`${activePeriodKey}-${category}`}
                data-category={category}
                ref={(el) => { categoryRefs.current[category] = el; }}
                className={`category-section w-full flex flex-col items-center transition-all duration-1000 ease-in-out py-20 px-[5vw] ${
                  activeCategoryName === category 
                    ? 'opacity-100 blur-0 scale-100' 
                    : 'opacity-10 blur-[3px] scale-98 pointer-events-none'
                }`}
              >
                {/* Category Header */}
                <div className="mb-20 text-center">
                  <span className={`text-[9px] font-black uppercase tracking-[0.6em] mb-3 block ${isDarkMode ? 'text-amber-400/60' : 'text-amber-700/60'}`}>
                    {organizationMode === 'region' ? 'CULTURAL DOMAIN' : 'LITERARY GENRE'}
                  </span>
                  <h2 className={`text-4xl font-black font-zh tracking-tight border-b pb-5 px-16 inline-block transition-colors duration-500 ${
                    isDarkMode ? 'text-white border-white/10' : 'text-[#4a423b] border-amber-900/10'
                  }`}>
                    {category}
                  </h2>
                </div>

                {/* Rows within this Category */}
                <div className="space-y-16 w-full flex flex-col items-center">
                  {groupData.rows.map((rowBooks, rowIndex) => (
                    <div 
                      key={rowIndex} 
                      className="flex justify-center items-center gap-8 md:gap-12 snap-center"
                    >
                      {rowBooks.map((book, bookIdx) => {
                        const palette = COVER_PALETTES[(groupIndex + rowIndex + bookIdx) % COVER_PALETTES.length];
                        return (
                          <button
                            key={book.id}
                            onClick={() => onSelectBook(book)}
                            className="group flex flex-col items-center transition-transform duration-500 hover:-translate-y-8"
                          >
                            <div className={`w-[135px] h-[200px] md:w-[165px] md:h-[240px] ${palette.bg} ${palette.text} shadow-[4px_10px_25px_-5px_rgba(44,36,30,0.1)] rounded-r-sm border-l-[8px] border-black/5 relative flex flex-col p-4 text-left group-hover:shadow-[10px_25px_45px_-10px_rgba(44,36,30,0.2)] transition-all overflow-hidden ${
                              isDarkMode ? 'brightness-90 contrast-110' : ''
                            }`}>
                              
                              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/linen.png')]"></div>
                              
                              <div className="relative z-10 flex-1 flex flex-col pt-1">
                                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black opacity-40 mb-3 block border-b border-current/10 pb-1.5 truncate">
                                  {book.author.name_latinized}
                                </span>
                                
                                <h3 className="text-base md:text-lg font-black leading-tight mb-1 font-zh text-current/90 line-clamp-2">
                                  {book.title_translations.zh}
                                </h3>

                                <p className="text-[8px] md:text-[9px] font-bold opacity-40 italic font-serif leading-tight line-clamp-2">
                                  {book.title_translations.en}
                                </p>
                                
                                <div className="absolute bottom-4 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none px-2">
                                   <p className="text-[36px] md:text-[48px] font-black opacity-[0.04] group-hover:opacity-[0.07] transition-all duration-700 whitespace-nowrap leading-none tracking-tighter">
                                     {book.title_original}
                                   </p>
                                </div>
                              </div>

                              <div className="relative z-10 pt-2 border-t border-current/10 flex items-center justify-between">
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-30 truncate">
                                  {book.metadata.genre[0]}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 text-center">
                              <span className={`text-[8px] font-black uppercase tracking-[0.2em] block ${isDarkMode ? 'text-amber-400/80' : 'text-amber-700/80'}`}>
                                {book.metadata.estimated_date}
                              </span>
                            </div>
                          </button>
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

      {/* Timeline Nav */}
      <nav className={`h-20 transition-colors duration-500 relative z-40 flex items-center overflow-x-auto no-scrollbar border-t shadow-[0_-5px_15px_rgba(0,0,0,0.02)] ${
        isDarkMode ? 'bg-black/80 border-white/5 backdrop-blur-xl' : 'bg-white/60 border-black/5 backdrop-blur-md'
      }`}>
        <div className="flex h-full min-w-full px-[5vw]">
          {Object.entries(data.periods).map(([key, period]) => {
            const p = period as LibraryPeriod;
            const isActive = activePeriodKey === key;
            return (
              <button
                key={key}
                onClick={() => setActivePeriodKey(key)}
                className={`flex-shrink-0 w-52 h-full flex flex-col justify-center px-8 border-r transition-all relative group overflow-hidden ${
                  isActive 
                    ? (isDarkMode ? 'bg-white/5' : 'bg-amber-50/40') 
                    : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-white/40')
                } ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}
              >
                <div className="relative z-10">
                  <span className={`text-[8px] uppercase tracking-[0.4em] font-black transition-all duration-500 ${
                    isActive ? (isDarkMode ? 'text-amber-400' : 'text-amber-700') : 'opacity-20'
                  }`}>
                    {p.era}
                  </span>
                  <h4 className={`text-[13px] font-bold mb-0.5 transition-transform duration-500 ${
                    isDarkMode ? 'text-white/90' : 'text-[#4a423b]'
                  } ${isActive ? 'translate-x-1' : 'opacity-60'}`}>
                    {p.period_name}
                  </h4>
                </div>
                <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-700 ease-out ${
                  isDarkMode ? 'bg-amber-400/60' : 'bg-amber-600/60'
                } ${isActive ? 'w-full' : 'w-0'}`} />
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
