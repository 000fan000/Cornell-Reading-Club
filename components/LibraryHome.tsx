
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
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [focusedRowIndex, setFocusedRowIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activePeriod = data.periods[activePeriodKey];

  const availableRegions = useMemo(() => {
    const regions = new Set<string>();
    activePeriod.books.forEach(book => {
      if (book.civilization_context.region) {
        regions.add(book.civilization_context.region);
      }
    });
    return ['All', ...Array.from(regions).sort()];
  }, [activePeriod]);

  useEffect(() => {
    setActiveRegion('All');
    setFocusedRowIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activePeriodKey]);

  const filteredBooks = useMemo(() => {
    let list = activePeriod.books;
    if (activeRegion !== 'All') {
      list = list.filter(book => book.civilization_context.region === activeRegion);
    }
    // Chunk books into rows of 6
    const chunks = [];
    for (let i = 0; i < list.length; i += 6) {
      chunks.push(list.slice(i, i + 6));
    }
    return chunks;
  }, [activePeriod, activeRegion]);

  // Handle focus tracking on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-row-index') || '0');
            setFocusedRowIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.6, // Require majority of row to be visible to focus
      }
    );

    const rows = container.querySelectorAll('.book-row');
    rows.forEach((row) => observer.observe(row));

    return () => observer.disconnect();
  }, [filteredBooks]);

  return (
    <div className="h-screen bg-[#f9f7f2] text-[#2c241e] overflow-hidden flex flex-col font-serif relative">
      {/* Dynamic Background Watermark */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-0 text-[600px] leading-none font-bold rotate-12 -translate-x-1/2 -translate-y-1/2">
          {activePeriod.books.length}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-8 relative z-10 w-full overflow-hidden">
        <header className="text-center mb-4 max-w-3xl px-6">
          <div className="flex items-center justify-center gap-4 mb-1">
            <div className="h-px w-8 bg-[#2c241e] opacity-20"></div>
            <span className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-black">{data.library.concept}</span>
            <div className="h-px w-8 bg-[#2c241e] opacity-20"></div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter transition-all duration-700">{data.library.name}</h1>
          
          {/* Regional Compass */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {availableRegions.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                  activeRegion === region 
                    ? 'bg-[#2c241e] text-[#f9f7f2] border-[#2c241e] shadow-sm' 
                    : 'bg-white bg-opacity-40 border-[#2c241e] border-opacity-5 hover:border-opacity-20 text-[#2c241e] text-opacity-40'
                }`}
              >
                {region === 'All' ? 'The World' : region}
              </button>
            ))}
          </div>
        </header>

        {/* Vertical Scroll Focus Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 w-full overflow-y-auto snap-y snap-mandatory no-scrollbar relative pt-[10vh] pb-[30vh]"
        >
          {filteredBooks.map((rowBooks, rowIndex) => (
            <div 
              key={rowIndex}
              data-row-index={rowIndex}
              className={`book-row w-full flex justify-center items-center gap-6 min-h-[450px] snap-center transition-all duration-700 ease-out py-12 px-[5vw] ${
                focusedRowIndex === rowIndex 
                  ? 'opacity-100 scale-100 blur-0' 
                  : 'opacity-20 scale-90 blur-[2px] pointer-events-none'
              }`}
            >
              {rowBooks.map((book, bookIdx) => {
                const palette = COVER_PALETTES[(rowIndex * 6 + bookIdx) % COVER_PALETTES.length];
                return (
                  <button
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="group flex flex-col items-center transition-transform duration-500 hover:-translate-y-8"
                  >
                    <div className={`w-[160px] h-[240px] md:w-[190px] md:h-[280px] ${palette.bg} ${palette.text} shadow-[15px_0_30px_-10px_rgba(0,0,0,0.4)] rounded-r-lg border-l-[14px] border-black border-opacity-20 relative flex flex-col p-5 text-left group-hover:shadow-[25px_0_45px_-10px_rgba(0,0,0,0.5)] transition-all overflow-hidden`}>
                      
                      {/* Linen Texture */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
                      
                      <div className="relative z-10 flex-1 flex flex-col pt-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-80 mb-3 block border-b border-current border-opacity-20 pb-1 truncate">
                          {book.author.name_latinized}
                        </span>
                        
                        {/* Chinese Title */}
                        <h3 className="text-xl md:text-2xl font-black leading-tight mb-1 font-zh drop-shadow-md">
                          {book.title_translations.zh}
                        </h3>

                        {/* English Title */}
                        <p className="text-[10px] md:text-[11px] font-bold opacity-70 italic font-serif leading-tight">
                          {book.title_translations.en}
                        </p>
                        
                        {/* Original Title Watermark (No tilt) */}
                        <div className="absolute bottom-4 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none">
                           <p className="text-[54px] md:text-[72px] font-black opacity-[0.08] group-hover:opacity-[0.12] transition-all duration-700 whitespace-nowrap leading-none tracking-tighter">
                             {book.title_original}
                           </p>
                        </div>
                      </div>

                      <div className="relative z-10 pt-3 border-t border-current border-opacity-10 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{book.metadata.genre[0]}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30"></div>
                      </div>
                    </div>

                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-center">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] block text-indigo-600 mb-0.5">
                        {book.metadata.estimated_date}
                      </span>
                      <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">
                        {book.author.civilization}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      {/* The Temporal Belt */}
      <nav className="h-24 bg-[#2c241e] text-[#f9f7f2] relative z-40 flex items-center overflow-x-auto no-scrollbar border-t border-[#4a3728] shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex h-full min-w-full px-[5vw]">
          {Object.entries(data.periods).map(([key, period]) => {
            const p = period as LibraryPeriod;
            const isActive = activePeriodKey === key;
            return (
              <button
                key={key}
                onClick={() => setActivePeriodKey(key)}
                className={`flex-shrink-0 w-64 h-full flex flex-col justify-center px-6 border-r border-white border-opacity-5 transition-all relative group overflow-hidden ${
                  isActive ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'
                }`}
              >
                <div className="relative z-10">
                  <span className={`text-[9px] uppercase tracking-[0.4em] font-black transition-all duration-500 ${isActive ? 'text-amber-400' : 'opacity-30'}`}>
                    {p.era}
                  </span>
                  <h4 className={`text-base font-bold mb-0.5 transition-transform duration-500 ${isActive ? 'translate-x-1' : ''}`}>
                    {p.period_name}
                  </h4>
                  <p className="text-[9px] opacity-20 italic font-sans">{p.time_range}</p>
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
