// ============ THEME COLORS ============

export interface ThemeColors {
  // Primary
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  textSecondary: string;
  accent: string;
  accentLight: string;
  accentDark: string;

  // Neutrals
  white: string;
  black: string;
  
  // Grays
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;

  // Functional
  cardBg: string;
  overlay: string;
  overlayLight: string;
  overlayDark: string;
  glassWhite: string;
  glassWhiteStrong: string;

  // Glassmorphism
  glassBg: string;
  glassBorder: string;
  glassCard: string;
  glassCardStrong: string;
  glassSurface: string;
  glassOverlay: string;

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: string[];
  gradientAccent: string[];
  gradientCard: string[];
  gradientHero: string[];

  // Status
  success: string;
  warning: string;
  error: string;
  info: string;

  // Status Bar
  statusBar: 'light-content' | 'dark-content';
}

export const lightColors: ThemeColors = {
  // Primary
  background: '#F0F4F8',
  surface: '#FFFFFF',
  text: '#18181B',
  textMuted: '#71717A',
  textSecondary: '#52525B',
  accent: '#EA580C',
  accentLight: '#FED7AA',
  accentDark: '#DC2626',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Functional
  cardBg: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
  overlayLight: 'rgba(0,0,0,0.2)',
  overlayDark: 'rgba(0,0,0,0.6)',
  glassWhite: 'rgba(255,255,255,0.25)',
  glassWhiteStrong: 'rgba(255,255,255,0.85)',

  // Glassmorphism
  glassBg: 'rgba(255,255,255,0.65)',
  glassBorder: 'rgba(255,255,255,0.4)',
  glassCard: 'rgba(255,255,255,0.7)',
  glassCardStrong: 'rgba(255,255,255,0.85)',
  glassSurface: 'rgba(255,255,255,0.5)',
  glassOverlay: 'rgba(255,255,255,0.15)',

  // Gradients
  gradientPrimary: ['#FF6B35', '#F7931E'],
  gradientAccent: ['#EA580C', '#FB923C'],
  gradientCard: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)'],
  gradientHero: ['#667EEA', '#764BA2'],

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Status Bar
  statusBar: 'dark-content',
};

export const darkColors: ThemeColors = {
  // Primary
  background: '#0A0A0F',
  surface: '#141419',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  textSecondary: '#D4D4D8',
  accent: '#F97316',
  accentLight: '#7C2D12',
  accentDark: '#FB923C',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays (inverted)
  gray50: '#18181B',
  gray100: '#1F1F24',
  gray200: '#2A2A32',
  gray300: '#3F3F46',
  gray400: '#71717A',
  gray500: '#A1A1AA',
  gray600: '#D4D4D8',
  gray700: '#E4E4E7',
  gray800: '#F4F4F5',
  gray900: '#FAFAFA',

  // Functional
  cardBg: '#1A1A1F',
  overlay: 'rgba(0,0,0,0.6)',
  overlayLight: 'rgba(0,0,0,0.4)',
  overlayDark: 'rgba(0,0,0,0.85)',
  glassWhite: 'rgba(255,255,255,0.08)',
  glassWhiteStrong: 'rgba(30,30,35,0.9)',

  // Glassmorphism
  glassBg: 'rgba(30,30,40,0.7)',
  glassBorder: 'rgba(255,255,255,0.1)',
  glassCard: 'rgba(40,40,50,0.8)',
  glassCardStrong: 'rgba(35,35,45,0.9)',
  glassSurface: 'rgba(25,25,35,0.6)',
  glassOverlay: 'rgba(0,0,0,0.3)',

  // Gradients
  gradientPrimary: ['#F97316', '#EA580C'],
  gradientAccent: ['#FB923C', '#F97316'],
  gradientCard: ['rgba(45,45,55,0.9)', 'rgba(30,30,40,0.7)'],
  gradientHero: ['#667EEA', '#764BA2'],

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Status Bar
  statusBar: 'light-content',
};

export type ThemeMode = 'light' | 'dark';

// Blur intensities
export const BLUR_INTENSITY = {
  light: 20,
  medium: 40,
  heavy: 80,
} as const;
