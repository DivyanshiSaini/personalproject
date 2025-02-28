import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router'; // Use useRouter instead of navigation prop

const AddRecipeScreen = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [finalImage, setFinalImage] = useState(null);

  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');
  const [stepImage, setStepImage] = useState(null);

  const router = useRouter(); // Initialize useRouter

  const pickImage = async (setImageCallback) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageCallback(result.uri);
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient('');
    }
  };

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, { text: newStep, image: stepImage }]);
      setNewStep('');
      setStepImage(null);
    }
  };

  const saveRecipe = async () => {
    if (!title.trim()) {
      alert('Please enter a recipe name.');
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      title,
      ingredients,
      steps,
      finalImage,
    };

    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      recipes.push(newRecipe);
      await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
      router.back(); // Use router.back() instead of navigation.goBack()
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/homepage.png')} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
              <Text style={styles.header}>Add Recipe</Text>

              {/* Recipe Name (Required) */}
              <TextInput style={styles.input} placeholder="Recipe Name (Required)" value={title} onChangeText={setTitle} />

              {/* Ingredients */}
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.row}>
                <TextInput style={styles.input} placeholder="Add Ingredient (Optional)" value={newIngredient} onChangeText={setNewIngredient} />
                <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
              {ingredients.map((item, index) => (
                <Text key={index} style={styles.listItem}>{item}</Text>
              ))}

              {/* Steps */}
              <Text style={styles.sectionTitle}>Steps</Text>
              <TextInput style={styles.input} placeholder="Add Step (Optional)" value={newStep} onChangeText={setNewStep} />
              <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setStepImage)}>
                <Text style={styles.buttonText}> Upload Step Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={addStep}>
                <Text style={styles.buttonText}>Add Step</Text>
              </TouchableOpacity>

              {steps.map((item, index) => (
                <View key={index} style={styles.stepContainer}>
                  <Text style={styles.listItem}>{item.text}</Text>
                  {item.image && <Image source={{ uri: item.image }} style={styles.stepImage} />}
                </View>
              ))}

              {/* Final Image (Optional) */}
              <Text style={styles.sectionTitle}>Final Dish Photo</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setFinalImage)}>
                <Text style={styles.buttonText}>Upload Photo</Text>
              </TouchableOpacity>
              {finalImage && <Image source={{ uri: finalImage }} style={styles.finalImage} />}

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
                <Text style={styles.buttonText}>Save Recipe</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  addButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: '#008080',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItem: {
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
    width: '100%',
  },
  stepContainer: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  stepImage: {
    width: 80,
    height: 80,
    marginTop: 5,
    borderRadius: 5,
  },
  finalImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default AddRecipeScreen; 

