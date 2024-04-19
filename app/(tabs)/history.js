import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

const attendanceHistory = [
  { id: '1', date: '2022-02-25', time: '09:00 AM', desc: 'Attended the meeting', attended: true },
  { id: '2', date: '2022-02-26', time: '09:30 AM', desc: 'Missed the meeting', attended: false },
];

const HistoryScreen = () => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)} style={[styles.card, { backgroundColor: item.attended ? '#d4edda' : '#f8d7da' }]}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name={item.attended ? "check-circle" : "times-circle"} size={24} color={item.attended ? "#28a745" : "#dc3545"} style={styles.icon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.date}>Date: {item.date}</Text>
        <Text style={styles.time}>Time: {item.time}</Text>
        <Text style={styles.desc}>Description: {item.desc}</Text>
      </View>
    </TouchableOpacity>
  );

  const handlePress = (id) => {
    router.push(`/history/${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance History</Text>
      <FlatList
        data={attendanceHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    height: 120, // Set a fixed height for the card
  },
  iconContainer: {
    marginRight: 20,
  },
  icon: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    fontSize: 16,
  },
});

export default HistoryScreen;
