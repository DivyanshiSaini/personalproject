// screens/FavoriteRecipes.js
import React, { useState, useCallback } from 'react';
import {View,Text,FlatList,StyleSheet,Image,ImageBackground,TouchableOpacity,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const FavoriteRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      const likedRecipes = parsedRecipes.filter((recipe) => recipe.liked === true);
      setFavorites(likedRecipes);
    } catch (error) {
      console.error('Error loading favorite recipes:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
    >
      <Image
        source={item.finalImage ? { uri: item.finalImage } : require('../../assets/images/default.png')}
        style={styles.thumbnail}
      />
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/homepage.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorite Recipes</Text>
        </View>
  
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </ImageBackground>
  );  
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 30 },
  title: { 
    fontSize: 25, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30, 
    color: '#D64527',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },  
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold' },
});

export default FavoriteRecipes;
