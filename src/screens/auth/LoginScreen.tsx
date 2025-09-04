import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { LoginForm } from '../../components/forms/LoginForm';
import type { AuthStackParamList } from '../../types/navigation';

/**
 * Enhanced Login screen component with form validation and error handling.
 * Uses the LoginForm component for authentication logic and validation.
 * Provides navigation to signup and forgot password screens.
 */
export function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleLoginSuccess = () => {
    // Navigation is handled automatically by AppNavigator based on auth state
    console.log('Login successful - navigating to main app');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <Screen keyboardAvoidingView={true}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: 8,
            }}
          >
            MultiApp
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: 'rgba(0, 0, 0, 0.75)',
              textAlign: 'center',
            }}
          >
            Sign in to continue
          </Text>
        </View>

        {/* Login Form */}
        <LoginForm
          onSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
          onNavigateToSignup={navigateToSignup}
        />
      </View>
    </Screen>
  );
} 