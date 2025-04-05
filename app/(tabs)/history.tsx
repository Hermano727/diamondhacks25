import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder data for the history screen
const placeholderData = [
  { id: '1', date: '2023-04-01', total: '$45.67', store: 'Grocery Store' },
  { id: '2', date: '2023-03-28', total: '$32.10', store: 'Restaurant' },
  { id: '3', date: '2023-03-25', total: '$78.45', store: 'Department Store' },
];

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: typeof placeholderData[0] }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.storeName}>{item.store}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.total}>{item.total}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Receipt History</Text>
      </View>
      
      <FlatList
        data={placeholderData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No receipts yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 