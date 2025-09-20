import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  // ScrollView,
  Image,
  // RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import { clearUser } from '../../store/slices/auth.slice';
import { Screen } from '../../components/common/Screen2';
import i18n, { updateLocale } from '../../language/i18n'; // Import your i18n instance
// import { Picker } from '@react-native-picker/picker';
import type { AppStackParamList } from '../../types/navigation';
import { type StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
// import { UserProfile } from '../../services/firebase/firestore.service'
import { useChats } from '../../hooks/chat/use-chats';
import { useUser } from '../../hooks/user/use-user';

type UserProfileScreenRouteProp = RouteProp<AppStackParamList, 'UserProfile'>;
type UserProfileScreenNavigationProp = StackNavigationProp<AppStackParamList, 'UserProfile'>;

export function UserProfileScreen() {
  const route = useRoute<UserProfileScreenRouteProp>();
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const uIdParam = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { User, isLoadingUser, userError, refreshUser } = useUser(uIdParam.uId);

  // chat navigation
  const { createChat } = useChats(user?.uid!);

  const handleSendAMessage = async () => {
    try {
      const chatId = await createChat(uIdParam.uId);
      // const message = i18n.t('p2pRequestMessage') + `${amount}.`
      if (User) {
        (navigation as any).navigate('IndividualChat', {
          chatId,
          otherUser: User,
          // message: message, //ayad
        });
      }
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('failedToStartChat'));
      console.error('Error creating chat:', error);
    }
  }

  return (
    <Screen>
      <View>
        {/* Header */}
        <View style={styles.header0}>
          <TouchableOpacity
            style={styles.headerBackButton}
            // onPress={handleAdsNavigate}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>{isLoadingUser ? i18n.t('userProfile') : User?.username}</Text>
        </View>

        {isLoadingUser ? (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: 16 }}>
              {i18n.t('loading')}
            </Text>
          </View>
        ) : userError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
            {/* <Text style={styles.errorText}>{p2pAdsError}</Text> */}
            <Text style={styles.errorText}>{userError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refreshUser}
            >
              <Text style={styles.retryText}>{i18n.t('retry')}</Text>
            </TouchableOpacity>
          </View>
        ) :
          // Profile Info 
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
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
                    {User?.username.charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
              }
            </View>
            {User?.displayName && <Text style={styles.displayName}>{User?.displayName}</Text>}
            <Text style={styles.username}>@{User?.username!}</Text>
            {/* <Text style={styles.email}>{User?.email!}</Text> */}
            <View style={styles.updateButtonContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleSendAMessage}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuItemText}>{i18n.t('SendAMessage')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
              </TouchableOpacity>
            </View>
          </View>}
      </View>
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
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
  },
  username: {
    color: 'Black',
    fontSize: 20,
    fontWeight: '600',
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
