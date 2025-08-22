// import {createStackNavigator} from '@react-navigation/stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
    DrawerContentScrollView,
    DrawerItem,
    createDrawerNavigator,
} from '@react-navigation/drawer';
// import { getHeaderTitle } from '@react-navigation/elements'; //ayad
import SCREENS from '../screens';
// import IntroScreen from '../screens/intro/IntroScreen';
// import LoginScreen from '../screens/auth/LoginScreen';
// import SignupScreen from '../screens/auth/SignupScreen';
// import HomeScreen from '../screens/tabs/HomeScreen';
import { Image, SafeAreaView, Text, View } from 'react-native';
import IMAGES from '../assets';
// import WishlistScreen from '../screens/tabs/WishlistScreen';
// import OrdersScreen from '../screens/tabs/OrdersScreen';
// import ProfileScreen from '../screens/tabs/ProfileScreen';
import { AdsScreen } from '../screens/ads/AdsScreen';
// import {useTheme} from '@react-navigation/native';
// import AboutScreen from '../screens/tabs/AboutScreen';
import { FriendsStackNavigator } from './FriendsStackNavigator';
// import { COLORS } from '../constants';
// import SettingScreen from '../screens/tabs/SettingScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
// import LanguageScreen from '../screens/language/LanguageScreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// const StackNavigation = () => {
//   return (
//     <Stack.Navigator initialRouteName={SCREENS.INTRO}>
//       <Stack.Screen
//         name={SCREENS.INTRO}
//         component={IntroScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name={SCREENS.LOGIN}
//         component={LoginScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name={SCREENS.SIGNUP}
//         component={SignupScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name={SCREENS.HOME}
//         component={TabNavigator}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name={SCREENS.LANGUAGE}
//         component={LanguageScreen}
//         options={{headerBackTitleVisible: false}}
//       />
//     </Stack.Navigator>
//   );
// };

// const ProfileScreenWithDrawer = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName={SCREENS.PROFILE}
//       drawerContent={props => {
//         const {routeNames, index} = props.state;
//         const focused = routeNames[index];
//         console.log('focused', focused);

//         return (
//           <DrawerContentScrollView {...props}>
//             <View style={{alignItems: 'center', marginBottom: 20}}>
//               <Image source={IMAGES.LOGO} style={{height: 100, width: 100}} />
//               <Text
//                 style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
//                 Code With Abdul
//               </Text>
//             </View>
//             <DrawerItem
//               label={'Profile'}
//               onPress={() => {
//                 props.navigation.navigate(SCREENS.PROFILE);
//               }}
//               focused={focused === SCREENS.PROFILE}
//               activeBackgroundColor={COLORS.ORANGE}
//               inactiveBackgroundColor={COLORS.GRAY_LIGHT}
//               inactiveTintColor={COLORS.BLACK}
//               activeTintColor={COLORS.WHITE}
//             />
//             <DrawerItem
//               label={'Settings'}
//               onPress={() => {
//                 props.navigation.navigate(SCREENS.SETTING);
//               }}
//               focused={focused === SCREENS.SETTING}
//               activeBackgroundColor={COLORS.ORANGE}
//               inactiveBackgroundColor={COLORS.GRAY_LIGHT}
//               inactiveTintColor={COLORS.BLACK}
//               activeTintColor={COLORS.WHITE}
//             />
//             <DrawerItem
//               label={'About'}
//               onPress={() => {
//                 props.navigation.navigate(SCREENS.ABOUT);
//               }}
//               focused={focused === SCREENS.ABOUT}
//               activeBackgroundColor={COLORS.ORANGE}
//               inactiveBackgroundColor={COLORS.GRAY_LIGHT}
//               inactiveTintColor={COLORS.BLACK}
//               activeTintColor={COLORS.WHITE}
//             />
//           </DrawerContentScrollView>
//         );
//       }}>
//       <Drawer.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
//       <Drawer.Screen name={SCREENS.ABOUT} component={AboutScreen} />
//       <Drawer.Screen name={SCREENS.SETTING} component={SettingScreen} />
//     </Drawer.Navigator>
//   );
// };

// const TabNavigator = () => {
//   const {colors} = useTheme();

