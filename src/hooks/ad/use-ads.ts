import { useState, useEffect, useCallback } from 'react';
import {
  createAd,
  getAdsByClass,
  getAdById,
  updateAdTitle,
  updateAdDiscription,
  updateAd
} from '../../services/firebase/firestore.service';
import type { Ad } from '../../types/ads';

/**
 * Custom hook for managing ad functionality.
 * Handles ad creation, editing, and deleting.
 */
export function useAds(currentUserId: string) {
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

  return {
    error,
    createNewAd,
  };
} 