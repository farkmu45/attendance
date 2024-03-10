import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const DetailScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail Page</Text>
      <Text style={styles.idText}>ID: {id}</Text>
      {/* Add more details or components as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  idText: {
    fontSize: 18,
    marginBottom: 8,
  },
  // Add more styles as needed
});

export default DetailScreen;
