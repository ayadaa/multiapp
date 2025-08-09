// import { httpsCallable } from 'firebase/functions';
import * as Functions from 'firebase/functions';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { functions, db } from '../../config/firebase';

const collectionCallable = Functions.httpsCallable(functions, 'collectionCall');

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