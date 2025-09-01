import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
// import { ChatScreen } from '../screens/chat/ChatScreen';
// import { CameraStackNavigator } from './CameraStackNavigator';
// import { AdsScreen } from '../screens/ads/AdsScreen';
import { AdsScreenWithDrawer, ChatScreenWithDrawer, P2PAdsScreenWithDrawer, WalletScreenWithDrawer } from './Drawer';
// import { P2PAdsScreen } from '../screens/p2pads/P2PAdsScreen';
// import { FriendsStackNavigator } from './FriendsStackNavigator';
// import StoriesScreen from '../screens/stories/StoriesScreen';
// import { ProfileScreen } from '../screens/profile/ProfileScreen';
// import { WalletScreen } from '../screens/wallet/WalletScreen';
import { MainTabParamList } from '../types/navigation';
// import { Screen } from '../components/common/Screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Screen } from '../components/common/Screen';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main tab navigator for Snap Factor.
 * Features bottom tabs for Chat, Camera, Stories, and Math.
 * Added Math tab for Snap Factor RAG features.
 */
export function MainTabNavigator() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
    {/* <Screen backgroundColor="#FFFFFF"> */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            // backgroundColor: '#FFFFFF',
            // borderTopWidth: 0,
            // height: Platform.OS === 'ios' ? 85 : 65,
            // paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            // paddingTop: 10,
            height: Platform.OS === 'ios' ? 60 : 40,
          },
          tabBarActiveTintColor: '#0084FF',
          tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.75)',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
        initialRouteName="Ads"
      >
        <Tab.Screen
          name="Ads"
          // component={AdsScreen}
          component={AdsScreenWithDrawer}
          options={{
            tabBarIcon: ({ focused }) => (
              // <Text style={{
              //   fontSize: 20,
              //   color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              // }}>
              //   🧮
              // </Text>
              <AntDesign name="home" size={24} color={focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'} />
            ),
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
          }}
        />

        {/* <Tab.Screen
          name="Ads"
          // component={AdsScreen}
          component={AdsScreenWithDrawer}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{
                fontSize: 20,
                color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              }}>
                🧮
              </Text>
            ),
            tabBarLabel: 'Ads',
          }}
        /> */}

        <Tab.Screen
          name="Chat"
          // component={ChatScreen}
          component={ChatScreenWithDrawer}
          options={{
            tabBarIcon: ({ focused }) => (
              // <Text style={{
              //   fontSize: 20,
              //   color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              // }}>
              //   💬
              // </Text>
              <AntDesign name="message1" size={24} color={focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'} />
            ),
            tabBarLabel: 'Messages',
            tabBarShowLabel: false,
          }}
        />

        {/* <Tab.Screen
          name="Camera"
          component={CameraStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{
                fontSize: 24,
                color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              }}>
                📸
              </Text>
            ),
            tabBarLabel: 'Camera',
          }}
        /> */}

        <Tab.Screen
          name="P2PAds"
          // component={P2PAdsScreen}
          component={P2PAdsScreenWithDrawer}
          options={{
            tabBarIcon: ({ focused }) => (
              // <Text style={{
              //   fontSize: 20,
              //   color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              // }}>
              //   🧮
              // </Text>
              <AntDesign name="swap" size={24} color={focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'} />
            ),
            tabBarLabel: 'Swap',
            tabBarShowLabel: false,
          }}
        />

        {/* <Tab.Screen
          name="Friends"
          component={FriendsStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{
                fontSize: 20,
                color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              }}>
                👥
              </Text>
            ),
            tabBarLabel: 'Friends',
          }}
        /> */}

        {/* <Tab.Screen
          name="Stories"
          component={StoriesScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{
                fontSize: 20,
                color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              }}>
                📱
              </Text>
            ),
            tabBarLabel: 'Stories',
          }}
        /> */}

        <Tab.Screen
          name="Wallet"
          component={WalletScreenWithDrawer}
          options={{
            tabBarIcon: ({ focused }) => (
              // <Text style={{
              //   fontSize: 20,
              //   color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              // }}>
              //   💳
              // </Text>
              <AntDesign name="wallet" size={24} color={focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'} />
            ),
            tabBarLabel: 'Wallet',
            tabBarShowLabel: false,
          }}
        />
        {/* <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{
                fontSize: 20,
                color: focused ? '#0084FF' : 'rgba(0, 0, 0, 0.75)'
              }}>
                👤
              </Text>
            ),
            tabBarLabel: 'Profile',
          }}
        /> */}
      </Tab.Navigator>
    {/* </Screen> */}
    </SafeAreaView>
  );
} 
