// ============ COLOR PALETTE ============
// Design: "Neo-Brutalism meets Soft Minimal"

export const COLORS = {
  // Primary
  background: '#FAFAFA',
  text: '#18181B',
  textMuted: '#71717A',
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
  cardBg: '#F4F4F5',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.3)',
  overlayDark: 'rgba(0,0,0,0.7)',
  glassWhite: 'rgba(255,255,255,0.15)',
  glassWhiteStrong: 'rgba(255,255,255,0.95)',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export type ColorKey = keyof typeof COLORS;
