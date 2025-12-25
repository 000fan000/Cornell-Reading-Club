
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
  onClose 
}) => {
  const [newThemeName, setNewThemeName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-[#1a1a1a] shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-xl font-bold">Reader Settings</h2>
        <button onClick={onClose} className="p-2 opacity-50 hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        {/* Preset Gallery */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Preset Gallery</h3>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleApplyPreset(t)}
                className="flex flex-col items-center gap-1 group"
                title={t.name}
              >
                <div 
                  className={`w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden shadow-sm ${
                    theme === t.id ? 'border-indigo-600 scale-110 ring-2 ring-indigo-600 ring-offset-2 ring-offset-white dark:ring-offset-[#1a1a1a]' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  style={{ backgroundColor: t.bg }}
                >
                  <span style={{ color: t.text }} className="text-xs font-serif font-bold">Aa</span>
                </div>
                <span className={`text-[10px] truncate w-full text-center ${theme === t.id ? 'font-bold text-indigo-600' : 'opacity-60'}`}>
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Saved Themes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Your Themes</h3>
            {!isSaving ? (
              <button 
                onClick={() => setIsSaving(true)}
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline"
              >
                + Save Current
              </button>
            ) : (
              <div className="flex items-center gap-2">
                 <input 
                  autoFocus
                  className="text-[10px] bg-slate-100 dark:bg-slate-800 border-none rounded px-2 py-1 outline-none w-24"
                  placeholder="Theme name..."
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
            <p className="text-[10px] italic opacity-30 text-center py-2">No custom themes saved yet.</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {savedThemes.map((t) => (
                <div key={t.id} className="relative group">
                  <button
                    onClick={() => handleApplySaved(t)}
                    className="flex flex-col items-center gap-1 w-full"
                    title={t.name}
                  >
                    <div 
                      className={`w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden shadow-sm ${
                        theme === t.id ? 'border-indigo-600 scale-110' : 'border-slate-200 dark:border-slate-800'
                      }`}
                      style={{ backgroundColor: t.settings.backgroundColor }}
                    >
                      <span style={{ color: t.settings.textColor }} className="text-xs font-serif font-bold">Aa</span>
                    </div>
                    <span className={`text-[10px] truncate w-full text-center ${theme === t.id ? 'font-bold text-indigo-600' : 'opacity-60'}`}>
                      {t.name}
                    </span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteTheme(t.id); }}
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
        <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Fine-tuning</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase opacity-60 mb-1 block">Page Color</label>
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
              <label className="text-[10px] uppercase opacity-60 mb-1 block">Ink Color</label>
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
                <label>Text Size</label>
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
        <section className="space-y-6 pb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Layout & Flow</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Line Spacing</label>
                <span>{settings.lineHeight}</span>
              </div>
              <input 
                type="range" min="1" max="3" step="0.1"
                value={settings.lineHeight}
                onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Paragraph Gap</label>
                <span>{settings.paragraphSpacing}em</span>
              </div>
              <input 
                type="range" min="0.5" max="5" step="0.1"
                value={settings.paragraphSpacing}
                onChange={(e) => handleChange('paragraphSpacing', parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>Readable Width</label>
                <span>{settings.maxWidth}px</span>
              </div>
              <input 
                type="range" min="300" max="1400" step="50"
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
          className="w-full py-2.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
        >
          Reset to Defaults
        </button>
      </div>
    </aside>
  );
};

export default SettingsPanel;
