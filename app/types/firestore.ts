export interface Receipt {
  id: string;
  date: Date;
  total: number;
  items: ReceiptItem[];
  imageUrl?: string;
  createdAt: Date;
}

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

export interface FoodComponent {
  id: string;
  name: string;
  category: string;
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: Date;
}

export interface Bill {
  id: string;
  amount: number;
  description: string;
  dueDate: Date;
  paid: boolean;
  category: string;
  createdAt: Date;
}

export interface UserProfile {
  phoneNumber: string;
  createdAt: Date;
  lastActive: Date;
  stats: {
    totalReceipts: number;
    totalFoodComponents: number;
    totalBills: number;
  };
} 