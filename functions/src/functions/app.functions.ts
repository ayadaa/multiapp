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

const P2PPaymentMethods = {
    zainCash: 'zainCash',
    zainCashBusiness: 'zainCashBusiness',
    alRafidainQiServices: 'alRafidainQiServices',
    asiaHawala: 'asiaHawala',
    firstIraqiBank: 'firstIraqiBank',
    fastPay: 'fastPay',
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
            const newReceiverBalance = receiverBalance - (- data.amount);
            //update sender balance
            docSenderRef.update({
                balance: newSenderBalance
            });
            //update receiver balance
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

// export const createP2PPaymentCall = functions.https.onCall(async (data: {uid: string, creatorUsername: string, amount: number, paymentMethod: string, price: string}, context: any) => { //sender (uid) receiver (uid)
export const createP2PPaymentCall = functions.https.onCall(async (data: {uid: string, amount: number, paymentMethod: string, price: string}, context: any) => { //sender (uid) receiver (uid)
    try {
        const uId = data.uid
        const docRef = db.collection('users').doc(`${uId}`);
        const doc = await docRef.get();
        const isVerified = doc.data()?.isVerified;
        const balance = doc.data()?.balance || 0;
        // const creatorUsername = data.creatorUsername;

        const amount = data.amount;
        const price = data.price;
        // const paymentMethod = P2PPaymentMethods[data.paymentMethod as `${P2PPaymentMethods.zainCash}` || `${P2PPaymentMethods.zainCashBusiness}` || `${P2PPaymentMethods.alRafidainQiServices}` || `${P2PPaymentMethods.asiaHawala}` || `${P2PPaymentMethods.firstIraqiBank}` || `${P2PPaymentMethods.fastPay}`];
        const paymentMethod = P2PPaymentMethods[data.paymentMethod as `zainCash` || `zainCashBusiness` || `alRafidainQiServices` || `asiaHawala` || `firstIraqiBank` || `fastPay`];
        const docP2PPaymentRef = db.collection('p2pPayment');
        const docTransactionsRef = db.collection('transactions');

        if (doc.exists && isVerified && balance <= amount) {
            // new palnce
            const newBalance = balance - amount;
            //update the balance
            docRef.update({
                balance: newBalance,
            });
            //add the P2P payment
            docP2PPaymentRef.add({
                createdBy: uId,
                // creatorUsername: creatorUsername,
                amount: amount,
                price: price,
                paymentMethod: paymentMethod,
                isActive: true,
                createdAt: Timestamp.now(),
            });

            //add transaction
            docTransactionsRef.add({
                sender: uId,
                receiver: 'p2pProgram',
                amount: amount,
                createdAt: Timestamp.now(),
            });
            return 'The p2p payment has been successfully placed!';
        } else if (!doc.exists) {
            return 'User not found!';
        } else if (!isVerified) {
            return 'The user is not verified!';
        } else {
            return 'Your balance is not enough to buy the offer!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});

export const deactiveateP2PPaymentCall = functions.https.onCall(async (data: {uid: string, p2pPaymentId: string}, context: any) => { //sender (uid) receiver (uid)
    try {
        const uId = data.uid
        const docRef = db.collection('users').doc(`${uId}`);
        const doc = await docRef.get();

        const p2pPaymentId = data.p2pPaymentId;
        const docP2PPaymentRef = db.collection('p2pPayment').doc(`${p2pPaymentId}`);
        const docP2PPayment = await docP2PPaymentRef.get();
        const createdBy = docP2PPayment.data()?.createdBy;

        if (doc.exists && docP2PPayment.exists && uId == createdBy) {
            //update the P2P payment
            docP2PPaymentRef.update({
                isActive: false,
            });

            return 'The p2p payment has been successfully deactiveated!';
        } else if (!doc.exists) {
            return 'User not found!';
        } else if (!docP2PPayment.exists) {
            return 'P2P payment not found!';
        } else {
            return 'Your can not edit this p2p payment!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});

export const createP2PRequestCall = functions.https.onCall(async (data: {uid: string, p2pPaymentId: string, amount: number}, context: any) => { //sender (uid) receiver (uid)
    try {
        const uId = data.uid;
        const docRef = db.collection('users').doc(`${uId}`);
        const doc = await docRef.get();
        const p2pPaymentId = data.p2pPaymentId;
        const amount = data.amount;
        const docP2PPaymentRef = db.collection('p2pPayment').doc(`${p2pPaymentId}`);
        const docP2PPayment = await docP2PPaymentRef.get();
        const p2pCreatedBy = docP2PPayment.data()?.createdBy;
        const p2pAmount = docP2PPayment.data()?.amount;
        const docP2PRequestsRef = db.collection('p2pRequests');

        if (doc.exists && docP2PPayment.exists && p2pAmount >= amount) {
            const expiredAt = Timestamp.now().toMillis() + (1 * 60 * 60 * 1000) // expires after one hour
            const expiresAt = Timestamp.fromMillis(expiredAt);
            //add the P2P request
            docP2PRequestsRef.add({
                createdBy: uId,
                p2pPaymentId: p2pPaymentId,
                p2pCreatedBy: p2pCreatedBy,
                amount: amount,
                expiresAt: expiresAt,
                isCompleted: false, // createdBy action
                isApproved: false, // p2pCreatedBy action
                isCanceled: false, // createdBy action
                isRejected: false, // p2pCreatedBy action
                isExpired: false, // p2pSystem action
                p2pPicture: '', // createdBy action
                createdAt: Timestamp.now(),
            });
            return 'The p2p request has been successfully placed!';
        } else if (!doc.exists) {
            return 'User not found!';
        } else if (!docP2PPayment.exists) {
            return 'The doc P2P Payment is not exists!';
        } else {
            return 'Placed amount is greater than the offer!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});

export const completeP2PRequestCall = functions.https.onCall(async (data: {uid: string, p2pRequestId: string, p2pPicture: string}, context: any) => { //sender (uid) receiver (uid)
    try {
        const uId = data.uid;
        const docRef = db.collection('users').doc(`${uId}`);
        const doc = await docRef.get();

        const p2pRequestId = data.p2pRequestId;
        const p2pPicture = data.p2pPicture;
        const docP2PRequestsRef = db.collection('p2pRequests').doc(`${p2pRequestId}`);
        const docP2PRequest = await docP2PRequestsRef.get();
        const createdBy = docP2PRequest.data()?.createdBy;
        const isExpired = docP2PRequest.data()?.isExpired;

        if (doc.exists && docP2PRequest.exists && uId == createdBy && isExpired == false) {
            //update the P2P request
            docP2PRequestsRef.update({
                isCompleted: true,
                p2pPicture: p2pPicture,
            });
            return 'The p2p request has been successfully updated!';
        } else if (!doc.exists) {
            return 'User not found!';
        } else if (!docP2PRequest.exists) {
            return 'Doc not found!';
        } else if (!(uId == createdBy)) {
            return 'You can not update this doc!';
        } else {
            return 'This request is expired!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});

export const approveP2PRequestCall = functions.https.onCall(async (data: {uid: string, p2pRequestId: string}, context: any) => { //sender (uid) receiver (uid)
    try {
        const uId = data.uid;
        const docRef = db.collection('users').doc(`${uId}`);
        const doc = await docRef.get();

        const p2pRequestId = data.p2pRequestId;
        const docP2PRequestsRef = db.collection('p2pRequests').doc(`${p2pRequestId}`);
        const docP2PRequest = await docP2PRequestsRef.get();
        const p2pPaymentId = docP2PRequest.data()?.p2pPaymentId;
        const p2pCreatedBy = docP2PRequest.data()?.p2pCreatedBy;
        const isExpired = docP2PRequest.data()?.isExpired;
        const amount = docP2PRequest.data()?.amount;

        const receiverId = docP2PRequest.data()?.createdBy;
        const docReceiverRef = db.collection('users').doc(`${receiverId}`);
        const docReceiver = await docReceiverRef.get();

        const docP2PPaymentRef = db.collection('p2pPayment').doc(`${p2pPaymentId}`);
        const docP2PPayment = await docP2PPaymentRef.get();
        const p2PPaymentbalance = docP2PPayment.data()?.amount;

        const docTransactionsRef = db.collection('transactions');

        if (doc.exists && docP2PRequest.exists && uId == p2pCreatedBy && isExpired == false && p2PPaymentbalance >= amount) {
            const receiverBalance = (docReceiver.data()?.balance) as number || 0;
            // const newSenderBalance = balance - amount;
            const newReceiverBalance = receiverBalance - (- amount);
            const newP2PPaymentBalance = p2PPaymentbalance - amount;
            //update sender balance
            // docSenderRef.update({
            //     balance: newSenderBalance
            // });
            //update the P2P payment
            docP2PPaymentRef.update({
                amount: newP2PPaymentBalance,
            });
            //update receiver balance
            docReceiverRef.update({
                balance: newReceiverBalance
            });
            //add transaction
            docTransactionsRef.add({
                // sender: senderId,
                sender: 'p2pProgram',
                receiver: receiverId,
                amount: amount,
                createdAt: Timestamp.now(),
            });
            //update the P2P request
            docP2PRequestsRef.update({
                isApproved: true,
            });
            return 'The p2p request has been successfully updated!';
        } else if (!doc.exists) {
            return 'User not found!';
        } else if (!docP2PRequest.exists) {
            return 'Doc not found!';
        } else if (!(uId == p2pCreatedBy)) {
            return 'You can not update this doc!';
        } else {
            return 'This request is expired!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});

export const cancelP2PRequestCall = functions.https.onCall(async (data: {uid: string, p2pRequestId: string}, context: any) => { //sender (uid) receiver (uid)
    try {
        const uId = data.uid;
        const docRef = db.collection('users').doc(`${uId}`);
        const doc = await docRef.get();

        const p2pRequestId = data.p2pRequestId;
        const docP2PRequestsRef = db.collection('p2pRequests').doc(`${p2pRequestId}`);
        const docP2PRequest = await docP2PRequestsRef.get();
        const createdBy = docP2PRequest.data()?.createdBy;
        const isExpired = docP2PRequest.data()?.isExpired;

        if (doc.exists && docP2PRequest.exists && uId == createdBy && isExpired == false) {
            //update the P2P request
            docP2PRequestsRef.update({
                isCanceled: true,
            });
            return 'The p2p request has been successfully updated!';
        } else if (!doc.exists) {
            return 'User not found!';
        } else if (!docP2PRequest.exists) {
            return 'Doc not found!';
        } else if (!(uId == createdBy)) {
            return 'You can not update this doc!';
        } else {
            return 'This request is expired!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});

export const rejectP2PRequestCall = functions.https.onCall(async (data: {uid: string, p2pRequestId: string}, context: any) => { //sender (uid) receiver (uid)
    try {
        const uId = data.uid;
        const docRef = db.collection('users').doc(`${uId}`);
        const doc = await docRef.get();

        const p2pRequestId = data.p2pRequestId;
        const docP2PRequestsRef = db.collection('p2pRequests').doc(`${p2pRequestId}`);
        const docP2PRequest = await docP2PRequestsRef.get();
        const p2pCreatedBy = docP2PRequest.data()?.p2pCreatedBy;
        const isExpired = docP2PRequest.data()?.isExpired;

        if (doc.exists && docP2PRequest.exists && uId == p2pCreatedBy && isExpired == false) {
            //update the P2P request
            docP2PRequestsRef.update({
                isRejected: true,
            });
            return 'The p2p request has been successfully updated!';
        } else if (!doc.exists) {
            return 'User not found!';
        } else if (!docP2PRequest.exists) {
            return 'Doc not found!';
        } else if (!(uId == p2pCreatedBy)) {
            return 'You can not update this doc!';
        } else {
            return 'This request is expired!';
        }
    } catch (error) {
        console.log(error);
        return 'Error retrieving data';
    }
});

// export const expiresP2PRequestCall = // p2pSystem action