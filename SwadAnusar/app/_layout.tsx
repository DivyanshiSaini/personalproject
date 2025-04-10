import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import InsideLayout from './insideLayout';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
const  Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      console.log('user', currentUser);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Login">
      {user ? (
        // If the user is logged in, show the dashboard
        <Stack.Screen
          name="InsideLayout"
          component={InsideLayout} 
          options={{ headerShown: false }}
        />
      ) : (
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

