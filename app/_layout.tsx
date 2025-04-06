import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inLoginGroup = segments[0] === 'login';
      const inTabsGroup = segments[0] === '(tabs)';
      const inSplashScreen = segments[0] === 'splash';

      if (!user) {
        // If not authenticated, only allow access to splash and login screens
        if (!inLoginGroup && !inSplashScreen) {
          router.replace('/splash');
        }
      } else {
        // If authenticated, only allow access to tabs
        if (inLoginGroup || inSplashScreen) {
          router.replace('/(tabs)');
        }
      }
    });

    return () => unsubscribe();
  }, [segments]);

  return (
    <Stack>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
} 