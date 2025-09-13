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
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearUser } from '../../store/slices/auth.slice';
import { Screen } from '../../components/common/Screen2';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../hooks/user/use-user';
import AdSearchCard from '../../components/cards/AdSearchCard';
import { useAds } from '../../hooks/ad/use-ads';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../store/slices/language.slice';
import i18n, { updateLocale } from '../../language/i18n'; // Import your i18n instance
import { Picker } from '@react-native-picker/picker';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { User } = useUser(user?.uid!);
  const { personAds, isLoadingPersonAds, personAdsError, refreshPersonAds } = useAds(user?.uid!);
  const dispatch2 = useDispatch();
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);
  i18n.locale = currentLanguage; // handle current language

  const handleChangeLanguage = (lang: string) => {
    dispatch2(setLanguage(lang));
    // updateLocale(lang); //ayad
  };
  /**
   * Handle logout with confirmation
   */
  // const handleLogout = () => {
  //   Alert.alert(
  //     'Logout',
  //     'Are you sure you want to logout?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Logout',
  //         style: 'destructive',
  //         onPress: () => {
  //           dispatch(clearUser());
  //         },
  //       },
  //     ]
  //   );
  // };
  const handleLogout = () => {
    dispatch(clearUser());
  };

  // const handleAdsNavigate = () => {
  //   navigation.navigate('Ads' as never);
  // };

  // Handle refresh
  const handleRefresh = async () => {
    console.log('handleRefresh called');
    try {
      await refreshPersonAds(user?.uid);
    } catch (error) {
      console.error('Error refreshing ads:', error);
    }
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingPersonAds}
            onRefresh={() => handleRefresh()}
            tintColor="white"
          />
        }
      >
        {/* Header */}
        {/* Header */}
        <View style={styles.header0}>
          <TouchableOpacity
            style={styles.headerBackButton}
            // onPress={handleAdsNavigate}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
        </View>
        {/* <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View> */}

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {/* <View style={styles.avatar}> */}
            {/* <Ionicons name="person" size={48} color="rgba(0, 0, 0, 0.8)" /> */}
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
                  {user?.username.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            }
            {/* </View> */}
          </View>
          {User?.displayName && <Text style={styles.displayName}>{User?.displayName}</Text>}
          <Text style={styles.username}>@{user?.username!}</Text>
          <Text style={styles.email}>{user?.email!}</Text>
          <View style={styles.updateButtonContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (User) {
                  navigation.navigate('UpdateProfile', User)
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemText}>Update Your Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (User) {
                  navigation.navigate('Referral')
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemText}>Referral program</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity> */}
          </View>
          {/* language */}
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              minWidth: 120,
              // height: 60,
              borderRadius: 12,
              paddingHorizontal: 2,
              paddingVertical: 1,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <Picker
              selectedValue={currentLanguage}
              style={{
                // flex: 1,
                minWidth: 120,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.2)',
                fontSize: 12,
                color: '#000000',
              }}
              onValueChange={(itemValue) => {
                handleChangeLanguage(itemValue);
              }}
            >
              <Picker.Item label='العربية' value='ar' />
              <Picker.Item label='English' value='en' />
            </Picker>
          </View>
        </View>

        {/* Menu Items */}
        {/* <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="person-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="settings-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="help-circle-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>

            </TouchableOpacity>
          </View> */}

        {/* Person ads section */}
        {/* Error State */}
        {personAdsError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
            <Text style={styles.errorText}>{personAdsError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => handleRefresh()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* ads list */}
        <View style={styles.adsSection}>
          <Text style={styles.adsHeaderText}>Your ads:</Text>
          {personAds?.length! > 0 ? <View>
            {personAds?.map((ad) => (
              <AdSearchCard key={ad.id} ad={ad} />
            ))}
          </View>
            : <Text style={styles.adsEmptyText}>You don't have any ads yet.</Text>
          }
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>MultiApp v1.0</Text>
          <Text style={styles.appInfoText}>Built with React Native & Firebase</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header0: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontWeight: 500,
    color: 'Black',
    marginBottom: 2,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerBackButton: {
    padding: 8,
    marginRight: 8,
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
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  displayName: {
    color: 'Black',
    fontSize: 24,
    fontWeight: '600',
    // marginBottom: 4,
  },
  username: {
    color: 'Black',
    fontSize: 20,
    fontWeight: '600',
    // marginBottom: 4,
  },
  email: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 16,
  },
  updateButtonContainer: {
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
  adsSection: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  adsHeaderText: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 16,
    marginLeft: 12,
  },
  adsEmptyText: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 14,
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
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 12,
    marginBottom: 4,
  },
}); 