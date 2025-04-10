import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const settings = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been successfully logged out.");
      // No need to manually navigate — RootLayout will handle it
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
      title: "Library",
      icon: "https://img.icons8.com/ios-filled/50/book.png",
      onPress: () => navigation.navigate("Library"),
    },
    {
      title: "About Us",
      icon: "https://img.icons8.com/ios-filled/50/info.png",
      onPress: () => navigation.navigate("AboutUs"),
    },
    {
      title: "Logout",
      icon: "https://img.icons8.com/ios-filled/50/exit.png",
      onPress: handleLogout,
    },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/bg.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.heading}>Settings</Text>
        <View style={styles.optionContainer}>
          {settingsOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                item.title === "Logout" && styles.logoutButton,
              ]}
              onPress={item.onPress}
              activeOpacity={0.8}
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2E231E",
    textAlign: "center",
    marginBottom: 30,
  },
  optionContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 15,
    tintColor: "#2E231E",
  },
  optionText: {
    fontSize: 18,
    color: "#2E231E",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#D64527",
  },
  logoutText: {
    color: "#fff",
  },
});

export default settings;
