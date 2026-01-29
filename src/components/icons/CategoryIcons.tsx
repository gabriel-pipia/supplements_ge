import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../constants';

interface IconProps {
  size?: number;
  color?: string;
}

export const IconSparkles: React.FC<IconProps> = ({ size = 16, color = COLORS.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </Svg>
);

export const IconDumbbell: React.FC<IconProps> = ({ size = 16, color = COLORS.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 4c-1.5 0-2.7.8-3.4 2H7c-1.7 0-3 1.3-3 3v1c0 .6.4 1 1 1s1-.4 1-1V9c0-.6.4-1 1-1h1c0 2.2 1.8 4 4 4s4-1.8 4-4h1c.6 0 1 .4 1 1v1c0 .6.4 1 1 1s1-.4 1-1V9c0-1.7-1.3-3-3-3h-1.6c-.7-1.2-1.9-2-3.4-2zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-5 8c-.6 0-1 .4-1 1v3c0 1.7 1.3 3 3 3h6c1.7 0 3-1.3 3-3v-3c0-.6-.4-1-1-1s-1 .4-1 1v3c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1v-3c0-.6-.4-1-1-1z" />
  </Svg>
);

export const IconZap: React.FC<IconProps> = ({ size = 16, color = COLORS.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </Svg>
);

export const IconPill: React.FC<IconProps> = ({ size = 16, color = COLORS.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <Path d="m8.5 8.5 7 7" />
  </Svg>
);

export const IconLeaf: React.FC<IconProps> = ({ size = 16, color = COLORS.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <Path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </Svg>
);

// Helper to get category icon by type
export const getCategoryIcon = (type: string, color: string): React.ReactNode => {
  switch (type) {
    case 'sparkles': return <IconSparkles size={16} color={color} />;
    case 'dumbbell': return <IconDumbbell size={16} color={color} />;
    case 'zap': return <IconZap size={16} color={color} />;
    case 'pill': return <IconPill size={16} color={color} />;
    case 'leaf': return <IconLeaf size={16} color={color} />;
    default: return <IconSparkles size={16} color={color} />;
  }
};
