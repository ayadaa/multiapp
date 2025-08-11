import { Timestamp } from 'firebase/firestore';

export interface P2PAd {
    id?: string;
    amount: number;
    price: number;
    createdAt: Timestamp;
    createdBy: string;
    isActive: boolean;
    paymentMethod: string;
}