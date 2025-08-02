import { useState, useEffect, useCallback } from 'react';
import {
  createAd,
  getAds,
  getAdsByClass,
  getAdById,
  updateAdTitle,
  updateAdDiscription,
  updateAd
} from '../../services/firebase/firestore.service';
import type { Ad } from '../../types/ads';
import { useAuth } from '../auth/use-auth';

/**
 * Custom hook for managing ad functionality.
 * Handles ad creation, editing, and deleting.
 */
export function useAds(currentUserId: string) {
  // const { user } = useAuth();

  // Data state
  const [ads, setAds] = useState<Ad[]>([]);
  // const [ad, setAd] = useState<Ad | null>(null);
  const [isLoadingAds, setIsLoadingAds] = useState(false);

  // Error states
  const [adsError, setAdsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new ad
   */
  const createNewAd = useCallback(async (
    // adData: {
    //   title: string;
    //   description: string;
    //   createdBy: string;
    //   className: string;
    //   // typeName: "sale" | "buy";
    //   typeName: string;
    //   country: string;
    //   city: string;
    // }
    adData: Ad
  ): Promise<string> => {
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
   * Load ads list
   */
  const refreshAds = useCallback(async () => {
    // if (!user?.uid) return;
    // console.log('start getting ads')
    setIsLoadingAds(true);
    setAdsError(null);
    
    try {
      const adsList = await getAds();
      setAds(adsList);
      // console.log('ads', ads)
    } catch (error) {
      console.error('Error loading ads:', error);
      setAdsError('Failed to load ads');
    } finally {
      setIsLoadingAds(false);
    }
  }, []);

  /**
   * Format timestamp
   */
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

  // Load initial data
  useEffect(() => {
    refreshAds();
  }, [refreshAds]);

  return {
    // Data
    ads,
    // ad,

    // Loading states
    isLoadingAds,

    // Error states
    error,
    adsError,

    // Actions
    createNewAd,
    refreshAds,

    formatTimestamp
  };
}
