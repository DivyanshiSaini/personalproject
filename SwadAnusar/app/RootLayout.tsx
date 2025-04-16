import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase/config'; // Ensure this is correctly imported from your firebase config file
import InsideLayout from './insideLayout';
import Login from './pages/login';
import Signup from './pages/signup';
//import ForgotPassword from './pages/forgotPassword'; 
import HomeScreen from './pages/home';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'User authenticated' : 'No user');
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    
    // Cleanup function
    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  // Show loading indicator while determining authentication state
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#D64527" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        // User is signed in
        <Stack.Screen
          name="InsideLayout"
          component={InsideLayout}
          options={{ headerShown: false }}
        />
      ) : (
        // User is not signed in
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}