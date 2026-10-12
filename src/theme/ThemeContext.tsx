import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeId, ThemeMode, THEMES, ThemeDefinition, ThemeColors } from './themeConfig';

interface ThemeContextType {
  theme: ThemeId;
  mode: ThemeMode;
  themeDef: ThemeDefinition;
  colors: ThemeColors;
  setTheme: (theme: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumina_theme') as ThemeId;
      if (saved && THEMES[saved]) return saved;
    }
    return 'solar-flare'; // default theme matches warm coffeehouse sunset mirage
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('lumina_mode') as ThemeMode;
      if (savedMode === 'dark' || savedMode === 'light') return savedMode;
    }
    return 'dark';
  });

  const themeDef = THEMES[theme] || THEMES['solar-flare'];
  const colors = mode === 'dark' ? themeDef.dark : themeDef.light;

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumina_theme', newTheme);
    }
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumina_mode', newMode);
    }
  };

  const toggleMode = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
  };

  // Synchronize CSS variables to document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-mode', mode);

    const { c1, c2, c3, c4 } = colors;

    // Set the 4 core color tokens
    root.style.setProperty('--theme-c1', c1);
    root.style.setProperty('--theme-c2', c2);
    root.style.setProperty('--theme-c3', c3);
    root.style.setProperty('--theme-c4', c4);

    if (mode === 'dark') {
      root.style.setProperty('--theme-bg', c1);

      if (theme === 'cyberpunk') {
        root.style.setProperty('--theme-surface', '#10131B');
        root.style.setProperty('--theme-surface-elevated', '#171C28');
        root.style.setProperty('--theme-surface-glass', 'rgba(11, 12, 16, 0.88)');
        root.style.setProperty('--theme-border', 'rgba(102, 252, 241, 0.22)');
        root.style.setProperty('--theme-border-accent', '#66FCF1');
        root.style.setProperty('--theme-text-primary', '#FFFFFF');
        root.style.setProperty('--theme-text-secondary', '#66FCF1');
        root.style.setProperty('--theme-text-muted', 'rgba(102, 252, 241, 0.7)');
        root.style.setProperty('--theme-accent', '#66FCF1');
        root.style.setProperty('--theme-accent-hover', '#8A2BE2');
        root.style.setProperty('--theme-pop', '#FCEE09');
        root.style.setProperty('--theme-glow', 'rgba(102, 252, 241, 0.35)');
        root.style.setProperty('--theme-header-bg', 'rgba(11, 12, 16, 0.90)');
      } else if (theme === 'solar-flare') {
        root.style.setProperty('--theme-surface', '#231139');
        root.style.setProperty('--theme-surface-elevated', '#2F174D');
        root.style.setProperty('--theme-surface-glass', 'rgba(26, 11, 46, 0.88)');
        root.style.setProperty('--theme-border', 'rgba(255, 94, 126, 0.22)');
        root.style.setProperty('--theme-border-accent', '#FF5E7E');
        root.style.setProperty('--theme-text-primary', '#FFF2DF');
        root.style.setProperty('--theme-text-secondary', '#FFB3C1');
        root.style.setProperty('--theme-text-muted', 'rgba(255, 242, 223, 0.65)');
        root.style.setProperty('--theme-accent', '#FF5E7E');
        root.style.setProperty('--theme-accent-hover', '#FFAA00');
        root.style.setProperty('--theme-pop', '#FFAA00');
        root.style.setProperty('--theme-glow', 'rgba(255, 94, 126, 0.35)');
        root.style.setProperty('--theme-header-bg', 'rgba(26, 11, 46, 0.90)');
      } else if (theme === 'nordic-frost') {
        root.style.setProperty('--theme-surface', '#112240');
        root.style.setProperty('--theme-surface-elevated', '#1D3557');
        root.style.setProperty('--theme-surface-glass', 'rgba(10, 25, 47, 0.88)');
        root.style.setProperty('--theme-border', 'rgba(100, 255, 218, 0.22)');
        root.style.setProperty('--theme-border-accent', '#64FFDA');
        root.style.setProperty('--theme-text-primary', '#CCD6F6');
        root.style.setProperty('--theme-text-secondary', '#64FFDA');
        root.style.setProperty('--theme-text-muted', 'rgba(204, 214, 246, 0.65)');
        root.style.setProperty('--theme-accent', '#64FFDA');
        root.style.setProperty('--theme-accent-hover', '#8892B0');
        root.style.setProperty('--theme-pop', '#CCD6F6');
        root.style.setProperty('--theme-glow', 'rgba(100, 255, 218, 0.35)');
        root.style.setProperty('--theme-header-bg', 'rgba(10, 25, 47, 0.90)');
      } else if (theme === 'emerald-botanical') {
        root.style.setProperty('--theme-surface', '#132820');
        root.style.setProperty('--theme-surface-elevated', '#1C382C');
        root.style.setProperty('--theme-surface-glass', 'rgba(13, 31, 24, 0.88)');
        root.style.setProperty('--theme-border', 'rgba(122, 229, 130, 0.22)');
        root.style.setProperty('--theme-border-accent', '#7AE582');
        root.style.setProperty('--theme-text-primary', '#F2E8CF');
        root.style.setProperty('--theme-text-secondary', '#7AE582');
        root.style.setProperty('--theme-text-muted', 'rgba(242, 232, 207, 0.65)');
        root.style.setProperty('--theme-accent', '#7AE582');
        root.style.setProperty('--theme-accent-hover', '#BC4749');
        root.style.setProperty('--theme-pop', '#BC4749');
        root.style.setProperty('--theme-glow', 'rgba(122, 229, 130, 0.35)');
        root.style.setProperty('--theme-header-bg', 'rgba(13, 31, 24, 0.90)');
      } else {
        // monochrome
        root.style.setProperty('--theme-surface', '#1C1C1C');
        root.style.setProperty('--theme-surface-elevated', '#2A2A2A');
        root.style.setProperty('--theme-surface-glass', 'rgba(18, 18, 18, 0.90)');
        root.style.setProperty('--theme-border', 'rgba(212, 255, 0, 0.22)');
        root.style.setProperty('--theme-border-accent', '#D4FF00');
        root.style.setProperty('--theme-text-primary', '#F8F9FA');
        root.style.setProperty('--theme-text-secondary', '#9E9E9E');
        root.style.setProperty('--theme-text-muted', 'rgba(248, 249, 250, 0.65)');
        root.style.setProperty('--theme-accent', '#D4FF00');
        root.style.setProperty('--theme-accent-hover', '#FFFFFF');
        root.style.setProperty('--theme-pop', '#D4FF00');
        root.style.setProperty('--theme-glow', 'rgba(212, 255, 0, 0.35)');
        root.style.setProperty('--theme-header-bg', 'rgba(18, 18, 18, 0.92)');
      }
    } else {
      // Light Mode
      root.style.setProperty('--theme-bg', c1);

      if (theme === 'cyberpunk') {
        root.style.setProperty('--theme-surface', '#FFFFFF');
        root.style.setProperty('--theme-surface-elevated', '#F0FAF9');
        root.style.setProperty('--theme-surface-glass', 'rgba(255, 255, 255, 0.88)');
        root.style.setProperty('--theme-border', 'rgba(74, 21, 124, 0.16)');
        root.style.setProperty('--theme-border-accent', '#4A157C');
        root.style.setProperty('--theme-text-primary', '#18082A');
        root.style.setProperty('--theme-text-secondary', '#4A157C');
        root.style.setProperty('--theme-text-muted', '#6B7280');
        root.style.setProperty('--theme-accent', '#4A157C');
        root.style.setProperty('--theme-accent-hover', '#D4A017');
        root.style.setProperty('--theme-pop', '#D4A017');
        root.style.setProperty('--theme-glow', 'rgba(74, 21, 124, 0.25)');
        root.style.setProperty('--theme-header-bg', 'rgba(255, 255, 255, 0.92)');
      } else if (theme === 'solar-flare') {
        root.style.setProperty('--theme-surface', '#FFFFFF');
        root.style.setProperty('--theme-surface-elevated', '#FFF8EF');
        root.style.setProperty('--theme-surface-glass', 'rgba(255, 242, 223, 0.88)');
        root.style.setProperty('--theme-border', 'rgba(230, 57, 86, 0.16)');
        root.style.setProperty('--theme-border-accent', '#E63956');
        root.style.setProperty('--theme-text-primary', '#1A0B2E');
        root.style.setProperty('--theme-text-secondary', '#E63956');
        root.style.setProperty('--theme-text-muted', '#7C5940');
        root.style.setProperty('--theme-accent', '#E63956');
        root.style.setProperty('--theme-accent-hover', '#D97706');
        root.style.setProperty('--theme-pop', '#D97706');
        root.style.setProperty('--theme-glow', 'rgba(230, 57, 86, 0.25)');
        root.style.setProperty('--theme-header-bg', 'rgba(255, 242, 223, 0.92)');
      } else if (theme === 'nordic-frost') {
        root.style.setProperty('--theme-surface', '#FFFFFF');
        root.style.setProperty('--theme-surface-elevated', '#EAF1FB');
        root.style.setProperty('--theme-surface-glass', 'rgba(240, 244, 252, 0.88)');
        root.style.setProperty('--theme-border', 'rgba(10, 25, 47, 0.14)');
        root.style.setProperty('--theme-border-accent', '#0D9488');
        root.style.setProperty('--theme-text-primary', '#0A192F');
        root.style.setProperty('--theme-text-secondary', '#0D9488');
        root.style.setProperty('--theme-text-muted', '#475569');
        root.style.setProperty('--theme-accent', '#0D9488');
        root.style.setProperty('--theme-accent-hover', '#0A192F');
        root.style.setProperty('--theme-pop', '#0A192F');
        root.style.setProperty('--theme-glow', 'rgba(13, 148, 136, 0.25)');
        root.style.setProperty('--theme-header-bg', 'rgba(240, 244, 252, 0.92)');
      } else if (theme === 'emerald-botanical') {
        root.style.setProperty('--theme-surface', '#FFFFFF');
        root.style.setProperty('--theme-surface-elevated', '#F4ECE1');
        root.style.setProperty('--theme-surface-glass', 'rgba(250, 246, 237, 0.88)');
        root.style.setProperty('--theme-border', 'rgba(188, 71, 73, 0.16)');
        root.style.setProperty('--theme-border-accent', '#2D6A4F');
        root.style.setProperty('--theme-text-primary', '#0D1F18');
        root.style.setProperty('--theme-text-secondary', '#2D6A4F');
        root.style.setProperty('--theme-text-muted', '#5C6450');
        root.style.setProperty('--theme-accent', '#2D6A4F');
        root.style.setProperty('--theme-accent-hover', '#BC4749');
        root.style.setProperty('--theme-pop', '#BC4749');
        root.style.setProperty('--theme-glow', 'rgba(45, 106, 79, 0.25)');
        root.style.setProperty('--theme-header-bg', 'rgba(250, 246, 237, 0.92)');
      } else {
        // monochrome
        root.style.setProperty('--theme-surface', '#FFFFFF');
        root.style.setProperty('--theme-surface-elevated', '#EEEEEE');
        root.style.setProperty('--theme-surface-glass', 'rgba(248, 249, 250, 0.90)');
        root.style.setProperty('--theme-border', 'rgba(18, 18, 18, 0.15)');
        root.style.setProperty('--theme-border-accent', '#121212');
        root.style.setProperty('--theme-text-primary', '#121212');
        root.style.setProperty('--theme-text-secondary', '#4B5563');
        root.style.setProperty('--theme-text-muted', '#6B7280');
        root.style.setProperty('--theme-accent', '#121212');
        root.style.setProperty('--theme-accent-hover', '#65A30D');
        root.style.setProperty('--theme-pop', '#65A30D');
        root.style.setProperty('--theme-glow', 'rgba(18, 18, 18, 0.25)');
        root.style.setProperty('--theme-header-bg', 'rgba(248, 249, 250, 0.92)');
      }
    }
  }, [theme, mode, colors]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        themeDef,
        colors,
        setTheme,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
