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
const createP2PPaymentCallable = Functions.httpsCallable(functions, 'createP2PPaymentCall');
const deactiveateP2PPaymentCallable = Functions.httpsCallable(functions, 'deactiveateP2PPaymentCall');
const createP2PRequestCallable = Functions.httpsCallable(functions, 'createP2PRequestCall');
const completeP2PRequestCallable = Functions.httpsCallable(functions, 'completeP2PRequestCall');
const approveP2PRequestCallable = Functions.httpsCallable(functions, 'approveP2PRequestCall');
const cancelP2PRequestCallable = Functions.httpsCallable(functions, 'cancelP2PRequestCall');
const rejectP2PRequestCallable = Functions.httpsCallable(functions, 'rejectP2PRequestCall');

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
        const result = await collectionCallable({uId: uId});
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
        const result = await sendAssetsCallable({sender: sender, receiver: receiver, amount: amount});
        console.log('Result data from sendAssetsCall:', result.data)
        // return result.data;
        return {success: 'success', data: result.data};
    } catch (error) {
        console.error('Error in sendAssetsCall:', error);
        throw new Error('Failed in sendAssetsCall function. Please try again.');  
    }
}

// update mining speed
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

// createP2PPaymentCall
export async function createP2PPayment(uid: string, amount: number, paymentMethod: string, price: number) {
    try {
        const result = await createP2PPaymentCallable({uid: uid, amount: amount, paymentMethod: paymentMethod, price: price});
        console.log('Result data from  createP2PPaymentCall:', result.data)
        return {success: 'success', data: result.data};
    } catch (error) {
        console.error('Error in  createP2PPaymentCall:', error);
        throw new Error('Failed in  createP2PPaymentCall function. Please try again.');  
    }
}

// deactiveateP2PPaymentCallable
export async function deactiveateP2PPayment(uid: string, p2pPaymentId: string) {
    try {
        const result = await deactiveateP2PPaymentCallable({uid: uid, p2pPaymentId: p2pPaymentId});
        console.log('Result data from  deactiveateP2PPaymentCallable:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in  deactiveateP2PPaymentCallable:', error);
        throw new Error('Failed in  deactiveateP2PPaymentCallable function. Please try again.');  
    }
}

// createP2PRequestCallable
export async function createP2PRequest(uid: string, p2pPaymentId: string, amount: number) {
    try {
        const result = await createP2PRequestCallable({uid: uid, p2pPaymentId: p2pPaymentId, amount: amount});
        console.log('Result data from  createP2PRequestCallable:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in  createP2PRequestCallable:', error);
        throw new Error('Failed in  createP2PRequestCallable function. Please try again.');  
    }
}

// completeP2PRequestCallable
export async function completeP2PRequest(uid: string, p2pRequestId: string, p2pPicture: string) {
    try {
        const result = await completeP2PRequestCallable({uid: uid, p2pRequestId: p2pRequestId, p2pPicture: p2pPicture});
        console.log('Result data from  completeP2PRequestCallable:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in  completeP2PRequestCallable:', error);
        throw new Error('Failed in  completeP2PRequestCallable function. Please try again.');  
    }
}

// approveP2PRequestCallable
export async function approveP2PRequest(uid: string, p2pRequestId: string) {
    try {
        const result = await approveP2PRequestCallable({uid: uid, p2pRequestId: p2pRequestId});
        console.log('Result data from  approveP2PRequestCallable:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in  approveP2PRequestCallable:', error);
        throw new Error('Failed in  approveP2PRequestCallable function. Please try again.');  
    }
}

// cancelP2PRequestCallable
export async function cancelP2PRequest(uid: string, p2pRequestId: string) {
    try {
        const result = await cancelP2PRequestCallable({uid: uid, p2pRequestId: p2pRequestId});
        console.log('Result data from  cancelP2PRequestCallable:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in  cancelP2PRequestCallable:', error);
        throw new Error('Failed in  cancelP2PRequestCallable function. Please try again.');  
    }
}

// rejectP2PRequestCallable
export async function rejectP2PRequest(uid: string, p2pRequestId: string) {
    try {
        const result = await rejectP2PRequestCallable({uid: uid, p2pRequestId: p2pRequestId});
        console.log('Result data from  rejectP2PRequestCallable:', result.data)
        return result.data;
    } catch (error) {
        console.error('Error in  rejectP2PRequestCallable:', error);
        throw new Error('Failed in  rejectP2PRequestCallable function. Please try again.');  
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