import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#228B22',
          borderTopWidth: 0,
          height: 80,
        },
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#FFF',
        tabBarLabelStyle: { display: 'none' },
      }}
    >
      {/* Recipes Screen */}
      <Tabs.Screen
        name="recipes" // This corresponds to pages/recipes.js
        options={{
          title: 'Recipes',
          tabBarIcon: () => (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/recipe.png' }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      {/* Dashboard Screen */}
      <Tabs.Screen
        name="dashboard" // This corresponds to pages/dashboard.js
        options={{
          title: 'Dashboard',
          tabBarIcon: () => (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/home.png' }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      {/* Settings Screen (Login for now) */}
      <Tabs.Screen
        name="login" // This corresponds to pages/login.js
        options={{
          title: 'Settings',
          tabBarIcon: () => (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/login-rounded-right.png' }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      {/* Hidden Pages */}
      
      <Tabs.Screen
        name="pages/home"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="pages/signup"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
        }}
      
      />
    </Tabs>
  );
}

