import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ImageBackground } from 'react-native';

const RecipeDetailsScreen = ({ route }) => {
  const { recipe } = route.params;

  // how a recipe might be displayed 
  return (
    <ImageBackground
      source={require('../../assets/images/homepage.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Recipe Title */}
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Final Dish Image */}
        {recipe.finalImage && (
          <Image source={{ uri: recipe.finalImage }} style={styles.finalImage} />
        )}

        {/* Ingredients Section */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((item, index) => (
          <View key={index} style={styles.listItemContainer}>
            <Text style={styles.listItem}>{item.name}</Text>
            <Text style={styles.quantity}>{item.quantity}</Text>
          </View>
        ))}

        {/* Steps Section */}
        <Text style={styles.sectionTitle}>Steps</Text>
        {recipe.steps.map((item, index) => (
          <View key={index} style={styles.stepContainer}>
            <Text style={styles.listItem}>{item.text}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.stepImage} />}
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    paddingTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  finalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  listItemContainer: {
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItem: {
    fontSize: 16,
    width: '70%', 
  },
  quantity: {
    fontSize: 16,
    color: '#666',
    width: '30%',  
    textAlign: 'right', 
  },
  stepContainer: {
    marginTop: 10,
  },
  stepImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 5,
  },
});

export default RecipeDetailsScreen;
