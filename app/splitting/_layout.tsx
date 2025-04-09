import { Stack } from 'expo-router';

export default function SplittingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        title: '',
        headerBackVisible: false,
        headerLeft: () => null,
        headerRight: () => null,
      }}
    />
  );
} 