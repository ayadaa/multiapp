/**
 * Profile Screen
 * Displays user profile information and provides logout functionality
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearUser } from '../../store/slices/auth.slice';
import { Screen } from '../../components/common/Screen';
import Assets from "../../constants/Assets"

const FullWidth = Dimensions.get("screen").width;
const CardWidth_0 = Math.min(FullWidth, 500) - 20 * 2;
const CardWidth = Dimensions.get("window").width  - 20 * 2;
const CardHeight = CardWidth_0 / 1.8

export function WalletScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(clearUser());
          },
        },
      ]
    );
  };

  return (
    // <FlatList 
      // ListHeaderComponent={
        // <View style={{
        //   overflow: "hidden"
        //   , borderRadius: 28
        //   , width: CardWidth
        //   , height: CardHeight
        //   , marginBottom: 20
        //   , alignSelf: "center"
        // }}>
        //   <Image source={Assets.Card} style={{ position: "absolute", height: "100%", width: "100%" }} resizeMode="cover" />
          // <View style={{ paddingLeft: 28, paddingTop: 28 }}>
          //   <Text style={{ color: "#fff", fontWeight: "700", fontSize: 32 }}>$ 12222.74</Text>
          //   <Text style={{ color: "#fff", marginTop: 5, fontSize: 15 }}>≈ 345268.754 ₿</Text>
          // </View>
          // <View style={{ flex: 1, justifyContent: "flex-end", paddingLeft: 28, paddingBottom: 28 }}>
          //   <Text style={{ color: "#fff", marginTop: 20, fontSize: 10 }}>This balance is not real.</Text>
          // </View>
        // </View>
      // }
    // />
    <Screen style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
        </View> */}

        <View style={styles.card}>
          {/* <Text style={styles.headerTitle}>Cadr</Text>
          <Text style={styles.headerTitle}>Cadr</Text>
          <Text style={styles.headerTitle}>Cadr</Text> */}
          {/* <View style={{ paddingLeft: 28, paddingTop: 28 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 32 }}>$ 12222.74</Text>
            <Text style={{ color: "#fff", marginTop: 5, fontSize: 15 }}>≈ 345268.754 ₿</Text>
          </View> */}
          <View style={styles.balanceSection}>
            <Text style={styles.username}>{user?.balance || '1000'} 💎</Text>
            <Text style={styles.email}>{user?.balance / 10 || '100'} $</Text>
          </View>

          <View style={styles.balanceSection}>
            <Text style={styles.username}>@{user?.username || 'username'}</Text>
            <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        {/* Profile Info */}
        {/* <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="rgba(255, 255, 255, 0.8)" />
            </View>
          </View>
          
          <Text style={styles.username}>@{user?.username || 'username'}</Text>
          <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
        </View> */}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/*Mining ⛏💎 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>Mining ⛏💎</Text>
            </View>
            <View style={styles.menuItemLeft}>
              {/* <Text style={styles.menuItemText}>Start Mining</Text> */}
              {/* <Text style={styles.menuItemText}>23:54:10</Text> */}
              <Text style={styles.menuItemText}>Collection</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.4)" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.4)" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.4)" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.menuItemText}>Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.4)" />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        {/* <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View> */}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Snap Factor v1.0</Text>
          <Text style={styles.appInfoText}>Built with React Native & Firebase</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    borderRadius: 12,
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
    color: 'white',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: 'rgba(255, 255, 255, 0.8)',
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
}); 