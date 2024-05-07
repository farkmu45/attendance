import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { endpoint } from "../api/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialIcons } from '@expo/vector-icons'; 

const DetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [detailAttend, setDetailAttend] = useState([]);
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
      setDetailAttend([response.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      {icon && <MaterialIcons name={icon} size={24} color="#3498db" style={styles.icon} />} 
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toDateString()} ${date.toLocaleTimeString()}`;
  };

  const renderDetailItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="info" size={24} color="#3498db" style={styles.headerIcon} />
        <Text style={styles.headerText}>Attendance Detail</Text>
      </View>
      <DetailItem label="ID" value={item.id} icon="credit-card" />
      <DetailItem label="User ID" value={item.user_id} icon="person" />
      <DetailItem label="Time" value={formatDateTime(item.time)} icon="access-time" />
      <DetailItem label="Type" value={item.type} icon="event" />
      <DetailItem label="Is Deviate" value={item.is_deviate ? "Yes" : "No"} icon="warning" />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={detailAttend}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDetailItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3498db",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
    color: "#333",
  },
  detailValue: {
    fontSize: 16,
    color: "#555",
  },
});

export default DetailScreen;
