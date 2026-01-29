import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: 'light' | 'medium' | 'strong';
  variant?: 'card' | 'surface' | 'modal';
  gradient?: boolean;
  borderRadius?: number;
}

const BLUR_LEVELS = {
  light: 20,
  medium: 40,
  strong: 80,
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 'medium',
  variant = 'card',
  gradient = false,
  borderRadius = 24,
}) => {
  const { colors, isDark } = useApp();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'modal':
        return isDark ? 'rgba(30,30,40,0.85)' : 'rgba(255,255,255,0.85)';
      case 'surface':
        return isDark ? 'rgba(25,25,35,0.8)' : 'rgba(255,255,255,0.8)';
      default:
        return isDark ? 'rgba(35,35,45,0.85)' : 'rgba(255,255,255,0.85)';
    }
  };

  // Slightly more transparent for blur effect on iOS
  const getBlurBackgroundColor = () => {
    switch (variant) {
      case 'modal':
        return isDark ? 'rgba(30,30,40,0.5)' : 'rgba(255,255,255,0.5)';
      case 'surface':
        return isDark ? 'rgba(25,25,35,0.4)' : 'rgba(255,255,255,0.4)';
      default:
        return isDark ? 'rgba(35,35,45,0.45)' : 'rgba(255,255,255,0.45)';
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 12,
    elevation: 4,
  };

  // Web fallback with CSS backdrop-filter
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          cardStyle,
          style,
          {
            backgroundColor: getBlurBackgroundColor(),
            // @ts-ignore - web-only property
            backdropFilter: `blur(${BLUR_LEVELS[intensity]}px) saturate(180%)`,
            WebkitBackdropFilter: `blur(${BLUR_LEVELS[intensity]}px) saturate(180%)`,
          },
        ]}
      >
        {gradient && (
          <LinearGradient
            colors={isDark ? ['rgba(255,100,50,0.2)', 'rgba(250,100,80,0.1)'] : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </View>
      </View>
    );
  }

  // Android: Use solid background since BlurView doesn't work well
  if (Platform.OS === 'android') {
    return (
      <View style={[cardStyle, style]}>
        {/* Solid background layer */}
        <View 
          style={[
            StyleSheet.absoluteFill, 
            { backgroundColor: getBackgroundColor() }
          ]} 
        />
        {/* Optional gradient overlay */}
        {gradient && (
          <LinearGradient
            colors={isDark ? ['rgba(255,100,50,0.15)', 'rgba(250,100,80,0.08)'] : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {/* Inner glow/highlight for glass effect */}
        <View 
          style={[
            StyleSheet.absoluteFill,
            {
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
              borderRadius: borderRadius - 1,
            }
          ]} 
        />
        <View style={{ position: 'relative', zIndex: 1 }}>{children}</View>
      </View>
    );
  }

  // iOS: Use BlurView with experimentalBlurMethod for better performance
  return (
    <View style={[cardStyle, style]}>
      <BlurView
        intensity={BLUR_LEVELS[intensity]}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      >
        <View 
          style={[
            StyleSheet.absoluteFill, 
            { backgroundColor: getBlurBackgroundColor() }
          ]} 
        />
      </BlurView>
      {gradient && (
        <LinearGradient
          colors={isDark ? ['rgba(255,100,50,0.25)', 'rgba(250,100,80,0.15)'] : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={{ position: 'relative', zIndex: 1 }}>{children}</View>
    </View>
  );
};

interface GlassModalBackgroundProps {
  children: React.ReactNode;
}

export const GlassModalBackground: React.FC<GlassModalBackgroundProps> = ({ children }) => {
  const { isDark } = useApp();

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0,0,0,0.4)',
            // @ts-ignore
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          },
        ]}
      >
        {children}
      </View>
    );
  }

  // Android: Semi-transparent overlay without blur
  if (Platform.OS === 'android') {
    return (
      <View 
        style={[
          StyleSheet.absoluteFill, 
          { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }
        ]}
      >
        {children}
      </View>
    );
  }

  // iOS: Use BlurView
  return (
    <BlurView
      intensity={30}
      tint={isDark ? 'dark' : 'light'}
      style={StyleSheet.absoluteFill}
    >
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
        {children}
      </View>
    </BlurView>
  );
};
