// import { httpsCallable } from 'firebase/functions';
import * as Functions from 'firebase/functions';
import { 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    collection,
    serverTimestamp,
    onSnapshot,
    Timestamp,
    writeBatch,
    arrayUnion,
    arrayRemove,
    increment
  } from 'firebase/firestore';
import { functions } from '../../config/firebase';
import { db } from '../../config/firebase';

const collectionCallable = Functions.httpsCallable(functions, 'collectionCall');
const sendAssetsCallable = Functions.httpsCallable(functions, 'sendAssetsCall');
const updateMiningSpeedCallable = Functions.httpsCallable(functions, 'updateMiningSpeedCall');

export async function collect(uId: string) {
    try {
        const result = await collectionCallable({uId: uId});
        console.log('Result data from collectionCall:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in collectionCall:', error);
        throw new Error('Failed in collectionCall function. Please try again.');  
    }
}

export async function sendAssets(sender: string, receiver: string, amount: number) {
    try {
        const result = await sendAssetsCallable({sender: sender, receiver: receiver, amount: amount});
        console.log('Result data from sendAssetsCall:', result.data)
        // return result.data;
        return {success: 'success', data: result.data};
    } catch (error) {
        console.error('Error in sendAssetsCall:', error);
        throw new Error('Failed in sendAssetsCall function. Please try again.');  
    }
}

export async function updateMiningSpeed(uid: string, offer: string) {
    try {
        const result = await updateMiningSpeedCallable({uid: uid, offer: offer});
        console.log('Result data from updateMiningSpeedCall:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in updateMiningSpeedCall:', error);
        throw new Error('Failed in updateMiningSpeedCall function. Please try again.');  
    }
}

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


// export async function collect(uId: string): Promise<string> {
//     try {
//       const result = await collectionCallable({ uId: uId });
//       const data = result.data as { success: boolean; balance?: string; error?: string };
      
//       if (!data.success || !data.balance) {
//         throw new Error(data.error || 'Failed to get daily challenge');
//       }
      
//       return data.balance;
//     } catch (error) {
//       console.error('Error getting daily challenge:', error);
//       throw new Error('Failed to load today\'s challenge. Please try again.');
//     }
// }