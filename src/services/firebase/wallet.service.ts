// import { httpsCallable } from 'firebase/functions';
import * as Functions from 'firebase/functions';
import {
    getDocs,
    query,
    where,
    limit,
    collection,
    orderBy
} from 'firebase/firestore';
import { functions } from '../../config/firebase';
import { db } from '../../config/firebase';

export interface MiningSpeedOffers {
    id?: string;
    name: string;
    price: number;
    speed: number;
    discount?: number;
}

const collectionCallable = Functions.httpsCallable(functions, 'collectionCall');
const sendAssetsCallable = Functions.httpsCallable(functions, 'sendAssetsCall');
const updateMiningSpeedCallable = Functions.httpsCallable(functions, 'updateMiningSpeedCall');

/**
 * Check if an address is exist
 */
export async function checkAddressExisting(uId: string): Promise<boolean> {
    try {
        const usersQuery = query(
            collection(db, 'users'),
            where('uid', '==', uId),
            limit(1)
        );
        //   const uDoc = await getDoc(doc(db, 'users', uid));
        const querySnapshot = await getDocs(usersQuery);
        return querySnapshot.empty;
    } catch (error) {
        console.error('Username availability check error:', error);
        throw new Error('Failed to check username availability');
    }
}

//collect assets
export async function collect(uId: string) {
    try {
        const result = await collectionCallable({ uId: uId });
        console.log('Result data from collectionCall:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in collectionCall:', error);
        throw new Error('Failed in collectionCall function. Please try again.');
    }
}

// send assets
export async function sendAssets(sender: string, receiver: string, amount: number) {
    try {
        const result = await sendAssetsCallable({ sender: sender, receiver: receiver, amount: amount });
        console.log('Result data from sendAssetsCall:', result.data)
        // return result.data;
        return { success: 'success', data: result.data };
    } catch (error) {
        console.error('Error in sendAssetsCall:', error);
        throw new Error('Failed in sendAssetsCall function. Please try again.');
    }
}

// update mining speed
export async function updateMiningSpeed(uid: string, offer: string) {
    try {
        const result = await updateMiningSpeedCallable({ uid: uid, offer: offer });
        console.log('Result data from updateMiningSpeedCall:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in updateMiningSpeedCall:', error);
        throw new Error('Failed in updateMiningSpeedCall function. Please try again.');
    }
}

// get mining speed offers
export async function getMiningSpeedOffers(): Promise<MiningSpeedOffers[]> {
    try {
        const adsQuery = query(
            collection(db, 'miningSpeedOffers'),
            orderBy('createdAt', 'desc')
        );

        const ads = await getDocs(adsQuery);
        return ads.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as MiningSpeedOffers[];
    } catch (error) {
        console.error('Get miningSpeedOffers error:', error);
        throw new Error('Failed to get miningSpeedOffers');
    }
}
