import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image } from "react-native";
import { Screen } from '../../components/common/Screen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAds } from '../../hooks/ad/use-ads';
import { useAuth } from '../../hooks/auth/use-auth';
import type { Ad } from '../../types/ads';
import type { NavigationProp } from '../../types/navigation';

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const {
    ads,
    isLoadingAds,
    adsError,
    refreshAds,
    formatTimestamp
  } = useAds(user?.uid || '');

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refreshAds();
    } catch (error) {
      console.error('Error refreshing ads:', error);
    }
  }

  const handleAdPress = (ad: Ad) => {
    navigation.navigate('AdDetails', ad);
  }

  return (
    <Screen backgroundColor="#FFFFFF">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Search</Text>
          </View>
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

                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    marginHorizontal: 16,
                    marginVertical: 2,
                    borderRadius: 16,
                  }}
                >
                  {ad.adPicture ? <View style={{
                    width: 50,
                    height: 50,
                    // borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <Image
                      source={{ uri: ad.adPicture || 'https://firebasestorage.googleapis.com/v0/b/snap-clone-2b5a1.firebasestorage.app/o/images%2F9k%3D?alt=media&token=bbd617c3-f983-44ce-b633-8562ae1cb9f0' }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View> : <View style={{
                    width: 50,
                    height: 50,
                    // borderRadius: 25,
                    backgroundColor: 'rgba(0, 132, 255, 0.8)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <Text style={{ fontSize: 18, color: '#000000' }}>
                      {ad.title.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </View>}

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
                        {ad.title}
                      </Text>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.75)',
                        fontSize: 12,
                      }}>
                        {ad.createdAt ? formatTimestamp(ad.createdAt) : ''}
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
                      }} numberOfLines={1}>
                        {ad.description.slice(0, 50)} {/* 50 characters */}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            /* Empty State */
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                Loading ...
              </Text>
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
    alignItems: 'center',
    justifyContent: "space-between", //search
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerBackButton: {
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
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.75)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  image: {
    height: 64,
    width: 64,
  },
});