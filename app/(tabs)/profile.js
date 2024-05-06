import React, { useState,useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoint } from "../api/endpoint";
import axios from "axios";
import { router } from "expo-router";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);


  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@userToken')
      console.log("Token removed from AsyncStorage");
    } catch(e) {
      console.log("Error removing token:", e);
    }
  }

  const handleLogout = async () => {
  
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsLoading(true);

              const token = await AsyncStorage.getItem("@userToken");
              console.log("Token:", token);
          
              const response = await axios.get(endpoint.logoutUser, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
          
              console.log("Logout response:", response);
          
              if (response.status === 200) {
                console.log("Logout successful");
                await removeValue();
                router.push('/login');
                
              } else {
                console.error("Logout failed:", response);
              }
            } catch (error) {
              console.error("Error during logout:", error);
            } finally {
              setIsLoading(false); 
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}></View>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://placekitten.com/200/200" }}
          style={styles.profilePic}
        />
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#3498db" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  banner: {
    backgroundColor: "#3498db",
    width: "100%",
    height: 200,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -100,
    marginBottom: 40,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#000",
    marginBottom: 16,
    backgroundColor:'red'
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6347",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
  },
});

export default ProfilePage;
