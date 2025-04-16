import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const RecipeDetailsScreen = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>

      {/* Back Button to Recipes */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Recipes')}>
          <AntDesign name="arrowleft" size={24} color="#8B0000" />
        </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
      </View>
      {recipe.finalImage && (
        <Image source={{ uri: recipe.finalImage }} style={styles.headerImage} />
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientQuantity}>{item.quantity}</Text>
              <Text style={styles.ingredientName}>{item.name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No ingredients added.</Text>
        )}
        <Text style={styles.sectionTitle}>Steps</Text>
        {recipe.steps.length > 0 ? (
          recipe.steps.map((item, index) => (
            <View key={index} style={styles.stepItem}>
              <Text style={styles.stepNumber}>Step {index + 1}</Text>
              <Text style={styles.stepText}>{item.text}</Text>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.stepImage} />
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No steps added.</Text>
        )}
        // Add to RecipeDetailsScreen component
          <View style={styles.shareContainer}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={() => navigation.navigate('ChatBox', {
                sharedRecipe: recipe
              })}
            >
              <Text style={styles.shareButtonText}>Share this Recipe</Text>
            </TouchableOpacity>
          </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'rgba(255,255,255,0.95)' 
  },
  headerContainer: { 
    adding: 20, 
    alignItems: 'center', 
    backgroundColor: '#f8f8f8' 
  },
  title: { 
    marginTop: 50, 
    fontSize: 26, 
    fontWeight: 'bold' ,
    paddingBottom: 15,
  },
  headerImage: { 
    padding: 20,
    width: '100%', 
    height: 250, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    borderRadius: 20,
  
  },
  contentContainer: { 
    paddingright: 20,
    paddingLeft: 20, 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginVertical: 10 
  },
  ingredientItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  ingredientQuantity: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginRight: 8, 
    color: '#008080'
  },
  ingredientName: { 
    fontSize: 16, 
    color: '#333' 
  },
  stepItem: { 
    marginBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingBottom: 15 
  },
  stepNumber: { fontSize: 18, 
    fontWeight: 'bold', 
    color: '#ff6347', 
    marginBottom: 5 
  },
  stepText: { 
    fontSize: 16, 
    color: '#333',
  },
  stepImage: { 
    width: '100%', 
    height: 250, 
    borderRadius: 8, 
    marginTop: 10,
    paddingTop:20,
    paddingBottom: 20,
    paddingRight: 20, 
    //padding: 20,
  },
  emptyText: { 
    fontSize: 16, 
    color: '#999', 
    fontStyle: 'italic' 
  },
  backButton: {
    bold: true,
    //backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  shareContainer: {
    padding: 20,
    alignItems: 'center'
  },
  shareButton: {
    backgroundColor: '#D64527',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center'
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default RecipeDetailsScreen;
