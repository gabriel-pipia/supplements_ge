import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  gradient?: boolean;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  block = false,
  leftIcon,
  rightIcon,
  gradient = false,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const { colors } = useApp();

  const getContainerStyle = (): ViewStyle => {
    let baseStyle: ViewStyle = {};

    // Size
    switch (size) {
      case 'sm':
        baseStyle = { paddingVertical: 8, paddingHorizontal: 12, height: 36 };
        break;
      case 'md':
        baseStyle = { paddingVertical: 12, paddingHorizontal: 20, height: 48 };
        break;
      case 'lg':
        baseStyle = { paddingVertical: 16, paddingHorizontal: 24, height: 56 };
        break;
    }

    // Variant Colors (if not gradient)
    if (!gradient) {
        switch (variant) {
            case 'primary':
                baseStyle = { ...baseStyle, backgroundColor: colors.accent, borderWidth: 0 };
                break;
            case 'secondary':
                baseStyle = { ...baseStyle, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.gray200 };
                break;
            case 'outline':
                baseStyle = { ...baseStyle, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent };
                break;
            case 'ghost':
                baseStyle = { ...baseStyle, backgroundColor: 'transparent', borderWidth: 0 };
                break;
            case 'danger':
                baseStyle = { ...baseStyle, backgroundColor: colors.error, borderWidth: 0 };
                break;
        }
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    if (block) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    let baseText: TextStyle = { fontWeight: '600' };

    // Size
    switch (size) {
      case 'sm':
        baseText.fontSize = 12;
        break;
      case 'md':
        baseText.fontSize = 14;
        break;
      case 'lg':
        baseText.fontSize = 16;
        break;
    }

    // Color
    switch (variant) {
      case 'primary':
      case 'danger':
        baseText.color = '#FFFFFF';
        break;
      case 'secondary':
        baseText.color = colors.text;
        break;
      case 'outline':
      case 'ghost':
        baseText.color = colors.accent;
        break;
    }

    return baseText;
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.accent : '#FFF'} />
      ) : (
        <>
          {leftIcon}
          <Text style={[
            styles.text, 
            getTextStyle(), 
            textStyle, 
            leftIcon ? { marginLeft: 8 } : undefined, 
            rightIcon ? { marginRight: 8 } : undefined
          ]}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </>
  );

  if (gradient && variant === 'primary') {
      return (
          <TouchableOpacity
            style={[styles.container, getContainerStyle(), { padding: 0, overflow: 'hidden', borderWidth: 0 }, style]}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
          >
              <LinearGradient
                  colors={[colors.accent, colors.accentDark || colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.gradient, { 
                      paddingVertical: (getContainerStyle().paddingVertical as number), 
                      paddingHorizontal: (getContainerStyle().paddingHorizontal as number),
                      height: '100%',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row'
                   }]}
              >
                  {content}
              </LinearGradient>
          </TouchableOpacity>
      )
  }

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  text: {
    textAlign: 'center',
  },
  gradient: {
      flex: 1,
  }
});
