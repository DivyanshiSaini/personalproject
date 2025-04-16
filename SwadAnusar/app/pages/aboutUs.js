import React from 'react';
import { ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutUs = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="arrow-back" size={24} color="#D64527" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>About Swad Anusar</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preserving Family Traditions</Text>
          <Text style={styles.text}>
            For generations, families have struggled to preserve their culinary heritage. 
            Handwritten recipes fade, memories get lost, and traditional cooking methods 
            disappear. Swad Anusar was born from our passion to help families safeguard 
            their food legacy through modern technology.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why It Matters</Text>
          <Text style={styles.text}>
            Food is more than nutrition - it's the heart of family identity and cultural 
            heritage. Our digital platform ensures your cherished recipes remain accessible, 
            organized, and shareable for future generations. Cook together, share stories, 
            and keep traditions alive through every meal.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Solution</Text>
          <Text style={styles.text}>
            Swad Anusar offers a secure, user-friendly space to:
            {"\n"}• Store recipes with photos & videos
            {"\n"}• Organize by cuisine, dietary needs, or occasions
            {"\n"}• Share privately with family groups
            {"\n"}• Collaborate on cooking projects
            {"\n"}• Discover ancestral dishes
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Frontend</Text>
            <Text style={styles.text}>
              Built with React Native and Expo for smooth cross-platform performance on 
              both iOS and Android. Enhanced with React Native Paper for beautiful, 
              accessible interfaces.
            </Text>
          </View>

          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Backend Infrastructure</Text>
            <Text style={styles.text}>
              • Node.js/Express API server
              {"\n"}• Firebase Firestore for database
              {"\n"}• Firebase Authentication for secure access
              {"\n"}• Firebase Storage for media files
              {"\n"}• Real-time updates using Firebase
            </Text>
          </View>

          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Development</Text>
            <Text style={styles.text}>
              Version controlled with GitHub, following industry best practices for 
              clean code and maintainable architecture.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  content: {
    padding: 15,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 15,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D64527',
    marginBottom: 15,
  },
  subSection: {
    marginVertical: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
});

export default AboutUs;