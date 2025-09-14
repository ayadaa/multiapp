/**
 * App Stack Navigator
 * Top-level stack navigator that includes MainTabs and modal screens like SnapViewer
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabNavigator } from './MainTabNavigator';
import { SnapViewerScreen } from '../screens/camera/SnapViewerScreen';
import { IndividualChatScreen } from '../screens/chat/IndividualChatScreen';
import StoryViewerScreen from '../screens/stories/StoryViewerScreen';
import CreateGroupScreen from '../screens/chat/CreateGroupScreen';
import CreateAdScreen from '../screens/ads/CreateAdScreen';
import UpdateAdScreen from '../screens/ads/UpdateAdScreen';
import AdDetails from '../screens/ads/AdDetails';
import { P2PCreateAdScreen } from '../screens/p2pads/P2PCreateAdScreen';
import P2PCreateRequestScreen from '../screens/p2pads/P2PCreateRequestScreen';
import { SendScreen } from '../screens/wallet/SendScreen';
import { ReceiveScreen } from '../screens/wallet/ReceiveScreen';
import MiningOffersScreen from '../screens/wallet/MiningOffersScreen';
import QRScannerScreen from '../screens/wallet/QRCodeScannerScreen';
import GroupChatScreen from '../screens/chat/GroupChatScreen';
import GroupSettingsScreen from '../screens/chat/GroupSettingsScreen';
import { ChallengeViewerScreen } from '../components/rag/ChallengeViewerScreen';
import { AppStackParamList } from '../types/navigation';
import { CardStyleInterpolators } from '@react-navigation/stack';
// import IncomingCallScreen from "../screens/chat/IncomingCallScreen";
// import CallScreen from "../screens/chat/CallScreen";
import { FriendsStackNavigator } from './FriendsStackNavigator';
import SearchScreen from '../screens/search/SearchScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { UpdateProfileScreen } from '../screens/profile/UpdateProfileScreen';
import { ReferralScreen } from '../screens/profile/ReferralScreen';
import i18n from '../language/i18n';

const Stack = createStackNavigator<AppStackParamList>();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      <Stack.Screen
        name="SnapViewer"
        component={SnapViewerScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="IndividualChat"
        component={IndividualChatScreen}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#FFFFFF',
          headerTitle: '',
        }}
      />

      <Stack.Screen
        name="GroupChat"
        component={GroupChatScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="GroupSettings"
        component={GroupSettingsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CreateAd"
        component={CreateAdScreen}
        options={{
          headerShown: true,
          headerTitle: i18n.t('createAd'),
        }}
      />

      <Stack.Screen
        name="AdDetails"
        component={AdDetails}
        options={{
          headerShown: true,
          headerTitle: i18n.t('adDetails'),
        }}
      />

      <Stack.Screen
        name="UpdateAd"
        component={UpdateAdScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="P2PCreateAd"
        component={P2PCreateAdScreen}
        options={{
          headerShown: true,
          headerTitle: i18n.t('createP2PAd'),
        }}
      />

      <Stack.Screen
        name="P2PCreateRequest"
        component={P2PCreateRequestScreen}
        options={{
          headerShown: true,
          headerTitle: i18n.t('createRequest'),
        }}
      />

      <Stack.Screen
        name="Send"
        component={SendScreen}
        options={{
          headerShown: true,
          headerTitle: i18n.t('send'),
        }}
      />

      <Stack.Screen
        name="Receive"
        component={ReceiveScreen}
        options={{
          headerShown: true,
          headerTitle: i18n.t('receive'),
        }}
      />

      <Stack.Screen
        name="MiningOffers"
        component={MiningOffersScreen}
        options={{
          headerShown: true,
          headerTitle: i18n.t('miningOffers'),
        }}
      />

      <Stack.Screen
        name="Scan"
        component={QRScannerScreen}
        options={{
          headerShown: true,
          headerTitle: i18n.t('scan'),
        }}
      />

      <Stack.Screen
        name="StoryViewer"
        component={StoryViewerScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Friends"
        component={FriendsStackNavigator}
        options={{
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="ChallengeViewer"
        component={ChallengeViewerScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />

      {/* <Stack.Screen
        name="IncomingCall"
        component={IncomingCallScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Call"
        component={CallScreen}
        options={{ headerShown: false }}
      /> */}

      <Stack.Screen
        name='Search'
        component={SearchScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name='UpdateProfile'
        component={UpdateProfileScreen}
        options={{
          headerShown: true,
          presentation: 'modal',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Referral"
        component={ReferralScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
} 