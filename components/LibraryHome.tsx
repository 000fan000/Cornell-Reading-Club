
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LibraryData, Book, LibraryPeriod } from '../types';

interface LibraryHomeProps {
  data: LibraryData;
  onSelectBook: (book: Book) => void;
}

const COVER_PALETTES = [
  { bg: 'bg-[#4a3728]', text: 'text-[#f4ead5]', accent: 'border-[#d4af37]' },
  { bg: 'bg-[#2d4031]', text: 'text-[#e8f0e9]', accent: 'border-[#8fbc8f]' },
  { bg: 'bg-[#1a2a40]', text: 'text-[#e6f0ff]', accent: 'border-[#4682b4]' },
  { bg: 'bg-[#5d2a2a]', text: 'text-[#ffe6e6]', accent: 'border-[#cd5c5c]' },
  { bg: 'bg-[#e2dcd2]', text: 'text-[#2c241e]', accent: 'border-[#b69f84]' },
  { bg: 'bg-[#3e3229]', text: 'text-[#f9f7f2]', accent: 'border-[#8d7861]' },
  { bg: 'bg-[#7a7465]', text: 'text-[#f9f7f2]', accent: 'border-[#2c241e]' },
];

const LibraryHome: React.FC<LibraryHomeProps> = ({ data, onSelectBook }) => {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(Object.keys(data.periods)[0]);
  const [activeRegionName, setActiveRegionName] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Fixed: Record type updated to HTMLElement | null to accommodate section elements correctly.
  const regionRefs = useRef<Record<string, HTMLElement | null>>({});

  const activePeriod = data.periods[activePeriodKey];

  // Group books by region and chunk them into rows
  const regionalGroups = useMemo(() => {
    const groups: Record<string, { rows: Book[][]; count: number }> = {};
    
    activePeriod.books.forEach(book => {
      const region = book.civilization_context.region || 'Uncharted';
      if (!groups[region]) groups[region] = { rows: [], count: 0 };
      
      groups[region].count++;
      const rows = groups[region].rows;
      const lastRow = rows[rows.length - 1];
      
      if (!lastRow || lastRow.length === 6) {
        rows.push([book]);
      } else {
        lastRow.push(book);
      }
    });

    const sorted = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    // Set initial active region
    if (sorted.length > 0 && !activeRegionName) {
      setActiveRegionName(sorted[0][0]);
    }
    return sorted;
  }, [activePeriod]);

  // Handle intersection observer to track active region in sidebar
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      threshold: 0.2, // Trigger when 20% of the region is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const region = entry.target.getAttribute('data-region');
          if (region) {
            setActiveRegionName(region);
          }
        }
      });
    }, observerOptions);

    const regions = container.querySelectorAll('.region-section');
    regions.forEach((r) => observer.observe(r));

    return () => observer.disconnect();
  }, [regionalGroups, activePeriodKey]);

  // Reset scroll and focus when period changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (regionalGroups.length > 0) {
      setActiveRegionName(regionalGroups[0][0]);
    }
  }, [activePeriodKey]);

  const scrollToRegion = (region: string) => {
    const element = regionRefs.current[region];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-screen bg-[#f9f7f2] text-[#2c241e] overflow-hidden flex flex-col font-serif relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-0 text-[600px] leading-none font-bold rotate-12 -translate-x-1/2 -translate-y-1/2">
          {activePeriod.books.length}
        </div>
      </div>

      {/* Header */}
      <header className="flex flex-col items-center text-center pt-8 pb-4 relative z-10 w-full px-6">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="h-px w-6 bg-[#2c241e] opacity-20"></div>
          <span className="text-[9px] uppercase tracking-[0.6em] opacity-40 font-black">{data.library.concept}</span>
          <div className="h-px w-6 bg-[#2c241e] opacity-20"></div>
        </div>
        <h1 className="text-3xl font-black tracking-tighter">{data.library.name}</h1>
        <p className="text-[11px] opacity-40 italic mt-1 max-w-lg mx-auto">"{activePeriod.description}"</p>
      </header>

      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* Vertical Regional Sidebar */}
        <aside className="w-56 h-full flex flex-col py-10 px-6 border-r border-black border-opacity-5 z-20 bg-[#f9f7f2] bg-opacity-80 backdrop-blur-sm">
          <div className="mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-1">Domain Index</h4>
            <div className="h-[2px] w-8 bg-amber-800 opacity-20"></div>
          </div>
          
          <nav className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
            {regionalGroups.map(([region, groupData]) => {
              const isActive = activeRegionName === region;
              return (
                <button
                  key={region}
                  onClick={() => scrollToRegion(region)}
                  className={`group flex items-center justify-between text-left transition-all duration-300 ${
                    isActive ? 'translate-x-1 scale-105' : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  <span className={`text-sm font-black font-zh tracking-wider transition-colors duration-500 ${
                    isActive ? 'text-amber-900 underline decoration-amber-500/30 underline-offset-4' : 'text-[#2c241e]'
                  }`}>
                    {region}
                  </span>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[9px] font-black transition-all duration-500 ${
                    isActive ? 'bg-amber-900 text-white shadow-md' : 'bg-[#2c241e] bg-opacity-5 text-[#2c241e]'
                  }`}>
                    {groupData.count}
                  </div>
                </button>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-black border-opacity-5">
            <div className="flex items-center justify-between opacity-30">
               <span className="text-[9px] font-black uppercase tracking-widest">Active Era</span>
               <span className="text-xs font-bold">{activePeriod.period_name}</span>
            </div>
          </div>
        </aside>

        {/* Main Vertical Scroll Area */}
        <main className="flex-1 w-full overflow-hidden relative">
          <div 
            ref={scrollContainerRef}
            className="h-full w-full overflow-y-auto snap-y snap-proximity no-scrollbar relative pt-[2vh] pb-[40vh]"
          >
            {regionalGroups.map(([region, groupData], groupIndex) => (
              <section 
                key={`${activePeriodKey}-${region}`}
                data-region={region}
                // Fixed: ref assignment now correctly matches the HTMLElement | null type.
                ref={(el) => { regionRefs.current[region] = el; }}
                className={`region-section w-full flex flex-col items-center transition-all duration-1000 ease-in-out py-16 px-[5vw] ${
                  activeRegionName === region 
                    ? 'opacity-100 blur-0 scale-100' 
                    : 'opacity-20 blur-[2px] scale-95 pointer-events-none'
                }`}
              >
                {/* Region Header - Focused when region is active */}
                <div className="mb-14 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-700 opacity-60 mb-2 block">CULTURAL DOMAIN</span>
                  <h2 className="text-5xl font-black font-zh tracking-tight border-b-2 border-amber-900 border-opacity-10 pb-4 px-12 inline-block">
                    {region}
                  </h2>
                </div>

                {/* Rows within this Region */}
                <div className="space-y-12 w-full flex flex-col items-center">
                  {groupData.rows.map((rowBooks, rowIndex) => (
                    <div 
                      key={rowIndex} 
                      className="flex justify-center items-center gap-6 md:gap-8 snap-center"
                    >
                      {rowBooks.map((book, bookIdx) => {
                        const palette = COVER_PALETTES[(groupIndex + rowIndex + bookIdx) % COVER_PALETTES.length];
                        return (
                          <button
                            key={book.id}
                            onClick={() => onSelectBook(book)}
                            className="group flex flex-col items-center transition-transform duration-500 hover:-translate-y-10"
                          >
                            <div className={`w-[140px] h-[210px] md:w-[170px] md:h-[250px] ${palette.bg} ${palette.text} shadow-[10px_0_20px_-8px_rgba(0,0,0,0.4)] rounded-r-lg border-l-[12px] border-black border-opacity-20 relative flex flex-col p-4 text-left group-hover:shadow-[20px_0_35px_-10px_rgba(0,0,0,0.5)] transition-all overflow-hidden`}>
                              
                              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
                              
                              <div className="relative z-10 flex-1 flex flex-col pt-1">
                                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-black opacity-80 mb-2 block border-b border-current border-opacity-20 pb-1 truncate">
                                  {book.author.name_latinized}
                                </span>
                                
                                <h3 className="text-base md:text-xl font-black leading-tight mb-1 font-zh drop-shadow-md line-clamp-2">
                                  {book.title_translations.zh}
                                </h3>

                                <p className="text-[8px] md:text-[10px] font-bold opacity-70 italic font-serif leading-tight line-clamp-2">
                                  {book.title_translations.en}
                                </p>
                                
                                <div className="absolute bottom-3 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none px-2">
                                   <p className="text-[40px] md:text-[56px] font-black opacity-[0.08] group-hover:opacity-[0.12] transition-all duration-700 whitespace-nowrap leading-none tracking-tighter">
                                     {book.title_original}
                                   </p>
                                </div>
                              </div>

                              <div className="relative z-10 pt-2 border-t border-current border-opacity-10 flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-60 truncate">
                                  {book.metadata.genre[0]}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0 text-center">
                              <span className="text-[9px] font-black uppercase tracking-widest block text-amber-700">
                                {book.metadata.estimated_date}
                              </span>
                              <span className="text-[8px] font-bold opacity-30 uppercase tracking-tighter">
                                {book.author.civilization}
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
      <nav className="h-20 bg-[#2c241e] text-[#f9f7f2] relative z-40 flex items-center overflow-x-auto no-scrollbar border-t border-[#4a3728] shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <div className="flex h-full min-w-full px-[5vw]">
          {Object.entries(data.periods).map(([key, period]) => {
            const p = period as LibraryPeriod;
            const isActive = activePeriodKey === key;
            return (
              <button
                key={key}
                onClick={() => setActivePeriodKey(key)}
                className={`flex-shrink-0 w-52 h-full flex flex-col justify-center px-6 border-r border-white border-opacity-5 transition-all relative group overflow-hidden ${
                  isActive ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'
                }`}
              >
                <div className="relative z-10">
                  <span className={`text-[8px] uppercase tracking-[0.4em] font-black transition-all duration-500 ${isActive ? 'text-amber-400' : 'opacity-20'}`}>
                    {p.era}
                  </span>
                  <h4 className={`text-sm font-bold mb-0.5 transition-transform duration-500 ${isActive ? 'translate-x-1' : ''}`}>
                    {p.period_name}
                  </h4>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-700 ease-out ${isActive ? 'w-full' : 'w-0'}`} />
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
