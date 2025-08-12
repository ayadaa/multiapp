/**
 * P2p Ads List screen displaying all ads.
 */
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
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useP2PAds } from '../../hooks/p2pAd/use-p2pAds';
import { useAuth } from '../../hooks/auth/use-auth';
// import type { Ad } from '../../types/ads';
import type { NavigationProp } from '../../types/navigation';
// import { formatTimestamp } from '../../functions/formatTimestamp';

export function P2PAdsScreen() {
  // const navigation = useNavigation();
  const navigation = useNavigation<NavigationProp>();
  // const { user } = useAuth();
  
  // const {
  //   p2pAds,
  //   isLoadingP2PAds,
  //   p2pAdsError,
  //   refreshP2PAds,
  // } = useP2PAds();
  const {
    p2pAdsWithUsers,
    isLoadingP2PAdsWithUsers,
    p2pAdsErrorWithUsers,
    refreshP2PAdsWithUsers,
  } = useP2PAds();

  const handleCreateP2PAdPress = () => {
    navigation.navigate('P2PCreateAd' as never); //ayad
  }

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    try {
      // await refreshP2PAds();
      await refreshP2PAdsWithUsers();
    } catch (error) {
      console.error('Error refreshing p2p ads:', error);
    }
  }

  // const handleAdPress = (ad: Ad) => {
  //   navigation.navigate('P2PAdDetails', ad);
  // }

  return (
    <Screen backgroundColor="#000000" statusBarStyle="light-content">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Ads</Text>
            <Text style={styles.subtitle}>
              {/* {p2pAds.length} {p2pAds.length === 1 ? 'ad' : 'ads'} */}
              {p2pAdsWithUsers.length} {p2pAdsWithUsers.length === 1 ? 'ad' : 'ads'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateP2PAdPress}
          >
            <Ionicons name="person-add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Error State */}
        {/* {p2pAdsError && ( */}
        {p2pAdsErrorWithUsers && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
            {/* <Text style={styles.errorText}>{p2pAdsError}</Text> */}
            <Text style={styles.errorText}>{p2pAdsErrorWithUsers}</Text>
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
              // refreshing={isLoadingP2PAds}
              refreshing={isLoadingP2PAdsWithUsers}
              onRefresh={handleRefresh}
              tintColor="white"
            />
          }
        >
          {/* {p2pAds.length > 0 ? ( */}
          {p2pAdsWithUsers.length > 0 ? (
            <View style={styles.friendsList}>
              {/* {p2pAds.map((ad) => ( */}
              {p2pAdsWithUsers.map((ad) => (
                <TouchableOpacity
                  // onPress={() => handleAdPress(ad)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                        {/* {ad.creatorUsername} */}
                        {ad.username}
                      </Text>
                      <Text style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: 12,
                      }}>
                        {ad.price}
                      </Text>
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 14,
                        flex: 1,
                      }} numberOfLines={1}>
                        {ad.paymentMethod}
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
                style={styles.addFriendsButton}
                onPress={handleCreateP2PAdPress}
              >
                <Ionicons name="person-add" size={20} color="white" />
                <Text style={styles.addFriendsButtonText}>Add Ads</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
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
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  friendsList: {
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
    color: 'white',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 132, 255, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 132, 255, 0.3)',
  },
  addFriendsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  onlineSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  onlineScrollView: {
    paddingLeft: 20,
  },
  onlineFriendCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  onlineAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.6)',
    position: 'relative',
  },
  onlineAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00FF88',
    borderWidth: 2,
    borderColor: '#000000',
  },
  onlineUsername: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  image: {
    height: 64,
    width: 64,
  },
}); 
