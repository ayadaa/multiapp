import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen2';
import { P2PCreateAdForm } from '../../components/forms/P2PCreateAdForm';
import { type StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../../types/navigation';

// type SendScreenRouteProp = RouteProp<AppStackParamList, 'Send'>;
type SendScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Send'>;

export function P2PCreateAdScreen() {
  // const navigation = useNavigation<any>();
  // const route = useRoute<SendScreenRouteProp>();
  const navigation = useNavigation<SendScreenNavigationProp>();
  // const qrData = route.params?.qrData;

  const handleSendSuccess = () => {
    // Navigation is handled automatically by AppNavigator based on auth state
    console.log('Send assets successful - navigating to wallet');
  };

  const navigateToP2PAds = () => {
    navigation.navigate('P2PAds' as any);
  };

  return (
    <Screen keyboardAvoidingView>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, padding: 24 }}>
          {/* Send Form */}
          <P2PCreateAdForm
            onSuccess={handleSendSuccess}
            onNavigateToP2PAds={navigateToP2PAds}
          />
        </View>
      </ScrollView>
    </Screen>
  );
} 