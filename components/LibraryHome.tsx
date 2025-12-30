
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LibraryData, Book, LibraryPeriod, Theme } from '../types';

interface LibraryHomeProps {
  data: LibraryData;
  onSelectBook: (book: Book) => void;
  theme: Theme;
  uiLanguage: 'en' | 'zh';
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onAcquireVolume?: () => void;
  onOpenAdmin?: () => void;
  onExportArchive?: () => void;
  onImportArchive?: (file: File) => void;
}

const COVER_PALETTES = [
  { bg: 'bg-[#f4f1ea]', text: 'text-[#5d544b]', accent: 'border-[#d4af37]', hex: '#d4af37' },
  { bg: 'bg-[#e8efea]', text: 'text-[#4a5d52]', accent: 'border-[#8fbc8f]', hex: '#8fbc8f' },
  { bg: 'bg-[#e3e9f0]', text: 'text-[#4a5568]', accent: 'border-[#4682b4]', hex: '#4682b4' },
  { bg: 'bg-[#f4e9e9]', text: 'text-[#6b4a4a]', accent: 'border-[#cd5c5c]', hex: '#cd5c5c' },
  { bg: 'bg-[#f2efe8]', text: 'text-[#5d5a4b]', accent: 'border-[#b69f84]', hex: '#b69f84' },
  { bg: 'bg-[#ede9f4]', text: 'text-[#554a6b]', accent: 'border-[#9f84b6]', hex: '#9f84b6' },
  { bg: 'bg-[#fcfaf2]', text: 'text-[#2c241e]', accent: 'border-[#d4af37]', hex: '#d4af37' },
];

const parseYear = (dateStr: string): number => {
  if (!dateStr) return 0;
  const cleaned = dateStr.replace('约', '').replace('世纪', '00');
  const match = cleaned.match(/\d+/);
  if (!match) return 0;
  let year = parseInt(match[0]);
  if (dateStr.includes('世纪')) year = (year - 1) * 100;
  return dateStr.includes('前') ? -year : year;
};

