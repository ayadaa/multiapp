import {
    createP2PPayment,
    deactiveateP2PPayment,
    createP2PRequest,
    completeP2PRequest,
    approveP2PRequest,
    cancelP2PRequest,
    rejectP2PRequest,
    // getP2PAds,
    getP2PAdsWithUsers,
    getP2PRequestsWithUsers
} from '../../services/firebase/p2pad.service'; 
import { useAppSelector } from '../../store/hooks'; 
import { useState, useEffect, useCallback } from 'react';
import type { P2PAd, P2PRequest } from '../../types/p2pads';
import type { UserProfile } from '../../services/firebase/firestore.service'

export function useP2PAds() {
  const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth); 
  // const [p2pAds, setP2pAds] = useState<P2PAd[]>([]);
  // const [isLoadingP2PAds, setIsLoadingP2PAds] = useState(false);
  // const [p2pAdsError, setP2pAdsError] = useState<string | null>(null);
  const [p2pAdsWithUsers, setP2pAdsWithUsers] = useState<(P2PAd & UserProfile)[]>([]);
  const [isLoadingP2PAdsWithUsers, setIsLoadingP2PAdsWithUsers] = useState(false);
  const [p2pAdsWithUsersError, setP2pAdsWithUsersError] = useState<string | null>(null);
  const [p2pRequestsWithUsers, setP2pRequestsWithUsers] = useState<(P2PRequest & UserProfile)[]>([]);
  const [isLoadingP2PRequestsWithUsers, setIsLoadingP2PRequestsWithUsers] = useState(false);
  const [p2pRequestsWithUsersError, setP2pRequestsWithUsersError] = useState<string | null>(null);

  // Load p2p ads list
  // const refreshP2PAds = useCallback(async () => {
  //   setIsLoadingP2PAds(true);
  //   setP2pAdsError(null);
    
  //   try {
  //     const p2pAdsList = await getP2PAds();
  //     setP2pAds(p2pAdsList);
  //   } catch (error) {
  //     console.error('Error loading p2p ads:', error);
  //     setP2pAdsError('Failed to load p2p ads');
  //   } finally {
  //     setIsLoadingP2PAds(false);
  //   }
  // }, []);
    
  // Load p2p requests with users list
  const refreshP2PRequestsWithUsers = useCallback(async (uId: string) => {
    setIsLoadingP2PRequestsWithUsers(true);
    setP2pRequestsWithUsersError(null);
    
    try {
      const p2pRequestsListWithUsers = await getP2PRequestsWithUsers(uId);
      setP2pRequestsWithUsers(p2pRequestsListWithUsers);
    } catch (error) {
      console.error('Error loading p2p requests with users:', error);
      setP2pRequestsWithUsersError('Failed to load p2p requests with users');
    } finally {
      setIsLoadingP2PRequestsWithUsers(false);
    }
  }, []);

  // Load p2p ads with users list
  const refreshP2PAdsWithUsers = useCallback(async () => {
    setIsLoadingP2PAdsWithUsers(true);
    setP2pAdsWithUsersError(null);
    
    try {
      const p2pAdsListWithUsers = await getP2PAdsWithUsers();
      setP2pAdsWithUsers(p2pAdsListWithUsers);
    } catch (error) {
      console.error('Error loading p2p ads with users:', error);
      setP2pAdsWithUsersError('Failed to load p2p ads with users');
    } finally {
      setIsLoadingP2PAdsWithUsers(false);
    }
  }, []);
    
  // Load initial data
  // useEffect(() => {
  //     refreshP2PAds();
  // }, [refreshP2PAds]);
  
  // Load initial p2p ads data
  useEffect(() => {
    refreshP2PAdsWithUsers();
  }, [refreshP2PAdsWithUsers]);

  // Load initial p2p requests data
  useEffect(() => {
    refreshP2PRequestsWithUsers(user?.uid!);
  }, [refreshP2PRequestsWithUsers]);

  return { 
    // Data
    // p2pAds,
    p2pAdsWithUsers,
    p2pRequestsWithUsers,

    // Loading states
    isLoading,
    // isLoadingP2PAds,
    isLoadingP2PAdsWithUsers,
    isLoadingP2PRequestsWithUsers,

    // Error states
    error,
    // p2pAdsError,
    p2pAdsWithUsersError,
    p2pRequestsWithUsersError,

    // actions
    createP2PPayment,
    deactiveateP2PPayment,
    createP2PRequest,
    completeP2PRequest,
    approveP2PRequest,
    cancelP2PRequest,
    rejectP2PRequest,
    // refreshP2PAds,
    refreshP2PAdsWithUsers,
    refreshP2PRequestsWithUsers,
  }
}