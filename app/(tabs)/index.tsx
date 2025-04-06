import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  const handleUploadPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Navigate to upload tab with the selected image
      router.push({
        pathname: "/(tabs)/receipt-parser",
        params: { imageUri: result.assets[0].uri }
      });
    }
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scrollView: { flex: 1 },
  content: { padding: 16 },
  heroSection: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1a237e' },
  subtitle: { fontSize: 16, color: '#666' },
  uploadButton: {
    backgroundColor: '#1a237e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  buttonText: { fontSize: 18, fontWeight: '600', color: '#fff' },
  featuresContainer: { marginTop: 32 },
  featuresTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#1a237e' },
  featuresList: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    backgroundColor: '#f0f4ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  featureDescription: { fontSize: 14, color: '#666' },
});

export default HomeScreen;
