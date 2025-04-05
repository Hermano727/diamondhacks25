import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Receipt } from '../../types/receipt';
// import { receiptService } from '../../services/receiptService';
import { mockReceiptService } from '../../services/mockData';
// import { auth } from '../../services/firebase';

export default function HistoryScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      // Using mock data instead of Firebase
      const data = await mockReceiptService.getUserReceipts();
      setReceipts(data);
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptPress = (receipt: Receipt) => {
    router.push({
      pathname: '/receipt/[id]',
      params: { id: receipt.id }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderItem = ({ item }: { item: Receipt }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleReceiptPress(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{item.storeName}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
          <Text style={styles.total}>{formatCurrency(item.total)}</Text>
        </View>
        
        <View style={styles.cardDetails}>
          {item.location?.address && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color="#1a237e" />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location.address}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="receipt-outline" size={16} color="#1a237e" />
            <Text style={styles.detailText}>
              {item.items.length} items
            </Text>
          </View>

          {item.group && (
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={16} color="#1a237e" />
              <Text style={styles.detailText}>
                Split with {item.group.people.length} people
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.cardArrow}>
        <Ionicons name="chevron-forward" size={20} color="#1a237e" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Receipt History</Text>
      </View>
      
      <FlatList
        data={receipts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="#1a237e" />
            <Text style={styles.emptyText}>No receipts yet</Text>
            <Text style={styles.emptySubtext}>
              Your scanned receipts will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeInfo: {
    flex: 1,
    marginRight: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
  cardDetails: {
    backgroundColor: '#f8f9fe',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cardArrow: {
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
}); 