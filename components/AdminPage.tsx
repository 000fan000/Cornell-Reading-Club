
import React, { useState } from 'react';
import { ReaderBook, UserNotes, Theme, LLMConfig, SavedLLMConfig } from '../types';
import { geminiService } from '../services/gemini';

interface AdminPageProps {
  onBack: () => void;
  persistedBooks: Record<string, ReaderBook>;
  notesStorage: Record<string, Record<number, UserNotes>>;
  onDeleteBook: (id: string) => void;
  onCommitBook: (book: ReaderBook) => void;
  llmConfig: LLMConfig;
  onLlmConfigChange: (config: LLMConfig) => void;
  savedLLMs: SavedLLMConfig[];
  onSaveLLM: (name: string) => void;
  onDeleteLLM: (id: string) => void;
  theme: Theme;
  uiLanguage: 'en' | 'zh';
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  onBack, 
  persistedBooks, 
  notesStorage, 
  onDeleteBook, 
  onCommitBook, 
  llmConfig, 
  onLlmConfigChange, 
  savedLLMs,
  onSaveLLM,
  onDeleteLLM,
  theme, 
  uiLanguage 
}) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'manual' | 'intelligence'>('registry');
  const [manualText, setManualText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualMeta, setManualMeta] = useState({ title: '', author: '' });

  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const isDark = theme === 'dark' || theme === 'nord' || theme === 'mocha';
  const books = Object.values(persistedBooks) as ReaderBook[];

  const handleManualDigitize = async () => {
    if (!manualText.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const book = await geminiService.processBookFile(manualText, 'text/plain', manualMeta.title || 'Untitled Manual Entry', llmConfig);
      onCommitBook(book);
      setActiveTab('registry');
      setManualText('');
      setManualMeta({ title: '', author: '' });
    } catch (e: any) {
      alert("Digitization failed: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestApi = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await geminiService.testConnection(llmConfig);
      setTestResult({ success: true, message: res });
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveProfile = () => {
    if (!newProfileName.trim()) return;
    onSaveLLM(newProfileName);
    setNewProfileName('');
    alert(uiLanguage === 'zh' ? '引擎配置已保存' : 'Engine profile saved');
  };

  const updateLlm = (field: keyof LLMConfig, value: any) => {
    onLlmConfigChange({ ...llmConfig, [field]: value });
  };

  const activeProvider = (llmConfig?.provider || 'google').toUpperCase();

  return (
    <div className={`h-screen flex flex-col transition-colors duration-500 ${
      isDark ? 'bg-[#121212] text-gray-100' : 'bg-[#fafafa] text-gray-900'
    }`}>
      <header className={`px-8 py-6 border-b flex items-center justify-between ${isDark ? 'border-white/10 bg-[#1a1a1a]' : 'border-black/5 bg-white/60'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-indigo-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-black italic">{uiLanguage === 'zh' ? '馆员控制台' : 'Librarian Console'}</h1>
            <p className={`text-[10px] uppercase tracking-[0.3em] ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '管理 / 维护 / 智能化协调' : 'Management / Maintenance / Intelligence'}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 p-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
           <button 
             onClick={() => setActiveTab('registry')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
               activeTab === 'registry' 
                ? (isDark ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100') 
                : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900')
             }`}
           >
             {uiLanguage === 'zh' ? '典藏' : 'Registry'}
           </button>
           <button 
             onClick={() => setActiveTab('manual')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
               activeTab === 'manual' 
                ? (isDark ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100') 
                : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900')
             }`}
           >
             {uiLanguage === 'zh' ? '数字化' : 'Digitizer'}
           </button>
           <button 
             onClick={() => setActiveTab('intelligence')}
             className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
               activeTab === 'intelligence' 
                ? (isDark ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100') 
                : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900')
             }`}
           >
             {uiLanguage === 'zh' ? '智能' : 'Intelligence'}
           </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'registry' && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
             <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                { label: uiLanguage === 'zh' ? '总卷数' : 'Total Volumes', value: books.length },
                { label: uiLanguage === 'zh' ? '笔记记录数' : 'Note Records', value: (Object.values(notesStorage) as Record<number, UserNotes>[]).reduce((acc: number, curr) => acc + Object.keys(curr).length, 0) },
                { label: uiLanguage === 'zh' ? '当前供应商' : 'Active Provider', value: activeProvider },
                { label: uiLanguage === 'zh' ? '状态' : 'Status', value: 'Synced' },
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/5 shadow-sm'}`}>
                  <div className={`text-[9px] font-black uppercase mb-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{stat.label}</div>
                  <div className={`text-xl font-mono font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div className={`flex-1 overflow-y-auto rounded-3xl border ${isDark ? 'bg-[#181818] border-white/10' : 'bg-white border-black/5 shadow-inner'}`}>
              <table className="w-full text-left border-collapse">
                <thead className={`sticky top-0 z-10 ${isDark ? 'bg-[#222] border-b border-white/10' : 'bg-gray-50 border-b border-black/5'}`}>
                  <tr>
                    <th className={`p-4 text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? 'ID / 卷名' : 'ID / Volume'}</th>
                    <th className={`p-4 text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '作者' : 'Author'}</th>
                    <th className={`p-4 text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '章节 / 笔记' : 'Chapters / Notes'}</th>
                    <th className={`p-4 text-[9px] font-black uppercase tracking-widest text-right ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '操作' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-black/5'}`}>
                  {books.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-sm italic text-gray-500">{uiLanguage === 'zh' ? '注册表为空' : 'Registry is empty.'}</td>
                    </tr>
                  ) : (
                    books.map((book) => (
                      <tr key={book.id} className={`group transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                        <td className="p-4">
                          <div className={`text-xs font-mono mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>#{book.id}</div>
                          <div className={`text-sm font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{book.title}</div>
                        </td>
                        <td className={`p-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{book.author}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                             <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>{book.chapters.length} CH</span>
                             <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${Object.keys(notesStorage[book.id] || {}).length > 0 ? (isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600') : (isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400')}`}>
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
                      <label className={`text-[9px] font-black uppercase ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '预定标题' : 'Planned Title'}</label>
                      <input 
                        className={`w-full p-4 rounded-xl border outline-none focus:ring-2 ring-indigo-500 ${isDark ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-black/5 text-gray-900'}`}
                        placeholder="e.g. Meditations Vol 2"
                        value={manualMeta.title}
                        onChange={(e) => setManualMeta({...manualMeta, title: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className={`text-[9px] font-black uppercase ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '署名' : 'Attribution'}</label>
                      <input 
                        className={`w-full p-4 rounded-xl border outline-none focus:ring-2 ring-indigo-500 ${isDark ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-black/5 text-gray-900'}`}
                        placeholder="e.g. Marcus Aurelius"
                        value={manualMeta.author}
                        onChange={(e) => setManualMeta({...manualMeta, author: e.target.value})}
                      />
                   </div>
                </div>
                <div className="flex-1 relative">
                   <textarea 
                     className={`w-full h-full p-6 rounded-3xl border outline-none resize-none font-serif text-lg leading-relaxed focus:ring-2 ring-indigo-500 ${isDark ? 'bg-[#181818] border-white/10 text-white placeholder-gray-600' : 'bg-white border-black/5 text-gray-900 placeholder-gray-300'}`}
                     placeholder={uiLanguage === 'zh' ? "粘贴原始文本..." : "Paste raw transcript text here..."}
                     value={manualText}
                     onChange={(e) => setManualText(e.target.value)}
                   />
                </div>
             </div>
             <aside className="w-80 flex flex-col justify-between">
                <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-indigo-900/40 border-indigo-500/40' : 'bg-indigo-50 border-indigo-100'}`}>
                   <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>{uiLanguage === 'zh' ? '手动数字化' : 'Manual Scriptorium'}</h3>
                   <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                     {uiLanguage === 'zh' ? '手动输入文本卷册。AI 将自动根据语义分割章节、提取关键元数据并完成馆藏收纳。' : 'Manually input volume text. AI will automatically split chapters by context, extract metadata, and commit it to your archive.'}
                   </p>
                </div>
                <button 
                  onClick={handleManualDigitize}
                  disabled={isProcessing || !manualText.trim()}
                  className={`w-full py-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
                    isProcessing || !manualText.trim() 
                    ? (isDark ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                    : 'bg-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isProcessing ? 'Analyzing...' : (uiLanguage === 'zh' ? '开始数字化' : 'Begin Digitization')}
                </button>
             </aside>
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
             <div className="max-w-4xl mx-auto w-full space-y-12">
                
                {/* Provider Toggle Section */}
                <section>
                   <h3 className={`text-xs font-black uppercase tracking-[0.4em] mb-6 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '核心提供商协调' : 'Core Provider Orchestration'}</h3>
                   <div className={`grid grid-cols-2 gap-4 p-2 rounded-3xl ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                      <button 
                        onClick={() => updateLlm('provider', 'google')}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          llmConfig.provider === 'google' 
                            ? (isDark ? 'bg-[#181818] border border-white/20 shadow-lg text-white' : 'bg-white border border-indigo-100 shadow-md text-indigo-700') 
                            : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900')
                        }`}
                      >
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${isDark ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}>G</div>
                         <div className="text-left">
                           <div className="text-sm font-black">Google Gemini</div>
                           <div className="text-[10px] opacity-60 italic">{uiLanguage === 'zh' ? '原生 SDK 集成' : 'Native SDK Integration'}</div>
                         </div>
                      </button>
                      <button 
                        onClick={() => updateLlm('provider', 'openai-compatible')}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          llmConfig.provider === 'openai-compatible' 
                            ? (isDark ? 'bg-[#181818] border border-white/20 shadow-lg text-white' : 'bg-white border border-indigo-100 shadow-md text-indigo-700') 
                            : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900')
                        }`}
                      >
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${isDark ? 'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>O</div>
                         <div className="text-left">
                           <div className="text-sm font-black">OpenAI Bridge</div>
                           <div className="text-[10px] opacity-60 italic">{uiLanguage === 'zh' ? '第三方 API 支持' : '3rd Party API Bridge'}</div>
                         </div>
                      </button>
                   </div>
                </section>

                {/* Main Configuration Section */}
                <section className="space-y-8">
                  {llmConfig.provider === 'google' ? (
                    <div className="animate-in fade-in duration-500 space-y-8">
                       <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? 'Gemini 引擎配置' : 'Gemini Engine Options'}</h4>
                       <div className="grid grid-cols-2 gap-6">
                          <button 
                            onClick={() => updateLlm('model', 'gemini-3-flash-preview')}
                            className={`p-6 rounded-3xl border text-left transition-all ${
                              llmConfig.model === 'gemini-3-flash-preview' 
                                ? (isDark ? 'border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/20 text-white' : 'border-emerald-200 bg-emerald-50 ring-2 ring-emerald-100 text-emerald-900') 
                                : (isDark ? 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/30' : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300')
                            }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-black italic ${llmConfig.model === 'gemini-3-flash-preview' ? (isDark ? 'text-emerald-300' : 'text-emerald-600') : ''}`}>Gemini 3 Flash</span>
                                <div className={`w-2 h-2 rounded-full ${llmConfig.model === 'gemini-3-flash-preview' ? 'bg-emerald-500 animate-pulse' : 'bg-current opacity-20'}`}></div>
                             </div>
                             <p className={`text-[10px] leading-relaxed font-mono tracking-tighter ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>ID: gemini-3-flash-preview</p>
                             <p className={`text-[10px] leading-relaxed mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{uiLanguage === 'zh' ? '轻量且迅速。最适合基础转录、简单摘要和高速处理。' : 'Lightweight and exceptionally fast. Ideal for basic transcription and indexing.'}</p>
                          </button>
                          
                          <button 
                            onClick={() => updateLlm('model', 'gemini-3-pro-preview')}
                            className={`p-6 rounded-3xl border text-left transition-all ${
                              llmConfig.model === 'gemini-3-pro-preview' 
                                ? (isDark ? 'border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/20 text-white' : 'border-emerald-200 bg-emerald-50 ring-2 ring-emerald-100 text-emerald-900') 
                                : (isDark ? 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/30' : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300')
                            }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-black italic ${llmConfig.model === 'gemini-3-pro-preview' ? (isDark ? 'text-emerald-300' : 'text-emerald-600') : ''}`}>Gemini 3 Pro</span>
                                <div className={`w-2 h-2 rounded-full ${llmConfig.model === 'gemini-3-pro-preview' ? 'bg-emerald-500 animate-pulse' : 'bg-current opacity-20'}`}></div>
                             </div>
                             <p className={`text-[10px] leading-relaxed font-mono tracking-tighter ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>ID: gemini-3-pro-preview</p>
                             <p className={`text-[10px] leading-relaxed mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{uiLanguage === 'zh' ? '深度推理与学术能力。支持思考预算、复杂分析。' : 'Deep reasoning and scholarly excellence. Supports thinking budgets.'}</p>
                          </button>

                          <button 
                            onClick={() => updateLlm('model', 'gemini-flash-lite-latest')}
                            className={`p-6 rounded-3xl border text-left transition-all ${
                              llmConfig.model === 'gemini-flash-lite-latest' 
                                ? (isDark ? 'border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/20 text-white' : 'border-emerald-200 bg-emerald-50 ring-2 ring-emerald-100 text-emerald-900') 
                                : (isDark ? 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/30' : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300')
                            }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-black italic ${llmConfig.model === 'gemini-flash-lite-latest' ? (isDark ? 'text-emerald-300' : 'text-emerald-600') : ''}`}>Gemini Flash Lite</span>
                                <div className={`w-2 h-2 rounded-full ${llmConfig.model === 'gemini-flash-lite-latest' ? 'bg-emerald-500 animate-pulse' : 'bg-current opacity-20'}`}></div>
                             </div>
                             <p className={`text-[10px] leading-relaxed font-mono tracking-tighter ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>ID: gemini-flash-lite-latest</p>
                             <p className={`text-[10px] leading-relaxed mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{uiLanguage === 'zh' ? '极致效率。适合超大规模文档的快速初步索引。' : 'Extreme efficiency. Ideal for ultra-fast preliminary indexing.'}</p>
                          </button>
                       </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-500 space-y-8">
                       <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '桥接参数' : 'Bridge Parameters'}</h4>
                       <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#181818] border-white/10 shadow-xl' : 'bg-white border-gray-100 shadow-sm'}`}>
                          <div className="grid grid-cols-1 gap-6">
                             <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase ml-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? 'API 接口地址' : 'API Base URL'}</label>
                                <input 
                                  className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 ring-indigo-500 ${isDark ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                                  placeholder="https://api.openai.com/v1"
                                  value={llmConfig.openaiApiUrl || ''}
                                  onChange={(e) => updateLlm('openaiApiUrl', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase ml-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? 'Bearer 令牌 / Token' : 'Bearer Token / API Key'}</label>
                                <input 
                                  type="password"
                                  className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 ring-indigo-500 ${isDark ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                                  placeholder="sk-..."
                                  value={llmConfig.openaiApiKey || ''}
                                  onChange={(e) => updateLlm('openaiApiKey', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase ml-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '指定模型 ID' : 'Model Identifier'}</label>
                                <input 
                                  className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 ring-indigo-500 ${isDark ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                                  placeholder="gpt-4o or deepseek-chat"
                                  value={llmConfig.openaiModel || ''}
                                  onChange={(e) => updateLlm('openaiModel', e.target.value)}
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Actions Bar (Test and Save) */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={handleTestApi}
                         disabled={isTesting}
                         className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${
                           isDark ? 'border-white/10 text-white hover:bg-white/10' : 'border-gray-100 text-gray-700 hover:bg-gray-50'
                         }`}
                       >
                          {isTesting ? (
                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          )}
                          {uiLanguage === 'zh' ? '测试连接' : 'Test Connection'}
                       </button>

                       <div className="flex-[2] flex gap-2">
                          <input 
                            className={`flex-1 px-4 py-4 rounded-2xl border outline-none focus:ring-2 ring-emerald-500 text-xs ${isDark ? 'bg-[#181818] border-white/10 text-white placeholder-gray-600' : 'bg-white border-gray-100 text-gray-900 placeholder-gray-300'}`}
                            placeholder={uiLanguage === 'zh' ? '输入配置名称保存...' : 'Enter profile name to save...'}
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                          />
                          <button 
                            onClick={handleSaveProfile}
                            disabled={!newProfileName.trim()}
                            className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                              !newProfileName.trim() ? (isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed') : 'bg-emerald-600 text-white hover:scale-[1.02]'
                            }`}
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                             {uiLanguage === 'zh' ? '保存配置' : 'Save Engine'}
                          </button>
                       </div>
                    </div>

                    {testResult && (
                       <div className={`p-4 rounded-xl animate-in slide-in-from-top-2 duration-300 border ${
                         testResult.success ? (isDark ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-100 text-emerald-700') : (isDark ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-100 text-red-700')
                       }`}>
                          <div className="text-[10px] font-black uppercase mb-1">{testResult.success ? 'TEST SUCCESSFUL' : 'TEST FAILED'}</div>
                          <div className="text-xs font-mono break-all">{testResult.message}</div>
                       </div>
                    )}
                  </div>
                </section>

                {/* Saved Profiles List */}
                {savedLLMs.length > 0 && (
                   <section className="space-y-6">
                      <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '已存引擎列表' : 'Saved AI Engines'}</h4>
                      <div className="grid grid-cols-3 gap-4">
                         {savedLLMs.map((profile) => (
                            <div key={profile.id} className={`p-4 rounded-2xl border flex flex-col justify-between group transition-all ${
                              JSON.stringify(llmConfig) === JSON.stringify(profile.config) 
                              ? (isDark ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'border-emerald-300 bg-emerald-50 shadow-md') 
                              : (isDark ? 'border-white/10 bg-white/5 hover:border-white/30 text-gray-300' : 'border-gray-100 bg-white hover:border-indigo-100 text-gray-500')
                            }`}>
                               <div className="flex justify-between items-start mb-4">
                                  <div onClick={() => onLlmConfigChange(profile.config)} className="cursor-pointer">
                                     <div className={`text-sm font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{profile.name}</div>
                                     <div className={`text-[9px] uppercase font-black ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{profile.config.provider} / {profile.config.model.split('/').pop()}</div>
                                  </div>
                                  <button 
                                    onClick={() => onDeleteLLM(profile.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-500 hover:text-white text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                               </div>
                               <button 
                                 onClick={() => onLlmConfigChange(profile.config)}
                                 className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                   JSON.stringify(llmConfig) === JSON.stringify(profile.config) 
                                   ? 'bg-emerald-600 text-white shadow-lg' 
                                   : (isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
                                 }`}
                               >
                                  {JSON.stringify(llmConfig) === JSON.stringify(profile.config) ? (uiLanguage === 'zh' ? '当前使用中' : 'Active') : (uiLanguage === 'zh' ? '激活' : 'Activate')}
                               </button>
                            </div>
                         ))}
                      </div>
                   </section>
                )}

                {/* Cognitive Features Section */}
                {llmConfig.provider === 'google' && (
                  <section className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h3 className={`text-xs font-black uppercase tracking-[0.4em] ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '认知功能' : 'Cognitive Features'}</h3>
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between py-4">
                              <div>
                                  <div className="text-xs font-bold">{uiLanguage === 'zh' ? '实时搜索落地' : 'Real-time Search Grounding'}</div>
                                  <div className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{uiLanguage === 'zh' ? '启用 Google Search 验证学术观点' : 'Verify claims via live Google Search'}</div>
                              </div>
                              <button onClick={() => updateLlm('useSearch', !llmConfig.useSearch)} className={`w-12 h-6 rounded-full transition-all relative ${llmConfig.useSearch ? (isDark ? 'bg-emerald-500' : 'bg-emerald-600') : (isDark ? 'bg-white/10' : 'bg-gray-100')}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${llmConfig.useSearch ? 'left-7' : 'left-1'}`}></div></button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className={`text-xs font-black uppercase tracking-[0.4em] ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '思考预算' : 'Reasoning Budget'}</h3>
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="flex justify-between items-end mb-4"><span className={`text-[10px] font-black font-mono ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{llmConfig.thinkingBudget} TOKENS</span></div>
                            <input type="range" min="0" max="32768" step="1024" value={llmConfig.thinkingBudget} disabled={!llmConfig.model.includes('pro') && !llmConfig.model.includes('gemini-3')} onChange={(e) => updateLlm('thinkingBudget', parseInt(e.target.value))} className="w-full accent-emerald-500" />
                            <p className={`text-[9px] mt-4 italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{uiLanguage === 'zh' ? '高预算可以增加深度但会增加延迟。' : 'Higher budgets increase depth but add latency.'}</p>
                        </div>
                    </div>
                  </section>
                )}

                <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300 shadow-lg shadow-emerald-500/5' : 'border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full animate-ping ${llmConfig.provider === 'google' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                        {uiLanguage === 'zh' ? `引擎就绪: ${activeProvider}` : `Intelligence Status: ${activeProvider}`}
                      </span>
                   </div>
                   <div className="text-[10px] font-mono opacity-30">CORE VERSION 1.36.0-BETA</div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
