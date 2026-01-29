import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
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
  light: 10,
  medium: 20,
  strong: 40,
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 'medium',
  variant = 'card',
  gradient = false,
  borderRadius = 24,
}) => {
  const { isDark } = useApp();

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

  const cardStyle: any = {
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
    // Web specific
    backdropFilter: `blur(${BLUR_LEVELS[intensity]}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${BLUR_LEVELS[intensity]}px) saturate(180%)`,
    backgroundColor: getBlurBackgroundColor(),
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  };

  return (
    <View style={[cardStyle, style]}>
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
};

interface GlassModalBackgroundProps {
  children: React.ReactNode;
}

export const GlassModalBackground: React.FC<GlassModalBackgroundProps> = ({ children }) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(0,0,0,0.4)',
          // @ts-ignore
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
      ]}
    >
      {children}
    </View>
  );
};
