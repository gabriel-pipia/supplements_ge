import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconChatProps {
  size?: number;
  color?: string;
}

export const IconChat: React.FC<IconChatProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" 
      stroke={color} 
      strokeWidth={2} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Circle cx="9" cy="10" r="1" fill={color} />
    <Circle cx="12" cy="10" r="1" fill={color} />
    <Circle cx="15" cy="10" r="1" fill={color} />
  </Svg>
);

export const IconSend: React.FC<IconChatProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
      stroke={color} 
      strokeWidth={2} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);
