import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {Link} from 'expo-router'
const attendanceHistory = [
  { id: '1', date: '2022-02-25', time: '09:00 AM', desc: 'Attended the meeting' },
];

const HistoryScreen = () => {
  const renderItem = ({ item }) => (
    <Link href={{ pathname: '/history/[id]', params: { id: 2 } }} >
    <View style={styles.item}>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Description: {item.desc}</Text>
    </View>
    </Link>
  );

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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default HistoryScreen;
