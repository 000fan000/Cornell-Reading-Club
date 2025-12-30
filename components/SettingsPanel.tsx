
import React, { useState } from 'react';
import { ReaderSettings, Theme, SavedTheme } from '../types';

interface SettingsPanelProps {
  settings: ReaderSettings;
  theme: Theme;
  savedThemes: SavedTheme[];
  onSettingsChange: (settings: ReaderSettings) => void;
  onThemeChange: (theme: Theme) => void;
  onSaveTheme: (name: string) => void;
  onDeleteTheme: (id: string) => void;
  onClose: () => void;
  uiLanguage: 'en' | 'zh';
}

const PRESET_THEMES = [
  { id: 'light', name: 'Cloud', bg: '#ffffff', text: '#1a1a1a' },
  { id: 'dark', name: 'Midnight', bg: '#121212', text: '#e5e5e5' },
  { id: 'sepia', name: 'Parchment', bg: '#f4ecd8', text: '#5b4636' },
  { id: 'nord', name: 'Nord', bg: '#2e3440', text: '#d8dee9' },
  { id: 'solarized', name: 'Solarized', bg: '#fdf6e3', text: '#657b83' },
  { id: 'matcha', name: 'Matcha', bg: '#f0f4ef', text: '#3d4e3d' },
  { id: 'mocha', name: 'Mocha', bg: '#1e1e2e', text: '#cdd6f4' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  theme, 
  savedThemes,
  onSettingsChange, 
  onThemeChange, 
  onSaveTheme,
  onDeleteTheme,
  onClose,
  uiLanguage
}) => {
  const [newThemeName, setNewThemeName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isDarkMode = theme === 'dark' || theme === 'nord' || theme === 'mocha';

  const handleChange = (key: keyof ReaderSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const fonts = [
    { name: 'System Sans', value: 'ui-sans-serif, system-ui, sans-serif' },
    { name: 'Inter', value: '"Inter", sans-serif' },
    { name: 'Merriweather', value: '"Merriweather", serif' },
    { name: 'Noto Serif SC', value: '"Noto Serif SC", serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Monospace', value: 'ui-monospace, monospace' },
  ];

  const handleApplyPreset = (preset: typeof PRESET_THEMES[0]) => {
    onThemeChange(preset.id);
    onSettingsChange({
      ...settings,
      backgroundColor: preset.bg,
      textColor: preset.text,
    });
  };

  const handleApplySaved = (saved: SavedTheme) => {
    onThemeChange(saved.id);
    onSettingsChange(saved.settings);
  };

  const t = {
    title: uiLanguage === 'zh' ? '阅读设置' : 'Reader Settings',
    preset: uiLanguage === 'zh' ? '预设主题' : 'Preset Gallery',
    yourThemes: uiLanguage === 'zh' ? '我的主题' : 'Your Themes',
    saveCurrent: uiLanguage === 'zh' ? '+ 保存当前' : '+ Save Current',
    noThemes: uiLanguage === 'zh' ? '尚无自定义主题' : 'No custom themes saved yet.',
    fineTuning: uiLanguage === 'zh' ? '色彩微调' : 'Fine-tuning',
    pageColor: uiLanguage === 'zh' ? '背景颜色' : 'Page Color',
    inkColor: uiLanguage === 'zh' ? '字体颜色' : 'Ink Color',
    typography: uiLanguage === 'zh' ? '排版设置' : 'Typography',
    fontFamily: uiLanguage === 'zh' ? '字体系列' : 'Font Family',
    textSize: uiLanguage === 'zh' ? '字号大小' : 'Text Size',
    layout: uiLanguage === 'zh' ? '布局与流转' : 'Layout & Flow',
    lineSpacing: uiLanguage === 'zh' ? '行间距' : 'Line Spacing',
    paraGap: uiLanguage === 'zh' ? '段落间距' : 'Paragraph Gap',
    width: uiLanguage === 'zh' ? '阅读宽度' : 'Readable Width',
    reset: uiLanguage === 'zh' ? '重置为默认值' : 'Reset to Defaults'
  };

  return (
    <aside className={`fixed right-0 top-0 bottom-0 w-80 shadow-2xl z-50 flex flex-col border-l animate-in slide-in-from-right duration-300 ${
      isDarkMode ? 'bg-[#1a1a1a] text-gray-200 border-slate-800' : 'bg-white text-gray-900 border-slate-200'
    }`}>
      <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <h2 className="text-xl font-bold">{t.title}</h2>
        <button onClick={onClose} className="p-2 opacity-50 hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        {/* Preset Gallery */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">{t.preset}</h3>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="flex flex-col items-center gap-1 group"
                title={preset.name}
              >
                <div 
                  className={`w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden shadow-sm ${
                    theme === preset.id ? 'border-indigo-600 scale-110 ring-2 ring-indigo-600 ring-offset-2' : isDarkMode ? 'border-slate-800' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: preset.bg }}
                >
                  <span style={{ color: preset.text }} className="text-xs font-serif font-bold">Aa</span>
                </div>
                <span className={`text-[10px] truncate w-full text-center ${theme === preset.id ? 'font-bold text-indigo-600' : 'opacity-60'}`}>
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Saved Themes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">{t.yourThemes}</h3>
            {!isSaving ? (
              <button 
                onClick={() => setIsSaving(true)}
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline"
              >
                {t.saveCurrent}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                 <input 
                  autoFocus
                  className={`text-[10px] border-none rounded px-2 py-1 outline-none w-24 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                  placeholder="..."
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newThemeName) {
                      onSaveTheme(newThemeName);
                      setNewThemeName('');
                      setIsSaving(false);
                    }
                  }}
                />
                <button onClick={() => setIsSaving(false)} className="text-[10px] opacity-40">✕</button>
              </div>
            )}
          </div>
          
          {savedThemes.length === 0 ? (
            <p className="text-[10px] italic opacity-30 text-center py-2">{t.noThemes}</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {savedThemes.map((saved) => (
                <div key={saved.id} className="relative group">
                  <button
                    onClick={() => handleApplySaved(saved)}
                    className="flex flex-col items-center gap-1 w-full"
                  >
                    <div 
                      className={`w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden shadow-sm ${
                        theme === saved.id ? 'border-indigo-600 scale-110' : isDarkMode ? 'border-slate-800' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: saved.settings.backgroundColor }}
                    >
                      <span style={{ color: saved.settings.textColor }} className="text-xs font-serif font-bold">Aa</span>
                    </div>
                    <span className={`text-[10px] truncate w-full text-center ${theme === saved.id ? 'font-bold text-indigo-600' : 'opacity-60'}`}>
                      {saved.name}
                    </span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteTheme(saved.id); }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Color Fine-tuning */}
        <section className={`space-y-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">{t.fineTuning}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase opacity-60 mb-1 block">{t.pageColor}</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={settings.backgroundColor} 
                  onChange={(e) => {
                    handleChange('backgroundColor', e.target.value);
                    onThemeChange('custom');
                  }}
                  className="w-10 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono opacity-40">{settings.backgroundColor}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase opacity-60 mb-1 block">{t.inkColor}</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={settings.textColor} 
                  onChange={(e) => {
                    handleChange('textColor', e.target.value);
                    onThemeChange('custom');
                  }}
                  className="w-10 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono opacity-40">{settings.textColor}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">{t.typography}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t.fontFamily}</label>
              <select 
                value={settings.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 ring-indigo-500 ${isDarkMode ? 'bg-[#252525] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
              >
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>{t.textSize}</label>
                <span>{settings.fontSize}px</span>
              </div>
              <input 
                type="range" min="12" max="48" step="1"
                value={settings.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="space-y-6 pb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">{t.layout}</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>{t.lineSpacing}</label>
                <span>{settings.lineHeight}</span>
              </div>
              <input 
                type="range" min="1" max="3" step="0.1"
                value={settings.lineHeight}
                onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>{t.paraGap}</label>
                <span>{settings.paragraphSpacing}em</span>
              </div>
              <input 
                type="range" min="0.5" max="5" step="0.1"
                value={settings.paragraphSpacing}
                onChange={(e) => handleChange('paragraphSpacing', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>{t.width}</label>
                <span>{settings.maxWidth}px</span>
              </div>
              <input 
                type="range" min="300" max="1400" step="50"
                value={settings.maxWidth}
                onChange={(e) => handleChange('maxWidth', parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </section>
      </div>

      <div className={`p-6 border-t ${isDarkMode ? 'border-slate-800 bg-[#1a1a1a]' : 'border-slate-100 bg-slate-50'}`}>
        <button 
          onClick={() => {
            onThemeChange('light');
            onSettingsChange({
              fontSize: 18,
              fontFamily: '"Merriweather", serif',
              lineHeight: 1.6,
              letterSpacing: 0,
              wordSpacing: 0,
              paragraphSpacing: 1.5,
              backgroundColor: '#ffffff',
              textColor: '#1a1a1a',
              maxWidth: 800,
            });
          }}
          className="w-full py-2.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
        >
          {t.reset}
        </button>
      </div>
    </aside>
  );
};

export default SettingsPanel;
