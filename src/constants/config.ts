// ============ APP CONFIGURATION ============

export const APP_CONFIG = {
  name: 'supplement.ge',
  tagline: 'პრემიუმ სპორტული კვება',
  version: '1.0.0',
  currency: '₾',
  defaultLanguage: 'ka',
  
  // API Configuration (for future use)
  api: {
    baseUrl: 'https://api.supplement.ge',
    timeout: 10000,
  },

  // Animation Durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },

  // Layout
  layout: {
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 32,
      full: 9999,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 32,
    },
  },

  // Hero Section
  hero: {
    height: 320,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
  },
} as const;
