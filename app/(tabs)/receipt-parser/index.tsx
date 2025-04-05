import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ReceiptParserScreen = () => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Upload Receipt</Text>
          <Text style={styles.subtitle}>Take a photo or upload an existing image of your receipt</Text>

          <View style={styles.uploadSection}>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="refresh" size={24} color="#1a237e" />
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadOptions}>
                <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                  <View style={styles.buttonIcon}>
                    <Ionicons name="camera" size={32} color="#1a237e" />
                  </View>
                  <Text style={styles.buttonTitle}>Take Photo</Text>
                  <Text style={styles.buttonSubtitle}>Use your camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <View style={styles.buttonIcon}>
                    <Ionicons name="images" size={32} color="#1a237e" />
                  </View>
                  <Text style={styles.buttonTitle}>Choose Image</Text>
                  <Text style={styles.buttonSubtitle}>From your gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {image && (
            <TouchableOpacity style={styles.parseButton}>
              <Text style={styles.parseButtonText}>Parse Receipt</Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  uploadSection: {
    marginBottom: 24,
    minHeight: 300,
    justifyContent: 'center',
  },
  uploadOptions: {
    flexDirection: 'column',
    gap: 16,
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8f9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    gap: 16,
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a237e',
  },
  parseButton: {
    backgroundColor: '#1a237e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  parseButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ReceiptParserScreen;