import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';


// how a recpie is added, its components 
const AddRecipeScreen = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
  const [newStep, setNewStep] = useState('');
  const [stepImage, setStepImage] = useState(null);

  const router = useRouter();

  // Function to reset all form fields
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

  // Clear form when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      resetForm();
      return () => {};
    }, [])
  );

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

  // Function to handle step submission via keyboard return key
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
      
      // Show success message and navigate back
      alert('Recipe saved successfully!');
      router.back();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe');
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg.png')} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
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

              {/* Recipe Name */}
              <TextInput 
                style={styles.input} 
                placeholder="Recipe Name (Required)" 
                value={title} 
                onChangeText={setTitle} 
              />

              {/* Ingredients */}
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

              {/* Steps */}
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
                  <Text style={styles.buttonText}>Add Image</Text>
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

              {/* Final Image */}
              <Text style={styles.sectionTitle}>Final Dish Photo</Text>
              <TouchableOpacity 
                style={[styles.button, styles.uploadButton]} 
                onPress={() => pickImage(setFinalImage)}
              >
                <Text style={styles.buttonText}>Upload Final Photo</Text>
              </TouchableOpacity>
              {finalImage && (
                <Image 
                  source={{ uri: finalImage }} 
                  style={styles.finalImage} 
                  resizeMode="cover"
                />
              )}

              {/* Save Button */}
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
    marginTop: 10,
    borderRadius: 8,
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
});

export default AddRecipeScreen;