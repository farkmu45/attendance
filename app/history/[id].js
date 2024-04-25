import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { endpoint } from "../api/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialIcons } from '@expo/vector-icons'; 


const DetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [detailAttend, setdetailAttend] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    getTokenFromAsyncStorage();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(endpoint.AttendDetail(id), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data);
      setdetailAttend([response.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error: display error message to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  const DetailItem = ({ label, value, icon }) => (
    <View style={styles.detailItem}>
      {icon && <MaterialIcons name={icon} size={24} color="#333" style={styles.icon} />} 
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toDateString()} ${date.toLocaleTimeString()}`;
  };
  

  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Attendance Detail</Text>
        <DetailItem label="ID" value={item.id} icon="credit-card" />
        <DetailItem label="User ID" value={item.user_id} icon="person" />
        <DetailItem label="Time" value={formatDateTime(item.time)} icon="access-time" />
        <DetailItem label="Type" value={item.type} icon="event" />
        <DetailItem label="Is Deviate" value={item.is_deviate ? "Yes" : "No"} icon="warning" />
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={detailAttend}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 16,
  },
});


export default DetailScreen;
