import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  LogBox
} from 'react-native';
import { firebase, auth } from '../backend/firebase/firebaseConfig';

import { router } from 'expo-router';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// Ignore specific warning for now as it's a package issue
LogBox.ignoreLogs([
  'FirebaseRecaptcha: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
]);

export default function PhoneAuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');
    
    // Format as +1 (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return input;
  };

  const handlePhoneNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    setError('');
  };

  const validatePhoneNumber = (number: string) => {
    // Remove formatting to check E.164 format
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.startsWith('1');
  };

  const attemptPhoneVerification = async () => {
    try {
      setError('');
      setStatus('');
      
      if (!phoneNumber) {
        setError('Please enter a phone number');
        return;
      }

      if (!validatePhoneNumber(phoneNumber)) {
        setError('Please enter a valid US phone number starting with +1');
        return;
      }

      setLoading(true);
      
      // Using Firebase compat version
      if (!recaptchaVerifier.current) {
        setError('reCAPTCHA not loaded. Please try again.');
        return;
      }
      
      const confirmation = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier.current);
      setVerificationId(confirmation.verificationId);
      setStatus('Verification code sent!');
    } catch (error: any) {
      console.error('Verification Error:', error);
      
      switch (error.code) {
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        case 'auth/billing-not-enabled':
          setError('Phone authentication is not enabled for this project.');
          break;
        case 'auth/invalid-phone-number':
          setError('Invalid phone number. Please check and try again.');
          break;
        default:
          setError('Failed to send verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    try {
      setError('');
      setStatus('');
      
      if (!verificationCode || verificationCode.length !== 6) {
        setError('Please enter a valid 6-digit code');
        return;
      }

      setLoading(true);
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      const userCredential = await firebase.auth().signInWithCredential(credential);
      
      // Store the authenticated user
      const user = userCredential.user;
      setStatus('Successfully logged in!');
      
      // Navigate to protected screen
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
    } catch (error: any) {
      console.error('Confirmation Error:', error);
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          setError('Invalid verification code. Please try again.');
          break;
        case 'auth/code-expired':
          setError('Code has expired. Please request a new one.');
          break;
        default:
          setError('Failed to verify code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebase.app().options}
              attemptInvisibleVerification
            />
            <Text style={styles.title}>Phone Authentication</Text>
            
            {status ? (
              <Text style={styles.status}>{status}</Text>
            ) : null}
            
            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}
            
            {!verificationId ? (
              <>
                <Text style={styles.label}>Enter your phone number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1 (234) 567-8900"
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
                <TouchableOpacity 
                  style={[styles.button, (!validatePhoneNumber(phoneNumber) || loading) && styles.buttonDisabled]}
                  onPress={attemptPhoneVerification}
                  disabled={!validatePhoneNumber(phoneNumber) || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Send Verification Code</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>Enter verification code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity 
                  style={[styles.button, (!verificationCode || loading) && styles.buttonDisabled]}
                  onPress={confirmCode}
                  disabled={!verificationCode || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Verify Code</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
});