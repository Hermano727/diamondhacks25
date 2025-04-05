import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Receipt } from '../../types/receipt';
// import { receiptService } from '../../services/receiptService';
import { mockReceiptService } from '../../services/mockData';

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipt();
  }, [id]);

  const loadReceipt = async () => {
    try {
      setLoading(true);
      const data = await mockReceiptService.getReceipt(id as string);
      setReceipt(data);
    } catch (error) {
      console.error('Error loading receipt:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!receipt) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Receipt not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: receipt.storeName,
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a237e', // Deep navy blue
          },
          headerTitleStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '600',
          },
          headerLeft: () => (
            <Ionicons
              name="chevron-back"
              size={24}
              color="#fff"
              style={{ marginLeft: 8 }}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {receipt.imageUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: receipt.imageUrl }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.mainContent}>
            <View style={styles.section}>
              <View style={styles.header}>
                <Text style={styles.storeName}>{receipt.storeName}</Text>
                <Text style={styles.date}>{formatDate(receipt.date)}</Text>
              </View>

              {receipt.location?.address && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={20} color="#1a237e" />
                  <Text style={styles.infoText}>{receipt.location.address}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Items</Text>
              {receipt.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.section, styles.summarySection]}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryAmount}>
                    {formatCurrency(receipt.total - receipt.tax)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryAmount}>
                    {formatCurrency(receipt.tax)}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalAmount}>
                    {formatCurrency(receipt.total)}
                  </Text>
                </View>
              </View>
            </View>

            {receipt.group && (
              <View style={[styles.section, styles.groupSection]}>
                <Text style={styles.sectionTitle}>Split with</Text>
                <View style={styles.peopleGrid}>
                  {receipt.group.people.map((person) => (
                    <View key={person.id} style={styles.personCard}>
                      <Ionicons name="person-circle-outline" size={32} color="#1a237e" />
                      <Text style={styles.personName}>{person.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  mainContent: {
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f9fe',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
  },
  summarySection: {
    backgroundColor: '#fff',
  },
  summaryContent: {
    backgroundColor: '#f8f9fe',
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
  groupSection: {
    marginBottom: 24,
  },
  peopleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  personCard: {
    backgroundColor: '#f8f9fe',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  personName: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
}); 