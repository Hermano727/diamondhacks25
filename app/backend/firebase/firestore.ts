import { firebase } from './firebaseConfig';
import type { Receipt, FoodComponent, Bill, UserProfile } from '../../types/firestore';

// User Profile Functions
export const createUserProfile = async (uid: string, phoneNumber: string) => {
  try {
    console.log('Creating user profile for UID:', uid);
    const userProfile: UserProfile = {
      phoneNumber,
      createdAt: new Date(),
      lastActive: new Date(),
      stats: {
        totalReceipts: 0,
        totalFoodComponents: 0,
        totalBills: 0,
      },
    };
    await firebase.firestore().collection('users').doc(uid).set(userProfile);
    console.log('User profile created successfully');
    return userProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    console.log('Fetching user profile for UID:', uid);
    const docRef = firebase.firestore().collection('users').doc(uid);
    const docSnap = await docRef.get();
    console.log('User profile document exists:', docSnap.exists);
    return docSnap.exists ? (docSnap.data() as UserProfile) : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserStats = async (uid: string) => {
  const receiptsSnapshot = await firebase.firestore().collection('users').doc(uid).collection('receipts').get();
  const foodSnapshot = await firebase.firestore().collection('users').doc(uid).collection('food').get();
  const billsSnapshot = await firebase.firestore().collection('users').doc(uid).collection('bills').get();

  await firebase.firestore().collection('users').doc(uid).update({
    'stats.totalReceipts': receiptsSnapshot.size,
    'stats.totalFoodComponents': foodSnapshot.size,
    'stats.totalBills': billsSnapshot.size,
    lastActive: new Date(),
  });
};

// Receipts Functions
export const getUserReceipts = async (uid: string): Promise<Receipt[]> => {
  const snapshot = await firebase.firestore()
    .collection('users')
    .doc(uid)
    .collection('receipts')
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
    createdAt: doc.data().createdAt.toDate(),
  } as Receipt));
};

export const addReceipt = async (uid: string, receipt: Omit<Receipt, 'id' | 'createdAt'>) => {
  const docRef = await firebase.firestore()
    .collection('users')
    .doc(uid)
    .collection('receipts')
    .add({
      ...receipt,
      createdAt: new Date(),
    });

  await updateUserStats(uid);
  return docRef.id;
};

// Food Components Functions
export const getUserFood = async (uid: string): Promise<FoodComponent[]> => {
  const snapshot = await firebase.firestore()
    .collection('users')
    .doc(uid)
    .collection('food')
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  } as FoodComponent));
};

export const addFoodComponent = async (uid: string, food: Omit<FoodComponent, 'id' | 'createdAt'>) => {
  const docRef = await firebase.firestore()
    .collection('users')
    .doc(uid)
    .collection('food')
    .add({
      ...food,
      createdAt: new Date(),
    });

  await updateUserStats(uid);
  return docRef.id;
};

// Bills Functions
export const getUserBills = async (uid: string): Promise<Bill[]> => {
  const snapshot = await firebase.firestore()
    .collection('users')
    .doc(uid)
    .collection('bills')
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dueDate: doc.data().dueDate.toDate(),
    createdAt: doc.data().createdAt.toDate(),
  } as Bill));
};

export const addBill = async (uid: string, bill: Omit<Bill, 'id' | 'createdAt'>) => {
  const docRef = await firebase.firestore()
    .collection('users')
    .doc(uid)
    .collection('bills')
    .add({
      ...bill,
      createdAt: new Date(),
    });

  await updateUserStats(uid);
  return docRef.id;
}; 