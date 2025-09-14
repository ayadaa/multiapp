import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { AppStackParamList } from '../../types/navigation';
import { P2PCreateRequestForm } from '../../components/forms/P2PCreateRequestForm';
import { Screen } from '../../components/common/Screen2';
import i18n from '../../language/i18n';

type AdDetailsScreenRouteProp = RouteProp<AppStackParamList, 'P2PCreateRequest'>;

export default function P2PCreateRequestScreen() {
  const route = useRoute<AdDetailsScreenRouteProp>();
  // const navigation = useNavigation<AdDetailsScreenNavigationProp>();
  const ad = route.params;
  // const { user } = useAuth();
  // const {
  //   formatTimestamp
  // } = useAds(user?.uid || '');
  // const {
  //   User,
  //   isLoadingUser,
  //   userError,
  //   refreshUser,
  // } = useUser(ad.createdBy || '');

  return (
    <Screen>
      {/* <View style={styles.infoContainer}> */}
      <View
        // onPress={() => handleAdPress(ad)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(5, 4, 4, 0.1)',
          // marginBottom: 24
        }}
      >
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          // backgroundColor: 'rgba(0, 200, 100, 0.8)',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
          overflow: "hidden",
        }}>
          {/* <Ionicons name="people" size={24} color="#FFFFFF" /> */}
          <Image
            source={{ uri: ad.profilePicture || 'https://firebasestorage.googleapis.com/v0/b/snap-clone-2b5a1.firebasestorage.app/o/images%2F9k%3D?alt=media&token=bbd617c3-f983-44ce-b633-8562ae1cb9f0' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}>
            <Text style={{
              color: '#000000',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
              {/* {ad.creatorUsername} */}
              {/* {ad.username} */}
              {/* {ad.username}   {((ad.requests! - ad.completeRequests!) / ad.requests!) * 100} % */}
              {ad.username}   {(Math.round(((ad.requests! - ad.approvedRequests!) / ad.requests!) * 100) / 100) * 100} %
            </Text>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: 12,
            }}>
              {ad.price} {i18n.t('IQD')}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.8)',
              fontSize: 14,
              // flex: 1,
            }} numberOfLines={1}>
              {ad.paymentMethod}  {ad.requests!}
            </Text>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.8)',
              fontSize: 14,
              // flex: 1,
            }} numberOfLines={1}>
              {ad.amount} 💎
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <P2PCreateRequestForm
          ad={ad}
        />
      </View>
      {/* </View> */}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    backgroundColor: '#FFFFFF',
  },
  // image: {
  //   height: IMG_HEIGHT,
  //   width: width,
  // },
  infoContainer: {
    padding: 24,
    // backgroundColor: '#fff',
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
    color: '#FF385C',
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
    borderColor: '#5E5D5E',
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
  image: {
    height: 50,
    width: 50,
    // borderRadius: "100%", // This will make it a circle
    // overflow: "hidden",
  },
});
