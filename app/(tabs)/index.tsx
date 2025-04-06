import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import mime from 'mime';

const ReceiptParserScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setParsedResult(null);
    }
  };

  const parseReceipt = async () => {
    if (!imageUri) return Alert.alert("No image selected!");

    const fileName = imageUri.split('/').pop() || 'receipt.jpg';
    const fileType = mime.getType(fileName) || 'image/jpeg';

    const formData = new FormData();
    formData.append('receipt', {
      uri: imageUri,
      name: fileName,
      type: fileType,
    } as unknown as Blob);

    try {
      const response = await axios.post('http://100.112.72.217:8000/upload-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('✅ Parsed:', response.data);
      setParsedResult(response.data);
    } catch (err: any) {
      console.error('❌ Parse error:', err.message);
      Alert.alert("Failed to parse receipt.");
    }
  };

  const handleUploadPress = () => {
    if (imageUri) {
      parseReceipt();
    } else {
      pickImage();
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

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          )}

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
            <View style={styles.buttonContent}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>
                {imageUri ? 'Parse Receipt' : 'Upload Receipt'}
              </Text>
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

          {parsedResult?.parsed?.items?.length > 0 && (
            <View style={{ marginTop: 32 }}>
              <Text style={styles.resultTitle}>Items:</Text>
              {parsedResult.parsed.items.map((item: any, index: number) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDetail}>
                    Price: ${parseFloat(item.price).toFixed(2)}
                  </Text>
                  {item.quantity && (
                    <Text style={styles.cardDetail}>Qty: {item.quantity}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
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
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#ddd',
    marginTop: 16,
  },
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
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 12,
  },
  card: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
  },
});

export default ReceiptParserScreen;
