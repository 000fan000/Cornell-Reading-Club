
import React from 'react';
import { BookAnnotation, Theme } from '../types';

interface AnnotationPanelProps {
  annotations: BookAnnotation[];
  theme: Theme;
  isGenerating?: boolean;
  uiLanguage: 'en' | 'zh';
  onGenerate: () => void;
}

const AnnotationPanel: React.FC<AnnotationPanelProps> = ({ annotations, theme, isGenerating, uiLanguage, onGenerate }) => {
  const isDark = theme === 'dark' || theme === 'nord' || theme === 'mocha';
  const isSepia = theme === 'sepia' || theme === 'solarized';

  return (
    <div className={`h-full overflow-y-auto p-6 border-l panel-border transition-colors duration-300 ${
      isDark ? 'bg-[#252525] text-gray-300' : isSepia ? 'bg-[#efdfbb] text-[#6d5747]' : 'bg-slate-50 text-gray-700'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">
          {uiLanguage === 'zh' ? '注释与批注' : 'Annotations'}
        </h3>
        {annotations.length > 0 && !isGenerating && (
           <button 
             onClick={onGenerate}
             title={uiLanguage === 'zh' ? '重新生成' : 'Regenerate'}
             className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors opacity-40 hover:opacity-100"
           >
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           </button>
        )}
      </div>
      
      <div className="space-y-4">
        {isGenerating ? (
          <div className="flex flex-col items-center py-10 opacity-30 animate-pulse text-center">
             <svg className="animate-spin h-5 w-5 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            <span className="text-[10px] uppercase tracking-widest">
              {uiLanguage === 'zh' ? '正在生成学术注释...' : 'Generating Annotations...'}
            </span>
          </div>
        ) : annotations.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center space-y-4">
            <p className="text-sm italic opacity-40">
              {uiLanguage === 'zh' ? '暂无注释。点击下方开启 AI 学术分析。' : 'No annotations available. Click below to initiate AI analysis.'}
            </p>
            <button 
              onClick={onGenerate}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-sm border ${
                isDark ? 'bg-amber-400 text-black border-transparent hover:bg-amber-300' : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'
              }`}
            >
              <span className="text-base leading-none">✨</span>
              {uiLanguage === 'zh' ? '开启文本批注' : 'Analyze & Annotate'}
            </button>
          </div>
        ) : (
          annotations.map((ann, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg shadow-sm border animate-in fade-in slide-in-from-right-4 duration-300 delay-[${idx * 100}ms] ${
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
