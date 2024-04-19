import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const AttendanceScreen = () => {
  const handleAttend = () => {
    router.replace("/CameraScreen"); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Attendance</Text>
      <FontAwesome5 name="user-clock" size={100} color="#3498db" style={styles.icon} />
      <TouchableOpacity style={styles.attendButton} onPress={handleAttend}>
        <Text style={styles.buttonText}>Attend Here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AttendanceScreen;
