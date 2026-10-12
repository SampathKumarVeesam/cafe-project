export type ThemeId = 
  | 'cyberpunk' 
  | 'solar-flare' 
  | 'nordic-frost' 
  | 'emerald-botanical' 
  | 'monochrome';

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  c1: string; // Background / Root Contrast
  c2: string; // Primary Surface / Secondary Contrast
  c3: string; // Primary Accent
  c4: string; // Accent Pop
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  dark: ThemeColors;
  light: ThemeColors;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    tagline: 'High Voltage Tech',
    dark: {
      c1: '#0B0C10', // Deep Obsidian
      c2: '#66FCF1', // Electric Cyan
      c3: '#8A2BE2', // Neon Violet
      c4: '#FCEE09', // Acid Yellow
    },
    light: {
      c1: '#FFFFFF', // Pure White
      c2: '#E6F9F8', // Soft Sky Tint
      c3: '#4A157C', // Midnight Violet
      c4: '#D4A017', // Amber Gold
    },
  },
  'solar-flare': {
    id: 'solar-flare',
    name: 'Solar Flare / Sunset Mirage',
    tagline: 'Warm Gradient Flow',
    dark: {
      c1: '#1A0B2E', // Deep Plum / Ink
      c2: '#FFF2DF', // Warm Cream / Silk
      c3: '#FF5E7E', // Hot Coral
      c4: '#FFAA00', // Golden Amber
    },
    light: {
      c1: '#FFF2DF', // Warm Cream / Silk
      c2: '#FFE5EC', // Soft Blush Tint
      c3: '#E63956', // Crimson Coral
      c4: '#1A0B2E', // Deep Plum Ink
    },
  },
  'nordic-frost': {
    id: 'nordic-frost',
    name: 'Nordic Frost / Bio-Luminescence',
    tagline: 'Cool Oceanic Clean',
    dark: {
      c1: '#0A192F', // Arctic Navy
      c2: '#233554', // Soft Slate
      c3: '#64FFDA', // Aquamarine Glow
      c4: '#CCD6F6', // Glacier Mist
    },
    light: {
      c1: '#F0F4FC', // Glacier Mist
      c2: '#FFFFFF', // Crisp White
      c3: '#0D9488', // Arctic Teal
      c4: '#0A192F', // Arctic Navy
    },
  },
  'emerald-botanical': {
    id: 'emerald-botanical',
    name: 'Emerald Botanical / Matcha Zen',
    tagline: 'Earthy Modernist',
    dark: {
      c1: '#0D1F18', // Deep Forest Moss
      c2: '#F2E8CF', // Warm Sand
      c3: '#7AE582', // Fresh Mint / Pistachio
      c4: '#BC4749', // Terracotta Rust
    },
    light: {
      c1: '#FAF6ED', // Warm Sand
      c2: '#FFFFFF', // Pure Linen
      c3: '#BC4749', // Terracotta Rust
      c4: '#0D1F18', // Deep Forest Moss
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome Chromatic / Titanium Acid',
    tagline: 'Brutalist Luxury',
    dark: {
      c1: '#121212', // Jet Black
      c2: '#9E9E9E', // Liquid Chrome / Silver
      c3: '#F8F9FA', // Pure Studio White
      c4: '#D4FF00', // Electric Lime Shock
    },
    light: {
      c1: '#F8F9FA', // Pure Studio White
      c2: '#E0E0E0', // Liquid Chrome / Silver
      c3: '#121212', // Jet Black
      c4: '#88A800', // Electric Lime Shock
    },
  },
};
