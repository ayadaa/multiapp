import { collect, sendAssets, updateMiningSpeed, createP2PPayment, deactiveateP2PPayment, createP2PRequest, completeP2PRequest, approveP2PRequest, cancelP2PRequest, rejectP2PRequest } from '../../services/firebase/wallet.service';
import { useState, useCallback } from 'react';
import { checkAddressExisting } from '../../services/firebase/wallet.service';
import { useAppSelector } from '../../store/hooks';

export function useWallet() {
    const [addressCheckLoading, setAddressCheckLoading] = useState<boolean>(false);
    const [addressExist, setAddressExist] = useState<boolean | null>(null);
    const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

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

    return { 
        // actions
        collect, 
        sendAssets, 
        updateMiningSpeed, 
        checkAddress,
        createP2PPayment, 
        deactiveateP2PPayment, 
        createP2PRequest, 
        completeP2PRequest, 
        approveP2PRequest, 
        cancelP2PRequest, 
        rejectP2PRequest,
        
        addressCheckLoading, 
        addressExist, 
        error, 
        isLoading 
    }
}