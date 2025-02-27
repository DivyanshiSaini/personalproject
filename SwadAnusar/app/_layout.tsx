import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName="pages/login"
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
      {/* Login Screen */}
      <Tabs.Screen
        name="pages/login"
        options={{
          title: 'Login',
          tabBarIcon: () => (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/login-rounded-right.png' }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      {/* Dashboard Screen */}
      <Tabs.Screen
        name="pages/dashboard"
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

      {/* Recipes Screen */}
      <Tabs.Screen
        name="pages/recipes"
        options={{
          title: 'Saved Recipes',
          tabBarIcon: () => (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/recipe.png' }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
