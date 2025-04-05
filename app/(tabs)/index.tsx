import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const handleUploadPress = () => {
    router.push('/(tabs)/receipt-parser');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroSection}>
            <Text style={styles.title}>Splitr</Text>
            <Text style={styles.subtitle}>Split your receipts easily</Text>
          </View>
          
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
            <View style={styles.buttonContent}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Upload Receipt</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="person-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.featureTitle}>No Account Required</Text>
                <Text style={styles.featureDescription}>Start using the app instantly without registration</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="flash-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.featureTitle}>Instant Parsing</Text>
                <Text style={styles.featureDescription}>Advanced AI to extract receipt details quickly</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="people-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.featureTitle}>Easy Splitting</Text>
                <Text style={styles.featureDescription}>Split expenses fairly with your friends</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  content: {
    padding: 16,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#1a237e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 