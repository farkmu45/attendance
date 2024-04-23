import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { endpoint } from "../api/endpoint"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const HistoryScreen = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => { 
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

    getTokenFromAsyncStorage();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint.Attend, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        // console.log(response.data.data);
        setAttendanceHistory(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    const attended = item.type === "IN" && item.is_deviate === 0;
    const typeText = item.type === "IN" ? "In" : "Out";

    return (
      <Link
        href={{
          pathname: "/history/[id]",
          params: {
            id: item.id, 
          },
        }}
        style={[
          styles.card,
          { backgroundColor: attended ? "#d4edda" : "#f8d7da" },
        ]}
      >
        <View style={styles.iconContainer}>
          {attended ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={24}
              color="#28a745"
              style={styles.icon}
            />
          ) : (
            <MaterialCommunityIcons
              name="cancel"
              size={24}
              color="#dc3545"
              style={styles.icon}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.date}>Date: {item.time.substring(0, 10)}</Text>
          <Text style={styles.time}>Time: {item.time.substring(11, 16)}</Text>
          <Text style={styles.type}>Type: {typeText}</Text>
          <Text style={styles.desc}>
            {attended ? "Attended" : "Missed"} the {typeText.toUpperCase()}{" "}
            class
          </Text>
        </View>
      </Link>
    );
  };

  const handlePress = (id) => {
    // Handle navigation or any other action when a card is pressed
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={attendanceHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#007bff",
    textAlign: "center",
    paddingVertical: 20,
  },

  card: {
    flexDirection: "row",
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    height: 120,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  icon: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  date: {
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 16,
  },
});

export default HistoryScreen;
