import { Image, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router'; // Using Expo Router's Link

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>

      {/* Option A: Standard route (if assign-items.tsx is at app/assign-items.tsx) */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Try Your Feature</ThemedText>
        <Link href="/assign-items">
          <ThemedText type="link">Go to Assign Items ➜</ThemedText>
        </Link>
      </ThemedView>

      {/* Option B: If your file is inside a group folder, like app/(tabs)/assign-items.tsx */}
      {/*
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Try Your Feature</ThemedText>
        <Link href="/(tabs)/assign-items">
          <ThemedText type="link">Go to Assign Items ➜</ThemedText>
        </Link>
      </ThemedView>
      */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
