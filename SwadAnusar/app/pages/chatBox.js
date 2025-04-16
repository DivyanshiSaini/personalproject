import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const ChatBox = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const flatListRef = useRef(null);
  
  // Get chat parameters
  const { 
    chatId, 
    chatName,
    currentUserId
  } = route.params;
  
  // If a recipe was passed through navigation params
  const sharedRecipe = route.params?.sharedRecipe;

  useEffect(() => {
    // Verify authentication state
    if (!FIREBASE_AUTH.currentUser) {
      Alert.alert('Authentication Error', 'Please log in to continue');
      navigation.goBack();
      return;
    }

    // Set up the chat header
    navigation.setOptions({
      title: chatName || 'Chat',
    });

    // Get current user information
    const getUserInfo = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('userEmail');
        const name = await AsyncStorage.getItem('userName');
        
        if (!id || !email) {
          throw new Error('User information not found');
        }
        
        setUserId(id);
        setUserEmail(email);
        setUserName(name || email.split('@')[0]);
        
        // If there's a shared recipe, send it immediately
        if (sharedRecipe) {
          sendRecipe(sharedRecipe);
        }
      } catch (error) {
        console.error('Error getting user info:', error);
        Alert.alert('Error', 'Failed to load user information');
      }
    };
    getUserInfo();

    // Set up real-time listener for messages
    const setupChat = async () => {
      try {
        const chatDocId = getChatDocId(currentUserId, chatId);
        const messagesRef = collection(FIREBASE_DB, 'individualChats', chatDocId, 'messages');
        
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp to Date
          }));
          setMessages(msgs);
          
          // Scroll to bottom when new messages arrive
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        });

        // Fetch user's recipes
        await fetchUserRecipes();

        return unsubscribe;
      } catch (error) {
        console.error('Chat setup error:', error);
        Alert.alert('Error', 'Failed to load chat messages');
      }
    };

    const unsubscribe = setupChat();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chatId, sharedRecipe, currentUserId]);

  const getChatDocId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('_');
  };

  const fetchUserRecipes = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        console.log('No user email found');
        return;
      }

      const recipesRef = collection(FIREBASE_DB, 'recipes');
      const q = query(recipesRef, where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      const recipesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRecipes(recipesList);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to load your recipes');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Verify authentication
      if (!FIREBASE_AUTH.currentUser) {
        Alert.alert('Error', 'You must be logged in to send messages');
        return;
      }

      const chatDocId = getChatDocId(currentUserId, chatId);
      const messagesRef = collection(FIREBASE_DB, 'individualChats', chatDocId, 'messages');

      await addDoc(messagesRef, {
        text: newMessage,
        senderId: userId,
        senderEmail: userEmail,
        senderName: userName,
        timestamp: serverTimestamp(),
        type: 'text'
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      Alert.alert('Error', `Failed to send message: ${error.message}`);
    }
  };

  const sendRecipe = async (recipe) => {
    try {
      // Verify authentication
      if (!FIREBASE_AUTH.currentUser) {
        Alert.alert('Error', 'You must be logged in to share recipes');
        return;
      }

      const chatDocId = getChatDocId(currentUserId, chatId);
      const messagesRef = collection(FIREBASE_DB, 'individualChats', chatDocId, 'messages');

      await addDoc(messagesRef, {
        senderId: userId,
        senderEmail: userEmail,
        senderName: userName,
        timestamp: serverTimestamp(),
        type: 'recipe',
        recipe: recipe
      });

      // Close modal if open
      setShowRecipeModal(false);
      
      // Clear navigation params if needed
      if (route.params?.sharedRecipe) {
        navigation.setParams({ sharedRecipe: null });
      }
    } catch (error) {
      console.error('Error sending recipe:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      Alert.alert('Error', `Failed to share recipe: ${error.message}`);
    }
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetails', { recipe });
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === userId;
    
    if (item.type === 'recipe') {
      return (
        <TouchableOpacity
          onPress={() => handleRecipePress(item.recipe)}
          style={[
            styles.recipeContainer,
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
          ]}
        >
          {!isCurrentUser && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          
          <View style={styles.recipeContent}>
            <Text style={[
              styles.recipeTitle,
              isCurrentUser ? styles.currentUserText : styles.otherUserText
            ]}>
              Recipe: {item.recipe.title}
            </Text>
            
            {item.recipe.finalImage && (
              <Image 
                source={{ uri: item.recipe.finalImage }} 
                style={styles.recipeImage} 
              />
            )}
            
            <Text style={[
              styles.recipeTapPrompt,
              isCurrentUser ? styles.currentUserText : styles.otherUserText
            ]}>
              Tap to view recipe
            </Text>
          </View>
          
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.currentUserTime : styles.otherUserTime
          ]}>
            {item.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[
          styles.messageContainer, 
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
        ]}>
          {!isCurrentUser && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.currentUserTime : styles.otherUserTime
          ]}>
            {item.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      );
    }
  };

  const RecipeSelectionModal = () => (
    <Modal
      visible={showRecipeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowRecipeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share a Recipe</Text>
            <TouchableOpacity onPress={() => setShowRecipeModal(false)}>
              <AntDesign name="close" size={24} color="#D64527" />
            </TouchableOpacity>
          </View>
          
          {recipes.length === 0 ? (
            <Text style={styles.noRecipesText}>No recipes available to share</Text>
          ) : (
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.recipeListItem} 
                  onPress={() => sendRecipe(item)}
                >
                  {item.finalImage ? (
                    <Image 
                      source={{ uri: item.finalImage }} 
                      style={styles.recipeListImage} 
                    />
                  ) : (
                    <View style={styles.noImagePlaceholder}>
                      <MaterialIcons name="restaurant" size={24} color="#999" />
                    </View>
                  )}
                  <Text style={styles.recipeListTitle}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.attachButton} 
          onPress={() => setShowRecipeModal(true)}
        >
          <MaterialIcons name="restaurant" size={24} color="#D64527" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      
      <RecipeSelectionModal />
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#D64527',
    borderTopRightRadius: 0,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: '#fff',
  },
  otherUserText: {
    color: '#333',
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555',
    fontSize: 12,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  currentUserTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherUserTime: {
    color: 'rgba(0,0,0,0.5)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#D64527',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  attachButton: {
    padding: 10,
    marginRight: 5,
  },
  // Recipe message styles
  recipeContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  recipeContent: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeTapPrompt: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D64527',
  },
  noRecipesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  recipeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recipeListImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  noImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeListTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default ChatBox;