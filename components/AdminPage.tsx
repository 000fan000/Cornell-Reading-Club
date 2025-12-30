
import React, { useState } from 'react';
import { ReaderBook, UserNotes, Theme, LLMConfig } from '../types';
import { geminiService } from '../services/gemini';

interface AdminPageProps {
  onBack: () => void;
  persistedBooks: Record<string, ReaderBook>;
  notesStorage: Record<string, Record<number, UserNotes>>;
  onDeleteBook: (id: string) => void;
  onCommitBook: (book: ReaderBook) => void;
  llmConfig: LLMConfig;
  onLlmConfigChange: (config: LLMConfig) => void;
  theme: Theme;
  uiLanguage: 'en' | 'zh';
}

const AdminPage: React.FC<AdminPageProps> = ({ onBack, persistedBooks, notesStorage, onDeleteBook, onCommitBook, llmConfig, onLlmConfigChange, theme, uiLanguage }) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'manual' | 'intelligence'>('registry');
  const [manualText, setManualText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualMeta, setManualMeta] = useState({ title: '', author: '' });

  const isDark = theme === 'dark' || theme === 'nord' || theme === 'mocha';
  const books = Object.values(persistedBooks);

  const handleManualDigitize = async () => {
    if (!manualText.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const book = await geminiService.processBookFile(manualText, 'text/plain', manualMeta.title || 'Untitled Manual Entry', llmConfig);
      onCommitBook(book);
      setActiveTab('registry');
      setManualText('');
      setManualMeta({ title: '', author: '' });
    } catch (e) {
      alert("Digitization failed: " + e);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateLlm = (field: keyof LLMConfig, value: any) => {
    onLlmConfigChange({ ...llmConfig, [field]: value });
  };

  return (
    <div className={`h-screen flex flex-col transition-colors duration-500 ${
      isDark ? 'bg-[#0a0a0a] text-gray-200' : 'bg-[#fafafa] text-gray-900'
    }`}>
      <header className={`px-8 py-6 border-b flex items-center justify-between ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white/60'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-black italic">{uiLanguage === 'zh' ? '馆员控制台' : 'Librarian Console'}</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">{uiLanguage === 'zh' ? '管理 / 维护 / 智能化协调' : 'Management / Maintenance / Intelligence'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full bg-current bg-opacity-5">
           <button 
             onClick={() => setActiveTab('registry')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'registry' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
           >
             {uiLanguage === 'zh' ? '典藏' : 'Registry'}
           </button>
           <button 
             onClick={() => setActiveTab('manual')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
           >
             {uiLanguage === 'zh' ? '数字化' : 'Digitizer'}
           </button>
           <button 
             onClick={() => setActiveTab('intelligence')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'intelligence' ? 'bg-emerald-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
           >
             {uiLanguage === 'zh' ? '智能' : 'Intelligence'}
           </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-8">
        {activeTab === 'registry' && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
             <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                { label: uiLanguage === 'zh' ? '总卷数' : 'Total Volumes', value: books.length },
                { label: uiLanguage === 'zh' ? '笔记记录数' : 'Note Records', value: Object.values(notesStorage).reduce((acc, curr) => acc + Object.keys(curr).length, 0) },
                { label: uiLanguage === 'zh' ? '智能引擎' : 'AI Engine', value: llmConfig.model.split('-')[2].toUpperCase() },
                { label: uiLanguage === 'zh' ? '状态' : 'Status', value: 'Synced' },
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                  <div className="text-[9px] font-black uppercase opacity-30 mb-1">{stat.label}</div>
                  <div className="text-xl font-mono font-bold">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className={`flex-1 overflow-y-auto rounded-3xl border ${isDark ? 'bg-black border-white/5' : 'bg-white border-black/5 shadow-inner'}`}>
              <table className="w-full text-left border-collapse">
                <thead className={`sticky top-0 z-10 ${isDark ? 'bg-[#111]' : 'bg-gray-50'}`}>
                  <tr>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest opacity-40 border-b border-current border-opacity-5">{uiLanguage === 'zh' ? 'ID / 卷名' : 'ID / Volume'}</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest opacity-40 border-b border-current border-opacity-5">{uiLanguage === 'zh' ? '作者' : 'Author'}</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest opacity-40 border-b border-current border-opacity-5">{uiLanguage === 'zh' ? '章节 / 笔记' : 'Chapters / Notes'}</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest opacity-40 border-b border-current border-opacity-5 text-right">{uiLanguage === 'zh' ? '操作' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-current divide-opacity-5">
                  {books.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center opacity-30 italic text-sm">{uiLanguage === 'zh' ? '注册表为空' : 'Registry is empty.'}</td>
                    </tr>
                  ) : (
                    books.map((book) => (
                      <tr key={book.id} className="group hover:bg-current hover:bg-opacity-[0.02] transition-colors">
                        <td className="p-4">
                          <div className="text-xs font-mono opacity-30 leading-none mb-1">#{book.id}</div>
                          <div className="text-sm font-bold">{book.title}</div>
                        </td>
                        <td className="p-4 text-xs opacity-60">{book.author}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                             <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold">{book.chapters.length} CH</span>
                             <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${Object.keys(notesStorage[book.id] || {}).length > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
                               {Object.keys(notesStorage[book.id] || {}).length} NOTES
                             </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => onDeleteBook(book.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="h-full flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex-1 flex flex-col space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase opacity-40">{uiLanguage === 'zh' ? '预定标题' : 'Planned Title'}</label>
                      <input 
                        className={`w-full p-4 rounded-xl border outline-none focus:ring-2 ring-indigo-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/5'}`}
                        placeholder="e.g. Meditations Vol 2"
                        value={manualMeta.title}
                        onChange={(e) => setManualMeta({...manualMeta, title: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase opacity-40">{uiLanguage === 'zh' ? '署名' : 'Attribution'}</label>
                      <input 
                        className={`w-full p-4 rounded-xl border outline-none focus:ring-2 ring-indigo-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/5'}`}
                        placeholder="e.g. Marcus Aurelius"
                        value={manualMeta.author}
                        onChange={(e) => setManualMeta({...manualMeta, author: e.target.value})}
                      />
                   </div>
                </div>
                <div className="flex-1 relative">
                   <textarea 
                     className={`w-full h-full p-6 rounded-3xl border outline-none resize-none font-serif text-lg leading-relaxed focus:ring-2 ring-indigo-500 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/10' : 'bg-white border-black/5 placeholder-black/10'}`}
                     placeholder={uiLanguage === 'zh' ? "粘贴原始文本..." : "Paste raw transcript text here..."}
                     value={manualText}
                     onChange={(e) => setManualText(e.target.value)}
                   />
                </div>
             </div>
             <aside className="w-80 flex flex-col justify-between">
                <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                   <h3 className="text-sm font-black uppercase tracking-widest">{uiLanguage === 'zh' ? '手动数字化' : 'Manual Scriptorium'}</h3>
                   <p className="text-xs opacity-60 leading-relaxed">
                     {uiLanguage === 'zh' ? '手动输入文本卷册。Gemini 将自动根据语义分割章节、提取关键元数据并完成馆藏收纳。' : 'Manually input volume text. Gemini will automatically split chapters by context, extract metadata, and commit it to your archive.'}
                   </p>
                </div>
                <button 
                  onClick={handleManualDigitize}
                  disabled={isProcessing || !manualText.trim()}
                  className={`w-full py-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
                    isProcessing || !manualText.trim() 
                    ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isProcessing ? 'Analyzing...' : (uiLanguage === 'zh' ? '开始数字化' : 'Begin Digitization')}
                </button>
             </aside>
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="max-w-4xl mx-auto w-full space-y-10">
                <section>
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-6">{uiLanguage === 'zh' ? '核心模型协调' : 'Core Model Orchestration'}</h3>
                   <div className="grid grid-cols-2 gap-6">
                      <button 
                        onClick={() => updateLlm('model', 'gemini-3-flash-preview')}
                        className={`p-6 rounded-3xl border text-left transition-all ${llmConfig.model === 'gemini-3-flash-preview' ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20' : 'border-current border-opacity-10 opacity-60 hover:opacity-100'}`}
                      >
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-black italic">Gemini 3 Flash</span>
                            <div className={`w-3 h-3 rounded-full ${llmConfig.model === 'gemini-3-flash-preview' ? 'bg-indigo-500 animate-pulse' : 'bg-current opacity-10'}`}></div>
                         </div>
                         <p className="text-[10px] leading-relaxed opacity-60">{uiLanguage === 'zh' ? '轻量且迅速。最适合基础转录、简单摘要和高速处理。' : 'Lightweight and exceptionally fast. Ideal for basic transcription and high-speed indexing.'}</p>
                      </button>
                      
                      <button 
                        onClick={() => updateLlm('model', 'gemini-3-pro-preview')}
                        className={`p-6 rounded-3xl border text-left transition-all ${llmConfig.model === 'gemini-3-pro-preview' ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20' : 'border-current border-opacity-10 opacity-60 hover:opacity-100'}`}
                      >
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-black italic">Gemini 3 Pro</span>
                            <div className={`w-3 h-3 rounded-full ${llmConfig.model === 'gemini-3-pro-preview' ? 'bg-emerald-500 animate-pulse' : 'bg-current opacity-10'}`}></div>
                         </div>
                         <p className="text-[10px] leading-relaxed opacity-60">{uiLanguage === 'zh' ? '深度推理与学术能力。支持思考预算、复杂分析和长文本理解。' : 'Deep reasoning and scholarly excellence. Supports thinking budgets and complex long-context analysis.'}</p>
                      </button>
                   </div>
                </section>

                <section className="grid grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-40">{uiLanguage === 'zh' ? '认知功能' : 'Cognitive Features'}</h3>
                      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'}`}>
                         <div className="flex items-center justify-between py-4">
                            <div>
                               <div className="text-xs font-bold">{uiLanguage === 'zh' ? '实时搜索落地' : 'Real-time Search Grounding'}</div>
                               <div className="text-[9px] opacity-40">{uiLanguage === 'zh' ? '启用 Google Search 验证学术观点' : 'Verify scholarly claims using live Google Search'}</div>
                            </div>
                            <button 
                              onClick={() => updateLlm('useSearch', !llmConfig.useSearch)}
                              className={`w-12 h-6 rounded-full transition-all relative ${llmConfig.useSearch ? 'bg-indigo-600' : 'bg-current opacity-10'}`}
                            >
                               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${llmConfig.useSearch ? 'left-7' : 'left-1'}`}></div>
                            </button>
                         </div>
                         <div className="h-px w-full bg-current opacity-5"></div>
                         <div className="flex items-center justify-between py-4">
                            <div>
                               <div className="text-xs font-bold">{uiLanguage === 'zh' ? '文明地图索引' : 'Civilization Mapping'}</div>
                               <div className="text-[9px] opacity-40">{uiLanguage === 'zh' ? '自动获取地理位置的文明上下文' : 'Contextualize locations via Google Maps'}</div>
                            </div>
                            <button 
                              onClick={() => updateLlm('useMaps', !llmConfig.useMaps)}
                              className={`w-12 h-6 rounded-full transition-all relative ${llmConfig.useMaps ? 'bg-indigo-600' : 'bg-current opacity-10'}`}
                            >
                               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${llmConfig.useMaps ? 'left-7' : 'left-1'}`}></div>
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-40">{uiLanguage === 'zh' ? '思考预算控制' : 'Reasoning Budget'}</h3>
                      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'}`}>
                         <div className="flex justify-between items-end mb-4">
                            <span className="text-[10px] font-black font-mono">{llmConfig.thinkingBudget} TOKENS</span>
                            <span className="text-[9px] opacity-40 uppercase tracking-widest">{uiLanguage === 'zh' ? '仅限 Pro 模型' : 'Pro Model Only'}</span>
                         </div>
                         <input 
                           type="range" min="0" max="32768" step="1024"
                           value={llmConfig.thinkingBudget}
                           disabled={llmConfig.model !== 'gemini-3-pro-preview'}
                           onChange={(e) => updateLlm('thinkingBudget', parseInt(e.target.value))}
                           className="w-full accent-emerald-500"
                         />
                         <p className="text-[9px] opacity-30 mt-4 leading-relaxed italic">
                           {uiLanguage === 'zh' ? '增加预算可以让模型在回答前进行更深入的逻辑推理。高预算会增加延迟。' : 'Higher budgets allow the model to engage in deeper logical sequences before outputting. Increases latency.'}
                         </p>
                      </div>
                   </div>
                </section>

                <div className={`p-4 rounded-xl border flex items-center justify-between border-indigo-500/30 bg-indigo-500/5`}>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{uiLanguage === 'zh' ? '引擎状态: 运行中' : 'Intelligence Status: Operational'}</span>
                   </div>
                   <div className="text-[10px] font-mono opacity-30">PROVIDER: GOOGLE GENAI SDK v1.34</div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
