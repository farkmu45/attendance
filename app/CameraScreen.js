import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Camera, CameraType } from "expo-camera";
import * as LocalAuthentication from "expo-local-authentication";
import { Link, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { endpoint } from "./api/endpoint";
import Toast from "react-native-root-toast";
import images from "../assets/images";
import LottieView from "lottie-react-native";

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [displayGif, setDisplayGif] = useState(false);
  const [gifToShow, setGifToShow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const animation = useRef(null);
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

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
        console.log("Error retrieving token from AsyncStorage:", error);
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
      if (result === true) {
        setModalVisible(true);
      } else {
        const errorMessage = result || "Unknown error";
        const retry = await showRetryAlert(errorMessage);
        if (retry) {
          await takePhoto();
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log("Error taking photo:", error);
    }
  };

  const showGifAndRedirect = async (response) => {
    setIsLoading(true);
    setDisplayGif(true);
  
    const animationSource =
      response.type === "IN"
        ? require('../assets/LottieJson/door_open_new.json') 
        : require('../assets/LottieJson/goodbye.json');
  
    setGifToShow(animationSource);
  
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    setIsLoading(false);
  
    if (response.type === "IN") {
      router.push("/(tabs)");
    } else {
      router.push("/(tabs)");
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
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        console.log(response.data);
        Toast.show("Attendance Success.", {
          duration: Toast.durations.SHORT,
        });

        showGifAndRedirect(response.data);

        return true;
      } else {
        console.log("Unexpected response status:", response.status);
        Toast.show("Verification Failed.", {
          duration: Toast.durations.LONG,
        });

        return false;
      }
    } catch (error) {
      console.log("Error verifying photo:", error.response.data);
      if (error.response.data.code === "NOT_RECOGNIZED") {
        const errorMessage = error.response.data.error;
        return errorMessage;
      } else if (error.response.data.code === "ATTENDANCE_EXISTS") {
        return "Attendance already exist.";
      } else {
        return "Error Please Try Again Later, Make Sure If You Not Attended Before";
      }
    }
  };

  const showRetryAlert = async (errorMessage) => {
    return new Promise((resolve, reject) => {
      if (errorMessage === "Attendance already exist.") {
        Alert.alert(
          "Verification Failed",
          `Error verifying photo, ${errorMessage}`,
          [
            {
              text: "OK",
              onPress: async () => {
                await router.push("/(tabs)");
                resolve();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Verification Failed",
          `Error verifying photo ${errorMessage}. Do you want to use fingerprint?`,
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
              onPress: () => resolve(false),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }
    });
  };

  const promptFingerprintAuthentication = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();

      // if (!hasHardware) {
      //   Alert.alert("Error", "Fingerprint authentication is not supported on this device.");
      //   return;
      // }

      let retry = true;
      while (retry) {
        const isAuthenticated = await LocalAuthentication.authenticateAsync({
          promptMessage: "Please verify your identity with fingerprint",
        });

        if (!isAuthenticated.success) {
          Alert.alert("Authentication failed");
        } else {
          const response = await axios.post(
            endpoint.AttendFace,
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          if (response.status === 201) {
            Toast.show("Attendance using fingerprint success.", {
              duration: Toast.durations.SHORT,
            });
            // console.log("yey berhasil");
            showGifAndRedirect(response.data);
            retry = false;
          }
        }
        if (retry) {
          const tryAgain = await showRetryAlert();
          retry = tryAgain;
        }
      }
    } catch (error) {
      console.log("Error with fingerprint authentication:", error.request);
      Alert.alert(
        "Information",
        `Fingerprint authentication failed ${error.response.data.error}.`
      );
    }
  }; 

  const handleModalClose = () => {
    setModalVisible(false);
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Camera
        ratio="4:3"
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.front}
      />
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
      <View style={styles.modalContainer}>
        {displayGif && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
              setDisplayGif(false);
            }}
          >
            <View style={styles.modalContent}>
              {gifToShow && (
                <LottieView
                  autoPlay
                  ref={animation}
                  loop={false}
                  style={styles.gif}
                  source={gifToShow}
                />
              )}
            </View>
          </Modal>
        )}
      </View>
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
    aspectRatio: 3 / 4,
  },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#3498db",
    padding: 20,
    borderRadius: 50,
    zIndex:10
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    zIndex:10
  },
  loading: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'transparent'
  },
  modalContent: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  gif: {
    width: 200,
    height: 200,
    backgroundColor: "#eee",
  },
});

export default CameraScreen;
