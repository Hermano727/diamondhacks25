import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  ScrollView,
} from 'react-native';

export default function ReceiptPreview() {
  const router = useRouter();
  const receiptId = router.query.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (receiptId) {
      fetch(`http://localhost:8000/preview/receipt/${receiptId}`)
        .then((res) => res.json())
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [receiptId]);

  const handleShare = async () => {
    const url = `http://localhost:8000/preview/receipt/${receiptId}`;
    await Share.share({ message: `Check out our split: ${url}` });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>⚠️ Receipt not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧾 Receipt Summary</Text>

      {Object.entries(data.people).map(([person, total]) => {
        const amount = Number(total);
        return (
          <Text key={person} style={styles.item}>
            {person}:{' '}
            <Text style={styles.bold}>${amount.toFixed(2)}</Text>
          </Text>
        );
      })}

      <Text style={styles.total}>
        Total:{' '}
        <Text style={styles.totalBold}>
          ${data.total.toFixed(2)}
        </Text>
      </Text>

      <TouchableOpacity onPress={handleShare} style={styles.button}>
        <Text style={styles.buttonText}>🔗 Copy Link</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#000',
    minHeight: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  item: {
    fontSize: 20,
    marginVertical: 6,
    color: 'white',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  total: {
    fontSize: 24,
    marginTop: 24,
    color: 'white',
    textAlign: 'center',
  },
  totalBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 26,
  },
  button: {
    marginTop: 28,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
