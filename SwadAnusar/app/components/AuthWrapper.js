// app/components/AuthWrapper.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const AuthWrapper = ({ children }) => {
  const { currentUser, loading, authError } = useAuth();
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0084ff" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }
  
  if (authError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Authentication Error: {authError}</Text>
      </View>
    );
  }
  
  if (!currentUser) {
    // This should be handled by your navigation logic
    // But as a safeguard, show this screen
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please sign in to continue</Text>
      </View>
    );
  }
  
  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  text: {
    marginTop: 10,
    fontSize: 16
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});

export default AuthWrapper;