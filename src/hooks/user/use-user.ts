import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, UserProfile, checkUsernameAvailability, updateUserProfile } from '../../services/firebase/firestore.service';
import type { UpdateProfileFormData } from '../../utils/validation/auth-schemas';

/**
 * Custom hook for managing user functionality.
 */
export function useUser(userId: string) {
    // Data state
    const [User, setUser] = useState<UserProfile | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    // Error states
    const [userError, setUserError] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    /**
   * Load user
   */
    const refreshUser = useCallback(async () => {
        console.log('start getting user')
        setIsLoadingUser(true);
        setUserError(null);

        try {
            const userP = await getUserProfile(userId);
            // console.log('userP', userP)
            setUser(userP);
            // console.log('User', User)
        } catch (error) {
            console.error('Error loading user:', error);
            setUserError('Failed to load user');
        } finally {
            setIsLoadingUser(false);
        }
    }, [getUserProfile]);

    /**
   * Update user profile
   */
    const updateProfile = useCallback(async (data: UpdateProfileFormData) => {
        setUpdateLoading(true);
        try {
            // Check username availability first
            const isAvailable = await checkUsernameAvailability(data.username);
            if (!isAvailable) {
                throw new Error('Username is already taken');
            }
            // update user
            setUpdateError(null);
            await updateUserProfile(data);
            return { success: true };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
            setUpdateError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setUpdateLoading(false);
        }
    }, [userId]);

    // Load initial data
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return {
        // Data
        User,

        // Loading states
        isLoadingUser,
        updateLoading,

        // Error states
        userError,
        updateError,

        // Actions
        refreshUser,
        updateProfile,
    };
}