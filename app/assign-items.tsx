import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const FRIEND_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];

export default function AssignItemsScreen() {
  const [step, setStep] = useState(1);
  const [newFriend, setNewFriend] = useState('');
  const [friends, setFriends] = useState<string[]>([]);
  const [items, setItems] = useState([
    { name: 'Burger', price: 8.99 },
    { name: 'Fries', price: 3.49 },
    { name: 'Soda', price: 2.0 },
    { name: 'Tax', price: 1.5 },
  ]);
  const [assignments, setAssignments] = useState<{ [itemName: string]: string[] }>({});
  const [expandedFriends, setExpandedFriends] = useState<{ [friend: string]: boolean }>({});

  const progressAnim = [
    useState(new Animated.Value(1))[0],
    useState(new Animated.Value(0.5))[0],
    useState(new Animated.Value(0.5))[0],
  ];

  const animateStep = (newStep: number) => {
    progressAnim.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === newStep - 1 ? 1 : 0.5,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  };

  const handleNext = () => {
    if (step < 3) {
      const next = step + 1;
      setStep(next);
      animateStep(next);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prev = step - 1;
      setStep(prev);
      animateStep(prev);
    }
  };

  const toggleAssignment = (itemName: string, friend: string) => {
    const current = assignments[itemName] || [];
    const updated = current.includes(friend)
      ? current.filter((f) => f !== friend)
      : [...current, friend];
    setAssignments({ ...assignments, [itemName]: updated });
  };

  const toggleExpandFriend = (friend: string) => {
    setExpandedFriends((prev) => ({
      ...prev,
      [friend]: !prev[friend],
    }));
  };

  const calculateTotals = () => {
    const summary: { [friend: string]: number } = {};
    friends.forEach((friend) => (summary[friend] = 0));
    Object.entries(assignments).forEach(([itemName, assignedTo]) => {
      const item = items.find((i) => i.name === itemName);
      if (item && assignedTo.length > 0) {
        const split = item.price / assignedTo.length;
        assignedTo.forEach((f) => (summary[f] += split));
      }
    });
    return summary;
  };

  const totals = calculateTotals();
  const grandTotal = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

  const getFriendColor = (friend: string) => {
    const index = friends.indexOf(friend);
    return FRIEND_COLORS[index % FRIEND_COLORS.length];
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressContainer}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={{
              width: progressAnim[i].interpolate({ inputRange: [0.5, 1], outputRange: [12, 20] }),
              height: progressAnim[i].interpolate({ inputRange: [0.5, 1], outputRange: [12, 20] }),
              borderRadius: 50,
              marginHorizontal: 8,
              backgroundColor: progressAnim[i].interpolate({
                inputRange: [0.5, 1],
                outputRange: ['#444', '#4CAF50'],
              }),
              opacity: progressAnim[i],
            }}
          />
        ))}
      </View>

      {step === 1 && (
        <>
          <Text style={styles.titleCenter}>👥 Who's on the tab?</Text>
          <Text style={styles.text}>Add everyone you're splitting with:</Text>
          <TextInput
            value={newFriend}
            onChangeText={setNewFriend}
            placeholder="Enter name"
            placeholderTextColor="#aaa"
            style={styles.input}
            onSubmitEditing={() => {
              if (newFriend.trim() && !friends.includes(newFriend.trim())) {
                setFriends([...friends, newFriend.trim()]);
                setNewFriend('');
              }
            }}
          />
          <View style={styles.tagContainer}>
            {friends.map((friend) => (
              <View
                key={friend}
                style={[styles.tag, { backgroundColor: getFriendColor(friend) }]}
              >
                <Text style={{ color: 'white' }}>{friend}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Next ➡️</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.titleCenter}>🧾 What's on the Tab?</Text>
          {items.map((item) => (
            <View key={item.name} style={styles.card}>
              <Text style={[styles.itemName, { textAlign: 'center' }]}>
                {item.name}{' '}
                <Text style={styles.price}>– ${item.price.toFixed(2)}</Text>
              </Text>
              <View style={[styles.tagContainer, { justifyContent: 'center' }]}>
                {friends.map((friend) => {
                  const isSelected = (assignments[item.name] || []).includes(friend);
                  return (
                    <TouchableOpacity
                      key={friend}
                      onPress={() => toggleAssignment(item.name, friend)}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: isSelected
                            ? getFriendColor(friend)
                            : '#E0E0E0',
                        },
                      ]}
                    >
                      <Text style={{ color: isSelected ? '#fff' : '#333' }}>
                        {friend}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ marginTop: 8 }}>
                {(() => {
                  const splitPeople = assignments[item.name] || [];
                  if (splitPeople.length === 0) return null;

                  let splitText = '';

                  if (splitPeople.length === 1) {
                    splitText = `${splitPeople[0]} bought this`;
                  } else if (splitPeople.length === friends.length) {
                    splitText = 'Everyone is splitting';
                  } else {
                    splitText = `${splitPeople.slice(0, -1).join(', ')} and ${
                      splitPeople.slice(-1)
                    } are splitting`;
                  }

                  return (
                    <Text
                      style={{
                        color: '#ccc',
                        fontSize: 14,
                        textAlign: 'center',
                        fontStyle: 'italic',
                        marginTop: 4,
                      }}
                    >
                      {splitText}
                    </Text>
                  );
                })()}
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Next ➡️</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.titleCenter}>💰 Split Up!</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              Grand Total: <Text style={{ fontWeight: 'bold' }}>${grandTotal.toFixed(2)}</Text>
            </Text>
          </View>

          {friends.map((friend) => {
            const total = totals[friend].toFixed(2);
            return (
              <View key={friend} style={{ marginBottom: 28 }}>
                <TouchableOpacity
                  onPress={() => toggleExpandFriend(friend)}
                  style={{ alignItems: 'center' }}
                >
                  <Text style={styles.summaryText}>
                    {friend} owes{' '}
                    <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                      ${total}
                    </Text>{' '}
                    ▼
                  </Text>
                </TouchableOpacity>

                {expandedFriends[friend] && (
                  <View style={{ marginTop: 10 }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: getFriendColor(friend),
                        fontSize: 16,
                        marginBottom: 4,
                      }}
                    >
                      Payment options for {friend}
                    </Text>
                    <View style={styles.payCard}>
                      <Ionicons name="logo-venmo" size={30} color="#1A237E" />
                      <Text style={styles.cardText}>Pay with Venmo</Text>
                    </View>
                    <View style={styles.payCard}>
                      <Image
                        source={require('../assets/images/zelle.png')}
                        style={styles.icon}
                      />
                      <Text style={styles.cardText}>Send with Zelle</Text>
                    </View>
                    <View style={styles.payCard}>
                      <Ionicons name="logo-apple" size={30} color="#1A237E" />
                      <Text style={styles.cardText}>Pay via Apple Pay</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}

      <View style={{ marginTop: 32, alignItems: 'center' }}>
        {step > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.button}>
            <Text style={styles.buttonText}>⬅️ Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: '#F5F5F5',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  titleCenter: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#1A237E',
    borderRadius: 8,
    padding: 12,
    color: '#333',
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    justifyContent: 'center',
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1A237E',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  card: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#1A237E',
  },
  summaryCard: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 10,
    marginTop: 24,
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
  payCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingLeft: 18,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  cardText: {
    color: '#1A237E',
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    width: 30,
    height: 30,
  },
});
