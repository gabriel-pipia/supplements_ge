import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useApp } from '../../context/AppContext';

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  rightIcon,
  error,
  containerStyle,
  inputStyle,
  onRightIconPress,
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const { colors } = useApp();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.accent;
    return colors.gray200;
  };

  const getIconColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.accent;
    return colors.textMuted;
  };

  const inputRef = useRef<TextInput>(null);

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text, marginBottom: 8 }]}>
          {label}
        </Text>
      )}
      
      <TouchableWithoutFeedback onPress={handleContainerPress}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              borderColor: getBorderColor(),
              borderWidth: isFocused || error ? 2 : 1,
              height: props.multiline ? undefined : 56,
              minHeight: 56,
              paddingVertical: props.multiline ? 12 : 0,
              // Web specific: cursor text on container to mimic native behavior
              ...Platform.select({
                  web: { cursor: 'text' }
              }) as any
            },
            style,
          ]}
        >
          {leftIcon && (
            <View style={styles.leftIcon}>
               {React.isValidElement(leftIcon) 
                  // @ts-ignore
                  ? React.cloneElement(leftIcon, { color: getIconColor() }) 
                  : leftIcon}
            </View>
          )}

          <TextInput
            ref={inputRef}
            style={[
                styles.input, 
                { color: colors.text }, 
                inputStyle,
                // Web specific: remove default outline
                Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : undefined
            ]}
            placeholderTextColor={colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={colors.accent}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
            >
               {React.isValidElement(rightIcon) 
                  // @ts-ignore
                  ? React.cloneElement(rightIcon, { color: getIconColor() }) 
                  : rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    // Web specific
    ...Platform.select({
        web: { cursor: 'pointer' }
    }) as any
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
