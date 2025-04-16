// app/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { subscribeToAuthChanges, getCurrentUser } from '../firebase/services/auth';
import { createOrUpdateUser, getCurrentUserProfile } from '../firebase/services/user';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setCurrentUser(user);
      setLoading(true);
      
      try {
        if (user) {
          // Ensure user exists in Firestore
          await createOrUpdateUser();
          
          // Get full user profile
          const profile = await getCurrentUserProfile();
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Refresh user profile (useful after profile updates)
  const refreshUserProfile = async () => {
    if (!currentUser) return null;
    
    try {
      const profile = await getCurrentUserProfile();
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      setAuthError(error.message);
      return null;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    authError,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};