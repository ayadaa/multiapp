import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../../types/navigation';
import { useAds } from '../../hooks/ad/use-ads';
import { useAuth } from '../../hooks/auth/use-auth';
import { useUser } from '../../hooks/user/use-user';
import { useChats } from '../../hooks/chat/use-chats';
import type { Ad } from '../../types/ads';

type AdDetailsScreenRouteProp = RouteProp<AppStackParamList, 'AdDetails'>;
type AdDetailsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'AdDetails'>;

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

export default function AdDetails() {
  const route = useRoute<AdDetailsScreenRouteProp>();
  const navigation = useNavigation<AdDetailsScreenNavigationProp>();
  const ad = route.params;
  const { user } = useAuth();
  const {
    formatTimestamp
  } = useAds(user?.uid || '');
  const {
    User,
    isLoadingUser,
    userError,
    refreshUser,
  } = useUser(ad.createdBy || '');

  /**
   * Handle send message button press - navigate to chat
   */
  const { createChat } = useChats(user?.uid || '');

  const handleSendMessagePress = async () => {
    try {
      const chatId = await createChat(ad.createdBy);
      if (User) {
        (navigation as any).navigate('IndividualChat', {
          chatId,
          otherUser: User,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start chat. Please try again.');
      console.error('Error creating chat:', error);
    }
  }

  const handleUpdateAdPress = (ad: Ad) => {
    navigation.navigate('UpdateAd', ad);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: ad.adPicture || 'https://firebasestorage.googleapis.com/v0/b/snap-clone-2b5a1.firebasestorage.app/o/images%2F9k%3D?alt=media&token=bbd617c3-f983-44ce-b633-8562ae1cb9f0' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{ad.title}</Text>
          <Text style={styles.location}>{ad.className}</Text>
          <Text style={styles.rooms}>{ad.typeName}</Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Text style={styles.ratings}>
              {ad.city}
            </Text>
          </View>
          <Text style={styles.footerPrice}> د.ع {ad.price}</Text>
          <View style={styles.divider} />
          {/* User profile details */}
          {User == null ?
            (
              <View><Text> . . . </Text></View>
            )
            : (
              <View style={styles.hostView}>
                {User?.profilePicture ? <Image source={{ uri: User.profilePicture }} style={styles.host} />
                  : <View style={styles.host}>
                    <Text>{User?.username?.charAt(0).toUpperCase() || '?'}</Text>
                  </View>
                }
                <View>
                  <Text style={{ fontWeight: '500', fontSize: 16 }}>{User.username}</Text>
                  <Text>{ad.createdAt ? formatTimestamp(ad.createdAt) : ''}</Text>
                </View>
                <TouchableOpacity
                  onPress={handleSendMessagePress}
                  style={styles.button}
                >
                  <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: 'mon-b',
                  }}>Send Message</Text>
                </TouchableOpacity>
                {(user?.uid == ad.createdBy) && <TouchableOpacity
                  onPress={() => handleUpdateAdPress(ad)}
                  style={styles.button}
                >
                  <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: 'mon-b',
                  }}>Update Ad</Text>
                </TouchableOpacity>}
              </View>
            )}
          <View style={styles.divider} />
          <Text style={styles.description}>{ad.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  rooms: {
    fontSize: 16,
    color: '#5E5D5E',
    marginVertical: 4,
    fontFamily: 'mon',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#5E5D5E',
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#5E5D5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  button: {
    backgroundColor: '#FF385C',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
});
