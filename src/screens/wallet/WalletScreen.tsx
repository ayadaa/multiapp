import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks';
import { clearUser } from '../../store/slices/auth.slice';
import { Screen } from '../../components/common/Screen';
import Assets from "../../constants/Assets"
import { useWallet } from '../../hooks/wallet/use-wallet';
import { useUser } from '../../hooks/user/use-user';
import { Timestamp } from 'firebase/firestore';
import { ref } from 'firebase/storage';
// import { Timestamp } from "firebase-admin/firestore";
import { useNavigation } from '@react-navigation/native';
// import MiningOffersBottomSheet from '../../components/bottomSheet/MiningOffersBottomSheet'
// import BottomSheet from "@gorhom/bottom-sheet";
import { FloatingAction } from "react-native-floating-action";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const actions = [
  {
    text: "Send",
    icon: <MaterialIcons name="call-received" size={24} color="white" style={{ transform: [{ rotate: '180deg' }] }} />,
    name: "bt_send",
    position: 1
  },
  {
    text: "Receive",
    icon: <MaterialIcons name="call-received" size={24} color="white" />,
    name: "bt_receive",
    position: 2
  },
];

const FullWidth = Dimensions.get("screen").width;
const CardWidth_0 = Math.min(FullWidth, 300) - 20 * 2;
const CardWidth = Dimensions.get("window").width - 20 * 2;
const CardHeight = CardWidth_0 / 1.8

