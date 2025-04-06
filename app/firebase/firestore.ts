import { db } from './config';
import type { Receipt, FoodComponent, Bill, UserProfile } from '../types/firestore';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

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

    await setDoc(doc(db, 'users', uid), userProfile);
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
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    console.log('User profile document exists:', docSnap.exists());
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserStats = async (uid: string) => {
  const receiptsSnapshot = await getDocs(collection(db, 'users', uid, 'receipts'));
  const foodSnapshot = await getDocs(collection(db, 'users', uid, 'food'));
  const billsSnapshot = await getDocs(collection(db, 'users', uid, 'bills'));

  await updateDoc(doc(db, 'users', uid), {
    'stats.totalReceipts': receiptsSnapshot.size,
    'stats.totalFoodComponents': foodSnapshot.size,
    'stats.totalBills': billsSnapshot.size,
    lastActive: new Date(),
  });
};

// Receipts Functions
export const getUserReceipts = async (uid: string): Promise<Receipt[]> => {
  const q = query(
    collection(db, 'users', uid, 'receipts'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
    createdAt: doc.data().createdAt.toDate(),
  } as Receipt));
};

export const addReceipt = async (uid: string, receipt: Omit<Receipt, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'users', uid, 'receipts'), {
    ...receipt,
    createdAt: new Date(),
  });

  await updateUserStats(uid);
  return docRef.id;
};

// Food Components Functions
export const getUserFood = async (uid: string): Promise<FoodComponent[]> => {
  const q = query(
    collection(db, 'users', uid, 'food'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  } as FoodComponent));
};

export const addFoodComponent = async (uid: string, food: Omit<FoodComponent, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'users', uid, 'food'), {
    ...food,
    createdAt: new Date(),
  });

  await updateUserStats(uid);
  return docRef.id;
};

// Bills Functions
export const getUserBills = async (uid: string): Promise<Bill[]> => {
  const q = query(
    collection(db, 'users', uid, 'bills'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dueDate: doc.data().dueDate.toDate(),
    createdAt: doc.data().createdAt.toDate(),
  } as Bill));
};

export const addBill = async (uid: string, bill: Omit<Bill, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'users', uid, 'bills'), {
    ...bill,
    createdAt: new Date(),
  });

  await updateUserStats(uid);
  return docRef.id;
}; 