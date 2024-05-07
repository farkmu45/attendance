import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const AttendanceScreen = () => {
  const [animation] = useState(new Animated.Value(0));

  const handleAttend = () => {
    router.replace("/CameraScreen");
  };

  const animateButton = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const buttonScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Attendance</Text>
        <FontAwesome5 name="user-clock" size={100} color="#3498db" style={styles.icon} />
        <TouchableOpacity
          style={[styles.attendButton, { transform: [{ scale: buttonScale }] }]}
          onPress={() => {
            animateButton();
            handleAttend();
          }}
        >
          <Text style={styles.buttonText}>Attend Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  icon: {
    marginBottom: 30,
  },
  attendButton: {
    backgroundColor: "#3498db",
    borderRadius: 100, 
    padding: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AttendanceScreen;
