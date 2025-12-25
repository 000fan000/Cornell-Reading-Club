
import React from 'react';
import { ReaderSettings, Theme } from '../types';

interface SettingsPanelProps {
  settings: ReaderSettings;
  theme: Theme;
  onSettingsChange: (settings: ReaderSettings) => void;
  onThemeChange: (theme: Theme) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  theme, 
  onSettingsChange, 
  onThemeChange, 
  onClose 
}) => {
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

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-[#1a1a1a] shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-xl font-bold">Reading Settings</h2>
        <button onClick={onClose} className="p-2 opacity-50 hover:opacity-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Themes Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Display Theme</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'light', label: 'Light', bg: 'bg-white', border: 'border-slate-200' },
              { id: 'sepia', label: 'Sepia', bg: 'bg-[#f4ecd8]', border: 'border-[#e0d6b6]' },
              { id: 'dark', label: 'Dark', bg: 'bg-[#121212]', border: 'border-[#333]' },
              { id: 'custom', label: 'Custom', bg: 'bg-gradient-to-tr from-indigo-500 to-purple-500', border: 'border-indigo-300' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id as Theme)}
                className={`flex flex-col items-center gap-1 group`}
              >
                <div className={`w-12 h-12 rounded-full ${t.bg} border-2 ${theme === t.id ? 'border-indigo-600 scale-110' : t.border} transition-all`} />
                <span className={`text-[10px] ${theme === t.id ? 'font-bold opacity-100' : 'opacity-60'}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {theme === 'custom' && (
          <section className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Custom Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase opacity-60 mb-1 block">Background</label>
                <input 
                  type="color" 
                  value={settings.backgroundColor} 
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-full h-8 rounded border-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase opacity-60 mb-1 block">Text</label>
                <input 
                  type="color" 
                  value={settings.textColor} 
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-full h-8 rounded border-none cursor-pointer"
                />
              </div>
            </div>
          </section>
        )}

        {/* Typography Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Typography</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Font Family</label>
              <select 
                value={settings.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm outline-none focus:ring-2 ring-indigo-500"
              >
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Font Size</label>
                <span>{settings.fontSize}px</span>
              </div>
              <input 
                type="range" min="12" max="48" step="1"
                value={settings.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Layout & Spacing</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Line Spacing</label>
                <span>{settings.lineHeight}</span>
              </div>
              <input 
                type="range" min="1" max="2.5" step="0.1"
                value={settings.lineHeight}
                onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Word Spacing</label>
                <span>{settings.wordSpacing}px</span>
              </div>
              <input 
                type="range" min="0" max="20" step="1"
                value={settings.wordSpacing}
                onChange={(e) => handleChange('wordSpacing', parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Paragraph Spacing</label>
                <span>{settings.paragraphSpacing}em</span>
              </div>
              <input 
                type="range" min="0.5" max="4" step="0.1"
                value={settings.paragraphSpacing}
                onChange={(e) => handleChange('paragraphSpacing', parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Letter Spacing</label>
                <span>{settings.letterSpacing}px</span>
              </div>
              <input 
                type="range" min="-2" max="10" step="0.5"
                value={settings.letterSpacing}
                onChange={(e) => handleChange('letterSpacing', parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Content Width</label>
                <span>{settings.maxWidth}px</span>
              </div>
              <input 
                type="range" min="400" max="1200" step="50"
                value={settings.maxWidth}
                onChange={(e) => handleChange('maxWidth', parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1a1a]">
        <button 
          onClick={() => onSettingsChange({
            fontSize: 18,
            fontFamily: '"Merriweather", serif',
            lineHeight: 1.6,
            letterSpacing: 0,
            wordSpacing: 0,
            paragraphSpacing: 1.5,
            backgroundColor: '#ffffff',
            textColor: '#1a1a1a',
            maxWidth: 800,
          })}
          className="w-full py-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
        >
          Reset to Default
        </button>
      </div>
    </aside>
  );
};

export default SettingsPanel;
