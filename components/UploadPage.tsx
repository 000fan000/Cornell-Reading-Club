
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/gemini';
import { ReaderBook, Theme, LLMConfig } from '../types';

interface UploadPageProps {
  onBack: () => void;
  onCommit: (book: ReaderBook) => void;
  theme: Theme;
  uiLanguage: 'en' | 'zh';
  llmConfig: LLMConfig;
}

type UploadStep = 'idle' | 'processing' | 'review';

const UploadPage: React.FC<UploadPageProps> = ({ onBack, onCommit, theme, uiLanguage, llmConfig }) => {
  const [step, setStep] = useState<UploadStep>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [processedBook, setProcessedBook] = useState<ReaderBook | null>(null);
  const [debugData, setDebugData] = useState<{ prompt: string; rawResponse: string } | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDarkMode = theme === 'dark' || theme === 'nord' || theme === 'mocha';

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleFile = async (file: File) => {
    setStep('processing');
    setLogs([]);
    addLog(uiLanguage === 'zh' ? `启动数字化流程：${file.name}` : `Initiating digitization for: ${file.name}`);
    
    try {
      const fileReader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        fileReader.onload = () => {
          const res = fileReader.result as string;
          resolve(file.type === 'application/pdf' ? res.split(',')[1] : res);
        };
        fileReader.onerror = reject;
        if (file.type === 'application/pdf') fileReader.readAsDataURL(file);
        else fileReader.readAsText(file);
      });

      addLog(uiLanguage === 'zh' ? `文件读取成功 (${(file.size / 1024).toFixed(1)} KB)。正在传输至 ${llmConfig.model}...` : `File read successful. Transmitting to ${llmConfig.model}...`);
      
      await new Promise(r => setTimeout(r, 800));

      const book = await geminiService.processBookFile(fileData, file.type, file.name, llmConfig);
      
      addLog(uiLanguage === 'zh' ? `数字化完成。元数据已提取。` : `Digitization complete. Metadata extracted.`);
      setProcessedBook(book);
      
      setDebugData({
        prompt: `System: Digital Librarian\nTask: Structured JSON Extraction\nEngine: ${llmConfig.model}`,
        rawResponse: JSON.stringify(book, null, 2)
      });

      setStep('review');
    } catch (error) {
      addLog(uiLanguage === 'zh' ? `错误：${error instanceof Error ? error.message : '转录过程中发生未知错误'}` : `ERROR: ${error instanceof Error ? error.message : 'Unknown failure'}`);
      console.error(error);
    }
  };

  return (
    <div className={`h-screen flex flex-col font-serif transition-colors duration-500 ${
      isDarkMode ? 'bg-[#0f0f0f] text-gray-200' : 'bg-[#fcfbf9] text-[#2c241e]'
    }`}>
      <header className={`px-8 py-6 border-b flex items-center justify-between ${
        isDarkMode ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white/40'
      }`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-black italic">{uiLanguage === 'zh' ? '数字化实验室' : 'Digitization Lab'}</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">
              {uiLanguage === 'zh' ? '人类迷宫 / 卷册获取' : 'Humanity\'s Labyrinth / Volume Acquisition'}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col items-center justify-center p-8">
        {step === 'idle' && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            className={`w-full max-w-2xl aspect-[16/9] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.01] group ${
              isDarkMode ? 'border-white/10 hover:border-amber-400/50 bg-white/5' : 'border-black/10 hover:border-indigo-600/50 bg-black/5'
            }`}
          >
            <div className="p-6 rounded-full bg-current bg-opacity-5 mb-6 group-hover:animate-float">
              <svg className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {uiLanguage === 'zh' ? '收纳新卷' : 'Acquire New Volume'}
            </h2>
            <p className="text-sm opacity-50 max-w-sm text-center px-4">
              {uiLanguage === 'zh' ? '上传 PDF 或 TXT 手稿。Gemini 将对文本进行索引、转录并验证。' : 'Upload a PDF or TXT manuscript. Gemini will index, transcribe, and verify the text for the library.'}
            </p>
            <input ref={fileInputRef} type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        )}

        {step === 'processing' && (
          <div className="w-full max-w-3xl flex flex-col space-y-8 animate-in fade-in zoom-in duration-500">
             <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                   <div className="w-20 h-20 border-2 border-current border-t-transparent rounded-full animate-spin opacity-20"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 opacity-40 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                   </div>
                </div>
                <h2 className="text-3xl font-black tracking-tight italic">
                  {uiLanguage === 'zh' ? '卷册数字化中...' : 'Digitizing Volume...'}
                </h2>
             </div>
             
             <div className={`p-6 rounded-2xl h-64 overflow-y-auto font-mono text-xs space-y-2 border ${
               isDarkMode ? 'bg-black border-white/10 text-emerald-400' : 'bg-slate-900 border-black/10 text-emerald-400 shadow-xl'
             }`}>
                {logs.map((log, i) => <div key={i} className="animate-in slide-in-from-left duration-300">{log}</div>)}
                <div className="animate-pulse">_</div>
             </div>
          </div>
        )}

        {step === 'review' && processedBook && (
          <div className="w-full max-w-5xl flex gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex-1 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar pr-4">
                <section>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 block">
                     {uiLanguage === 'zh' ? '提取结果' : 'Extraction Results'}
                   </span>
                   <div className={`p-8 rounded-3xl border shadow-sm ${
                     isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'
                   }`}>
                      <div className="grid grid-cols-2 gap-12">
                         <div className="space-y-6">
                            <div>
                               <label className="text-[9px] font-black uppercase opacity-30 block mb-1">
                                 {uiLanguage === 'zh' ? '标题' : 'Title'}
                               </label>
                               <input 
                                 className="w-full bg-transparent text-2xl font-black outline-none border-b border-transparent focus:border-current"
                                 value={processedBook.title}
                                 onChange={(e) => setProcessedBook({...processedBook, title: e.target.value})}
                               />
                            </div>
                            <div>
                               <label className="text-[9px] font-black uppercase opacity-30 block mb-1">
                                 {uiLanguage === 'zh' ? '作者' : 'Author'}
                               </label>
                               <input 
                                 className="w-full bg-transparent text-lg font-bold outline-none border-b border-transparent focus:border-current"
                                 value={processedBook.author}
                                 onChange={(e) => setProcessedBook({...processedBook, author: e.target.value})}
                               />
                            </div>
                            <div className="pt-4 flex flex-wrap gap-2">
                               {processedBook.library_card?.thematic_tags.map(t => (
                                 <span key={t.tag} className="px-3 py-1 rounded-lg bg-current bg-opacity-5 text-[10px] font-bold">#{t.tag}</span>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[9px] font-black uppercase opacity-30 block">
                              {uiLanguage === 'zh' ? '章节结构' : 'Chapter Structure'}
                            </label>
                            <div className="space-y-2">
                               {processedBook.chapters.map(ch => (
                                 <div key={ch.chapter_number} className="flex items-center gap-3 p-3 rounded-xl bg-current bg-opacity-[0.02] border border-current border-opacity-[0.03]">
                                    <span className="text-xs font-black opacity-30">0{ch.chapter_number}</span>
                                    <span className="text-xs font-bold truncate">{ch.chapter_title}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </section>

                {showDebug && debugData && (
                  <section className="animate-in slide-in-from-top-4 duration-300">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 block text-amber-500">
                      {uiLanguage === 'zh' ? '调试工坊 (Gemini 响应)' : 'Debug Forge (Gemini Response)'}
                    </span>
                    <div className="grid grid-cols-2 gap-4 h-96">
                       <div className={`p-4 rounded-xl font-mono text-[10px] overflow-auto border ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-900 text-white border-black/5'}`}>
                          <div className="opacity-40 mb-2">// {uiLanguage === 'zh' ? '提取提示词' : 'Extraction Prompt'}</div>
                          {debugData.prompt}
                       </div>
                       <div className={`p-4 rounded-xl font-mono text-[10px] overflow-auto border ${isDarkMode ? 'bg-black border-white/10 text-emerald-400' : 'bg-slate-900 text-emerald-400 border-black/5'}`}>
                          <div className="opacity-40 mb-2">// {uiLanguage === 'zh' ? '原始 JSON 响应' : 'Raw JSON Response'}</div>
                          {debugData.rawResponse}
                       </div>
                    </div>
                  </section>
                )}
             </div>

             <aside className="w-80 space-y-6 flex-shrink-0">
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-amber-400 text-black border-transparent' : 'bg-indigo-600 text-white border-transparent'}`}>
                   <h3 className="text-lg font-black mb-2">
                     {uiLanguage === 'zh' ? '数字化就绪' : 'Digitization Ready'}
                   </h3>
                   <p className="text-xs opacity-80 leading-relaxed mb-6">
                     {uiLanguage === 'zh' ? 'AI 已成功将手稿映射至图书馆架构。请核对章节并收录至永久馆藏。' : 'The AI has successfully mapped the manuscript into our library schema. Review the chapters and commit to the permanent collection.'}
                   </p>
                   <button 
                     onClick={() => onCommit(processedBook)}
                     className="w-full py-4 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                   >
                     {uiLanguage === 'zh' ? '收录至图书馆' : 'Commit to Library'}
                   </button>
                </div>
                <button 
                  onClick={() => setShowDebug(!showDebug)}
                  className={`w-full py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
                  }`}
                >
                  {showDebug ? (uiLanguage === 'zh' ? '隐藏调试工坊' : 'Hide Debug Forge') : (uiLanguage === 'zh' ? '开启调试工坊' : 'Open Debug Forge')}
                </button>
                <button 
                  onClick={() => setStep('idle')}
                  className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all"
                >
                  {uiLanguage === 'zh' ? '舍弃并重试' : 'Discard & Retry'}
                </button>
             </aside>
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default UploadPage;
