
import React, { useState, useMemo } from 'react';
import { LibraryData, Book, LibraryPeriod } from '../types';

interface LibraryHomeProps {
  data: LibraryData;
  onSelectBook: (book: Book) => void;
}

const BOOK_COVERS = [
  'bg-[#e2dcd2]', 'bg-[#d1c6b8]', 'bg-[#b69f84]', 'bg-[#8d7861]', 
  'bg-[#5b4a3c]', 'bg-[#3e3229]', 'bg-[#a39b8b]', 'bg-[#7a7465]'
];

const LibraryHome: React.FC<LibraryHomeProps> = ({ data, onSelectBook }) => {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(Object.keys(data.periods)[0]);

  const activePeriod = data.periods[activePeriodKey];
  
  const books = useMemo(() => {
    return activePeriod.books;
  }, [activePeriod]);

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-[#2c241e] overflow-hidden flex flex-col font-serif relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-0 text-[400px] leading-none font-bold rotate-12 -translate-x-1/2 -translate-y-1/2">
          101
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <header className="text-center mb-16 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">{data.library.name}</h1>
          <p className="text-sm uppercase tracking-[0.3em] opacity-40 mb-6">{data.library.concept}</p>
          <p className="text-lg leading-relaxed opacity-70 italic">
            "The Garden of Forking Paths — 101 worlds, each reflecting all others, every reader finds their path."
          </p>
        </header>

        {/* Book Display Area */}
        <div className="w-full max-w-7xl h-[450px] relative overflow-x-auto overflow-y-hidden px-10 flex items-end gap-6 scroll-smooth pb-12 no-scrollbar">
          {books.length > 0 ? (
            books.map((book, idx) => (
              <button
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="group flex-shrink-0 flex flex-col items-center transition-all duration-500 hover:-translate-y-8 animate-in zoom-in-95 fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Book Spine/Cover Representation */}
                <div className={`w-[160px] h-[240px] ${BOOK_COVERS[idx % BOOK_COVERS.length]} shadow-[8px_0_15px_-5px_rgba(0,0,0,0.3)] rounded-r-md border-l-[12px] border-black border-opacity-10 relative flex flex-col p-4 text-left group-hover:shadow-[15px_0_25px_-5px_rgba(0,0,0,0.4)] transition-shadow`}>
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">{book.author.name_latinized}</span>
                    <h3 className="text-lg font-bold leading-tight mb-2">{book.title_translations.en}</h3>
                    <p className="text-2xl font-bold opacity-20 font-zh absolute bottom-4 right-4">{book.title_original}</p>
                  </div>
                  <div className="pt-2 border-t border-black border-opacity-5">
                    <span className="text-[9px] uppercase tracking-tighter opacity-40">{book.metadata.genre[0]}</span>
                  </div>
                </div>
                {/* Hover Label */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                  <span className="text-xs font-bold uppercase tracking-widest block">{book.metadata.estimated_date}</span>
                  <span className="text-[10px] opacity-50">{book.author.civilization}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20 italic">
              Exploring the annals of history for this era...
            </div>
          )}
        </div>
      </main>

      {/* The Temporal Belt (Timeline Navigation) */}
      <nav className="h-32 bg-[#2c241e] text-[#f9f7f2] relative z-20 flex items-center overflow-x-auto no-scrollbar border-t-4 border-[#8d7861]">
        <div className="flex h-full min-w-full px-[10vw]">
          {Object.entries(data.periods).map(([key, period]) => (
            <button
              key={key}
              onClick={() => setActivePeriodKey(key)}
              className={`flex-shrink-0 w-80 h-full flex flex-col justify-center px-8 border-r border-white border-opacity-5 transition-all relative group overflow-hidden ${
                activePeriodKey === key ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'
              }`}
            >
              <div className="relative z-10">
                <span className={`text-[10px] uppercase tracking-[0.3em] transition-opacity ${activePeriodKey === key ? 'opacity-100' : 'opacity-40'}`}>
                  {period.era}
                </span>
                <h4 className="text-xl font-bold mb-1">{period.period_name}</h4>
                <p className="text-[10px] opacity-40 italic">{period.time_range}</p>
              </div>
              {/* Highlight Bar */}
              <div className={`absolute bottom-0 left-0 h-1 bg-[#8d7861] transition-all duration-500 ${activePeriodKey === key ? 'w-full' : 'w-0'}`} />
            </button>
          ))}
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
