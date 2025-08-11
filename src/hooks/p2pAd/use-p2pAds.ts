import { createP2PPayment, deactiveateP2PPayment, createP2PRequest, completeP2PRequest, approveP2PRequest, cancelP2PRequest, rejectP2PRequest } from '../../services/firebase/p2pad.service';
import { useAppSelector } from '../../store/hooks';

export function useP2PAds() {
    const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    return { 
        // actions
        createP2PPayment, 
        deactiveateP2PPayment, 
        createP2PRequest, 
        completeP2PRequest, 
        approveP2PRequest, 
        cancelP2PRequest, 
        rejectP2PRequest,
        
        error, 
        isLoading 
    }
}