const LibraryHome: React.FC<LibraryHomeProps> = ({ data, onSelectBook, theme, uiLanguage, onToggleTheme, onToggleLanguage, onAcquireVolume, onOpenAdmin, onExportArchive, onImportArchive }) => {
  const [activePeriodKey, setActivePeriodKey] = useState<string>(Object.keys(data.periods)[0]);
  const [organizationMode, setOrganizationMode] = useState<'region' | 'genre'>('region');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const importFileRef = useRef<HTMLInputElement>(null);

  const isDarkMode = theme === 'dark' || theme === 'nord' || theme === 'mocha';
  const activePeriod = data.periods[activePeriodKey] || Object.values(data.periods)[0];

  const tagStats = useMemo(() => {
    const stats: Record<string, { weight: number; count: number }> = {};
    if (!activePeriod?.books) return [];
    activePeriod.books.forEach(book => {
      book.thematic_tags?.forEach(t => {
        if (!stats[t.tag]) stats[t.tag] = { weight: 0, count: 0 };
        stats[t.tag].weight += (t.weight || 1);
        stats[t.tag].count += 1;
      });
    });
    const entries = Object.entries(stats).map(([tag, data]) => ({ tag, score: data.weight * data.count }));
    const maxScore = Math.max(...entries.map(e => e.score), 1);
    return entries.map(e => ({ ...e, normalizedScore: maxScore > 0 ? e.score / maxScore : 0 })).sort((a, b) => b.score - a.score);
  }, [activePeriod]);

  const groupedData = useMemo(() => {
    const groups: Record<string, { count: number; books: Book[] }> = {};
    if (!activePeriod?.books) return [];
    
    let filteredBooks = [...activePeriod.books];
    if (activeTag) filteredBooks = filteredBooks.filter(book => book.thematic_tags?.some(t => t.tag === activeTag));
    
    filteredBooks.sort((a, b) => parseYear(a.metadata?.estimated_date || "") - parseYear(b.metadata?.estimated_date || "")).forEach(book => {
      const category = organizationMode === 'region' 
        ? (book.civilization_context?.region || 'Uncharted') 
        : (book.metadata?.genre?.[0] || 'Misc');
        
      if (!groups[category]) groups[category] = { count: 0, books: [] };
      groups[category].books.push(book);
      groups[category].count++;
    });
    
    return Object.entries(groups).map(([name, g]) => {
      const rows: Book[][] = [];
      for (let i = 0; i < g.books.length; i += 4) rows.push(g.books.slice(i, i + 4));
      return [name, { ...g, rows }] as [string, { rows: Book[][]; count: number }];
    }).sort((a, b) => a[0].localeCompare(b[0]));
  }, [activePeriod, organizationMode, activeTag]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cat = entry.target.getAttribute('data-category');
          if (cat) setActiveCategoryName(cat);
        }
      });
    }, { root: container, threshold: 0.1 });
    container.querySelectorAll('.category-section').forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [groupedData]);

  const navContent = (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h4 className={`text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mb-2 ${isDarkMode ? 'text-white' : ''}`}>{organizationMode === 'region' ? (uiLanguage === 'zh' ? '档案疆域' : 'Archive Domain') : (uiLanguage === 'zh' ? '类型索引' : 'Genre Index')}</h4>
        <div className="h-[1px] w-full bg-current opacity-[0.05]"></div>
      </div>
      <nav className="flex-1 flex flex-col gap-5 overflow-y-auto no-scrollbar">
        {groupedData.map(([category, g]) => (
          <button key={category} onClick={() => categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth' })} className={`group flex items-center justify-between text-left transition-all ${activeCategoryName === category ? 'translate-x-2' : 'opacity-40 hover:opacity-100'}`}>
            <span className={`text-[13px] font-black font-zh tracking-wide ${activeCategoryName === category ? (isDarkMode ? 'text-amber-400' : 'text-amber-700') : (isDarkMode ? 'text-white' : 'text-[#2c241e]')}`}>{category}</span>
            <span className={`text-[10px] font-bold opacity-30 ${activeCategoryName === category ? 'opacity-100' : ''}`}>{g.count}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className={`h-screen transition-colors duration-700 overflow-hidden flex flex-col font-serif relative ${isDarkMode ? 'bg-[#121212] text-[#e5e5e5]' : 'bg-[#fcfbf9] text-[#2c241e]'}`}>
      <header className={`flex flex-col items-center text-center pt-8 pb-4 relative z-30 w-full px-6 border-b ${isDarkMode ? 'bg-black/40 border-white/5 backdrop-blur-md' : 'bg-white/40 border-black/5 backdrop-blur-sm'}`}>
        <div className="absolute left-8 top-10 flex items-center gap-3">
           <button onClick={onAcquireVolume} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm border ${isDarkMode ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
             {uiLanguage === 'zh' ? '收录新卷' : 'Acquire Volume'}
           </button>
           <button onClick={onOpenAdmin} title={uiLanguage === 'zh' ? '进入馆员控制台' : 'Librarian Command Center'} className={`p-2 rounded-full border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-amber-400 hover:text-black' : 'bg-black/5 border-black/10 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
           </button>
           <div className={`h-8 w-px ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
           <button onClick={onExportArchive} title={uiLanguage === 'zh' ? '备份全馆 JSON 档案' : 'Backup Library Archive'} className={`p-2 rounded-full transition-all flex items-center gap-2 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white/40 hover:text-white' : 'bg-black/5 hover:bg-black/10 text-black/40 hover:text-black'}`}>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 9l-4 4m0 0l-4-4m4 4V4" /></svg>
             <span className="text-[9px] font-bold uppercase tracking-widest">{uiLanguage === 'zh' ? '全馆备份' : 'Backup'}</span>
           </button>
           <button onClick={() => importFileRef.current?.click()} title={uiLanguage === 'zh' ? '导入馆藏档案' : 'Import Library Archive'} className={`p-2 rounded-full transition-all flex items-center gap-2 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white/40 hover:text-white' : 'bg-black/5 hover:bg-black/10 text-black/40 hover:text-black'}`}>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
             <span className="text-[9px] font-bold uppercase tracking-widest">{uiLanguage === 'zh' ? '档案导入' : 'Import'}</span>
           </button>
           <input ref={importFileRef} type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && onImportArchive?.(e.target.files[0])} />
        </div>
        <div className="absolute right-8 top-10 flex items-center gap-4">
          <button onClick={onToggleLanguage} className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-amber-400' : 'bg-black/5 text-indigo-600'}`}>{uiLanguage === 'zh' ? 'CHS' : 'ENG'}</button>
          <div className={`flex items-center gap-1 p-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
            <button onClick={() => setOrganizationMode('region')} className={`px-3 py-1.5 rounded-full transition-all ${organizationMode === 'region' ? (isDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white shadow-sm text-amber-700') : 'opacity-40'}`}>{uiLanguage === 'zh' ? '疆域' : 'Domain'}</button>
            <button onClick={() => setOrganizationMode('genre')} className={`px-3 py-1.5 rounded-full transition-all ${organizationMode === 'genre' ? (isDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white shadow-sm text-amber-700') : 'opacity-40'}`}>{uiLanguage === 'zh' ? '类型' : 'Type'}</button>
          </div>
          <button onClick={onToggleTheme} className={`p-2.5 rounded-full ${isDarkMode ? 'bg-white/5 text-amber-400' : 'bg-black/5 text-indigo-600'}`}>{isDarkMode ? '🌞' : '🌙'}</button>
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter">{uiLanguage === 'zh' ? data.library.name : 'Library 101'}</h1>
        <p className="text-[11px] opacity-30 italic mt-1 font-sans tracking-wide uppercase">{activePeriod?.description || ""}</p>
      </header>

      <div className={`z-20 px-10 py-4 border-b flex items-center gap-6 ${isDarkMode ? 'bg-[#151515] border-white/5' : 'bg-[#faf9f6] border-black/5'}`}>
        <div className="flex-shrink-0 flex items-center gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest opacity-20">{uiLanguage === 'zh' ? '馆藏检索' : 'Registry Search'}:</span>
          {activeTag && <button onClick={() => setActiveTag(null)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${isDarkMode ? 'bg-amber-400 text-black' : 'bg-amber-700 text-white'}`}>{uiLanguage === 'zh' ? '清除' : 'Clear'}</button>}
        </div>
        <div className="flex items-center gap-x-8 whitespace-nowrap overflow-x-auto no-scrollbar py-2">
          {tagStats.slice(0, 15).map((stat) => (
            <button key={stat.tag} onClick={() => setActiveTag(activeTag === stat.tag ? null : stat.tag)} className={`transition-all font-zh font-black ${activeTag === stat.tag ? (isDarkMode ? 'text-amber-400 scale-110' : 'text-amber-800 scale-110') : 'opacity-30 hover:opacity-100'}`} style={{ fontSize: `${Math.max(12, 28 * stat.normalizedScore)}px` }}>{stat.tag}</button>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex w-full overflow-hidden ${organizationMode === 'genre' ? 'flex-row-reverse' : 'flex-row'}`}>
        <aside className={`w-56 h-full py-10 px-8 z-20 border-current border-opacity-[0.05] ${isDarkMode ? 'bg-[#1a1a1a]/80 backdrop-blur-md' : 'bg-white/20 backdrop-blur-md'} ${organizationMode === 'region' ? 'border-r' : 'border-l'}`}>{navContent}</aside>
        <main className="flex-1 overflow-y-auto no-scrollbar" ref={scrollContainerRef}>
          {groupedData.map(([category, g]) => (
            <section key={category} data-category={category} ref={(el) => { categoryRefs.current[category] = el; }} className="category-section py-20 px-[5vw] flex flex-col items-center">
              <h2 className={`text-4xl font-black border-b-2 pb-5 px-16 mb-24 font-serif italic ${isDarkMode ? 'text-white border-white/10' : 'text-[#4a423b] border-amber-900/10'}`}>{category}</h2>
              <div className="space-y-48 w-full flex flex-col items-center">
                {g.rows.map((rowBooks, rIdx) => (
                  <div key={rIdx} className="flex justify-center items-end gap-16">
                    {rowBooks.map((book) => (
                      <button key={book.id} onClick={() => onSelectBook(book)} className="group flex flex-col items-center transition-transform hover:-translate-y-8 relative">
                         <div className={`w-[160px] h-[230px] md:w-[200px] md:h-[290px] ${COVER_PALETTES[parseYear(book.id)%7].bg} shadow-2xl rounded-r border-l-[8px] border-black/10 flex flex-col p-6 text-left relative overflow-hidden`}>
                            {book.is_user_uploaded && (
                              <div className="absolute top-0 right-0 p-2 opacity-30">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                              </div>
                            )}
                            <span className="text-[10px] font-black opacity-60 mb-4 font-sans tracking-tighter">{(book.author?.name_chinese || book.author?.name_original) || "Unknown"}</span>
                            <h3 className="text-base md:text-xl font-black leading-tight line-clamp-3 font-serif italic">{uiLanguage === 'zh' ? book.title_translations?.zh : book.title_translations?.en}</h3>
                            <div className="mt-auto pt-4 border-t border-black/5">
                              <span className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">{book.metadata?.genre?.[0] || "Manuscript"}</span>
                            </div>
                         </div>
                         <div className="mt-4 text-[10px] font-bold opacity-30 font-sans tracking-widest">{book.metadata?.estimated_date || "Unknown"}</div>
                         {book.is_user_uploaded && <div className="absolute -top-4 -right-4 px-2 py-0.5 rounded bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">{uiLanguage === 'zh' ? '持久化卷' : 'Persisted'}</div>}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>

      <nav className={`h-28 flex items-center overflow-x-auto no-scrollbar border-t ${isDarkMode ? 'bg-black/80 border-white/5 backdrop-blur-2xl' : 'bg-white/80 border-black/5 backdrop-blur-2xl'}`}>
        <div className="flex h-full min-w-full px-6 gap-2">
          {/* Fix: Cast Object.entries(data.periods) to [string, LibraryPeriod][] to ensure correct property access */}
          {(Object.entries(data.periods) as [string, LibraryPeriod][]).map(([key, p]) => (
            <button key={key} onClick={() => setActivePeriodKey(key)} className={`flex-shrink-0 w-64 h-full flex items-center px-6 transition-all relative ${activePeriodKey === key ? (isDarkMode ? 'bg-white/5' : 'bg-amber-50/40') : 'hover:bg-black/5'}`}>
               <div className="flex flex-col items-start text-left">
                  <span className={`text-[8px] font-black tracking-widest uppercase ${activePeriodKey === key ? (isDarkMode ? 'text-amber-400' : 'text-amber-700') : 'opacity-20'}`}>{p.era}</span>
                  <h4 className={`text-[15px] font-black font-serif italic ${activePeriodKey === key ? 'opacity-100' : 'opacity-40'}`}>{p.period_name}</h4>
                  <span className="text-[9px] font-bold opacity-30 font-sans tracking-widest">{p.total_books} {uiLanguage === 'zh' ? '卷册' : 'VOLUMES'}</span>
               </div>
               {activePeriodKey === key && <div className={`absolute bottom-0 left-0 h-1 w-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'}`} />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default LibraryHome;
