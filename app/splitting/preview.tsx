import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface Person {
  id: string;
  name: string;
  items: ReceiptItem[];
  total: number;
}

const PreviewSplitScreen = () => {
  const { people: peopleStr, total: totalStr } = useLocalSearchParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (peopleStr && totalStr) {
      try {
        const parsedPeople = JSON.parse(peopleStr as string);
        const parsedTotal = parseFloat(totalStr as string);
        setPeople(parsedPeople);
        setTotal(parsedTotal);
      } catch (err) {
        console.error('Failed to parse data:', err);
        Alert.alert('Error', 'Failed to load split data');
      }
    }
  }, [peopleStr, totalStr]);

  const handleShare = async () => {
    try {
      const url = `http://100.112.72.217:8000/preview/receipt/${Date.now()}`;
      await Share.share({ 
        message: `Check out our split: ${url}`,
        title: 'Receipt Split'
      });
    } catch (err) {
      console.error('❌ Share error:', err);
      Alert.alert("Failed to share receipt.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Split Preview</Text>
          
          {/* People List */}
          <View style={styles.peopleSection}>
            {people.map(person => (
              <View key={person.id} style={styles.personCard}>
                <View style={styles.personHeader}>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personTotal}>${person.total.toFixed(2)}</Text>
                </View>
                
                <View style={styles.itemsList}>
                  {person.items.map((item, index) => (
                    <View key={index} style={styles.item}>
                      <Text style={styles.itemName}>
                        {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                      </Text>
                      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Total Section */}
          <View style={styles.totalSection}>
            <Text style={styles.totalTitle}>Total Bill</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share" size={24} color="#fff" />
              <Text style={styles.shareButtonText}>Share Split</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1a237e" />
              <Text style={styles.backButtonText}>Back to Assign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 24,
  },
  peopleSection: {
    marginBottom: 24,
  },
  personCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  personName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
  personTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  itemsList: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
    padding: 12,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
  },
  totalSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  actions: {
    gap: 12,
  },
  shareButton: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#1a237e',
  },
  backButtonText: {
    color: '#1a237e',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PreviewSplitScreen;