//   return (
//     <Tab.Navigator
//       initialRouteName={SCREENS.HOME}
//       screenOptions={{tabBarStyle: {backgroundColor: colors.tabbarBackground}}}>
//       <Tab.Screen
//         name={SCREENS.HOME}
//         component={HomeScreen}
//         options={{
//           title: 'Home',
//           tabBarIcon: ({focused}) => (
//             <Image
//               source={IMAGES.HOME}
//               style={{
//                 height: 30,
//                 width: 30,
//                 tintColor: focused
//                   ? colors.tabbarActiveColor
//                   : colors.tabbarInactiveColor,
//               }}
//             />
//           ),
//           tabBarActiveTintColor: colors.tabbarActiveColor,
//           tabBarInactiveTintColor: colors.tabbarInactiveColor,
//         }}
//       />
//       <Tab.Screen
//         name={SCREENS.WISHLIST}
//         component={WishlistScreen}
//         options={{
//           title: 'Wishlist',
//           tabBarIcon: ({focused}) => (
//             <Image
//               source={IMAGES.WISHLIST}
//               style={{
//                 height: 30,
//                 width: 30,
//                 tintColor: focused
//                   ? colors.tabbarActiveColor
//                   : colors.tabbarInactiveColor,
//               }}
//             />
//           ),
//           tabBarActiveTintColor: colors.tabbarActiveColor,
//           tabBarInactiveTintColor: colors.tabbarInactiveColor,
//         }}
//       />
//       <Tab.Screen
//         name={SCREENS.ORDERS}
//         component={OrdersScreen}
//         options={{
//           title: 'Orders',
//           tabBarIcon: ({focused}) => (
//             <Image
//               source={IMAGES.ORDERS}
//               style={{
//                 height: 30,
//                 width: 30,
//                 tintColor: focused
//                   ? colors.tabbarActiveColor
//                   : colors.tabbarInactiveColor,
//               }}
//             />
//           ),
//           tabBarActiveTintColor: colors.tabbarActiveColor,
//           tabBarInactiveTintColor: colors.tabbarInactiveColor,
//         }}
//       />
//       <Tab.Screen
//         name={SCREENS.PROFILE}
//         component={ProfileScreenWithDrawer}
//         options={{
//           title: 'Profile',
//           headerShown: false,
//           tabBarIcon: ({focused}) => (
//             <Image
//               source={IMAGES.PROFILE}
//               style={{
//                 height: 30,
//                 width: 30,
//                 tintColor: focused
//                   ? colors.tabbarActiveColor
//                   : colors.tabbarInactiveColor,
//               }}
//             />
//           ),
//           tabBarActiveTintColor: colors.tabbarActiveColor,
//           tabBarInactiveTintColor: colors.tabbarInactiveColor,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default StackNavigation;


export const AdsScreenWithDrawer = () => {
    return (
        <Drawer.Navigator
            initialRouteName={SCREENS.Ads}
            // screenOptions={
            //     headerShown: false,
            // } //ayad
            drawerContent={props => {
                const { routeNames, index } = props.state;
                const focused = routeNames[index];
                console.log('focused', focused);

                return (
                    <DrawerContentScrollView {...props}>
                        <View style={{
                            alignItems: 'center',
                            marginBottom: 10,
                            paddingBottom: 5,
                            borderBottomWidth: 1,
                            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                        }}>
                            <View style={{
                                borderRadius: '100%',
                                overflow: "hidden",
                                height: 100,
                                width: 100
                            }}>
                                <Image source={IMAGES.Icon} style={{ height: 100, width: 100 }} />
                            </View>
                            <Text
                                style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                                Code With Ayad
                            </Text>
                        </View>
                        <DrawerItem
                            label={'Ads'}
                            onPress={() => {
                                props.navigation.navigate(SCREENS.Ads);
                            }}
                            focused={focused === SCREENS.Ads}
                            activeBackgroundColor={'rgba(0, 132, 255, 0.8)'}
                            inactiveBackgroundColor={'lightgray'}
                            inactiveTintColor={'#000'}
                            activeTintColor={'#FFF'}
                            style={{ marginBottom: 2 }}
                        />
                        <DrawerItem
                            label={'Profile'}
                            onPress={() => {
                                props.navigation.navigate(SCREENS.Profile);
                            }}
                            focused={focused === SCREENS.Profile}
                            activeBackgroundColor={'rgba(0, 132, 255, 0.8)'}
                            inactiveBackgroundColor={'lightgray'}
                            inactiveTintColor={'#000'}
                            activeTintColor={'#FFF'}
                            style={{ marginBottom: 2 }}
                        />
                        <DrawerItem
                            label={'Friends'}
                            onPress={() => {
                                props.navigation.navigate(SCREENS.Friends);
                            }}
                            focused={focused === SCREENS.Friends}
                            activeBackgroundColor={'rgba(0, 132, 255, 0.8)'}
                            inactiveBackgroundColor={'lightgray'}
                            inactiveTintColor={'#000'}
                            activeTintColor={'#FFF'}
                            style={{ marginBottom: 2 }}
                        />
                    </DrawerContentScrollView>
                );
            }}>
            <Drawer.Screen name={SCREENS.Profile} component={ProfileScreen} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Ads} component={AdsScreen} />
            <Drawer.Screen name={SCREENS.Friends} component={FriendsStackNavigator} options={{ headerShown: false }} />
        </Drawer.Navigator>
    );
};

