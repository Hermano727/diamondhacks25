import React, { useRef, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebase, auth } from '../backend/firebase/firebaseConfig';

export default function PhoneAuthScreen() {
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  const sendVerification = async () => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current!
      );
      setVerificationId(id);
      setMessage('Code has been sent to your phone.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await signInWithCredential(auth, credential);
      setMessage('Phone authentication successful! ✅');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options} // ✅ FIXED
      />

      <TextInput
        placeholder="+1 234 567 8900"
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <Button title="Send Verification Code" onPress={sendVerification} />

      {verificationId ? (
        <>
          <TextInput
            placeholder="Verification code"
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            style={styles.input}
          />
          <Button title="Confirm Code" onPress={confirmCode} />
        </>
      ) : null}

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginVertical: 10,
  },
  message: {
    marginTop: 20,
    color: 'blue',
  },
});
