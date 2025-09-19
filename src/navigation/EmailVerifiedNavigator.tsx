import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmailVerifiedScreen } from '../screens/auth/EmailVerifiedScreen';

const Stack = createNativeStackNavigator<any>();

export function EmailVerifiedNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="EmailVerified"
        component={EmailVerifiedScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
} 