
import React, { useState, useEffect } from 'react';
import { UserNotes, Theme } from '../types';
import { geminiService } from '../services/gemini';

interface CornellNotesPanelProps {
  chapterId: number;
  initialNotes?: UserNotes;
  chapterText: string;
  theme: Theme;
  onSave: (notes: UserNotes) => void;
}

const CornellNotesPanel: React.FC<CornellNotesPanelProps> = ({ 
  chapterId, 
  initialNotes, 
  chapterText,
  theme,
  onSave 
}) => {
  const [notes, setNotes] = useState<UserNotes>(initialNotes || { cues: [], notes: '', summary: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setNotes(initialNotes || { cues: [], notes: '', summary: '' });
  }, [chapterId, initialNotes]);

  const handleUpdate = (field: keyof UserNotes, value: any) => {
    const updated = { ...notes, [field]: value };
    setNotes(updated);
    onSave(updated);
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    const cues = await geminiService.generateCues(chapterText);
    const summary = await geminiService.generateSummary(chapterText);
    
    const updated = {
      ...notes,
      cues: cues.length > 0 ? cues : notes.cues,
      summary: summary || notes.summary
    };
    setNotes(updated);
    onSave(updated);
    setIsGenerating(false);
  };

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const baseStyles = isDark ? 'bg-[#1e1e1e] text-gray-200 border-[#333]' : 
                    isSepia ? 'bg-[#fcf8e8] text-[#5b4636] border-[#e0d6b6]' : 
                    'bg-white text-gray-800 border-slate-200';

  const inputStyles = `w-full bg-transparent resize-none focus:outline-none transition-all duration-200 p-4 h-full`;

  return (
    <div className={`h-full flex flex-col border-t-2 panel-border ${isDark ? 'bg-[#1a1a1a]' : 'bg-slate-50'}`}>
      <div className="flex items-center justify-between px-6 py-2 border-b panel-border bg-opacity-50">
        <div className="flex items-center gap-4">
           <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">Cornell Notes</h3>
           <span className="text-[10px] opacity-40">Chapter {chapterId}</span>
        </div>
        <button 
          onClick={handleAiGenerate}
          disabled={isGenerating}
          className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${
            isGenerating 
            ? 'opacity-50 cursor-not-allowed bg-gray-200' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
        >
          {isGenerating ? (
            <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : '✨ Generate AI Assistance'}
        </button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Cues Section (30%) */}
        <div className={`w-[30%] border-r panel-border flex flex-col ${baseStyles}`}>
          <div className="px-4 pt-3 text-[10px] font-bold uppercase opacity-40">Cues & Questions</div>
          <div className="flex-1 overflow-y-auto p-2">
            <textarea
              className={inputStyles}
              placeholder="Keywords, prompts, or questions..."
              value={notes.cues.join('\n')}
              onChange={(e) => handleUpdate('cues', e.target.value.split('\n'))}
            />
          </div>
        </div>

        {/* Main Notes Section (50%) */}
        <div className={`w-[50%] border-r panel-border flex flex-col ${baseStyles}`}>
          <div className="px-4 pt-3 text-[10px] font-bold uppercase opacity-40">Notes & Reflections</div>
          <div className="flex-1 overflow-y-auto p-2">
            <textarea
              className={inputStyles}
              placeholder="Record your insights here..."
              value={notes.notes}
              onChange={(e) => handleUpdate('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Summary Section (20%) */}
        <div className={`w-[20%] flex flex-col ${baseStyles}`}>
          <div className="px-4 pt-3 text-[10px] font-bold uppercase opacity-40">Summary</div>
          <div className="flex-1 overflow-y-auto p-2">
            <textarea
              className={inputStyles}
              placeholder="Key takeaway..."
              value={notes.summary}
              onChange={(e) => handleUpdate('summary', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CornellNotesPanel;
