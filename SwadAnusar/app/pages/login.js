import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter from expo-router

export default function LoginScreen() {
  const router = useRouter();  // Initialize router

  return (
    <ImageBackground source={require('../../assets/images/homepage.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.logo}>Swad Anusar</Text>
        
        <TextInput style={styles.input} placeholder='Phone or Email' placeholderTextColor='#888' />
        <TextInput style={styles.input} placeholder='Password' placeholderTextColor='#888' secureTextEntry />
        
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('./dashboard')}  // Navigate to Dashboard on login button press
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        
        <Text style={styles.orText}>or Login with</Text>
        
        <TouchableOpacity>
          <Text style={styles.signup} onPress={() => router.push('./signup')}>Sign up</Text>  // Navigate to Signup screen
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
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 30,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  forgot: {
    color: '#888',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
  },
  orText: {
    marginVertical: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 10,
  },
  socialIcon: {
    padding: 5,
  },
  signup: {
    color: '#007bff',
    fontSize: 16,
  },
});
