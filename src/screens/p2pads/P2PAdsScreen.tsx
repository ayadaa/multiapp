import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useAds } from '../../hooks/ad/use-ads';
import { useAuth } from '../../hooks/auth/use-auth';
import type { Ad } from '../../types/ads';
import type { NavigationProp } from '../../types/navigation';
import { useP2PAds } from '../../hooks/p2pAd/use-p2pAds';
import type { P2PAd, P2PRequest } from '../../types/p2pads';
import type { UserProfile } from '../../services/firebase/firestore.service'

export function P2PAdsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  // const {
  //   ads,
  //   isLoadingAds,
  //   adsError,
  //   refreshAds,
  //   formatTimestamp
  // } = useAds(user?.uid || '');
  const {
    p2pAdsWithUsers: ads,
    isLoadingP2PAdsWithUsers: isLoadingAds,
    p2pAdsWithUsersError: adsError,
    refreshP2PAdsWithUsers,
    p2pRequestsWithUsers,
    isLoadingP2PRequestsWithUsers,
    p2pRequestsWithUsersError,
    refreshP2PRequestsWithUsers,
    completeP2PRequest,
    approveP2PRequest,
    cancelP2PRequest,
    rejectP2PRequest,
  } = useP2PAds();

  // create p2p ad
  const handleCreateP2PAdPress = () => {
    navigation.navigate('P2PCreateAd' as never); //ayad
  }

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refreshP2PAdsWithUsers();
    } catch (error) {
      console.error('Error refreshing p2p ads:', error);
    }
  };

  // handle p2p ad press
  const handleAdPress = (p2pAdWithUser: P2PAd & UserProfile) => {
    navigation.navigate('P2PCreateRequest', p2pAdWithUser);
  }

  return (
    <Screen backgroundColor="#FFFFFF" statusBarStyle="light-content">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>P2P Ads</Text>
            <Text style={styles.subtitle}>
              {ads.length} {ads.length === 1 ? 'ad' : 'ads'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateP2PAdPress}
          >
            <Entypo name="add-to-list" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Error State */}
        {adsError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
            <Text style={styles.errorText}>{adsError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ads List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingAds}
              onRefresh={handleRefresh}
              tintColor="white"
            />
          }
        >
          {ads.length > 0 ? (
            <View style={styles.adsList}>
              {ads.map((ad) => (
                <TouchableOpacity
                  key={ad.id}
                  onPress={() => handleAdPress(ad)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
                        {/* {ad.username} */}
                        {ad.username}   {((ad.requests && ad.approvedRequests) && (ad.requests > 0))? ((Math.round(((ad.requests! - ad.approvedRequests!) / ad.requests!) * 100) / 100) * 100): 'NaN'} %
                        {/* {ad.username}   {ad.requests && ad.approvedRequests && ((Math.round(((ad.requests - ad.approvedRequests) / ad.requests) * 100) / 100) * 100) && '%'} */}
                      </Text>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.75)',
                        fontSize: 12,
                      }}>
                        {ad.price} IQD
                      </Text>
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontSize: 14,
                        flex: 1,
                      }}>
                        {ad.paymentMethod}  {ad.requests}
                      </Text>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontSize: 14,
                      }}>
                        {ad.amount} 💎
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

              ))}
            </View>
          ) : (
            /* Empty State */
            <View style={styles.emptyStateContainer}>
              <Ionicons name="people-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyStateTitle}>No Ads Yet</Text>
              <Text style={styles.emptyStateText}>
                Start by adding some ads.
              </Text>
              <TouchableOpacity
                style={styles.addAdsButton}
                onPress={handleCreateP2PAdPress}
              >
                {/* <Ionicons name="person-add" size={20} color="white" /> */}
                <Entypo name="add-to-list" size={24} color="black" />
                <Text style={styles.addAdsButtonText}>Add P2P Ads</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'Black',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.75)',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 132, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 132, 255, 0.3)',
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
  scrollView: {
    flex: 1,
  },
  adsList: {
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'Black',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.75)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addAdsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 132, 255, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 132, 255, 0.3)',
  },
  addAdsButtonText: {
    color: 'Black',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: '100%',
  },
}); 
