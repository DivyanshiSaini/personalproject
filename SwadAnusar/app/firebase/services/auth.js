// app/firebase/services/auth.js
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    onAuthStateChanged
  } from 'firebase/auth';
  import { FIREBASE_AUTH } from '../config';
  import { createOrUpdateUser } from './user';
  
  // Sign in with email and password
  export const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('User signed in');
      
      // Update Firestore user data
      await createOrUpdateUser();
      
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      
      // Translate Firebase error codes to user-friendly messages
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later');
      } else {
        throw new Error('Error signing in: ' + error.message);
      }
    }
  };
  
  // Create a new user account
  export const signUp = async (email, password, name) => {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, { displayName: name });
      
      // Add user to Firestore
      await createOrUpdateUser({ name });
      
      console.log('User account created');
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      } else {
        throw new Error('Error creating account: ' + error.message);
      }
    }
  };
  
  // Sign out
  export const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log('User signed out');
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Error signing out: ' + error.message);
    }
  };
  
  // Send password reset email
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      console.log('Password reset email sent');
      return true;
    } catch (error) {
      console.error('Error sending password reset:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else {
        throw new Error('Error sending password reset: ' + error.message);
      }
    }
  };
  
  // Listen to auth state changes
  export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(FIREBASE_AUTH, callback);
  };
  
  // Get current authenticated user (if any)
  export const getCurrentUser = () => {
    return FIREBASE_AUTH.currentUser;
  };