import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import listingsData from './airbnb-listings.json';
import { Ionicons } from '@expo/vector-icons';
import Colors from './AdDetailsColors';
import { defaultStyles } from './AdDetailsStyle';
import type { AppStackParamList, NavigationProp } from '../../types/navigation';
// import { formatTimestamp } from '../../functions/formatTimestamp';
import { useAds } from '../../hooks/ad/use-ads';
import { useAuth } from '../../hooks/auth/use-auth';
import { useUser } from '../../hooks/user/use-user';
import { useChats } from '../../hooks/chat/use-chats';

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

  // const { id } = useLocalSearchParams();
  const id = "9689519"
  const listing = (listingsData as any[]).find((item) => item.id === id);
  // const listing = (listingsData as any[])[0]

  // const handleFormatTimestamp = (tx: any) => {
  //   return formatTimestamp(tx)
  // }

  const { createChat } = useChats(user?.uid || '');
  
  /**
   * Handle send message button press - navigate to chat
   */
  const handleSendMessagePress = async () => {
    try {
      // const { createChat } = useChats(user?.uid || '');
      const chatId = await createChat(User?.uid || '');

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
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: listing.xl_picture_url }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{ad.title}</Text>
          <Text style={styles.location}>{ad.className}</Text>
          <Text style={styles.rooms}>{ad.typeName}</Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {listing.review_scores_rating / 20} · {listing.number_of_reviews} reviews
            </Text>
          </View>
          <Text style={styles.footerPrice}>€{listing.price}</Text>

          <View style={styles.divider} />

          {/* User profile details */}
          {User == null ?
          (
          <View><Text> . . . </Text></View>
          )
          :(
            <View style={styles.hostView}>
              <Image source={{ uri: listing.host_picture_url }} style={styles.host} />

              <View>
                <Text style={{ fontWeight: '500', fontSize: 16 }}>{User.username}</Text>
                <Text>{ad.createdAt? formatTimestamp(ad.createdAt): ''}</Text>
              </View>

              <TouchableOpacity 
                onPress={handleSendMessagePress}
                style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}
              >
                <Text style={defaultStyles.btnText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.description}>{ad.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

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
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: 'mon',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
});
