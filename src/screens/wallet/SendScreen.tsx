import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { SendForm } from '../../components/forms/SendForm';

export function SendScreen() {
  const navigation = useNavigation<any>();

  const handleSendSuccess = () => {
    // Navigation is handled automatically by AppNavigator based on auth state
    console.log('Send assets successful - navigating to wallet');
  };

  const navigateToWallet = () => {
    navigation.navigate('Wallet');
  };

  return (
    <Screen backgroundColor="#000000" keyboardAvoidingView>
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
                color: '#FFFFFF',
                marginBottom: 8,
              }}
            >
              Join Snap Factor
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center',
              }}
            >
              Create your account to get started
            </Text>
          </View>

          {/* Send Form */}
          <SendForm
            onSuccess={handleSendSuccess}
            onNavigateToWallet={navigateToWallet}
          />
        </View>
      </ScrollView>
    </Screen>
  );
} 