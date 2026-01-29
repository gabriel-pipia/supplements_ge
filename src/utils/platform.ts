import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Check if device is iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if device is Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Check if running on web
 */
export const isWeb = Platform.OS === 'web';

/**
 * Get screen dimensions
 */
export const SCREEN = {
  width,
  height,
  isSmall: width < 375,
  isMedium: width >= 375 && width < 414,
  isLarge: width >= 414,
};

/**
 * Calculate responsive size based on screen width
 */
export const responsiveWidth = (percentage: number): number => {
  return (percentage / 100) * width;
};

/**
 * Calculate responsive size based on screen height
 */
export const responsiveHeight = (percentage: number): number => {
  return (percentage / 100) * height;
};

/**
 * Get platform-specific value
 */
export const selectPlatform = <T>(options: { ios?: T; android?: T; web?: T; default: T }): T => {
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isAndroid && options.android !== undefined) return options.android;
  if (isWeb && options.web !== undefined) return options.web;
  return options.default;
};
