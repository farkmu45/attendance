import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

export default function Page() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTokenFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@userToken');
        setToken(storedToken);
        setLoading(false); 
      } catch (error) {
        console.error('Error getting token from storage:', error);
        setLoading(false); 
      }
    };

    getTokenFromStorage();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return token ? <Redirect href='(tabs)' /> : <Redirect href='login' />;
}

const LoadingIndicator = () => {
  return <Text>Loading...</Text>;
};
