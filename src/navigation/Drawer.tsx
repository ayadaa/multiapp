import {
    DrawerContentScrollView,
    DrawerItem,
    createDrawerNavigator,
} from '@react-navigation/drawer';
import SCREENS from '../screens';
import { Image, Text, View, Button } from 'react-native';
import { AdsScreen } from '../screens/ads/AdsScreen';
import { FriendsStackNavigator } from './FriendsStackNavigator';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { P2PAdsScreen } from '../screens/p2pads/P2PAdsScreen';
import { WalletScreen } from '../screens/wallet/WalletScreen';
import { useAppSelector } from './../store/hooks';
import { useUser } from './../hooks/user/use-user';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { ReferralScreen } from '../screens/profile/ReferralScreen';
// import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../store/slices/language.slice';
import i18n from '../language/i18n'; // Import your i18n instance

const renderHeader = () => {
    const user = useAppSelector((state) => state.auth.user);
    const { User } = useUser(user?.uid || '');

    const dispatch = useDispatch();
    const currentLanguage = useAppSelector((state) => state.language.currentLanguage);
    i18n.locale = currentLanguage; // handle current language

    const handleChangeLanguage = (lang: string) => {
        dispatch(setLanguage(lang));
    };

    return (
        <View style={{
            alignItems: 'center',
            marginBottom: 10,
            paddingBottom: 5,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        }}>
            {/* <View style={{
                borderRadius: '100%',
                overflow: "hidden",
                height: 100,
                width: 100
            }}>
                <Image source={{ uri: User?.profilePicture || 'https://firebasestorage.googleapis.com/v0/b/snap-clone-2b5a1.firebasestorage.app/o/chatImages%2Fd4e908d0-cf99-452f-9df5-e26f406cec9f?alt=media&token=9da6b3b3-5694-4e60-9920-23baa72fb73f' }}
                    style={{ height: 100, width: 100 }}
                />
            </View> */}
            {User?.profilePicture ? <View style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: "hidden",
            }}>
                <Image
                    source={{ uri: User.profilePicture }}
                    style={{ height: 100, width: 100 }}
                    resizeMode="cover"
                />
            </View>
                : <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    backgroundColor: 'rgba(0, 132, 255, 0.8)',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{ fontSize: 18, color: '#000000' }}>
                        {user?.username?.charAt(0).toUpperCase() || '?'}
                    </Text>
                </View>
            }
            {User?.displayName && <Text
                style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}
            >
                {User?.displayName}
            </Text>}
            <Text
                style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
            >
                @{user?.username}
            </Text>
            {/* language */}
            <View>
                <Text>{currentLanguage}</Text>
                <Text>{i18n.t('greeting')}</Text>
                <Text>{i18n.t('welcomeMessage')}</Text>
                <Button title="Set English" onPress={() => handleChangeLanguage('en')} />
                <Button title="Set Arabic" onPress={() => handleChangeLanguage('ar')} />
            </View>
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
                            icon={({ color, size }) => (<Ionicons name="person" size={20} color="rgba(0, 0, 0, 0.8)" />)}
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
                            icon={({ color, size }) => (<FontAwesome5 name="user-friends" size={20} color="rgba(0, 0, 0, 0.8)" />)}
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
                        <DrawerItem
                            label={'Referral'}
                            icon={() => (<Ionicons name="person-add" size={20} color="rgba(0, 0, 0, 0.8)" />)}
                            onPress={() => {
                                props.navigation.navigate(SCREENS.Referral);
                            }}
                            focused={focused === SCREENS.Referral}
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
            <Drawer.Screen name={SCREENS.Referral} component={ReferralScreen} options={{ headerShown: false }} />
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
                        <DrawerItem
                            label={'Referral'}
                            icon={() => (<Ionicons name="person-add" size={20} color="rgba(0, 0, 0, 0.8)" />)}
                            onPress={() => {
                                props.navigation.navigate(SCREENS.Referral);
                            }}
                            focused={focused === SCREENS.Referral}
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
                    headerShown: false
                }}
            />
            <Drawer.Screen name={SCREENS.Profile} component={ProfileScreen} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Friends} component={FriendsStackNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Referral} component={ReferralScreen} options={{ headerShown: false }} />
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
                        <DrawerItem
                            label={'Referral'}
                            icon={() => (<Ionicons name="person-add" size={20} color="rgba(0, 0, 0, 0.8)" />)}
                            onPress={() => {
                                props.navigation.navigate(SCREENS.Referral);
                            }}
                            focused={focused === SCREENS.Referral}
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
                    headerShown: false
                }}
            />
            <Drawer.Screen name={SCREENS.Profile} component={ProfileScreen} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Friends} component={FriendsStackNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Referral} component={ReferralScreen} options={{ headerShown: false }} />
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
                        <DrawerItem
                            label={'Referral'}
                            icon={() => (<Ionicons name="person-add" size={20} color="rgba(0, 0, 0, 0.8)" />)}
                            onPress={() => {
                                props.navigation.navigate(SCREENS.Referral);
                            }}
                            focused={focused === SCREENS.Referral}
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
                    headerShown: false
                }}
            />
            <Drawer.Screen name={SCREENS.Profile} component={ProfileScreen} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Friends} component={FriendsStackNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name={SCREENS.Referral} component={ReferralScreen} options={{ headerShown: false }} />
        </Drawer.Navigator>
    );
}
