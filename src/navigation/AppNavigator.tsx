import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import AppStackNavigator from './AppStackNavigator';
import { useAppSelector } from '../store/hooks';
import i18n from '../language/i18n'; // Import your i18n instance
// import { EmailVerifiedScreen } from '../screens/auth/EmailVerifiedScreen';
import { EmailVerifiedNavigator } from './EmailVerifiedNavigator'
// import { useAppSelector } from '../store/hooks';

/**
 * Main application navigator that manages the root navigation flow.
 * Switches between authentication flow and main app flow based on user state.
 * Integrates with Redux store to track authentication status.
 * 
 * Phase 0 implementation:
 * - Shows AuthNavigator when user is not authenticated
 * - Shows MainTabNavigator when user is authenticated
 * - Will be enhanced with deep linking and state persistence in Phase 1
 */
export function AppNavigator() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isEmailVerified = useAppSelector((state) => state.auth.user?.isEmailVerified);
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);
  i18n.locale = currentLanguage; // handle current language

  console.log('isEmailVerified', isEmailVerified)

  // React.useEffect(() => {
  //   const currentLanguage = useAppSelector((state) => state.language.currentLanguage);
  //   i18n.locale = currentLanguage; // handle current language
  // }, [i18n.locale]);

  return (
    <NavigationContainer>
      {(isEmailVerified == false) ? <EmailVerifiedNavigator /> : isAuthenticated ? <AppStackNavigator /> : <AuthNavigator />}
      {/* <EmailVerifiedScreen /> */}
    </NavigationContainer>
  );
} 