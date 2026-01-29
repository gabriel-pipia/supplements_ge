// ============ IMAGE ASSETS ============
// This file exports image URLs and asset paths for the app

// Brand Assets
export const BRAND = {
  // App Icons
  iconDark: require('../../assets/app-icon-dark.png'),
  iconLight: require('../../assets/app-icon-light.png'),
  
  // SVG Logos (for header)
  logoDark: require('../../assets/logo-dark.svg'),
  logoLight: require('../../assets/logo-light.svg'),
  
  // Favicon
  favicon: require('../../assets/favicon.svg'),
} as const;

export const IMAGES = {
  // Hero/Background Images
  hero: {
    gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
  },

  // Placeholder Images
  placeholder: {
    product: 'https://via.placeholder.com/400x400?text=Product',
    avatar: 'https://via.placeholder.com/100x100?text=Avatar',
  },

  // Product Images (can be replaced with local assets)
  products: {
    proteinWhey: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    creatine: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop',
    vitaminD3: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    wheyIsolate: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop',
    omega3: 'https://images.unsplash.com/photo-1559757175-7cb036e0e390?w=400&h=400&fit=crop',
    creatineHcl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    veganProtein: 'https://images.unsplash.com/photo-1622484211148-c9e4bfeb5cd5?w=400&h=400&fit=crop',
    multivitamin: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop',
  },
} as const;
