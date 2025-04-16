import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  Keyboard 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const AddRecipeScreen = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
  const [newStep, setNewStep] = useState('');
  const [stepImage, setStepImage] = useState(null);

  const navigation = useNavigation();

  // Reset form each time the screen is focused
  const resetForm = () => {
    setTitle('');
    setIngredients([]);
    setSteps([]);
    setFinalImage(null);
    setNewIngredientName('');
    setNewIngredientQuantity('');
    setNewStep('');
    setStepImage(null);
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [])
  );

  // Updated pickImage to use result.assets[0].uri
  const pickImage = async (setImageCallback) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets && result.assets.length > 0 ? result.assets[0].uri : null;
      if (uri) {
        console.log("Selected image:", uri);
        setImageCallback(uri);
      }
    }
  };

  const addIngredient = () => {
    if (newIngredientName.trim() && newIngredientQuantity.trim()) {
      setIngredients([
        ...ingredients,
        { name: newIngredientName, quantity: newIngredientQuantity },
      ]);
      setNewIngredientName('');
      setNewIngredientQuantity('');
    }
  };

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, { text: newStep, image: stepImage }]);
      setNewStep('');
      setStepImage(null);
    }
  };

  const handleStepSubmit = () => {
    if (newStep.trim()) {
      addStep();
    }
    Keyboard.dismiss();
  };

  const saveRecipe = async () => {
    if (!title.trim()) {
      alert('Please enter a recipe name.');
      return;
    }

    console.log("Saving final image URI:", finalImage);
    const userEmail = await AsyncStorage.getItem('userEmail');

    const newRecipe = {
      id: Date.now().toString(),
      title,
      ingredients,
      steps,
      finalImage: finalImage || "https://images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg",
      liked: false,
      userEmail // Add this line to include creator email
    };

    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      recipes.push(newRecipe);
      await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
      
      alert('Recipe saved successfully!');
      navigation.navigate('RecipeDetails', { recipe: newRecipe });
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe');
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg.png')} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
       {/* Back Button to Recipes */}
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Recipes')}>
          <AntDesign name="arrowleft" size={24} color="#8B0000" />
        </TouchableOpacity>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.header}>Add Recipe</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Recipe Name (Required)" 
                value={title} 
                onChangeText={setTitle} 
              />

              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.ingredientRow}>
                <View style={styles.ingredientInputContainer}>
                  <TextInput
                    style={[styles.input, styles.ingredientInput]}
                    placeholder="Ingredient"
                    value={newIngredientName}
                    onChangeText={setNewIngredientName}
                  />
                </View>
                <View style={styles.quantityInputContainer}>
                  <TextInput
                    style={[styles.input, styles.quantityInput]}
                    placeholder="Qty"
                    value={newIngredientQuantity}
                    onChangeText={setNewIngredientQuantity}
                  />
                </View>
                <TouchableOpacity style={styles.smallAddButton} onPress={addIngredient}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
              
              {ingredients.map((item, index) => (
                <View key={index} style={styles.listItemContainer}>
                  <Text style={styles.listItem}>
                    <Text style={styles.quantityText}>{item.quantity}</Text> - {item.name}
                  </Text>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Steps</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Add Step (Optional)" 
                value={newStep} 
                onChangeText={setNewStep} 
                multiline
                onSubmitEditing={handleStepSubmit}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <View style={styles.stepButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.uploadButton]} 
                  onPress={() => pickImage(setStepImage)}
                >
                  <Text style={styles.buttonText}>Add Step Image</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.addStepButton]} 
                  onPress={addStep}
                >
                  <Text style={styles.buttonText}>Add Step</Text>
                </TouchableOpacity>
              </View>

              {steps.map((item, index) => (
                <View key={index} style={styles.stepContainer}>
                  <Text style={styles.stepNumber}>Step {index + 1}</Text>
                  <Text style={styles.listItem}>{item.text}</Text>
                  {item.image && (
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.stepImage} 
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))}

              <Text style={styles.sectionTitle}>Final Dish Photo</Text>
              <TouchableOpacity 
                style={[styles.button, styles.uploadButton]} 
                onPress={() => pickImage(setFinalImage)}
              >
                <Text style={styles.buttonText}>Upload Final Photo</Text>
              </TouchableOpacity>
              {finalImage ? (
                <Image 
                  source={{ uri: finalImage }} 
                  style={styles.finalImage} 
                  resizeMode="cover"
                />
              ) : (
                <Image 
                  source={{ uri: "https://via.placeholder.com/300x200?text=No+Image" }}
                  style={styles.finalImage}
                />
              )}

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={saveRecipe}
              >
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
  container: {
    top: 40,
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: 'white',
    fontSize: 14,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  ingredientInputContainer: {
    flex: 2,
    marginRight: 5,
  },
  quantityInputContainer: {
    flex: 1,
    marginRight: 5,
  },
  ingredientInput: {
    width: '100%',
  },
  quantityInput: {
    width: '100%',
  },
  smallAddButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#008080',
  },
  addStepButton: {
    backgroundColor: '#4682B4',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listItemContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
  },
  listItem: {
    fontSize: 14,
    color: '#333',
  },
  quantityText: {
    fontWeight: 'bold',
    color: '#008080',
  },
  stepContainer: {
    marginTop: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  stepNumber: {
    fontWeight: 'bold',
    color: '#ff6347',
    marginBottom: 5,
  },
  stepImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 5,
  },
  finalImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  stepButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 10,
    padding: 10,
    bold: true,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default AddRecipeScreen;
