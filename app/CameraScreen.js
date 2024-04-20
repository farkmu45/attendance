import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { endpoint } from "./api/endpoint";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTokenFromAsyncStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("@userToken");
        if (token !== null) {
          console.log("Token retrieved:", token);
          setAuthToken(token);
        } else {
          console.log("Token not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error retrieving token from AsyncStorage:", error);
      }
    };

    getTokenFromAsyncStorage();
  }, []);

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePictureAsync();
      setIsLoading(true);
      const result = await verifyPhoto(photo.uri);
      setIsLoading(false);
      if (result) {
        router.push("/(tabs)");
      } else {
        const retry = await showRetryAlert();
        if (retry) {
          await takePhoto();
        } else {
          await showFingerprintAlert();
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const verifyPhoto = async (photoUri) => {
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: photoUri,
        type: "image/jpeg",
        name: "attendPhoto.jpg",
      });
  
      const response = await axios.post(endpoint.Attend, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.status === 201) {
        console.log(response.data);
        return true; 
      } else {
        console.log("Unexpected response status:", response.status);
        return false; 
      }
    } catch (error) {
      console.error("Error verifying photo:", error);
      return false; 
    }
  };
  

  const showFingerprintAlert = async () => {
    return new Promise(async (resolve, reject) => {
      Alert.alert(
        "Verification Failed",
        "Do you want to use fingerprint authentication?",
        [
          {
            text: "Yes",
            onPress: async () => {
              await promptFingerprintAuthentication();
              resolve();
            },
          },
          {
            text: "No",
            onPress: async () => {
              await takePhoto();
              resolve();
            },
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    });
  };

  const promptFingerprintAuthentication = async () => {
    try {
      const isAuthenticated = await LocalAuthentication.authenticateAsync({
        promptMessage: "Please verify your identity with fingerprint",
      });

      if (!isAuthenticated.success) {
        Alert.alert("Authentication failed");
      }

      const response = await axios.post(endpoint.AttendFace, null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 201) {
        navigation.navigate("/tabs");
      }
    } catch (error) {
      console.error("Error with fingerprint authentication:", error);
      Alert.alert(
        "Information",
        "Fingerprint authentication failed. Please try again."
      );
    }
  };

  const showRetryAlert = async () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "Verification Failed",
        "Error verifying photo. Do you want to try again?",
        [
          {
            text: "Yes",
            onPress: () => resolve(true),
          },
          {
            text: "No",
            onPress: () => resolve(false),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={CameraType.front} />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Ionicons name="camera" size={36} color="white" />
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      <Link style={styles.backButton} href="/(tabs)">
        <Ionicons name="arrow-back" size={24} color="white" />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
  },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 50,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  loading: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default CameraScreen;
