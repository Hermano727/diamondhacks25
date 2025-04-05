// import {
//   collection,
//   doc,
//   setDoc,
//   getDoc,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   limit,
//   DocumentData,
// } from 'firebase/firestore';
// import { db, auth } from './firebase';
// import { Receipt } from '../types/receipt';

// const RECEIPTS_COLLECTION = 'receipts';

// export const receiptService = {
//   // Create a new receipt
//   async createReceipt(receipt: Omit<Receipt, 'id'>): Promise<string> {
//     const receiptRef = doc(collection(db, RECEIPTS_COLLECTION));
//     const newReceipt = {
//       ...receipt,
//       id: receiptRef.id,
//       userId: auth.currentUser?.uid,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
    
//     await setDoc(receiptRef, newReceipt);
//     return receiptRef.id;
//   },

//   // Get a receipt by ID
//   async getReceipt(id: string): Promise<Receipt | null> {
//     const receiptRef = doc(db, RECEIPTS_COLLECTION, id);
//     const receiptSnap = await getDoc(receiptRef);
    
//     if (!receiptSnap.exists()) {
//       return null;
//     }
    
//     return receiptSnap.data() as Receipt;
//   },

//   // Get receipts for the current user
//   async getUserReceipts(options?: {
//     limit?: number;
//     status?: Receipt['status'];
//   }): Promise<Receipt[]> {
//     const userId = auth.currentUser?.uid;
//     if (!userId) {
//       return [];
//     }

//     let q = query(
//       collection(db, RECEIPTS_COLLECTION),
//       where('userId', '==', userId),
//       orderBy('createdAt', 'desc')
//     );

//     if (options?.status) {
//       q = query(q, where('status', '==', options.status));
//     }

//     if (options?.limit) {
//       q = query(q, limit(options.limit));
//     }

//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(doc => doc.data() as Receipt);
//   },

//   // Get receipts shared with the user
//   async getSharedReceipts(): Promise<Receipt[]> {
//     const userId = auth.currentUser?.uid;
//     if (!userId) {
//       return [];
//     }

//     const q = query(
//       collection(db, RECEIPTS_COLLECTION),
//       where('group.people', 'array-contains', { id: userId }),
//       orderBy('createdAt', 'desc')
//     );

//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(doc => doc.data() as Receipt);
//   },

//   // Update a receipt
//   async updateReceipt(id: string, updates: Partial<Receipt>): Promise<void> {
//     const receiptRef = doc(db, RECEIPTS_COLLECTION, id);
//     await setDoc(receiptRef, {
//       ...updates,
//       updatedAt: new Date().toISOString(),
//     }, { merge: true });
//   },

//   // Get recent receipts for anonymous users (stored locally)
//   async getLocalReceipts(): Promise<Receipt[]> {
//     try {
//       const receipts = await localStorage.getItem('localReceipts');
//       return receipts ? JSON.parse(receipts) : [];
//     } catch {
//       return [];
//     }
//   },

//   // Save receipt locally for anonymous users
//   async saveLocalReceipt(receipt: Receipt): Promise<void> {
//     try {
//       const receipts = await this.getLocalReceipts();
//       receipts.unshift(receipt);
//       await localStorage.setItem('localReceipts', JSON.stringify(receipts.slice(0, 10)));
//     } catch {
//       // Handle error
//     }
//   },
// }; 