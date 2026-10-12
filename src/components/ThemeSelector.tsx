import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { THEMES, ThemeId } from '../theme/themeConfig';
import { Palette, Sun, Moon, Check, ChevronDown, Sparkles } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { theme, mode, themeDef, colors, setTheme, toggleMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left flex-shrink-0" ref={dropdownRef}>
      {/* Floating Pill Trigger */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--theme-surface-glass)] backdrop-blur-xl border border-[var(--theme-border)] shadow-xl transition-all hover:border-[var(--theme-accent)] flex-shrink-0">
        {/* Theme Dropdown Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-[var(--theme-text-primary)] transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
          title="Change color palette"
        >
          <Palette className="w-3.5 h-3.5 text-[var(--theme-accent)] flex-shrink-0" />
          
          {/* 4-Color Swatch Preview */}
          <div className="flex items-center -space-x-1 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full border border-black/30" style={{ backgroundColor: colors.c1 }} />
            <span className="w-2.5 h-2.5 rounded-full border border-black/30" style={{ backgroundColor: colors.c2 }} />
            <span className="w-2.5 h-2.5 rounded-full border border-black/30" style={{ backgroundColor: colors.c3 }} />
            <span className="w-2.5 h-2.5 rounded-full border border-black/30" style={{ backgroundColor: colors.c4 }} />
          </div>

          <span className="hidden xl:inline font-mono text-[11px] font-bold tracking-tight whitespace-nowrap">
            {themeDef.name.split('/')[0].trim()}
          </span>

          <ChevronDown className={`w-3 h-3 text-[var(--theme-text-muted)] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className="w-[1px] h-4 bg-[var(--theme-border)]" />

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleMode}
          className="p-1.5 rounded-xl hover:bg-white/10 text-[var(--theme-text-primary)] transition-all cursor-pointer relative"
          title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {mode === 'dark' ? (
            <Moon className="w-3.5 h-3.5 text-[var(--theme-pop)]" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          )}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[var(--theme-surface)] backdrop-blur-2xl border border-[var(--theme-border)] shadow-2xl p-2.5 z-50 animate-scaleUp text-[var(--theme-text-primary)]">
          <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-[var(--theme-border)] pb-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--theme-text-muted)]">
              <Sparkles className="w-3 h-3 text-[var(--theme-accent)]" />
              <span>4-Color Theme System</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-[var(--theme-accent)]">
              {mode.toUpperCase()}
            </span>
          </div>

          <div className="space-y-1">
            {Object.values(THEMES).map((t) => {
              const isSelected = t.id === theme;
              const paletteColors = mode === 'dark' ? t.dark : t.light;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)] shadow-sm'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold leading-tight text-[var(--theme-text-primary)]">
                        {t.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3 h-3 text-[var(--theme-accent)] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--theme-text-muted)]">
                      {t.tagline}
                    </p>
                  </div>

                  {/* 4-Color Swatch */}
                  <div className="flex items-center -space-x-1 ml-2 flex-shrink-0">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: paletteColors.c1 }} 
                      title={`C1: ${paletteColors.c1}`}
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" 
                      style={{ backgroundColor: paletteColors.c2 }} 
                      title={`C2: ${paletteColors.c2}`}
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" 
                      style={{ backgroundColor: paletteColors.c3 }} 
                      title={`C3: ${paletteColors.c3}`}
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" 
                      style={{ backgroundColor: paletteColors.c4 }} 
                      title={`C4: ${paletteColors.c4}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick mode switch button in footer */}
          <div className="mt-2 pt-2 border-t border-[var(--theme-border)] flex items-center justify-between px-2 text-xs">
            <span className="text-[11px] text-[var(--theme-text-muted)]">Color Mode</span>
            <button
              onClick={toggleMode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-border)] text-xs font-medium hover:bg-[var(--theme-accent)] hover:text-black transition-colors cursor-pointer"
            >
              {mode === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              <span>{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
