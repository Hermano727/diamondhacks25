import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

export interface PhoneAuthState {
  phoneNumber: string;
  verificationId: string;
  verificationCode: string;
  loading: boolean;
  error: string;
  status: string;
}

export interface PhoneAuthRefs {
  recaptchaVerifier: React.RefObject<FirebaseRecaptchaVerifierModal>;
} 