import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks';
import { useWallet } from '../../hooks/wallet/use-wallet';
import { useUser } from '../../hooks/user/use-user';
import { Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { FloatingAction } from "react-native-floating-action";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Screen } from '../../components/common/Screen2';
import i18n from '../../language/i18n';

const FullWidth = Dimensions.get("screen").width;
const CardWidth_0 = Math.min(FullWidth, 300) - 20 * 2;
const CardWidth = Dimensions.get("window").width - 20 * 2;
const CardHeight = CardWidth_0 / 1.8

export function WalletScreen() {
  const navigation = useNavigation<any>();
  const user = useAppSelector((state) => state.auth.user);
  const { User, isLoadingUser, userError, refreshUser } = useUser(user?.uid || '');
  const { collect, transactions, isLoadingTransactions, refreshTransactions, transactionsError } = useWallet(user?.uid || '');
  const [time, setTime] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const actions = [
    {
      text: i18n.t('send'),
      icon: <MaterialIcons name="call-received" size={24} color="white" style={{ transform: [{ rotate: '180deg' }] }} />,
      name: "bt_send",
      position: 1
    },
    {
      text: i18n.t('receive'),
      icon: <MaterialIcons name="call-received" size={24} color="white" />,
      name: "bt_receive",
      position: 2
    },
  ];

  //set time
  useEffect(() => {
    setTimeout(() => {
      const miningEndTime = User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis();
      const timeDiff = miningEndTime - Timestamp.now().toMillis();
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
    return `${hours}: ${minutes}: ${seconds}`;
  }

  // Handle collection
  const handleCollection = useCallback(async () => {
    const newBalance = await collect(user?.uid || '0')
    console.log('newBalance', newBalance)
    Alert.alert(
      'collection',
      `collection complete successfully! New balance ${newBalance}`,
    );
    refreshUser();
  }, [user?.uid]);

  const navigateToSend = () => {
    navigation.navigate('Send');
  }

  const navigateToReceive = () => {
    navigation.navigate('Receive');
  }

  const navigateToMiningOffers = () => {
    navigation.navigate('MiningOffers');
  }

  //format time
  const formatTimestamp = React.useCallback((timestamp: any): string => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  }, []);

  return (
    <Screen>
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
          <Text style={styles.title}>{i18n.t('wallet')}</Text>
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
            <Text style={styles.retryText}>{i18n.t('retry')}</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingUser && isLoadingTransactions}
            onRefresh={() => {
              refreshUser();
              refreshTransactions(user?.uid!);
            }}
            tintColor="white"
          />
        }
      >
        {/* card */}
        <View style={styles.card}>
          <View style={styles.balanceSection}>
            <Text style={styles.username}>{Math.round((User?.balance || 0) * 1000) / 1000} 💎</Text>
            <Text style={styles.email}>{Math.round((User?.balance ? User.balance * 1.35 : 0) * 1000) / 1000} {i18n.t('IQD')}</Text>
          </View>
          <View style={styles.balanceSection}>
            <Text style={styles.username}>@{user?.username!}</Text>
            <Text style={styles.email}>{user?.email!}</Text>
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
              <Text style={styles.menuItemText}>{i18n.t('mining')} ⛏ : {User?.miningSpeed || 0}💎 / {i18n.t('day')}</Text>
            </View>
            <View style={styles.menuItemLeft}>
              {(User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis()) - Timestamp.now().toMillis() > 0 && <Text style={styles.menuItemText}>{getFormattedTime(time)}</Text>}
              {(User?.miningEndTime ? User.miningEndTime.toMillis() : Timestamp.now().toMillis()) - Timestamp.now().toMillis() <= 0 && <Text style={styles.menuItemText}>{i18n.t('collection')}</Text>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToMiningOffers}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>{i18n.t('updateMiningSpeed')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
          </TouchableOpacity>

        </View>
        {/* Transactions View */}
        <View style={styles.transactionsContainer}>
          <View>
            <Text>{i18n.t('transactions')}: </Text>
            {transactions.length > 0 && <View style={{ marginTop: 3 }}> {transactions.map((transaction) => (
              <View
                key={transaction.id}
                style={styles.transactionItem}
              >
                <View style={[{
                  width: 70,
                  height: 25,
                  borderRadius: 10,
                  // backgroundColor: 'rgba(0, 200, 100, 0.8)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                },
                (transaction.sender == user?.uid) ? { backgroundColor: 'rgba(200, 0, 0, 0.8)' } : { backgroundColor: 'rgba(0, 200, 100, 0.8)' }
                ]}>
                  <Text style={{
                    color: 'black',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>{(transaction.sender == user?.uid) ? i18n.t('send') : i18n.t('receive')}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                    <Text style={{
                      color: 'rgba(0, 0, 0, 1)',
                      fontSize: 12,
                    }}>
                      {transaction.amount} 💎
                    </Text>
                    <Text style={{
                      color: 'rgba(0, 0, 0, 1)',
                      fontSize: 12,
                    }}>
                      {formatTimestamp(transaction.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}</View>}
          </View>
          {isLoadingTransactions && <View>
            <Text>{i18n.t('loadingTransactions')}</Text>
          </View>}
        </View>
      </ScrollView>
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
    </Screen>
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
    fontWeight: 500,
    marginBottom: 2,
  },
  card: {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    height: CardHeight,
    backgroundColor: 'rgba(0, 132, 255, 1)',
    borderColor: 'rgba(0, 132, 255, 0.95)',
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
  transactionsContainer: {
    marginVertical: 5,
    marginHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    marginVertical: 2,
    borderRadius: 16,
    height: 50,
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
