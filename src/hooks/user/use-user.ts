import { useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '../../services/firebase/firestore.service';
// import type { UserProfile } from '../../services/firebase/firestore.service';

/**
 * Custom hook for managing user functionality.
 */
export function useUser(userId: string) {
    // Data state
    const [User, setUser] = useState<any>([]);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    // Error states
    const [userError, setUserError] = useState<string | null>(null);

    /**
   * Load user
   */
    const refreshUser = useCallback(async (uId: string) => {
        setIsLoadingUser(true);
        setUserError(null);

        try {
            const userP = await getUserProfile(uId);
            setUser(userP);
        } catch (error) {
            console.error('Error loading user:', error);
            setUserError('Failed to load user');
        } finally {
            setIsLoadingUser(false);
        }
    }, []);

    // Load initial data
    useEffect(() => {
        refreshUser(userId);
    }, [refreshUser]);

    return {
        // Data
        User,
    
        // Loading states
        isLoadingUser,
    
        // Error states
        userError,
    
        // Actions
        refreshUser,
      };
}