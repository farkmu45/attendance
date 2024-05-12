import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoint } from "../api/endpoint";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem("@userToken");
        const response = await axios.get(endpoint.Profile, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@userToken');
      console.log("Token removed from AsyncStorage");
    } catch(e) {
      console.log("Error removing token:", e);
    }
  };

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
                await AsyncStorage.removeItem('@userToken');
                router.push('login');
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
      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#3498db" />
      ) : (
        <>
          <View style={styles.card}>
            <Image
              source={{ uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }}
              style={styles.profilePic}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{userData?.username.toUpperCase()}</Text>
              <Text style={styles.email}>{userData?.name}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6347",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 20,
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
    alignSelf: 'center',
  },
});

export default ProfilePage;
