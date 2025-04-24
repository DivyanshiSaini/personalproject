import React from "react";
import { useNavigation } from "@react-navigation/native";
import {View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert,} from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebase/config";
import Ionicons from "react-native-vector-icons/Ionicons"; // 🆕 import icon

const Settings = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been successfully logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  const settingsOptions = [
    {
      title: "Account Information",
      icon: "https://img.icons8.com/ios-filled/50/user-male-circle.png",
      onPress: () => navigation.navigate("AccountInfo"),
    },
    {
      title: "My Favorite Recipes",
      icon: "https://img.icons8.com/ios-filled/50/book.png",
      onPress: () => navigation.navigate("FavoriteRecipes"),
    },
    {
      title: "Logout",
      icon: "https://img.icons8.com/ios-filled/50/exit.png",
      onPress: handleLogout,
    },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/homepage.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Top Row: Heading + Info Icon */}
        <View style={styles.topRow}>
          <Text style={styles.heading}>User Settings</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AboutUs")}
            style={styles.infoButton}
          >
            <Ionicons name="information-circle" size={28} color="#D64527" />
          </TouchableOpacity>
        </View>

        <View style={styles.optionContainer}>
          {settingsOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                item.title === "Logout" && styles.logoutButton,
              ]}
              onPress={item.onPress}
              activeOpacity={0.9}
            >
              <View style={styles.option}>
                <Image source={{ uri: item.icon }} style={styles.icon} />
                <Text
                  style={[
                    styles.optionText,
                    item.title === "Logout" && styles.logoutText,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#D64527",
    textAlign: "left",
    letterSpacing: 1,
  },
  infoButton: {
    padding: 4,
  },
  optionContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: "#FFF6F1",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 14,
    tintColor: "#D64527",
  },
  optionText: {
    fontSize: 18,
    color: "#2E231E",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FFF6F1",
  },
  logoutText: {
    color: "#2E231E",
    fontWeight: "700",
  },
});

export default Settings;
