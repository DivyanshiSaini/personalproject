import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootLayout from './app/RootLayout';
import { LogBox } from 'react-native';

// Ignore specific warnings if needed
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootLayout />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}