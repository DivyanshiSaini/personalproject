// app/Pages/ChatScreen.js
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
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { 
  collection, 
  doc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const chatBox = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const flatListRef = useRef(null);
  
  // Get chat type and ID from route params
  const { chatType, chatId, chatName } = route.params;
  const isGroupChat = chatType === 'group';

  useEffect(() => {
    // Set up the chat header
    navigation.setOptions({
      title: chatName || 'Chat',
    });

    // Get current user ID
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();

    // Set up real-time listener for messages
    let messagesRef;
    if (isGroupChat) {
      messagesRef = collection(FIREBASE_DB, 'groupChats', chatId, 'messages');
    } else {
      // For individual chats, we use a combined ID to keep chats between two users
      const chatDocId = [userId, chatId].sort().join('_');
      messagesRef = collection(FIREBASE_DB, 'individualChats', chatDocId, 'messages');
    }

    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      
      // Scroll to bottom when new messages arrive
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [chatId, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userName = await AsyncStorage.getItem('userName');
      
      let messagesRef;
      if (isGroupChat) {
        messagesRef = collection(FIREBASE_DB, 'groupChats', chatId, 'messages');
      } else {
        const chatDocId = [userId, chatId].sort().join('_');
        messagesRef = collection(FIREBASE_DB, 'individualChats', chatDocId, 'messages');
      }

      await addDoc(messagesRef, {
        text: newMessage,
        senderId: userId,
        senderEmail: userEmail,
        senderName: userName,
        timestamp: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === userId;
    
    return (
      <View style={[
        styles.messageContainer, 
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {!isCurrentUser && !isGroupChat && (
          <Text style={styles.senderName}>{item.senderName}</Text>
        )}
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>
          {item.timestamp?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

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
    color: '#fff',
  },
  currentUserMessageText: {
    color: '#fff',
  },
  otherUserMessageText: {
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
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
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
});

export default chatBox;