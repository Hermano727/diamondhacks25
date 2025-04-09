import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface Person {
  id: string;
  name: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

const SplitBillScreen = () => {
  const params = useLocalSearchParams();
  const items = JSON.parse(params.items as string) as ReceiptItem[];
  const subtotal = parseFloat(params.subtotal as string);
  const [taxPercentage, setTaxPercentage] = useState(parseFloat(params.taxPercentage as string));
  const tipPercentage = parseFloat(params.tipPercentage as string);
  const useCustomTip = params.useCustomTip === 'true';
  const customTipAmount = parseFloat(params.customTipAmount as string);
  const totalTax = parseFloat(params.totalTax as string);
  const totalTip = parseFloat(params.totalTip as string);

  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: '', items: [], subtotal: 0, tax: 0, tip: 0, total: 0 }
  ]);
  const [confirmed, setConfirmed] = useState(false);

  const addPerson = () => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name: '',
      items: [],
      subtotal: 0,
      tax: 0,
      tip: 0,
      total: 0,
    };
    setPeople([...people, newPerson]);
    setConfirmed(false);
  };

  const confirmPerson = () => {
    // Check if the last person has a name
    const lastPerson = people[people.length - 1];
    if (!lastPerson.name.trim()) {
      Alert.alert(
        "Name Required",
        "Please enter a name for the current person before confirming.",
        [{ text: "OK" }]
      );
      return;
    }
    setConfirmed(true);
  };

  const updatePersonName = (id: string, name: string) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, name } : person
    ));
    if (id === people[people.length - 1].id) {
      setConfirmed(false);
    }
  };

  const assignItem = (item: ReceiptItem, personId: string) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        const updatedItems = [...person.items, item];
        const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const proportion = newSubtotal / subtotal;
        return {
          ...person,
          items: updatedItems,
          subtotal: newSubtotal,
          tax: totalTax * proportion,
          tip: totalTip * proportion,
          total: newSubtotal + (totalTax * proportion) + (totalTip * proportion)
        };
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
        const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const proportion = newSubtotal / subtotal;
        return {
          ...person,
          items: updatedItems,
          subtotal: newSubtotal,
          tax: totalTax * proportion,
          tip: totalTip * proportion,
          total: newSubtotal + (totalTax * proportion) + (totalTip * proportion)
        };
      }
      return person;
    }));
  };

  const deletePerson = (id: string) => {
    // Don't allow deleting the last person
    if (people.length <= 1) {
      Alert.alert("Cannot delete the last person");
      return;
    }

    // Remove the person and reassign their items to the first person
    const personToDelete = people.find(p => p.id === id);
    const firstPerson = people[0];
    
    setPeople(people.filter(p => p.id !== id).map(p => {
      if (p.id === firstPerson.id && personToDelete) {
        // Add the deleted person's items to the first person
        return {
          ...p,
          items: [...p.items, ...personToDelete.items],
          subtotal: p.subtotal + personToDelete.subtotal,
          tax: p.tax + personToDelete.tax,
          tip: p.tip + personToDelete.tip,
          total: p.total + personToDelete.total
        };
      }
      return p;
    }));
  };

  const handlePreview = () => {
    // Check if all people have names
    const unnamedPeople = people.filter(p => !p.name.trim());
    if (unnamedPeople.length > 0) {
      Alert.alert("Please enter names for all people");
      return;
    }
    const total = subtotal + totalTax + totalTip;
    router.push({
      pathname: '/splitting/preview',
      params: {
        people: JSON.stringify(people),
        total: total.toString(),
        tax: totalTax.toString(),
        tip: totalTip.toString()
      },
    });
  };

  const handleTaxChange = (text: string) => {
    // Allow empty string for deletion
    if (text === '') {
      setTaxPercentage(0);
      return;
    }

    // Remove any non-numeric characters except decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Ensure no more than 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    // Convert to number and ensure it's not negative
    const value = parseFloat(cleanedText);
    if (!isNaN(value) && value >= 0) {
      setTaxPercentage(value);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Split Bill</Text>
          
          {/* People Section */}
          <View style={styles.peopleSection}>
            {people.map(person => (
              <View key={person.id} style={styles.personCard}>
                <View style={styles.personHeader}>
                  <View style={styles.nameInputContainer}>
                    <TextInput
                      style={styles.personNameInput}
                      placeholder="Enter name"
                      placeholderTextColor="#666"
                      value={person.name}
                      onChangeText={(text) => updatePersonName(person.id, text)}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deletePerson(person.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                    </TouchableOpacity>
                  </View>
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButton} onPress={addPerson}>
                <Ionicons name="person-add" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Add Person</Text>
              </TouchableOpacity>
              {people[people.length - 1].name.trim() && !confirmed && (
                <TouchableOpacity style={styles.confirmButton} onPress={confirmPerson}>
                  <Ionicons name="checkmark" size={24} color="#fff" />
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Available Items */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Available Items</Text>
            {items.map((item, index) => (
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
                      <Text style={styles.assignButtonText}>{person.name ? person.name[0] : '?'}</Text>
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
  nameInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  personNameInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    flex: 1,
    backgroundColor: '#f8f9fe',
    padding: 8,
    borderRadius: 8,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
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
  confirmButton: {
    flex: 1,
    backgroundColor: '#1a237e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  taxSection: {
    marginBottom: 24,
  },
  taxSliderContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taxSlider: {
    width: '100%',
    height: 40,
  },
  taxValueContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  taxValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
});

export default SplitBillScreen;