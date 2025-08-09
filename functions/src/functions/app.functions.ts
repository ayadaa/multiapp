import * as functions from "firebase-functions";
// import * as v2 from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
// import type { UserProfile } from "../types/common";

// type Indexable = {[key: string]: any}

admin.initializeApp();
const db = admin.firestore();
const miningSpeedOffers = {
    slow: {cost: 100, speed: 10},
    medium: {cost: 500, speed: 50},
    fast: {cost: 5000, speed: 500},
    veryFast: {cost: 50000, speed: 5000},
}

// export const helloworld = v2.https.onRequest((request, response) => {
//     const name = request.params[0].replace('/', '');
//     const items: Indexable = { lamp: 'This is a lamp', chair: 'This is a chair' };
//     const message = items[name];
//     response.send(`<h1>${message}</h1>`);
// });

// export const getUsername = v2.https.onRequest(async (request, response) => {
//     try {
//         const uId = request.params[0].replace('/', '');
//         const docRef = db.collection('users').doc(`${uId}`);
//         const doc = await docRef.get();
        
//         if (doc.exists) {
//             const userName = doc.data()?.username;
//             response.status(200).send(userName);
//         } else {
//             response.status(404).send('Document not found!');
//         }
//     } catch (error) {
//         response.status(500).send('Error retrieving data');
//     }
// });

// export const collection = v2.https.onRequest(async (request, response) => {
//     try {
//         const uId = request.params[0].replace('/', '');
//         const docRef = db.collection('users').doc(`${uId}`);

//         const docTransactionsRef = db.collection('transactions');
//         const doc = await docRef.get();

//         const referralPercentage = 0.03 // 3%
//         const referral = doc.data()?.referral
//         const docReferralRef = db.collection('users').doc(`${referral}`);
//         const docReferral = await docReferralRef.get();
        
//         if (doc.exists) {
//             const date = new Date()
//             // const miningEndTime = (doc.data()?.miningEndTime as Timestamp).toDate() || date;
//             const miningEndTime = (doc.data()?.miningEndTime || Timestamp.fromDate(date)).toDate() as Date;
//             console.log('miningEndTime', miningEndTime);
//             const condition = date.getTime() >= miningEndTime.getTime(); 
//             if (condition) {
//                 // get balance and mining speed
//                 const balance = doc.data()?.balance || 0;
//                 console.log('balance', balance);
//                 const miningFreeSpeed = 10; // mining free speed
//                 const miningSpeed = doc.data()?.miningSpeed || miningFreeSpeed;
//                 console.log('miningSpeed', miningSpeed);
//                 const newBalance = balance + miningSpeed;
//                 // time details
//                 const newMiningStartTime = Timestamp.now();
//                 const newMiningEndTime = Timestamp.fromMillis(date.getTime() + 24 * 60 * 60 * 1000);
//                 //update balance and time
//                 docRef.update({
//                     miningStartTime: newMiningStartTime,
//                     miningEndTime: newMiningEndTime,
//                     balance: newBalance
//                 });
//                 //add mining program transaction
//                 docTransactionsRef.add({
//                 sender: 'miningProgram',
//                 receiver: uId,
//                 amount: miningSpeed,
//                 createdAt: Timestamp.now(),
//                 });

//                 //referral program
//                 if (!referral) {
//                     // return response
//                     response.status(200).send(`${newBalance}`);
//                     return;
//                 }
//                 // get referral balance
//                 const referralBalance = docReferral.data()?.balance || 0;
//                 const newReferralBalance = referralBalance + (referralPercentage * miningSpeed);
//                 //update referral balance
//                 docReferralRef.update({
//                     balance: newReferralBalance
//                 });
//                 //add referral program transaction
//                 docTransactionsRef.add({
//                     sender: 'referralProgram',
//                     senderId: uId,
//                     receiver: referral,
//                     amount: miningSpeed * referralPercentage,
//                     createdAt: Timestamp.now(),
//                 });
//                 // return response
//                 response.status(200).send(`${newBalance}`);
//                 return
//             } else {
//                 response.status(200).send(`${doc.data()?.balance}`);
//             }
//         } else {
//             response.status(404).send('Document not found!');
//         }
//     } catch (error) {
//         console.log(error);
//         response.status(500).send('Error retrieving data');
//     }
// });

