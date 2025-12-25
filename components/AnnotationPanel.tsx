
import React from 'react';
import { BookAnnotation, Theme } from '../types';

interface AnnotationPanelProps {
  annotations: BookAnnotation[];
  theme: Theme;
}

const AnnotationPanel: React.FC<AnnotationPanelProps> = ({ annotations, theme }) => {
  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  return (
    <div className={`h-full overflow-y-auto p-6 border-l panel-border transition-colors duration-300 ${
      isDark ? 'bg-[#252525] text-gray-300' : isSepia ? 'bg-[#efdfbb] text-[#6d5747]' : 'bg-slate-50 text-gray-700'
    }`}>
      <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-60">Publisher Annotations</h3>
      
      <div className="space-y-4">
        {annotations.length === 0 ? (
          <p className="text-sm italic opacity-50">No annotations for this chapter.</p>
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
                  ann.type === 'key_concept' ? 'bg-indigo-100 text-indigo-700' :
                  ann.type === 'philosophical_interpretation' ? 'bg-emerald-100 text-emerald-700' :
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
