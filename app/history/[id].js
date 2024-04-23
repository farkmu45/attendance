import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { endpoint } from "../api/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const DetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [detailAttend, setdetailAttend] = useState();
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  const getTokenFromAsyncStorage = async () => {
    try {
      const token = await AsyncStorage.getItem("@userToken");
      if (token !== null) {
        // console.log("Token retrieved:", token);
        setAuthToken(token);
      } else {
        console.log("Token not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(endpoint.AttendDetail(id), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data);
      setdetailAttend(response.data); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }; 

  useEffect(() => {
    getTokenFromAsyncStorage();
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text style={styles.title}>Attendance Detail</Text>
        <Text style={styles.detail}>ID: {item.id}</Text>
        <Text style={styles.detail}>User ID: {item.user_id}</Text> 
        <Text style={styles.detail}>Time: {item.time}</Text>
        <Text style={styles.detail}>Type: {item.type}</Text>
        <Text style={styles.detail}>
          Is Deviate: {item.is_deviate ? "Yes" : "No"}
        </Text>
        <Text style={styles.detail}>Created At: {item.created_at}</Text>
        <Text style={styles.detail}>Updated At: {item.updated_at}</Text>
      </View>
    ); 
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={detailAttend}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default DetailScreen;
