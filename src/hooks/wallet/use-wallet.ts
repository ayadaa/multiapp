import {
    collect,
    sendAssets,
    updateMiningSpeed,
    checkAddressExisting,
    getMiningSpeedOffers,
    type MiningSpeedOffers,
    getTransactions,
    type Transaction,
} from '../../services/firebase/wallet.service';
import { useState, useCallback, useEffect } from 'react';
// import { checkAddressExisting } from '../../services/firebase/wallet.service';
import { useAppSelector } from '../../store/hooks';

export function useWallet(currentUserId: string) {
    const [addressCheckLoading, setAddressCheckLoading] = useState<boolean>(false);
    const [addressExist, setAddressExist] = useState<boolean | null>(null);
    const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    // Data state
    const [miningSpeedOffers, setMiningSpeedOffers] = useState<MiningSpeedOffers[]>([]);
    const [isLoadingMiningSpeedOffers, setIsLoadingMiningSpeedOffers] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

    // Error states
    const [miningSpeedOffersError, setMiningSpeedOffersError] = useState<string | null>(null);
    const [transactionsError, setTransactionsError] = useState<string | null>(null);

    // Check if address is exist
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

    //Load Transactions list
    const refreshTransactions = useCallback(async (uid: string) => {
        setIsLoadingTransactions(true);
        setTransactionsError(null);
        try {
            console.log('Start getting transactions')
            const transactionsList = await getTransactions(uid);
            setTransactions(transactionsList);
            console.log('Transactions', transactionsList)
        } catch (error) {
            console.error('Error loading Transactions:', error);
            setTransactionsError('Failed to load Transactions');
        } finally {
            setIsLoadingTransactions(false);
        }
    }, []);

    //Load MiningSpeedOffers list
    const refreshMiningSpeedOffers = useCallback(async () => {
        setIsLoadingMiningSpeedOffers(true);
        setMiningSpeedOffersError(null);
        try {
            console.log('start getting mining speed offers')
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

    // Load initial data
    useEffect(() => {
        refreshMiningSpeedOffers();
        refreshTransactions(currentUserId);
    }, [refreshMiningSpeedOffers, refreshTransactions]);

    return {
        // Data
        miningSpeedOffers,
        transactions,

        // Loading states
        isLoading,
        addressCheckLoading,
        isLoadingMiningSpeedOffers,
        isLoadingTransactions,

        // actions
        collect,
        sendAssets,
        updateMiningSpeed,
        checkAddress,
        refreshMiningSpeedOffers,
        refreshTransactions,

        // logic
        addressExist,

        // Error states
        error,
        miningSpeedOffersError,
        transactionsError,
    }
}