// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveRecipes = async (recipes) => {
  try {
    const jsonValue = JSON.stringify(recipes);
    await AsyncStorage.setItem('recipes', jsonValue);
  } catch (e) {
    console.error('Failed to save recipes:', e);
  }
};

export const loadRecipes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('recipes');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load recipes:', e);
    return [];
  }
};