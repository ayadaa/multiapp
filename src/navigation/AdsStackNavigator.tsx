// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { AdsScreen } from '../screens/ads/AdsScreen';
// import CreateAdScreen from '../screens/ads/CreateAdScreen';

// /**
//  * Stack navigator for friends-related screens.
//  * Handles navigation between friends list and add friends functionality.
//  * Provides a clean navigation flow for friend management features.
//  */

// export type FriendsStackParamList = {
//   Ads: undefined;
//   CreateAd: undefined;
// };

// const Stack = createStackNavigator<FriendsStackParamList>();

// export function AdsStackNavigator() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//         cardStyle: { backgroundColor: '#000000' },
//         gestureEnabled: true,
//       }}
//       initialRouteName="Ads"
//     >
//       <Stack.Screen
//         name="Ads"
//         component={AdsScreen}
//         options={{
//           title: 'Ads',
//         }}
//       />
      
//       <Stack.Screen
//         name="CreateAd"
//         component={CreateAdScreen}
//         options={{
//           title: 'Create Ad',
//         }}
//       />
//     </Stack.Navigator>
//   );
// } 