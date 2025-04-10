import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Get additional user data from Firestore
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
      const userData = userDoc.data();
      
      // 3. Store user data in AsyncStorage
      await AsyncStorage.multiSet([
        ['userEmail', user.email],
        ['userId', user.uid],
        ['userName', userData?.name || ''],
        ['userPhoto', userData?.photoURL || '']
      ]);
      
      console.log('Login successful:', user.email);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
      let errorMessage = 'Login failed. Please try again.';
      
      // More specific error messages
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      }
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/homepage.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.logo}>Swad Anusar</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        
        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        
        {loading ? (
          <ActivityIndicator size="large" color="#D64527" />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signup}>Don't have an account? <Text style={styles.signupHighlight}>Sign up</Text></Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 25,
    borderRadius: 15,
    marginHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#D64527',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  forgot: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'right',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#D64527',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  signup: {
    color: '#666',
    textAlign: 'center',
    fontSize: 15,
  },
  signupHighlight: {
    color: '#D64527',
    fontWeight: '600',
  },
});