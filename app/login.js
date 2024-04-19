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
      <FontAwesome5Icon name="user-circle" size={80} color="#3498db" style={styles.icon} />
      <Text style={styles.title}>Welcome to Attendance</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <FontAwesome5Icon name="user" size={20} color="#3498db" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={styles.inputWrapper}>
          <FontAwesome5Icon name="lock" size={20} color="#3498db" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
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
    backgroundColor: "#fff",
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#3498db",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginPage;