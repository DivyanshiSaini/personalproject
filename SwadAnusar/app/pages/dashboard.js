// app/Pages/dashboard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();

  const handleGroupChatPress = (groupName) => {
    navigation.navigate('recipes', { groupName }); // Navigate to recipes screen with group name
  };

  return (
    <ImageBackground source={require('../../assets/images/homepage.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Swad Anusar</Text>
        <ScrollView style={styles.chatList}>
          <TouchableOpacity
            style={styles.chatTab}
            onPress={() => handleGroupChatPress('Tanwar Family')}
          >
            <Text style={styles.chatText}>Tanwar Family</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatTab}
            onPress={() => handleGroupChatPress('UF Roomies')}
          >
            <Text style={styles.chatText}>UF Roomies</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatTab}
            onPress={() => handleGroupChatPress('Dostis')}
          >
            <Text style={styles.chatText}>Dostis</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  chatList: {
    marginTop: 20,
  },
  chatTab: {
    backgroundColor: '#D64527',
    padding: 25,
    borderRadius: 10,
    marginBottom: 10,
  },
  chatText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'left',
  },
});