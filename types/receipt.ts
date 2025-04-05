export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  splitBetween?: string[]; // Array of user IDs who split this item
}

export interface Receipt {
  id: string;
  userId?: string; // Optional: only present if user is logged in
  storeName: string;
  date: string;
  total: number;
  tax: number;
  items: ReceiptItem[];
  imageUrl?: string; // URL to the receipt image in Firebase Storage
  location?: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  group?: {
    people: Array<{
      id: string;
      name: string;
      email?: string;
    }>;
    splitType: 'equal' | 'custom'; // How the bill was split
  };
  status: 'pending' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>; // For future extensibility
} 