import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, TextInputProps, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import i18n from '../../language/i18n';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  isAddress?: boolean;
  containerStyle?: ViewStyle;
}

/**
 * Reusable Input component for form fields with consistent styling.
 * Supports labels, error messages, icons, and password visibility toggle.
 * Follows the design system defined in theme-rules.md.
 * 
 * @param label - Optional label text to display above the input
 * @param error - Error message to display below the input
 * @param leftIcon - Optional icon to display on the left side
 * @param rightIcon - Optional icon to display on the right side
 * @param isPassword - Whether this is a password field (adds visibility toggle)
 * @param containerStyle - Optional custom styles for the container
 */
export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  isAddress = false,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation<any>();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigateToScan = () => {
    navigation.navigate('Scan');
  };

  const inputContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: error ? '#FF4444' : isFocused ? '#0084FF' : 'rgba(0, 0, 0, 0.5)',
    minHeight: 48,
  };

  const inputStyle = {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
  };

  const labelStyle = {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#000000',
    marginBottom: 8,
  };

  const errorStyle = {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  };

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && <Text style={labelStyle}>{label}</Text>}

      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={{ marginRight: 12 }}>
            {leftIcon}
          </View>
        )}

        <TextInput
          style={[inputStyle, style]}
          placeholderTextColor="rgba(0, 0, 0, 0.6)"
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ marginLeft: 12 }}
          >
            <Text style={{ color: '#0084FF', fontSize: 14, fontWeight: '500' }}>
              {isPasswordVisible ? i18n.t('hide') : i18n.t('show')}
            </Text>
          </TouchableOpacity>
        )}

        {isAddress && (
          <TouchableOpacity
            onPress={navigateToScan}
            style={{ marginLeft: 12 }}
          >
            <AntDesign name="scan1" size={24} color="black" />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && (
          <View style={{ marginLeft: 12 }}>
            {rightIcon}
          </View>
        )}
      </View>

      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
} 