import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { endpoint } from "../api/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialIcons, FontAwesome5, Fontisto } from "@expo/vector-icons";

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
      {icon && (
        <MaterialIcons
          name={icon}
          size={24}
          color="#3498db"
          style={styles.icon}
        />
      )}
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toDateString()} ${date.toLocaleTimeString()}`;
  };
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  const renderDetailItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.headerText}>Attendance Detail</Text>
      <View style={styles.detailItem}>
        <FontAwesome5 name="clock" size={23} color="#555" style={styles.icon} />
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>Time :</Text>
          <Text style={styles.detailValue}>{item.time.substring(11, 16)}</Text>
        </View>
      </View>
      <View style={styles.detailItem}>
        <Fontisto
          name="date"
          size={25}
          color="#555"
          style={styles.icon}
        />
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>Date :</Text>
          <Text style={styles.detailValue}>{formatDate(item.time)}</Text>
        </View>
      </View>
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
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 16,
    textAlign: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 10,
    alignSelf: "flex-start",
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 4,
    color: "#333",
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 16,
    color: "#555",
    flexShrink: 1,
  },
});

export default DetailScreen;
