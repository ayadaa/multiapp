import {
    DrawerContentScrollView,
    DrawerItem,
    createDrawerNavigator,
} from '@react-navigation/drawer';
import SCREENS from '../screens';
import { Image, SafeAreaView, Text, View } from 'react-native';
import IMAGES from '../assets';
import { AdsScreen } from '../screens/ads/AdsScreen';
import { FriendsStackNavigator } from './FriendsStackNavigator';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { P2PAdsScreen } from '../screens/p2pads/P2PAdsScreen';
import { WalletScreen } from '../screens/wallet/WalletScreen';

const renderHeader = () => {
    return (
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
    );
}
const Drawer = createDrawerNavigator();

export const AdsScreenWithDrawer = () => {
    return (
        <Drawer.Navigator
            initialRouteName={SCREENS.Ads}
            drawerContent={props => {
                const { routeNames, index } = props.state;
                const focused = routeNames[index];
                console.log('focused', focused);

                return (
                    <DrawerContentScrollView {...props}>
                        {renderHeader()}
                        {/* <DrawerItem
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
                        /> */}
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
            <Drawer.Screen name={SCREENS.Ads} component={AdsScreen}
                options={{
                    drawerLabelStyle: {
                        fontSize: 16,
                    },
                    headerShown: false
                }}
            />
            <Drawer.Screen name={SCREENS.Profile} component={ProfileScreen} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Friends} component={FriendsStackNavigator} options={{ headerShown: false }} />
        </Drawer.Navigator>
    );
};

export const ChatScreenWithDrawer = () => {
    return (
        <Drawer.Navigator
            initialRouteName={SCREENS.Chat}
            drawerContent={props => {
                const { routeNames, index } = props.state;
                const focused = routeNames[index];
                console.log('focused', focused);

                return (
                    <DrawerContentScrollView {...props}>
                        {renderHeader()}
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
            <Drawer.Screen name={SCREENS.Chat} component={ChatScreen}
                options={{
                    drawerLabelStyle: {
                        fontSize: 16,
                    },
                }}
            />
            <Drawer.Screen name={SCREENS.Profile} component={ProfileScreen} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Friends} component={FriendsStackNavigator} options={{ headerShown: false }} />
        </Drawer.Navigator>
    );
};

export const P2PAdsScreenWithDrawer = () => {
    return (
        <Drawer.Navigator
            initialRouteName={SCREENS.P2PAds}
            drawerContent={props => {
                const { routeNames, index } = props.state;
                const focused = routeNames[index];
                console.log('focused', focused);

                return (
                    <DrawerContentScrollView {...props}>
                        {renderHeader()}
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
            <Drawer.Screen name={SCREENS.P2PAds} component={P2PAdsScreen}
                options={{
                    drawerLabelStyle: {
                        fontSize: 16,
                    },
                }}
            />
            <Drawer.Screen name={SCREENS.Profile} component={ProfileScreen} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Friends} component={FriendsStackNavigator} options={{ headerShown: false }} />
        </Drawer.Navigator>
    );
};

export const WalletScreenWithDrawer = () => {
    return (
        <Drawer.Navigator
            initialRouteName={SCREENS.Wallet}
            drawerContent={props => {
                const { routeNames, index } = props.state;
                const focused = routeNames[index];
                console.log('focused', focused);

                return (
                    <DrawerContentScrollView {...props}>
                        {renderHeader()}
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
            <Drawer.Screen name={SCREENS.Wallet} component={WalletScreen}
                options={{
                    drawerLabelStyle: {
                        fontSize: 16,
                    },
                }}
            />
            <Drawer.Screen name={SCREENS.Profile} component={ProfileScreen} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Friends} component={FriendsStackNavigator} options={{ headerShown: false }} />
        </Drawer.Navigator>
    );
};