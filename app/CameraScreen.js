import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { Camera, CameraType } from "expo-camera";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { endpoint } from "./api/endpoint";
import { Link, router } from "expo-router";
const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [authToken, setAuthToken] = useState(null);

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
      await verifyPhoto(photo.uri);
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };
  const verifyPhoto = async (photoUri) => {
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: photoUri,
        type: "file",
        name: "attendPhoto.jpg",
      });

      const response = await axios.post(endpoint.Attend, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
 
      if (response.status === 201) {
        return response.data; 
      } 
      
    } catch (error) {
      console.error("Error verifying photo:", error.code);
      return false;
    }
  };


  const showFingerprintAlert = async () => {
    return new Promise((resolve, reject) => {
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
      
      const response = await axios.post(endpoint.AttendFace, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error with fingerprint authentication:", error);
      Alert.alert( 
        "Information",
        "The photo is not recognized and fingerprint authentication failed."
      );
    }
  };

  return (
    <View style={styles.container}>
    <Camera ref={cameraRef} style={styles.camera} type={CameraType.front} />
    <TouchableOpacity style={styles.button} onPress={takePhoto}>
      <Text style={styles.buttonText}>Take Photo</Text>
    </TouchableOpacity>
    <Link style={styles.backButton} href={'/(tabs)'}>
      <Text style={styles.buttonText}>Back</Text>
    </Link>
  </View>
  
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  camera: {
    width: '100%',
    height: '80%', // Adjust as needed
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'transparent', // Adjust as needed
    padding: 10,
    borderRadius: 5,
  },
});


export default CameraScreen;
