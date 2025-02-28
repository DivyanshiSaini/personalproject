import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter from expo-router

export default function CreateAccountScreen() {
  const router = useRouter();  // Initialize router

  return (
    <ImageBackground source={require('../../assets/images/homepage.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.logo}>Swad Anusar</Text>
        
        <TextInput style={styles.input} placeholder='Full Name' placeholderTextColor='#888' />
        <TextInput style={styles.input} placeholder='Phone or Email' placeholderTextColor='#888' />
        <TextInput style={styles.input} placeholder='Password' placeholderTextColor='#888' secureTextEntry />
        <TextInput style={styles.input} placeholder='Confirm Password' placeholderTextColor='#888' secureTextEntry />
        
        <TouchableOpacity 
          style={styles.createAccountButton}
          onPress={() => router.push('./dashboard')}  // Navigate to Dashboard after account creation
        >
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
        
        <Text style={styles.orText}>or Create Account with</Text>
        
        <TouchableOpacity>
          <Text style={styles.login} onPress={() => router.push('./login')}>
            Already have an account? Log in
          </Text>  // Navigate to Login page
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
  createAccountButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom: 10,
  },
  createAccountText: {
    color: '#fff',
    fontSize: 18,
  },
  orText: {
    marginVertical: 10,
  },
  login: {
    color: '#007bff',
    fontSize: 16,
  },
});
