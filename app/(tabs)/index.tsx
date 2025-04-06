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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Upload & Parse Receipt</Text>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
        )}

        <View style={{ marginVertical: 16 }}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="images" size={20} color="#fff" />
            <Text style={styles.buttonText}>Choose Receipt</Text>
          </TouchableOpacity>

          {imageUri && (
            <TouchableOpacity style={styles.button} onPress={parseReceipt}>
              <Ionicons name="document-text" size={20} color="#fff" />
              <Text style={styles.buttonText}>Parse Receipt</Text>
            </TouchableOpacity>
          )}
        </View>

        {parsedResult && (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>Parsed Result:</Text>
            <Text style={styles.resultText}>
              {JSON.stringify(parsedResult, null, 2)}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  preview: { width: '100%', height: 300, borderRadius: 12, backgroundColor: '#ccc' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a237e',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  result: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  resultTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  resultText: { fontFamily: 'Courier', fontSize: 14 },
});

export default ReceiptParserScreen;
