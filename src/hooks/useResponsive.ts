import { useWindowDimensions, Platform } from 'react-native';

export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface ResponsiveValues {
  width: number;
  height: number;
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isWeb: boolean;
  columns: number;
  containerPadding: number;
  maxContentWidth: number;
  cardWidth: number;
  sidebarWidth: number;
  showSidebar: boolean;
  gap: number;
  isSmallMobile: boolean;
}

const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

export const useResponsive = (): ResponsiveValues => {
  const { width, height } = useWindowDimensions();

  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;
  const isWide = width >= BREAKPOINTS.wide;
  const isWeb = Platform.OS === 'web';

  let screenSize: ScreenSize = 'mobile';
  if (isWide) screenSize = 'wide';
  else if (isDesktop) screenSize = 'desktop';
  else if (isTablet) screenSize = 'tablet';

  const sidebarWidth = 260;
  const showSidebar = isDesktop;
  
  // Available width for content
  const contentWidth = isDesktop ? width - sidebarWidth : width;
  
  // Maintain 2 columns for most mobile devices until very narrow
  const isSmallMobile = contentWidth < 300;

  // Determine columns
  let columns = 2;
  if (isSmallMobile) columns = 1;
  else if (isTablet) columns = 3;
  else if (isDesktop && !isWide) columns = 4;
  else if (isWide) columns = 5;

  // Spacing values
  const containerPadding = isSmallMobile ? 12 : (isMobile ? 16 : 24);
  const gap = isSmallMobile ? 12 : 16;
  const maxContentWidth = 1400;

  // Calculate card width
  const gridPadding = containerPadding * 2;
  const availableGridWidth = Math.min(contentWidth, maxContentWidth) - gridPadding;
  const totalGapWidth = (columns - 1) * gap;
  const cardWidth = (availableGridWidth - totalGapWidth) / columns;

  return {
    width,
    height,
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isWeb,
    columns,
    containerPadding,
    maxContentWidth,
    cardWidth,
    sidebarWidth,
    showSidebar,
    gap,
    isSmallMobile,
  };
};

export const getResponsiveSpacing = (width: number, base: number) => {
  if (width < BREAKPOINTS.tablet) return base * 0.8;
  if (width < BREAKPOINTS.desktop) return base;
  return base * 1.2;
};
