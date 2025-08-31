import { useState, useEffect, useCallback } from 'react';
import {
  createAd,
  getAds,
  getPersonAds,
  searchAdsByTitle,
  getAdsByClass,
  getAdById,
  updateAdTitle,
  updateAdDiscription,
  updateAd,
} from '../../services/firebase/firestore.service';
import type { Ad } from '../../types/ads';
import { useAuth } from '../auth/use-auth';
import { string } from 'yup';

export function useAds(currentUserId: string) {
  // const { user } = useAuth();

  // Data state
  const [ads, setAds] = useState<Ad[]>([]);
  const [personAds, setPersonAds] = useState<Ad[] | null>([]);
  const [searchResults, setSearchResults] = useState<Ad[]>([]);

  // Loading states
  const [isLoadingAds, setIsLoadingAds] = useState(false);
  const [isLoadingPersonAds, setIsLoadingPersonAds] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Error states
  const [adsError, setAdsError] = useState<string | null>(null);
  const [personAdsError, setPersonAdsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  //format time
  const formatTimestamp = useCallback((timestamp: any): string => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  }, []);

  /**
   * Create a new ad
   */
  const createNewAd = useCallback(async (adData: Ad): Promise<string> => {
    try {
      setError(null);
      const adId = await createAd(adData);
      return adId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ad';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [currentUserId]);

  /**
   * Update an ad
   */
  const updateAnAd = useCallback(async (adData: Ad): Promise<string> => {
    try {
      setError(null);
      await updateAd(adData);
      return 'update completed!';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ad';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [currentUserId]);

  /**
   * Load ads list
   */
  const refreshAds = useCallback(async (className = 'All category', cityName = 'All cities', typeName = 'All types') => {
    // if (!user?.uid) return;
    // console.log('start getting ads');
    setIsLoadingAds(true);
    setAdsError(null);
    try {
      const adsList = await getAds(className, cityName, typeName);
      setAds(adsList);
      // console.log('ads', ads);
    } catch (error) {
      console.error('Error loading ads:', error);
      setAdsError('Failed to load ads');
    } finally {
      setIsLoadingAds(false);
    }
  }, []);

  /**
   * Load person ads list
   */
  const refreshPersonAds = useCallback(async (createdBy = currentUserId) => {
    setIsLoadingPersonAds(true);
    setPersonAdsError(null);
    try {
      const adsList = await getPersonAds(createdBy);
      setPersonAds(adsList);
    } catch (error) {
      console.error('Error loading ads:', error);
      setAdsError('Failed to load ads');
    } finally {
      setIsLoadingAds(false);
    }
  }, []);

  /**
     * Search for ads by title
     */
  const searchAds = useCallback(async (title: string, className = 'All category', cityName = 'All cities', typeName = 'All types') => {
    if (!title.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const results = await searchAdsByTitle(title.trim(), className, cityName, typeName);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching ads:', error);
      setSearchError('Failed to search ads');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [ads]);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    refreshAds();
    refreshPersonAds();
  }, [refreshAds]);

  return {
    // Data
    ads,
    personAds,
    searchResults,
    // ad,

    // Loading states
    isLoadingAds,
    isLoadingPersonAds,
    isSearching,

    // Error states
    error,
    adsError,
    personAdsError,
    searchError,

    // Actions
    createNewAd,
    refreshAds,
    refreshPersonAds,
    searchAds,
    clearSearch,
    updateAnAd,

    formatTimestamp,
  };
}
