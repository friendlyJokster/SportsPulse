export type AppTheme = 'sapphire' | 'terracotta' | 'nordic' | 'amethyst' | 'slate-dark' | 'light' | 'dark' | 'calm' | 'nord' | 'oled' | 'system';

export type AppFont = 'plus-jakarta' | 'lexend' | 'outfit' | 'manrope' | 'space-grotesk';

export interface UserPreferences {
  theme: AppTheme;
  font: AppFont;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  followSystemTheme?: boolean;
}

export interface ThemeOption {
  id: AppTheme;
  name: string;
  category: 'dark' | 'light';
  tagline: string;
  description: string;
  badge: string;
  previewBg: string;
  previewSurface: string;
  previewBorder: string;
  previewText: string;
  previewAccent: string;
}

export interface FontOption {
  id: AppFont;
  name: string;
  cssFamily: string;
  isDefault?: boolean;
  tagline: string;
  description: string;
  sample: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'system',
    name: 'Auto System',
    category: 'light',
    tagline: 'Follow Device OS Appearance',
    description: 'Dynamically switches between light and dark mode according to your Android or iOS system setting.',
    badge: 'Adaptive OS',
    previewBg: '#F1F5F9',
    previewSurface: '#FFFFFF',
    previewBorder: '#CBD5E1',
    previewText: '#0F172A',
    previewAccent: '#3B82F6'
  },
  {
    id: 'sapphire',
    name: 'Sapphire & Cobalt',
    category: 'light',
    tagline: 'Royal Blue & Porcelain • Clean & Crisp',
    description: 'Crisp porcelain canvas with elegant royal cobalt blue accents, warm amber alerts, and high-contrast slate ink. Zero green/black eye fatigue.',
    badge: 'Recommended',
    previewBg: '#F5F8FC',
    previewSurface: '#FFFFFF',
    previewBorder: '#DBE4F0',
    previewText: '#0F172A',
    previewAccent: '#2563EB'
  },
  {
    id: 'terracotta',
    name: 'Warm Sand & Terracotta',
    category: 'light',
    tagline: 'Clay & Linen • Ultra-Low Eye Strain',
    description: 'Gentle warm linen parchment with rich terracotta clay accents and warm espresso text. The most soothing palette for extended daytime scoring.',
    badge: 'Gentle on Eyes',
    previewBg: '#F8F5EE',
    previewSurface: '#FFFFFF',
    previewBorder: '#E7DFD2',
    previewText: '#2C2522',
    previewAccent: '#C85A32'
  },
  {
    id: 'nordic',
    name: 'Nordic Slate & Sky',
    category: 'dark',
    tagline: 'Muted Steel Blue • Soft Night Mode',
    description: 'Deep soothing steel-slate navy with soft glacier sky-blue accents and warm coral alerts. Prevents dark-mode halation and glare.',
    badge: 'Soothing Dark',
    previewBg: '#151D2A',
    previewSurface: '#1D283A',
    previewBorder: '#2B3B52',
    previewText: '#F1F5F9',
    previewAccent: '#38BDF8'
  },
  {
    id: 'amethyst',
    name: 'Amethyst & Lavender',
    category: 'light',
    tagline: 'Royal Violet & Cloud White',
    description: 'Cloud white canvas with deep royal violet buttons and lavender status pills. Modern, refined, and distinct from typical sports apps.',
    badge: 'Refined',
    previewBg: '#F9F8FD',
    previewSurface: '#FFFFFF',
    previewBorder: '#E4E2F2',
    previewText: '#1E1B4B',
    previewAccent: '#6366F1'
  },
  {
    id: 'slate-dark',
    name: 'Graphite & Warm Gold',
    category: 'dark',
    tagline: 'Soft Charcoal & Golden Amber',
    description: 'Mellow graphite dark mode with warm amber-gold action keys and soft pearl text. Free of stark black and harsh neon greens.',
    badge: 'Warm Dark',
    previewBg: '#181C24',
    previewSurface: '#222733',
    previewBorder: '#313848',
    previewText: '#F8FAFC',
    previewAccent: '#F59E0B'
  }
];

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    cssFamily: "'Plus Jakarta Sans', sans-serif",
    isDefault: true,
    tagline: 'Default • Athletic & Modern',
    description: 'Clean, athletic geometric sans-serif engineered for digital sports dashboards and fast visual scanning.',
    sample: '6 Runs • Over 18.4 • SR 178.5'
  },
  {
    id: 'lexend',
    name: 'Lexend',
    cssFamily: "'Lexend', sans-serif",
    tagline: 'Cognitive Ease • Anti-Strain',
    description: 'Scientifically designed by educational researchers to reduce visual stress, prevent letter-crowding, and enhance reading speed.',
    sample: 'Match Point • Raid 28s • Bonus Point'
  },
  {
    id: 'outfit',
    name: 'Outfit',
    cssFamily: "'Outfit', sans-serif",
    tagline: 'Geometric & Friendly',
    description: 'Warm, rounded geometric display typography with spacious counters and balanced optical harmony.',
    sample: 'Goal 74:12 • Yellow Card • +4 Stoppage'
  },
  {
    id: 'manrope',
    name: 'Manrope',
    cssFamily: "'Manrope', sans-serif",
    tagline: 'Humanist • High Legibility',
    description: 'Crossover modern humanist sans-serif with natural letterforms that feel calm, refined, and readable at all sizes.',
    sample: 'Game 4, Set 2 • Deuce • Ace 128 km/h'
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    cssFamily: "'Space Grotesk', sans-serif",
    tagline: 'Sport-Tech • Futuristic',
    description: 'Distinctive monospace-infused proportional typeface offering sharp editorial character and score precision.',
    sample: 'Q4 02:45 • Shot Clock 14s • 3-Pointer'
  }
];
