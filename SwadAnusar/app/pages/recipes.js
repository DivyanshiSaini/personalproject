import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


// recepies page, has all the recepies 

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  // Fetch recipes on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchRecipes = async () => {
        try {
          const storedRecipes = await AsyncStorage.getItem('recipes');
          if (storedRecipes) {
            console.log("Fetching updated recipes:", JSON.parse(storedRecipes));
            setRecipes(JSON.parse(storedRecipes));
          }
        } catch (error) {
          console.error('Error loading recipes:', error);
        }
      };
      fetchRecipes();
    }, [recipes]) // Ensure re-fetch on updates
  );

  const deleteRecipe = async (id) => {
    console.log("Attempting to delete recipe with ID:", id);
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              let storedRecipes = await AsyncStorage.getItem('recipes');
              let parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];

              // Convert IDs to strings for safe comparison
              const updatedRecipes = parsedRecipes.filter(recipe => recipe.id.toString() !== id.toString());
              
              console.log("Updated recipes after deletion:", updatedRecipes);
              
              await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
              
              // Force UI update
              setRecipes([]);
              setTimeout(() => setRecipes(updatedRecipes), 100);
            } catch (error) {
              console.error('Error deleting recipe:', error);
            }
          }
        }
      ]
    );
  };
  
  return (
    <ImageBackground
      source={require('../../assets/images/homepage.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Recipes</Text>

        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()} // Ensure ID is a string
          renderItem={({ item }) => (
            <View style={styles.recipeItem}>
              <TouchableOpacity
                onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
              >
                <Text style={styles.recipeTitle}>{item.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRecipe(item.id)} // Call delete function with item id
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddRecipes')}
        >
          <Text style={styles.addButtonText}>+ Add Recipe</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  recipeItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  recipeTitle: { fontSize: 18, fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#ff0000', 
    padding: 5, 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#fff', 
    fontWeight: 'bold'
  },
  addButton: { 
    marginTop: 20, 
    backgroundColor: '#ff6347', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default RecipesScreen;
