import { Receipt } from '../types/receipt';

// Mock receipt data
const mockReceipts: Receipt[] = [
  {
    id: '1',
    storeName: 'Walmart',
    date: new Date().toISOString(),
    total: 156.78,
    tax: 12.34,
    items: [
      { id: '1', name: 'Groceries', quantity: 1, price: 45.67 },
      { id: '2', name: 'Electronics', quantity: 2, price: 49.99 },
    ],
    location: {
      address: '123 Main St, City, State',
    },
    group: {
      people: [
        { id: '1', name: 'John' },
        { id: '2', name: 'Jane' },
      ],
      splitType: 'equal',
    },
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    storeName: 'Target',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    total: 89.99,
    tax: 7.20,
    items: [
      { id: '3', name: 'Clothing', quantity: 1, price: 29.99 },
      { id: '4', name: 'Home Decor', quantity: 1, price: 52.80 },
    ],
    location: {
      address: '456 Oak Ave, City, State',
    },
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockReceiptService = {
  // Get all receipts
  async getUserReceipts(): Promise<Receipt[]> {
    return mockReceipts;
  },

  // Get a receipt by ID
  async getReceipt(id: string): Promise<Receipt | null> {
    const receipt = mockReceipts.find(r => r.id === id);
    return receipt || null;
  },

  // Create a new receipt
  async createReceipt(receipt: Omit<Receipt, 'id'>): Promise<string> {
    const newId = (mockReceipts.length + 1).toString();
    const newReceipt = {
      ...receipt,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockReceipts.push(newReceipt as Receipt);
    return newId;
  },

  // Get receipts for anonymous users
  async getLocalReceipts(): Promise<Receipt[]> {
    return mockReceipts;
  },

  // Save receipt locally
  async saveLocalReceipt(receipt: Receipt): Promise<void> {
    mockReceipts.push(receipt);
  },
}; 