
import React from 'react';
import { BookAnnotation, Theme } from '../types';

interface AnnotationPanelProps {
  annotations: BookAnnotation[];
  theme: Theme;
  isGenerating?: boolean;
}

const AnnotationPanel: React.FC<AnnotationPanelProps> = ({ annotations, theme, isGenerating }) => {
  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  return (
    <div className={`h-full overflow-y-auto p-6 border-l panel-border transition-colors duration-300 ${
      isDark ? 'bg-[#252525] text-gray-300' : isSepia ? 'bg-[#efdfbb] text-[#6d5747]' : 'bg-slate-50 text-gray-700'
    }`}>
      <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-60">Annotations</h3>
      
      <div className="space-y-4">
        {isGenerating ? (
          <div className="flex flex-col items-center py-10 opacity-30 animate-pulse text-center">
             <svg className="animate-spin h-5 w-5 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            <span className="text-[10px] uppercase tracking-widest">Generating Annotations...</span>
          </div>
        ) : annotations.length === 0 ? (
          <p className="text-sm italic opacity-40 text-center py-10">No annotations available. Click "Notes" to enable analysis.</p>
        ) : (
          annotations.map((ann, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg shadow-sm border ${
                isDark ? 'bg-[#2d2d2d] border-[#3d3d3d]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  ann.type.includes('concept') ? 'bg-indigo-100 text-indigo-700' :
                  ann.type.includes('interpretation') ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {ann.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] opacity-40 ml-auto">{ann.reference_position}</span>
              </div>
              <p className="text-sm leading-relaxed">{ann.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnotationPanel;