export const collectionCall = functions.https.onCall(async (data: {uId: string}, context: any) => {
    try {
        // const uId = request.params[0].replace('/', '');
        const uId = data.uId
        const docRef = db.collection('users').doc(`${uId}`);

        const docTransactionsRef = db.collection('transactions');
        const doc = await docRef.get();

        const referralPercentage = 0.03 // 3%
        const referral = doc.data()?.referral
        const docReferralRef = db.collection('users').doc(`${referral}`);
        const docReferral = await docReferralRef.get();
        
        if (doc.exists) {
            const date = new Date()
            // const miningEndTime = (doc.data()?.miningEndTime as Timestamp).toDate() || date;
            const miningEndTime = (doc.data()?.miningEndTime || Timestamp.fromDate(date)).toDate() as Date;
            console.log('miningEndTime', miningEndTime);
            const condition = date.getTime() >= miningEndTime.getTime(); 
            if (condition) {
                // get balance and mining speed
                const balance = doc.data()?.balance || 0;
                console.log('balance', balance);
                const miningFreeSpeed = 10; // mining free speed
                const miningSpeed = doc.data()?.miningSpeed || miningFreeSpeed;
                console.log('miningSpeed', miningSpeed);
                const newBalance = balance + miningSpeed;
                // time details
                const newMiningStartTime = Timestamp.now();
                const newMiningEndTime = Timestamp.fromMillis(date.getTime() + 24 * 60 * 60 * 1000);
                //update balance and time
                docRef.update({
                    miningStartTime: newMiningStartTime,
                    miningEndTime: newMiningEndTime,
                    balance: newBalance
                });
                //add mining program transaction
                docTransactionsRef.add({
                sender: 'miningProgram',
                receiver: uId,
                amount: miningSpeed,
                createdAt: Timestamp.now(),
                });

                //referral program
                if (!referral) {
                    // return response
                    // response.status(200).send(`${newBalance}`);
                    return `${newBalance}`;
                }
                // get referral balance
                const referralBalance = docReferral.data()?.balance || 0;
                const newReferralBalance = referralBalance + (referralPercentage * miningSpeed);
                //update referral balance
                docReferralRef.update({
                    balance: newReferralBalance
                });
                //add referral program transaction
                docTransactionsRef.add({
                    sender: 'referralProgram',
                    senderId: uId,
                    receiver: referral,
                    amount: miningSpeed * referralPercentage,
                    createdAt: Timestamp.now(),
                });
                // return response
                // response.status(200).send(`${newBalance}`);
                return `${newBalance}`;
            } else {
                // response.status(200).send(`${doc.data()?.balance}`);
                return `${doc.data()?.balance}`;
            }
        } else {
            // response.status(404).send('Document not found!');
            return 'Document not found!';
        }
    } catch (error) {
        console.log(error);
        // response.status(500).send('Error retrieving data');
        return 'Error retrieving data';
    }
});

export const sendAssetsCall = functions.https.onCall(async (data: {sender: string, receiver: string, amount: number}, context: any) => { //sender (uid) receiver (uid)
    try {
        // sender
        const senderId = data.sender
        const docSenderRef = db.collection('users').doc(`${senderId}`);
        const docSender = await docSenderRef.get();
        const senderBalance = (docSender.data()?.balance) as number || 0;
        //receiver
        // const receiverUsername = data.receiver
        // const docReceiverRef = db.collection('users').where('username', '==', receiverUsername);
        const receiverId = data.receiver
        const docReceiverRef = db.collection('users').doc(`${receiverId}`);
        const docReceiver = await docReceiverRef.get();
        //transactions
        const docTransactionsRef = db.collection('transactions');

        // const receiverBalance = docReceiver.docs[0].data()?.balance || 0;
        
        // if (docSender.exists && docReceiver.size > 0 && senderBalance >= data.amount) {
        if (docSender.exists && docReceiver.exists && senderBalance >= data.amount) {
            const receiverBalance = (docReceiver.data()?.balance) as number || 0;
            const newSenderBalance = senderBalance - data.amount;
            const newReceiverBalance = receiverBalance + data.amount;
            //update sender balance
            docSenderRef.update({
                balance: newSenderBalance
            });
            //update receiver balance
            // docReceiverRef.doc(docReceiver.docs[0].id).update({
            //     balance: newReceiverBalance
            // });
            docReceiverRef.update({
                balance: newReceiverBalance
            });
            //add transaction
            docTransactionsRef.add({
                sender: senderId,
                receiver: receiverId,
                amount: data.amount,
                createdAt: Timestamp.now(),
            });
            return 'Send assets successfully!';
        } else if (!docSender.exists) {
            return 'Sender not found!';
        } else if (!docReceiver.exists) {
            return 'Receiver not found!';
        } else {
            return 'Your balance is not enough to send assets!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});

export const updateMiningSpeedCall = functions.https.onCall(async (data: {uid: string, offer: string}, context: any) => { //sender (uid) receiver (uid)
    try {
        const uId = data.uid
        const docRef = db.collection('users').doc(`${uId}`);
        const doc = await docRef.get();
        const balance = doc.data()?.balance || 0;
        const miningSpeedOffer = miningSpeedOffers[data.offer as 'fast' || 'medium' || 'slow'];
        const cost = miningSpeedOffer.cost;
        
        //receiver
        const receiverId = '4pHLmWkpasdZzunuZHrmhFHlsPJ3' // admin id
        const docReceiverRef = db.collection('users').doc(`${receiverId}`);
        const docReceiver = await docReceiverRef.get();

        const docTransactionsRef = db.collection('transactions');

        if (doc.exists && docReceiver.exists && balance >= cost) {
            const receiverBalance = docReceiver.data()?.balance || 0;
            const newBalance = balance - cost;
            const newReceiverBalance = receiverBalance + cost;
            const speed = miningSpeedOffer.speed;
            const newMiningSpeed = (docReceiver.data()?.miningSpeed || 10) + speed;
            //update sender balance
            docRef.update({
                balance: newBalance,
                miningSpeed: newMiningSpeed
            });
            //update receiver balance
            docReceiverRef.update({
                balance: newReceiverBalance
            });
            //add transaction
            docTransactionsRef.add({
                sender: uId,
                receiver: receiverId,
                amount: cost,
                createdAt: Timestamp.now(),
            });
            return 'The offer has been successfully purchased!';
        } else if (!doc.exists) {
            return 'Sender not found!';
        } else if (!docReceiver.exists) {
            return 'Receiver not found!';
        } else {
            return 'Your balance is not enough to buy the offer!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});
