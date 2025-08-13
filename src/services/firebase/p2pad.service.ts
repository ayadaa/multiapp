import * as Functions from 'firebase/functions';
import { functions } from '../../config/firebase';
import type { P2PAd, P2PRequest } from '../../types/p2pads';
import { 
    getDocs, 
    collection, 
    query, 
    orderBy, 
    where
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getUserProfile, UserProfile } from './firestore.service'

const createP2PPaymentCallable = Functions.httpsCallable(functions, 'createP2PPaymentCall');
const deactiveateP2PPaymentCallable = Functions.httpsCallable(functions, 'deactiveateP2PPaymentCall');
const createP2PRequestCallable = Functions.httpsCallable(functions, 'createP2PRequestCall');
const completeP2PRequestCallable = Functions.httpsCallable(functions, 'completeP2PRequestCall');
const approveP2PRequestCallable = Functions.httpsCallable(functions, 'approveP2PRequestCall');
const cancelP2PRequestCallable = Functions.httpsCallable(functions, 'cancelP2PRequestCall');
const rejectP2PRequestCallable = Functions.httpsCallable(functions, 'rejectP2PRequestCall');

// createP2PPaymentCall
// export async function createP2PPayment(uid: string, creatorUsername: string, amount: number, paymentMethod: string, price: number) {
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
        return {success: 'success', data: result.data};
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
        return {success: 'success', data: result.data};
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
        return {success: 'success', data: result.data};
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
        return {success: 'success', data: result.data};
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
        return {success: 'success', data: result.data};
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
        return {success: 'success', data: result.data};
    } catch (error) {
        console.error('Error in  rejectP2PRequestCallable:', error);
        throw new Error('Failed in  rejectP2PRequestCallable function. Please try again.');  
    }
}

// Get p2p ads
export async function getP2PAds(): Promise<P2PAd[]> {
  try {
    const p2pAdsQuery = query(
        collection(db, 'p2pPayment'),
        where('isActive', '==', true),
        // orderBy('createdAt', 'desc'),
        orderBy('price', 'asc'),
    );
    
    const p2pAds = await getDocs(p2pAdsQuery);
    console.log('p2p ads', p2pAds)
    return p2pAds.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as P2PAd[];
  } catch (error) {
    console.error('Get p2p ads error:', error);
    throw new Error('Failed to get p2p ads');
  }
}

// Get p2p ads with users
export async function getP2PAdsWithUsers(): Promise<(P2PAd & UserProfile)[]> {
    const p2pAds = await getP2PAds();
    const p2pAdsWithUsers = <(P2PAd & UserProfile)[]>[];
    for (let index = 0; index < p2pAds.length; index++) {
        const ad = p2pAds[index];
        const user = await getUserProfile(ad.createdBy);
        if (user) {
            p2pAdsWithUsers.push({ ...ad, ...user });
        }
    }
    console.log('p2p ads with users', p2pAdsWithUsers);
    return p2pAdsWithUsers;
}

// Get p2p requests
export async function getP2PRequests(): Promise<P2PRequest[]> {
  try {
    const p2pRequestsQuery = query(
        collection(db, 'p2pRequests'),
        // where('isActive', '==', true),
        // where('createdBy', '==', uId),
        // where('p2pCreatedBy', '==', uId),
        orderBy('createdAt', 'desc'),
    );
     
    const p2pRequests = await getDocs(p2pRequestsQuery);
    console.log('p2p requests', p2pRequests)
    return p2pRequests.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as P2PRequest[];
  } catch (error) {
    console.error('Get p2p requests error:', error);
    throw new Error('Failed to get p2p requests');
  }
}

// Get p2p requests with users
export async function getP2PRequestsWithUsers(): Promise<(P2PRequest & UserProfile)[]> {
    const p2pRequests = await getP2PRequests();
    const p2pRequestsWithUsers = <(P2PRequest & UserProfile)[]>[];
    for (let index = 0; index < p2pRequests.length; index++) {
        const request = p2pRequests[index];
        const user = await getUserProfile(request.createdBy);
        if (user) {
            p2pRequestsWithUsers.push({ ...request, ...user });
        }
    }
    console.log('p2p requests with users', p2pRequestsWithUsers);
    return p2pRequestsWithUsers;
}
