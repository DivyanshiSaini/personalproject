// app/firebase/services/user.js
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection,
    query,
    where,
    getDocs,
    serverTimestamp
  } from 'firebase/firestore';
  import { FIREBASE_DB, FIREBASE_AUTH } from '../config';
  
  // Error handling wrapper
  const handleFirestoreError = (error, operation) => {
    console.error(`Error in ${operation}:`, error);
    
    // Check for common permission errors
    if (error.code === 'permission-denied') {
      console.error('Permission denied. Make sure user is authenticated and has correct permissions.');
    }
    
    throw error;
  };
  
  // Helper to get current user
  const getCurrentUser = () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error('User not authenticated');
    return user;
  };
  
  // Create or update user profile
  export const createOrUpdateUser = async (userData = {}) => {
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser.uid;
      
      // Get existing user data if any
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      
      const updatedData = {
        email: currentUser.email,
        name: currentUser.displayName || userData.name || 'User',
        uniqueId: userId,
        photoURL: currentUser.photoURL || userData.photoURL || null,
        updatedAt: serverTimestamp(),
        ...userData // Allow additional custom fields
      };
      
      // If user doc doesn't exist, add createdAt
      if (!userDoc.exists()) {
        updatedData.createdAt = serverTimestamp();
      }
      
      // Set or update user document
      await setDoc(doc(FIREBASE_DB, 'users', userId), updatedData, { merge: true });
      
      console.log('User profile created/updated');
      return userId;
    } catch (error) {
      return handleFirestoreError(error, 'createOrUpdateUser');
    }
  };
  
  // Get current user profile
  export const getCurrentUserProfile = async () => {
    try {
      const currentUser = getCurrentUser();
      return await getUserProfile(currentUser.uid);
    } catch (error) {
      return handleFirestoreError(error, 'getCurrentUserProfile');
    }
  };
  
  // Get any user profile by ID
  export const getUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      
      if (!userDoc.exists()) {
        console.warn(`User ${userId} does not exist`);
        return null;
      }
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      return handleFirestoreError(error, 'getUserProfile');
    }
  };
  
  // Update user profile
  export const updateUserProfile = async (updates) => {
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser.uid;
      
      // Add updatedAt timestamp
      updates.updatedAt = serverTimestamp();
      
      await updateDoc(doc(FIREBASE_DB, 'users', userId), updates);
      
      console.log('User profile updated');
      return true;
    } catch (error) {
      return handleFirestoreError(error, 'updateUserProfile');
    }
  };
  
  // Search users by name or email
  export const searchUsers = async (searchTerm) => {
    try {
      const currentUser = getCurrentUser();
      const usersRef = collection(FIREBASE_DB, 'users');
      
      // Search by name (case insensitive search not directly supported in Firestore)
      // This is a simple implementation - for production, consider using a proper search solution
      const querySnapshot = await getDocs(usersRef);
      
      const users = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        
        // Skip current user
        if (doc.id === currentUser.uid) return;
        
        // Check if name or email contains search term (case insensitive)
        const nameMatch = userData.name && 
                         userData.name.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = userData.email && 
                          userData.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (nameMatch || emailMatch) {
          users.push({
            id: doc.id,
            ...userData
          });
        }
      });
      
      return users;
    } catch (error) {
      return handleFirestoreError(error, 'searchUsers');
    }
  };
  
  // Get multiple user profiles by IDs
  export const getUserProfiles = async (userIds) => {
    try {
      const users = [];
      
      // Get each user profile
      for (const userId of userIds) {
        const userProfile = await getUserProfile(userId);
        if (userProfile) {
          users.push(userProfile);
        }
      }
      
      return users;
    } catch (error) {
      return handleFirestoreError(error, 'getUserProfiles');
    }
  };