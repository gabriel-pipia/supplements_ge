import { APP_CONFIG } from '../constants';

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number): string => {
  return `${APP_CONFIG.currency}${price.toFixed(2)}`;
};

/**
 * Format price without decimals for display
 */
export const formatPriceShort = (price: number): string => {
  return `${APP_CONFIG.currency}${price}`;
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Format review count (e.g., 2847 -> "2.8K")
 */
export const formatReviewCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
