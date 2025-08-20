import { collect, sendAssets, updateMiningSpeed, checkAddressExisting, getMiningSpeedOffers, type MiningSpeedOffers } from '../../services/firebase/wallet.service';
import { useState, useCallback } from 'react';
// import { checkAddressExisting } from '../../services/firebase/wallet.service';
import { useAppSelector } from '../../store/hooks';

export function useWallet() {
    const [addressCheckLoading, setAddressCheckLoading] = useState<boolean>(false);
    const [addressExist, setAddressExist] = useState<boolean | null>(null);
    const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    // Data state
    const [miningSpeedOffers, setMiningSpeedOffers] = useState<MiningSpeedOffers[]>([]);
    const [isLoadingMiningSpeedOffers, setIsLoadingMiningSpeedOffers] = useState(false);

    // Error states
    const [miningSpeedOffersError, setMiningSpeedOffersError] = useState<string | null>(null);

    /**
   * Check if address is exist
   */
    const checkAddress = useCallback(async (uId: string) => {
        if (uId.length < 3) {
            setAddressExist(null);
            return;
        }

        setAddressCheckLoading(true);
        try {
            const isExist = await checkAddressExisting(uId);
            // setAddressExist(isExist);
            setAddressExist(!isExist);
        } catch (error) {
            console.error('Adress check error:', error);
            setAddressExist(null);
        } finally {
            setAddressCheckLoading(false);
        }
    }, []);

    //Load MiningSpeedOffers list
    const refreshMiningSpeedOffers = useCallback(async () => {
        setIsLoadingMiningSpeedOffers(true);
        setMiningSpeedOffersError(null);

        try {
            const miningSpeedOffersList = await getMiningSpeedOffers();
            setMiningSpeedOffers(miningSpeedOffersList);
            console.log('MiningSpeedOffers', miningSpeedOffersList)
        } catch (error) {
            console.error('Error loading MiningSpeedOffers:', error);
            setMiningSpeedOffersError('Failed to load MiningSpeedOffers');
        } finally {
            setIsLoadingMiningSpeedOffers(false);
        }
    }, []);

    return {
        // Data
        miningSpeedOffers,

        // Loading states
        isLoading,
        addressCheckLoading,
        isLoadingMiningSpeedOffers,

        // actions
        collect,
        sendAssets,
        updateMiningSpeed,
        checkAddress,
        refreshMiningSpeedOffers,

        // logic
        addressExist,

        // Error states
        error,
        miningSpeedOffersError,
    }
}