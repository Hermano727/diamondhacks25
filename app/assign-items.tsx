import { View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function AssignItemsScreen() {
  const [friends, setFriends] = useState(['Alex', 'Emily', 'You']);
  const [items, setItems] = useState([
    { name: 'Burger', price: 8.99 },
    { name: 'Fries', price: 3.49 },
    { name: 'Soda', price: 2.0 },
    { name: 'Tax', price: 1.5 },
  ]);
  const [assignments, setAssignments] = useState<{ [itemName: string]: string[] }>({});

  const toggleAssignment = (itemName: string, friend: string) => {
    const current = assignments[itemName] || [];
    const updated = current.includes(friend)
      ? current.filter((f) => f !== friend)
      : [...current, friend];

    setAssignments({ ...assignments, [itemName]: updated });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: 'white' }}>
        Assign Items
      </Text>

      {items.map((item) => (
        <View key={item.name} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, color: 'white' }}>
            {item.name} – ${item.price.toFixed(2)}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {friends.map((friend) => {
              const isSelected = (assignments[item.name] || []).includes(friend);
              return (
                <TouchableOpacity
                  key={friend}
                  onPress={() => toggleAssignment(item.name, friend)}
                  style={{
                    padding: 8,
                    backgroundColor: isSelected ? '#4CAF50' : '#ccc',
                    marginRight: 8,
                    marginBottom: 8,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: isSelected ? 'white' : 'black' }}>{friend}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* ✅ Split Summary */}
      {Object.entries(assignments).length > 0 && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>
            Split Summary:
          </Text>
          {friends.map((friend) => {
            let total = 0;
            Object.keys(assignments).forEach((itemName) => {
              if (assignments[itemName]?.includes(friend)) {
                const item = items.find((i) => i.name === itemName);
                total += item ? item.price / assignments[itemName].length : 0;
              }
            });
            return (
              <Text key={friend} style={{ color: 'white', fontSize: 16 }}>
                {friend}: ${total.toFixed(2)}
              </Text>
            );
          })}
        </View>
      )}

      {/* ✅ Download Button (Web only) */}
      {Object.entries(assignments).length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Button
            title="Download Split Summary"
            onPress={() => {
              const summary: { [key: string]: number } = {};
              friends.forEach((friend) => {
                let total = 0;
                Object.keys(assignments).forEach((itemName) => {
                  if (assignments[itemName]?.includes(friend)) {
                    const item = items.find((i) => i.name === itemName);
                    total += item ? item.price / assignments[itemName].length : 0;
                  }
                });
                summary[friend] = Number(total.toFixed(2));
              });

              const data = JSON.stringify(summary, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'split-summary.json';
              link.click();
            }}
          />
        </View>
      )}
    </ScrollView>
  );
}
