// app/firebase/services/chat.js
import { 
    doc, 
    setDoc, 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    where, 
    orderBy, 
    getDocs, 
    getDoc,
    onSnapshot,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
    limit
  } from 'firebase/firestore';
  import { FIREBASE_DB, FIREBASE_AUTH } from '../config';
  
  // Error handling wrapper
  const handleFirestoreError = (error, operation) => {
    console.error(`Error in ${operation}:`, error);
    
    // Check for common permission errors
    if (error.code === 'permission-denied') {
      console.error('Permission denied. Make sure user is authenticated and has correct permissions.');
      // You might want to trigger a re-authentication here
    }
    
    throw error;
  };
  
  // Helper to get current user
  const getCurrentUser = () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error('User not authenticated');
    return user;
  };
  
  // ==================== INDIVIDUAL CHAT OPERATIONS ====================
  
  // Create or get individual chat between two users
  export const createIndividualChat = async (otherUserId) => {
    try {
      const currentUser = getCurrentUser();
      const user1Id = currentUser.uid;
      const user2Id = otherUserId;
      
      // Create sorted chat ID
      const chatId = [user1Id, user2Id].sort().join('_');
      
      // Check if chat already exists
      const chatDoc = await getDoc(doc(FIREBASE_DB, 'individualChats', chatId));
      
      if (!chatDoc.exists()) {
        // Create new chat document
        await setDoc(doc(FIREBASE_DB, 'individualChats', chatId), {
          participants: [user1Id, user2Id],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`Individual chat ${chatId} created`);
      } else {
        console.log(`Individual chat ${chatId} already exists`);
      }
      
      return chatId;
    } catch (error) {
      return handleFirestoreError(error, 'createIndividualChat');
    }
  };
  
  // Send message in individual chat
  export const sendIndividualMessage = async (chatId, messageContent) => {
    try {
      const currentUser = getCurrentUser();
      
      // Verify user is participant in this chat
      const chatDoc = await getDoc(doc(FIREBASE_DB, 'individualChats', chatId));
      if (!chatDoc.exists()) {
        throw new Error('Chat does not exist');
      }
      
      const chatData = chatDoc.data();
      if (!chatData.participants.includes(currentUser.uid)) {
        throw new Error('You are not a participant in this chat');
      }
      
      // Create message object
      const messageData = {
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        senderName: currentUser.displayName || 'User',
        timestamp: serverTimestamp(),
        ...messageContent // This includes text/type/recipe fields
      };
      
      // Add message to subcollection
      const messagesRef = collection(FIREBASE_DB, 'individualChats', chatId, 'messages');
      const messageRef = await addDoc(messagesRef, messageData);
      
      // Update chat document with last message info
      const messagePreview = messageContent.type === 'text' ? 
        messageContent.text : 
        `Shared a ${messageContent.type}`;
      
      await updateDoc(doc(FIREBASE_DB, 'individualChats', chatId), {
        lastMessage: messagePreview,
        lastMessageTimestamp: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`Message sent in chat ${chatId}`);
      return messageRef.id;
    } catch (error) {
      return handleFirestoreError(error, 'sendIndividualMessage');
    }
  };
  
  // Get all individual chats for current user
  export const getIndividualChats = async () => {
    try {
      const currentUser = getCurrentUser();
      
      const chatsRef = collection(FIREBASE_DB, 'individualChats');
      const q = query(
        chatsRef, 
        where('participants', 'array-contains', currentUser.uid),
        orderBy('lastMessageTimestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const chats = [];
      
      for (const doc of querySnapshot.docs) {
        const chatData = doc.data();
        
        // Get the other participant's ID
        const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
        
        // Get the other user's profile
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', otherUserId));
        const userData = userDoc.exists() ? userDoc.data() : null;
        
        chats.push({
          id: doc.id,
          ...chatData,
          otherUser: userData
        });
      }
      
      return chats;
    } catch (error) {
      return handleFirestoreError(error, 'getIndividualChats');
    }
  };
  
  // Listen to messages in real-time for an individual chat
  export const listenToIndividualMessages = (chatId, callback) => {
    try {
      const currentUser = getCurrentUser();
      
      const messagesRef = collection(FIREBASE_DB, 'individualChats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp to JS Date
        }));
        
        callback(messages);
      }, (error) => {
        console.error('Error listening to messages:', error);
        // Handle specific errors
        if (error.code === 'permission-denied') {
          console.error('Permission denied. Make sure you are a participant in this chat.');
        }
      });
      
      return unsubscribe;
    } catch (error) {
      handleFirestoreError(error, 'listenToIndividualMessages');
      return () => {}; // Return empty function if error
    }
  };
  
  // ==================== GROUP CHAT OPERATIONS ====================
  
  // Create a new group chat
  export const createGroupChat = async (groupName, memberIds) => {
    try {
      const currentUser = getCurrentUser();
      
      // Create a unique group ID (using timestamp and creator ID)
      const timestamp = new Date().getTime();
      const groupId = `group_${timestamp}_${currentUser.uid}`;
      
      // Ensure creator is in members
      if (!memberIds.includes(currentUser.uid)) {
        memberIds.push(currentUser.uid);
      }
      
      // Create group chat document
      await setDoc(doc(FIREBASE_DB, 'groupChats', groupId), {
        name: groupName,
        members: memberIds,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: currentUser.uid,
        photoURL: null // Optional group photo
      });
      
      console.log(`Group chat ${groupId} created`);
      return groupId;
    } catch (error) {
      return handleFirestoreError(error, 'createGroupChat');
    }
  };
  
  // Add members to group chat
  export const addGroupMembers = async (groupId, newMemberIds) => {
    try {
      const currentUser = getCurrentUser();
      
      // Get group data
      const groupDoc = await getDoc(doc(FIREBASE_DB, 'groupChats', groupId));
      if (!groupDoc.exists()) {
        throw new Error('Group does not exist');
      }
      
      const groupData = groupDoc.data();
      if (!groupData.members.includes(currentUser.uid)) {
        throw new Error('You are not a member of this group');
      }
      
      // Add new members
      await updateDoc(doc(FIREBASE_DB, 'groupChats', groupId), {
        members: arrayUnion(...newMemberIds),
        updatedAt: serverTimestamp()
      });
      
      console.log(`Members added to group ${groupId}`);
      return true;
    } catch (error) {
      return handleFirestoreError(error, 'addGroupMembers');
    }
  };
  
  // Remove member from group chat
  export const removeGroupMember = async (groupId, memberId) => {
    try {
      const currentUser = getCurrentUser();
      
      // Get group data
      const groupDoc = await getDoc(doc(FIREBASE_DB, 'groupChats', groupId));
      if (!groupDoc.exists()) {
        throw new Error('Group does not exist');
      }
      
      const groupData = groupDoc.data();
      if (!groupData.members.includes(currentUser.uid)) {
        throw new Error('You are not a member of this group');
      }
      
      // Only creator or self can remove members
      if (groupData.createdBy !== currentUser.uid && memberId !== currentUser.uid) {
        throw new Error('Only the group creator can remove other members');
      }
      
      // Remove member
      await updateDoc(doc(FIREBASE_DB, 'groupChats', groupId), {
        members: arrayRemove(memberId),
        updatedAt: serverTimestamp()
      });
      
      console.log(`Member ${memberId} removed from group ${groupId}`);
      return true;
    } catch (error) {
      return handleFirestoreError(error, 'removeGroupMember');
    }
  };
  
  // Send message in group chat
  export const sendGroupMessage = async (groupId, messageContent) => {
    try {
      const currentUser = getCurrentUser();
      
      // Verify user is member in this group
      const groupDoc = await getDoc(doc(FIREBASE_DB, 'groupChats', groupId));
      if (!groupDoc.exists()) {
        throw new Error('Group does not exist');
      }
      
      const groupData = groupDoc.data();
      if (!groupData.members.includes(currentUser.uid)) {
        throw new Error('You are not a member of this group');
      }
      
      // Create message object
      const messageData = {
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        senderName: currentUser.displayName || 'User',
        timestamp: serverTimestamp(),
        ...messageContent // This includes text/type/recipe fields
      };
      
      // Add message to subcollection
      const messagesRef = collection(FIREBASE_DB, 'groupChats', groupId, 'messages');
      const messageRef = await addDoc(messagesRef, messageData);
      
      // Update group document with last message info
      const messagePreview = messageContent.type === 'text' ? 
        messageContent.text : 
        `Shared a ${messageContent.type}`;
      
      await updateDoc(doc(FIREBASE_DB, 'groupChats', groupId), {
        lastMessage: messagePreview,
        lastMessageTimestamp: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`Message sent in group ${groupId}`);
      return messageRef.id;
    } catch (error) {
      return handleFirestoreError(error, 'sendGroupMessage');
    }
  };
  
  // Get all group chats for current user
  export const getGroupChats = async () => {
    try {
      const currentUser = getCurrentUser();
      
      const chatsRef = collection(FIREBASE_DB, 'groupChats');
      const q = query(
        chatsRef, 
        where('members', 'array-contains', currentUser.uid),
        orderBy('lastMessageTimestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const groups = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastMessageTimestamp: doc.data().lastMessageTimestamp?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      return groups;
    } catch (error) {
      return handleFirestoreError(error, 'getGroupChats');
    }
  };
  
  // Listen to messages in real-time for a group chat
  export const listenToGroupMessages = (groupId, callback) => {
    try {
      const currentUser = getCurrentUser();
      
      const messagesRef = collection(FIREBASE_DB, 'groupChats', groupId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp to JS Date
        }));
        
        callback(messages);
      }, (error) => {
        console.error('Error listening to group messages:', error);
        // Handle specific errors
        if (error.code === 'permission-denied') {
          console.error('Permission denied. Make sure you are a member of this group.');
        }
      });
      
      return unsubscribe;
    } catch (error) {
      handleFirestoreError(error, 'listenToGroupMessages');
      return () => {}; // Return empty function if error
    }
  };
  
  // ==================== UTILITIES ====================
  
  // Delete a message (can only delete own messages)
  export const deleteMessage = async (chatType, chatId, messageId) => {
    try {
      const currentUser = getCurrentUser();
      
      // Get the message to verify ownership
      const messageRef = doc(FIREBASE_DB, 
        chatType === 'individual' ? 'individualChats' : 'groupChats', 
        chatId, 
        'messages', 
        messageId
      );
      
      const messageDoc = await getDoc(messageRef);
      if (!messageDoc.exists()) {
        throw new Error('Message does not exist');
      }
      
      // Verify ownership
      const messageData = messageDoc.data();
      if (messageData.senderId !== currentUser.uid) {
        throw new Error('You can only delete your own messages');
      }
      
      // Delete the message
      await deleteDoc(messageRef);
      console.log(`Message ${messageId} deleted`);
      return true;
    } catch (error) {
      return handleFirestoreError(error, 'deleteMessage');
    }
  };
  
  // Get chat details (individual or group)
  export const getChatDetails = async (chatType, chatId) => {
    try {
      const currentUser = getCurrentUser();
      
      const chatRef = doc(FIREBASE_DB, 
        chatType === 'individual' ? 'individualChats' : 'groupChats', 
        chatId
      );
      
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
        throw new Error('Chat does not exist');
      }
      
      const chatData = chatDoc.data();
      
      // Ensure user has access
      const participantsField = chatType === 'individual' ? 'participants' : 'members';
      if (!chatData[participantsField].includes(currentUser.uid)) {
        throw new Error('You do not have access to this chat');
      }
      
      return {
        id: chatId,
        type: chatType,
        ...chatData
      };
    } catch (error) {
      return handleFirestoreError(error, 'getChatDetails');
    }
  };
  
  // Get recent messages for a chat (useful for chat previews)
  export const getRecentMessages = async (chatType, chatId, messageLimit = 10) => {
    try {
      const currentUser = getCurrentUser();
      
      // Verify access
      const chatRef = doc(FIREBASE_DB, 
        chatType === 'individual' ? 'individualChats' : 'groupChats', 
        chatId
      );
      
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
        throw new Error('Chat does not exist');
      }
      
      const chatData = chatDoc.data();
      const participantsField = chatType === 'individual' ? 'participants' : 'members';
      if (!chatData[participantsField].includes(currentUser.uid)) {
        throw new Error('You do not have access to this chat');
      }
      
      // Get recent messages
      const messagesRef = collection(FIREBASE_DB, 
        chatType === 'individual' ? 'individualChats' : 'groupChats', 
        chatId, 
        'messages'
      );
      
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(messageLimit)
      );
      
      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      
      // Return in chronological order
      return messages.reverse();
    } catch (error) {
      return handleFirestoreError(error, 'getRecentMessages');
    }
  };