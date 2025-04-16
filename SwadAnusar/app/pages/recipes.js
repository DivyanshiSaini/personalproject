import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ImageBackground, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  // Fetch recipes when screen is focused
  const fetchRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  // Delete a recipe by id
  const deleteRecipe = async (id) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              const storedRecipes = await AsyncStorage.getItem('recipes');
              const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
              const updatedRecipes = parsedRecipes.filter(recipe => recipe.id.toString() !== id.toString());
              await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
              setRecipes(updatedRecipes);
            } catch (error) {
              console.error('Error deleting recipe:', error);
            }
          }
        }
      ]
    );
  };

  // Toggle the liked state for a recipe
  const toggleLike = async (id) => {
    try {
      const updatedRecipes = recipes.map(recipe => {
        if (recipe.id.toString() === id.toString()) {
          return { ...recipe, liked: !recipe.liked };
        }
        return recipe;
      });
      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.recipeItem}>
      <TouchableOpacity
        style={styles.recipeContent}
        onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
      >
        {item.finalImage ? (
          <Image source={{ uri: item.finalImage }} style={styles.thumbnail} />
        ) : (
          <Image source={require('../../assets/images/default.png')} style={styles.thumbnail} />
        )}
        <Text style={styles.recipeTitle}>{item.title}</Text>
      </TouchableOpacity>
      <View style={styles.recipeActions}>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Text style={[styles.likeIcon, item.liked ? styles.liked : null]}>
            {item.liked ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteRecipe(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/homepage.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Recipes</Text>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddRecipes')}
        >
          <Text style={styles.addButtonText}>+ Add Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: '#4CAF50', marginTop: 10 }]}
          onPress={() => navigation.navigate('FavoriteRecipes')}
        >
          <Text style={styles.addButtonText}>❤️ View Favorites</Text>
      </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  recipeItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  recipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thumbnail: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    marginRight: 12 
  },
  recipeTitle: { 
    fontSize: 18, 
    fontWeight: 'bold'
  },
  recipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  liked: {
    color: 'red',
  },
  deleteButton: {
    backgroundColor: '#ff0000', 
    padding: 5, 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  addButton: { 
    marginTop: 20, 
    backgroundColor: '#ff6347', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default Recipes;
