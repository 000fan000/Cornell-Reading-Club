
import React from 'react';
import { Chapter, Theme } from '../types';

interface ReaderPanelProps {
  chapter: Chapter;
  theme: Theme;
  fontSize: number;
}

const ReaderPanel: React.FC<ReaderPanelProps> = ({ chapter, theme, fontSize }) => {
  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  return (
    <div className={`h-full overflow-y-auto p-8 md:p-12 transition-colors duration-300 ${
      isDark ? 'bg-[#1a1a1a] text-gray-200' : isSepia ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="border-b pb-6 border-current opacity-20">
          <h2 className="text-sm uppercase tracking-widest opacity-60 font-medium">Chapter {chapter.chapter_number}</h2>
          <h1 className="text-3xl font-bold mt-2 font-serif">{chapter.chapter_title}</h1>
        </header>

        <section className="space-y-8">
          <div 
            className="font-zh leading-relaxed tracking-wide text-center"
            style={{ fontSize: `${fontSize * 1.5}px` }}
          >
            {chapter.original_text}
          </div>

          <div className="space-y-6 pt-8">
            {chapter.translations.map((trans, idx) => (
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReaderPanel;