export function WalletScreen() {
  const navigation = useNavigation<any>();
  const user = useAppSelector((state) => state.auth.user);
  const { User, isLoadingUser, userError, refreshUser } = useUser(user?.uid || '');
  const { collect } = useWallet();
  // const [time, setTime] = useState<number>(1 * 24 * 60 * 60 * 1000);
  const [time, setTime] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // const bottomSheetRef = React.useRef<BottomSheet>(null);
  // const snapPoints = React.useMemo(() => ["25%", "50%", "75%"], []);

  // const showBottomSheet = React.useCallback(() => {
  //   bottomSheetRef.current?.expand();
  // }, []);

  // const [minEndTime, setMinEndTime] = useState<number>(User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis());
  // const date = new Date().getTime();
  // const date = new Date().getTime();
  // const miningEndTime = User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis();
  // const timeDiff = miningEndTime - date;
  // setTime(timeDiff);

  //set time
  useEffect(() => {
    // const date = new Date().getTime();
    // const miningEndTime = User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis();
    // const timeDiff = miningEndTime - date;
    // setTime(timeDiff);

    setTimeout(() => {
      // setTime((prevTime) => prevTime - 1000);
      const miningEndTime = User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis();
      // const timeDiff = miningEndTime - date;
      const timeDiff = miningEndTime - Timestamp.now().toMillis();
      // console.log('miningEndTime, timeDiff, User?.miningEndTime!.toMillis()', miningEndTime, timeDiff, User?.miningEndTime!.toMillis())
      setTime(timeDiff);
    }, 1000);
    //set is desable
    if (((User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis()) - Timestamp.now().toMillis()) > 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [time, User?.miningEndTime]);

  const getFormattedTime = (milliSeconds: number) => {
    const seconds = Math.floor((milliSeconds / 1000) % 60);
    const minutes = Math.floor((milliSeconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliSeconds / (1000 * 60 * 60)) % 24);
    // const days = Math.floor(milliSeconds / (1000 * 60 * 60 * 24));

    // return `${days}: ${hours}: ${minutes}: ${seconds}`;
    return `${hours}: ${minutes}: ${seconds}`;
  }


  /**
   * Handle collection
   */
  const handleCollection = useCallback(async () => {
    // if (((User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis()) - Timestamp.now().toMillis()) > 0) {
    //   return console.log('mining end time not reached');
    // }

    const newBalance = await collect(user?.uid || '0')
    console.log('newBalance', newBalance)
    Alert.alert(
      'collection',
      `collection completed successfukky! New balance ${newBalance}`,
    );
    refreshUser();
    // setMinEndTime(User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis())
  }, [user?.uid]);

  const navigateToSend = () => {
    navigation.navigate('Send');
  };

  const navigateToReceive = () => {
    navigation.navigate('Receive');
  };

  const navigateToMiningOffers = () => {
    navigation.navigate('MiningOffers');
  };

  return (
    // <Screen backgroundColor="#FFFFFF">
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
        </View> */}
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerDrawerButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Text style={{ color: 'Black', fontSize: 20, fontWeight: 'bold', }}> ☰ </Text>
          {/* <Ionicons name="menu" size={24} color="#000000" /> */}
          {/* <Entypo name="menu" size={24} color="black" /> */}
          {/* <Feather name="menu" size={24} color="black" /> */}
          {/* <MaterialIcons name="menu" size={24} color="black" /> */}
          {/* <AntDesign name="menuunfold" size={24} color="black" /> */}
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Wallet</Text>
        </View>
      </View>

      {/* Error State */}
      {userError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#FF3B30" />
          <Text style={styles.errorText}>{userError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshUser}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingUser}
            onRefresh={refreshUser}
            tintColor="white"
          />
        }
      >
        {/* card */}
        <View style={styles.card}>
          <View style={styles.balanceSection}>
            <Text style={styles.username}>{Math.round((User?.balance || 0) * 1000) / 1000} 💎</Text>
            <Text style={styles.email}>{Math.round((User?.balance ? User.balance * 1.35 : 0) * 1000) / 1000} د.ع</Text>
          </View>
          <View style={styles.balanceSection}>
            <Text style={styles.username}>@{user?.username || 'username'}</Text>
            <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>
        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/*Mining ⛏💎 */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // collect(user?.uid || '0')
              handleCollection();
            }}
            disabled={isDisabled}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>Mining ⛏💎 : {User?.miningSpeed || 0} / day</Text>
            </View>
            <View style={styles.menuItemLeft}>
              {/* <Text style={styles.menuItemText}>Start Mining</Text> */}
              {/* <Text style={styles.menuItemText}>{getFormattedTime(time)}</Text> */}
              {/* <Text style={styles.menuItemText}>Collection</Text> */}
              {(User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis()) - Timestamp.now().toMillis() > 0 && <Text style={styles.menuItemText}>{getFormattedTime(time)}</Text>}
              {(User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis()) - Timestamp.now().toMillis() <= 0 && <Text style={styles.menuItemText}>Collection</Text>}
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={navigateToSend}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="person-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Send</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity> */}

          {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={navigateToReceive}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="settings-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Receive</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToMiningOffers}
          >
            <View style={styles.menuItemLeft}>
              {/* <Ionicons name="help-circle-outline" size={20} color="rgba(0, 0, 0, 0.8)" /> */}
              <Text style={styles.menuItemText}>Update mining speed</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity> */}
        </View>
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Snap Factor v1.0</Text>
          <Text style={styles.appInfoText}>Built with React Native & Firebase</Text>
        </View>
      </ScrollView>
      {/* <MiningOffersBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} /> */}
      <FloatingAction
        actions={actions}
        onPressItem={(name) => {
          if (name === "bt_send") {
            navigateToSend();
          } else if (name === "bt_receive") {
            navigateToReceive();
          }
        }
        }
      />
    </View>
    // </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerDrawerButton: {
    padding: 8,
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: 'Black',
    // fontWeight: 'bold',
    fontWeight: 500,
    marginBottom: 2,
  },
  card: {
    paddingTop: 10,
    // paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginHorizontal: 20,
    // marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
    // borderRadius: 12,
    marginBottom: 8,
    height: CardHeight,
    // backgroundColor: '#000000',
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    color: 'Black',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  username: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  menuSection: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 16,
    marginLeft: 12,
  },
  logoutSection: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  appInfoText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    color: 'Black',
    fontSize: 14,
    fontWeight: '600',
  },
}); 