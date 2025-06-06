import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Dashboard from './pages/dashboard';
import AddRecipe from './pages/addRecipe';
import HomeScreen from './pages/home';
import Recipes from './pages/recipes';
import { LogBox } from 'react-native';
import Login from './pages/login';
import Signup from './pages/signup';
import AboutUs from './pages/aboutUs';
import FavoriteRecipes from './pages/favoriteRecipes';
import Settings from './pages/settings';
import ChatBox from './pages/chatBox';
import RecipeDetails from './pages/recipeDetails';
import AccountInfo from './pages/accountInfo';

const Tabs = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tabs.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#4CAF50',
          borderTopWidth: 0,
          height: 80,
        },
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#FFF',
        tabBarLabelStyle: { display: 'none' },
      }}
    >
      {/* Dashboard Screen */}
      <Tabs.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: () => (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/chat.png' }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />
      {/* Recipes Screen */}
      <Tabs.Screen
        name="Recipes" // This corresponds to pages/recipes.js
        component={Recipes}
        options={{
          tabBarIcon: () => (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/plus.png' }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />
      {/* Recipes Screen */}
      <Tabs.Screen
        name="Settings" // This corresponds to pages/recipes.js
        component={Settings}
        options={{
          tabBarIcon: () => (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/settings.png' }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />
      {/* Hidden Screen */}
       <Tabs.Screen
        name="AddRecipes"
        component={AddRecipe}
        options={{ tabBarItemStyle: { display: "none" } }}
      />

      {/* Hidden Screen */}
      <Tabs.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ tabBarItemStyle: { display: "none" } }}
      />

       {/* Hidden Screen */}
       <Tabs.Screen
        name="Login"
        component={Login}
        options={{ tabBarItemStyle: { display: "none" } }}
      />

       {/* Hidden Screen */}
       <Tabs.Screen
        name="ChatBox"
        component={ChatBox}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      {/* Hidden Screen */}
      <Tabs.Screen
        name="RecipeDetails"
        component={RecipeDetails}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      {/* Hidden Screen */}
      <Tabs.Screen
        name="AboutUs"
        component={AboutUs}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      {/* Hidden Screen */}
      <Tabs.Screen
        name="FavoriteRecipes"
        component={FavoriteRecipes}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      {/* Hidden Screen */}
      <Tabs.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
    </Tabs.Navigator>
  );
}