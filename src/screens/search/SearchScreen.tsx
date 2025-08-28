import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image, TextInput } from "react-native";
import { Screen } from '../../components/common/Screen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAds } from '../../hooks/ad/use-ads';
import { useAuth } from '../../hooks/auth/use-auth';
import type { Ad } from '../../types/ads';
import type { NavigationProp } from '../../types/navigation';
import React from 'react';
import AdSearchCard from '../../components/cards/AdSearchCard';
import FilterBar from '../../components/ads/FilterBar';

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { user } = useAuth();
  const {
    ads,
    isLoadingAds,
    adsError,
    refreshAds,
    searchResults,
    searchAds,
    isSearching,
    searchError,
    clearSearch,
  } = useAds(user?.uid || '');

  // Handle search input changes with debouncing
  const handleSearchChange = React.useCallback((text: string) => {
    console.log('Search query length:', searchQuery.length)
    setSearchQuery(text);
    if (text.trim().length >= 2) {
      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(() => {
        searchAds(text);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (text.trim().length === 0) {
      clearSearch();
    }
  }, [searchAds, clearSearch]);

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refreshAds();
    } catch (error) {
      console.error('Error refreshing ads:', error);
    }
  }

  // const handleAdPress = (ad: Ad) => {
  //   navigation.navigate('AdDetails', ad);
  // }

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
          {/* Search Section */}
          {/* <View style={styles.searchContainer}> */}
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="rgba(0, 0, 0, 0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search ad..."
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  clearSearch();
                  console.log('Search query length:', searchQuery.length)
                }}
              >
                <Ionicons name="close-circle" size={20} color="rgba(0, 0, 0, 0.6)" />
              </TouchableOpacity>
            )}
          </View>
          {/* </View> */}
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
          {/* filter bar */}
          <FilterBar />

          {(searchQuery.length < 2) && (ads.length > 0) &&
            <View style={styles.adsList}>
              {ads.map((ad) => (
                <AdSearchCard key={ad.id} ad={ad} />
              ))}
            </View>}

          {/* Empty State  */}
          {(searchQuery.length < 2) && (ads.length = 0) &&
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                Loading ...
              </Text>
            </View>}

          {/* Search result */}
          {searchQuery.length >= 2 && <View style={styles.adsList}>
            {/* <Text style={styles.sectionTitle}>
              Search Results
              {isSearching && (
                <Text style={styles.loadingText}> (Searching...)</Text>
              )}
            </Text> */}
            {isSearching &&<Text style={styles.loadingText}> Searching...</Text>}
            {searchError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{searchError}</Text>
              </View>
            )}
            {searchResults.map((ad) => (
              <AdSearchCard key={ad.id} ad={ad} />
            ))}
          </View>}
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
  // searchInputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   borderRadius: 30,
  //   paddingHorizontal: 16,
  //   paddingVertical: 6,
  //   borderWidth: 1,
  //   borderColor: 'rgba(0, 0, 0, 0.2)',
  // },
  searchInputContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 6,
    alignItems: 'center',
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
        width: 1,
        height: 1,
    }
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: 'black',
    borderWidth: 0, //ayad
    outlineWidth: 0, //ayad
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  loadingText: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 'normal',
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