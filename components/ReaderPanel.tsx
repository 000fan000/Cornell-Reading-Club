
import React from 'react';
import { Chapter, Theme } from '../types';

interface ReaderPanelProps {
  chapter: Chapter;
  theme: Theme;
  fontSize: number;
  showTranslation: boolean;
  isGeneratingTranslation?: boolean;
}

const ReaderPanel: React.FC<ReaderPanelProps> = ({ 
  chapter, 
  theme, 
  fontSize, 
  showTranslation,
  isGeneratingTranslation 
}) => {
  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  return (
    <div className={`h-full overflow-y-auto p-8 md:p-12 transition-colors duration-300 ${
      isDark ? 'bg-[#1a1a1a] text-gray-200' : isSepia ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="border-b pb-6 border-current opacity-20 text-center md:text-left">
          <h2 className="text-sm uppercase tracking-widest opacity-60 font-medium">Chapter {chapter.chapter_number}</h2>
          <h1 className="text-3xl font-bold mt-2 font-serif">{chapter.chapter_title}</h1>
        </header>

        <section className="space-y-8">
          <div 
            className="leading-relaxed tracking-wide text-center py-4 whitespace-pre-wrap"
            style={{ fontSize: `${fontSize * 1.2}px` }}
          >
            {chapter.original_text}
          </div>

          {showTranslation && (
            <div className="space-y-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-current opacity-10"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Translation</span>
                <div className="h-px flex-1 bg-current opacity-10"></div>
              </div>
              
              {isGeneratingTranslation ? (
                <div className="flex flex-col items-center py-10 opacity-40 animate-pulse">
                  <svg className="animate-spin h-6 w-6 mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs uppercase tracking-widest">Generating with Gemini AI...</span>
                </div>
              ) : chapter.translations.length > 0 ? (
                chapter.translations.map((trans, idx) => (
                  <div key={idx} className="border-l-2 border-indigo-400 pl-6 italic">
                    <p 
                      className="font-serif leading-relaxed opacity-90"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {trans.text}
                    </p>
                    <cite className="text-xs not-italic uppercase tracking-wider mt-2 block opacity-50">
                      — Translated by {trans.translator}
                    </cite>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm opacity-40 italic py-4">No translation available.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReaderPanel;
