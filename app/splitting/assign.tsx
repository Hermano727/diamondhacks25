import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';

interface ParsedReceipt {
  storeName: string;
  date: string;
  total: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  tax: number;
  subtotal: number;
}

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

const ReceiptParserScreen = () => {
  const { items, subtotal, tax, tip, total } = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedReceipt | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);

  useEffect(() => {
    if (items) {
      try {
        const parsedItems = JSON.parse(items as string);
        console.log('Parsed items:', parsedItems);
        
        // Ensure all prices are numbers and quantities are integers
        const formattedItems = parsedItems.map((item: any) => ({
          name: item.name,
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
          quantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1
        }));
        
        setReceiptItems(formattedItems);
      } catch (err) {
        console.error('Failed to parse items:', err);
        Alert.alert('Error', 'Failed to load receipt items');
      }
    }
  }, [items]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setError(null);
      setParsedData(null);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setError(null);
      setParsedData(null);
    }
  };

  const parseReceipt = async () => {
    if (!image) return Alert.alert('No image selected!');

    setLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const formData = new FormData();

      const fileName = image.split('/').pop() || 'receipt.jpg';
      const fileType = 'image/jpeg';

      const file = {
        uri: image,
        name: fileName,
        type: fileType,
      };

      formData.append('receipt', file as any);

      const response = await axios.post('http://100.112.72.217:8000/upload-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      if (response.data && response.data.parsed) {
        const transformedData = {
          storeName: 'Store Name',
          date: new Date().toLocaleDateString(),
          items: response.data.parsed.items.map((item: any) => ({
            name: item.name,
            price: parseFloat(item.price),
            quantity: 1,
          })),
          subtotal: parseFloat(response.data.parsed.subtotal || '0'),
          tax: parseFloat(response.data.parsed.tax || '0'),
          total: parseFloat(response.data.parsed.total || '0'),
        };

        setParsedData(transformedData);
      } else {
        setError('Failed to parse receipt data');
      }
    } catch (err: any) {
      console.error('❌ Parse error:', err.message);
      setError(err.message || 'Failed to parse receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addPerson = () => {
    if (!newPersonName.trim()) return;
    
    const newPerson: Person = {
      id: Date.now().toString(),
      name: newPersonName.trim(),
      items: [],
      total: 0,
    };
    
    setPeople([...people, newPerson]);
    setNewPersonName('');
  };

  const assignItem = (item: ReceiptItem, personId: string) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        const updatedItems = [...person.items, item];
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...person, items: updatedItems, total: newTotal };
      }
      return person;
    }));
  };

  const removeItem = (item: ReceiptItem, personId: string) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        const updatedItems = person.items.filter(i => 
          i.name !== item.name || i.price !== item.price
        );
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...person, items: updatedItems, total: newTotal };
      }
      return person;
    }));
  };

  const handlePreview = () => {
    router.push({
      pathname: '/splitting/preview',
      params: {
        people: JSON.stringify(people),
        total: total,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Split Bill</Text>
          
          {/* Add People Section */}
          <View style={styles.addPersonSection}>
            <TextInput
              style={styles.input}
              placeholder="Enter person's name"
              value={newPersonName}
              onChangeText={setNewPersonName}
              onSubmitEditing={addPerson}
            />
            <TouchableOpacity style={styles.addButton} onPress={addPerson}>
              <Ionicons name="person-add" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add Person</Text>
            </TouchableOpacity>
          </View>

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
                    <View key={index} style={styles.assignedItem}>
                      <Text style={styles.itemName}>
                        {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                      </Text>
                      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeItem(item, person.id)}
                      >
                        <Ionicons name="close-circle" size={20} color="#d32f2f" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Available Items */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Available Items</Text>
            {receiptItems.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                  </Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.assignButtons}>
                  {people.map(person => (
                    <TouchableOpacity
                      key={person.id}
                      style={[
                        styles.assignButton,
                        person.items.some(i => i.name === item.name && i.price === item.price) && styles.assignedButton
                      ]}
                      onPress={() => assignItem(item, person.id)}
                    >
                      <Text style={styles.assignButtonText}>{person.name[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Preview Button */}
          {people.length > 0 && (
            <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
              <Ionicons name="eye" size={24} color="#fff" />
              <Text style={styles.previewButtonText}>Preview Split</Text>
            </TouchableOpacity>
          )}
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
  addPersonSection: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
  assignedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fe',
    padding: 12,
    borderRadius: 8,
  },
  itemsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
  },
  itemCard: {
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
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  assignButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  assignButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8eaf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignedButton: {
    backgroundColor: '#4CAF50',
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
  },
  removeButton: {
    padding: 4,
  },
  previewButton: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ReceiptParserScreen;