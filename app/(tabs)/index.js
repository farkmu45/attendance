import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const Clock = ({ currentTime }) => {
  return (
    <View style={styles.clockContainer}>
      <View style={styles.clock}>
        <Text style={styles.clockText}>{currentTime.toLocaleTimeString()}</Text>
      </View>
    </View>
  );
};

const AttendanceScreen = () => {
  const [animation] = useState(new Animated.Value(0));
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const generateGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting("Good morning!");
    } else if (hour < 18) {
      setGreeting("Good afternoon!");
    } else {
      setGreeting("Good evening!");
    }
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    generateGreeting();
  }, [currentTime]);

  const handleAttend = () => {
    router.replace("/CameraScreen");
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.container}>
      <Clock currentTime={currentTime} />
      <View style={styles.card}>
        <View style={styles.greetingContainer}>
          <FontAwesome5 name="sun" size={24} color="#FFD700" style={styles.icon} />
          <Text style={styles.greeting}>{greeting}</Text>
        </View>
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  attendButton: {
    backgroundColor: "#3498db",
    borderRadius: 100,
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginTop:20
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  clockContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  clock: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
  },
  clockText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default AttendanceScreen;
