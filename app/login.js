import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import { Link, router } from "expo-router";
import { endpoint } from "./api/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@userToken", value);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = () => { 
    axios
      .post(endpoint.loginUser, {
        username: username,
        password: password,
      }) 
      .then((response) => {
        console.log("Login successful");
        console.log(response.data.data.token);
        storeData(response.data.data.token);
        router.replace("/(tabs)");
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <View style={styles.container}>
      <FontAwesome5Icon
        name="user-circle"
        size={80}
        color="#3498db"
        style={styles.icon}
      />
      <Text style={styles.title}>Welcome to attendance</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 8,
  },
  loginButton: {
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

export default LoginPage;
