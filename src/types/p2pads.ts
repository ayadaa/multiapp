import { Timestamp } from 'firebase/firestore';

export interface P2PAd {
    id?: string;
    amount: number;
    price: number;
    createdAt: Timestamp;
    createdBy: string;
    // creatorUsername: string;
    isActive: boolean;
    paymentMethod: string;
}

export interface P2PRequest {
    id: string;
    amount: number;
    createdAt: Timestamp;
    createdBy: string;
    expiresAt: Timestamp;
    isApproved: boolean;
    isCanceled: boolean;
    isCompleted: boolean;
    isExpired: boolean;
    isRejected: boolean;
    p2pCreatedBy: string;
    p2pPaymentId: string;
    price: string;
}
