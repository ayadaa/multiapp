import { useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '../../services/firebase/firestore.service';
import type { UserProfile } from '../../services/firebase/firestore.service';

/**
 * Custom hook for managing user functionality.
 */
export function useUser(userId: string) {
    // Data state
    const [User, setUser] = useState<UserProfile | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    // Error states
    const [userError, setUserError] = useState<string | null>(null);

    /**
   * Load user
   */
    const refreshUser = useCallback(async () => {
        console.log('start getting user')
        setIsLoadingUser(true);
        setUserError(null);

        try {
            const userP = await getUserProfile(userId);
            console.log('userP', userP)
            setUser(userP);
            console.log('User', User)
        } catch (error) {
            console.error('Error loading user:', error);
            setUserError('Failed to load user');
        } finally {
            setIsLoadingUser(false);
        }
    }, [getUserProfile]);

    // Load initial data
    useEffect(() => {
        refreshUser();
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