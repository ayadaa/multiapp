import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { SignupForm } from '../../components/forms/SignupForm';
import i18n from '../../language/i18n';

/**
 * Enhanced Signup screen component with form validation and username checking.
 * Uses the SignupForm component for registration logic and validation.
 * Provides navigation to login screen and handles successful registration.
 */
export function SignupScreen() {
  const navigation = useNavigation<any>();

  const handleSignupSuccess = () => {
    // Navigation is handled automatically by AppNavigator based on auth state
    console.log('Signup successful - navigating to main app');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Screen keyboardAvoidingView={true}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
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
              {i18n.t('joinNumoStore')}
            </Text>
            {/* <Image source={require('../../../assets/splash-icon.png')} style={{ width: 150, height: 150 }} /> */}
            <Text
              style={{
                fontSize: 16,
                color: 'rgba(0, 0, 0, 0.75)',
                textAlign: 'center',
              }}
            >
              {i18n.t('createYourAccountToGetStarted')}
            </Text>
          </View>

          {/* Signup Form */}
          <SignupForm
            onSuccess={handleSignupSuccess}
            onNavigateToLogin={navigateToLogin}
          />
        </View>
      </ScrollView>
    </Screen>
  );
} 
