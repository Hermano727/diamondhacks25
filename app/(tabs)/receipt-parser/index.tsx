import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import mime from 'mime';
import { useLocalSearchParams, router } from 'expo-router';
import Constants from 'expo-constants';

interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface ParsedReceipt {
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

interface ReceiptResponse {
  parsed: ParsedReceipt;
  raw_text?: string;
}

const ReceiptParserScreen = () => {
  const { imageUri } = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ReceiptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set the image from params when the screen loads
  useEffect(() => {
    if (imageUri && typeof imageUri === 'string') {
      setImage(imageUri);
    }
  }, [imageUri]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setParsedResult(null);
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
      setParsedResult(null);
    }
  };
  const getLocalApiUrl = (path: string) => {
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
    return `http://${debuggerHost || 'localhost'}:8000${path}`;
  };
  const parseReceipt = async () => {
    if (!image) return Alert.alert("No image selected!");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    const file = {
      uri: image,
      type: 'image/jpeg',
      name: 'receipt.jpg'
    };
    formData.append('receipt', file as any);

    try {
        const response = await axios.post(getLocalApiUrl('/upload-receipt'), formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000, // Increased timeout to 30 seconds
      });
      console.log('✅ Parsed:', response.data);
      
      // Ensure the data is properly formatted
      const parsedData = response.data.parsed || {} as ParsedReceipt;
      const items = (parsedData.items || []).map((item: ReceiptItem) => ({
        name: item.name || 'Unknown Item',
        price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
        quantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1
      }));

      setParsedResult({
        ...response.data,
        parsed: {
          ...parsedData,
          items,
          subtotal: typeof parsedData.subtotal === 'number' ? parsedData.subtotal : parseFloat(parsedData.subtotal) || 0,
          tax: typeof parsedData.tax === 'number' ? parsedData.tax : parseFloat(parsedData.tax) || 0,
          tip: typeof parsedData.tip === 'number' ? parsedData.tip : parseFloat(parsedData.tip) || 0,
          total: typeof parsedData.total === 'number' ? parsedData.total : parseFloat(parsedData.total) || 0
        }
      });
    } catch (err: any) {
      console.error('❌ Parse error:', err.message);
      setError(err.message || 'Failed to parse receipt. Please try again.');
      Alert.alert("Failed to parse receipt.");
    } finally {
      setLoading(false);
    }
  };

  const handleSplitBill = () => {
    if (parsedResult?.parsed?.items) {
      router.push({
        pathname: '/splitting/assign',
        params: {
          items: JSON.stringify(parsedResult.parsed.items),
          subtotal: parsedResult.parsed.subtotal,
          tax: parsedResult.parsed.tax,
          tip: parsedResult.parsed.tip,
          total: parsedResult.parsed.total
        },
      });
    }
  };

  const handleShare = async () => {
    if (!parsedResult) return;
    
    try {
      const url = `http://100.112.72.217:8000/preview/receipt/${Date.now()}`;
      await Share.share({ 
        message: `Check out our split: ${url}`,
        title: 'Receipt Split'
      });
    } catch (err) {
      console.error('❌ Share error:', err);
      Alert.alert("Failed to share receipt.");
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
                  onPress={() => {
                    setImage(null);
                    setParsedResult(null);
                  }}
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

          {error && <Text style={styles.errorText}>{error}</Text>}

          {image && !parsedResult && (
            <TouchableOpacity
              style={[styles.parseButton, loading && styles.buttonDisabled]}
              onPress={parseReceipt}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.parseButtonText}>Parse Receipt</Text>
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          )}

          {parsedResult?.parsed?.items && parsedResult.parsed.items.length > 0 && (
            <View style={styles.parsedDataContainer}>
              <View style={styles.itemsContainer}>
                {parsedResult.parsed.items.map((item: ReceiptItem, index: number) => (
                  <View key={index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.itemInfo}>
                        {item.quantity > 1 && (
                          <View style={styles.quantityBadge}>
                            <Text style={styles.quantityText}>{item.quantity}x</Text>
                          </View>
                        )}
                        <Text style={styles.cardTitle}>{item.name}</Text>
                      </View>
                      <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                    {item.quantity > 1 && (
                      <Text style={styles.cardSubtotal}>
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.totalsSection}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal:</Text>
                  <Text style={styles.totalAmount}>${parsedResult.parsed.subtotal.toFixed(2)}</Text>
                </View>
                {parsedResult.parsed.tax !== undefined && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tax:</Text>
                    <Text style={styles.totalAmount}>${parsedResult.parsed.tax.toFixed(2)}</Text>
                  </View>
                )}
                {parsedResult.parsed.tip !== undefined && parsedResult.parsed.tip > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tip:</Text>
                    <Text style={styles.totalAmount}>${parsedResult.parsed.tip.toFixed(2)}</Text>
                  </View>
                )}
                {parsedResult.parsed.total !== undefined && (
                  <View style={[styles.totalRow, styles.grandTotal]}>
                    <Text style={[styles.totalLabel, styles.grandTotalLabel]}>Total:</Text>
                    <Text style={[styles.totalAmount, styles.grandTotalAmount]}>
                      ${parsedResult.parsed.total.toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.splitButton} onPress={handleSplitBill}>
                  <Ionicons name="people" size={24} color="#fff" />
                  <Text style={styles.splitButtonText}>Split Bill</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                  <Ionicons name="share" size={24} color="#fff" />
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  parsedDataContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  splitButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#1a237e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  splitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBadge: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    padding: 4,
    marginRight: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
    color: '#666',
  },
  cardSubtotal: {
    fontSize: 14,
    color: '#666',
  },
  totalsSection: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 14,
    color: '#666',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a237e',
  },
});

export default ReceiptParserScreen;