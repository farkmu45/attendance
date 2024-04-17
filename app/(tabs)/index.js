import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import {router} from 'expo-router'

const AttendanceScreen = () => {
  const handleAttend = () => {
    router.replace('/CameraScreen');
  };
  return (
    <View style={styles.container}>
      <Text>Homepage</Text>
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
  },

  attendButton: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AttendanceScreen;
