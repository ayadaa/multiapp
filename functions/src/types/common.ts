import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
    uid: string;
    email: string;
    username: string;
    displayName?: string;
    profilePicture?: string;
    createdAt: Timestamp;
    lastSeen: Timestamp;
    isOnline?: boolean;
    balance?: number;
}