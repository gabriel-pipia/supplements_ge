import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context';
import { Button } from './Button';

interface PromoBannerProps {
  title: string;
  label: string;
  code: string;
  onPress?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ 
  title, 
  label, 
  code, 
  onPress 
}) => {
  const { colors, t } = useApp();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <LinearGradient
        colors={[colors.accent, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
        <Button
          title={`${t('useCode')}: ${code}`}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          variant="secondary"
          size="sm"
          style={{ backgroundColor: colors.white, alignSelf: 'flex-start', marginTop: 16, borderWidth: 0 }}
          textStyle={{ color: colors.accent, fontWeight: 'bold' }}
        />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    lineHeight: 32,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
