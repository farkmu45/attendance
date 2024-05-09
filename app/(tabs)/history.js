import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { endpoint } from "../api/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const HistoryScreen = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingData, setisLoadingData] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getTokenFromAsyncStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("@userToken");
        if (token !== null) {
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
      const response = await axios.get(endpoint.Attend, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setAttendanceHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderItem = ({ item }) => {
    const attendedIn = item.type === "IN" && item.is_deviate === 0;
    const attendedOut = item.type === "OUT" && item.is_deviate === 0;
    const deviate = item.is_deviate;
  
    let icon;
    if (attendedIn) {
      icon = (
        <Image
          source={require(".././../assets/attend.png")}
          style={[styles.icon, { tintColor: "#28a745" }]}
        />
      );
    } else if (attendedOut) {
      icon = (
        <Image
          source={require(".././../assets/exit.png")}
          style={[styles.icon, { tintColor: "#dc3545" }]}
        />
      );
    } else {
      icon = (
        <Image
          source={require(".././../assets/office.png")}
          style={[styles.icon, { tintColor: "#FFA000" }]}
        />
      );
    }
  
    return (
      <Pressable
        style={[
          styles.card,
          attendedIn
            ? styles.attendedIn
            : attendedOut
            ? styles.attendedOut
            : styles.deviate,
        ]}
      >
        <Link
          href={{
            pathname: "/history/[id]",
            params: {
              id: item.id,
            },
          }}
          asChild
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={styles.iconContainer}>{icon}</View>
            <View style={styles.textContainer}>
              <Text style={styles.date}>Date: {item.time.substring(0, 10)}</Text>
              <Text style={styles.time}>Time: {item.time.substring(11, 16)}</Text>
              <Text style={styles.type}>
                Type: {item.type === "IN" ? "In" : "Out"}
              </Text>
              <Text style={styles.desc}>
                {attendedIn ? "Attended" : attendedOut ? "Missed" : "Deviated"}{" "}
                the {item.type.toUpperCase()} class
              </Text>
            </View>
          </View>
        </Link>
      </Pressable>
    );
  };
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          data={attendanceHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007bff"]}
              tintColor="#007bff"
            />
          }
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
    marginHorizontal: 3,
    borderRadius: 8,
    elevation: 3,
    height: 120,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  icon: {
    marginRight: 20,
    width: 40,
    height: 40,
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 10,
  },
});

export default HistoryScreen;
