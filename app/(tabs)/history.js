import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { endpoint } from '../api/endpoint'
import { parseISO, format } from 'date-fns'

const HistoryScreen = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [authToken, setAuthToken] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const getTokenFromAsyncStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('@userToken')
        if (token !== null) {
          setAuthToken(token)
        } else {
          console.log('Token not found in AsyncStorage')
        }
      } catch (error) {
        console.error('Error retrieving token from AsyncStorage:', error)
      } finally {
        setLoading(false)
      }
    }

    getTokenFromAsyncStorage()
  
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(endpoint.Attend, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setAttendanceHistory(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (authToken) {
      fetchData()
    }
  }, [authToken])

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const renderItem = ({ item }) => {
    const attendedIn = item.type === 'IN'


    let icon
    if (attendedIn) {
      icon = (
        <Image
          source={require('.././../assets/attend.png')}
          style={[styles.icon, { tintColor: 'green' }]}
        />
      )
    } else {
      icon = (
        <Image
          source={require('.././../assets/attend.png')}
          style={[styles.icon, { tintColor: 'green' }]}
        /> 
      )
    }

    const date = parseISO(item.time)
    const formattedDate = format(date, 'yyyy-MM-dd') 
    const formattedTime = format(date, 'HH:mm')

    return (
      <Link
        style={styles.card}
        href={{
          pathname: '/history/[id]',
          params: {
            id: item.id,
          },
        }}
        asChild
      >
        <Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={styles.iconContainer}>{icon}</View>
            <View style={styles.textContainer}>
              <Text style={styles.date}>{formattedDate}</Text>
              {/* <Text
                style={{
                  ...styles.type,
                  borderColor: item.is_deviate
                    ? 'rgba(54, 255, 31, 1)'
                    : 'rgba(255, 231, 27, 1)',
                  backgroundColor: item.is_deviate
                    ? 'rgba(184, 255, 175, 1)'
                    : 'rgba(255, 245, 155, 1)', 
                  color: 'black',
                }}
              >
                {item.is_deviate ? 'ON TIME' : 'LATE'}
              </Text> */}
            </View>
            <Text style={styles.time}>{formattedTime}</Text>
          </View>
        </Pressable>
      </Link>
    )
  }

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
              colors={['#007bff']}
              tintColor='#007bff'
            />
          }
        />
      )}
    </View>
  )
}

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
    color: '#007bff',
    textAlign: 'center',
    paddingVertical: 20,
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 3,
    borderRadius: 8,
    height: 90,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: 'rgba(227, 227, 227, 1)',
    borderWidth: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  icon: {
    marginRight: 2,
    width: 30,
    height: 30,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  date: {
    fontSize: 15,
    color: 'rgba(60, 60, 60, 1)',
    fontWeight:'bold'
  },
  time: {
    fontSize: 22,
    fontWeight: '600',
    color: 'rgba(60, 60, 60, 1)',
  },
  type: {
    fontSize: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderWidth: 1,
    borderRadius: 50,
    fontWeight: 500,
    alignSelf: 'flex-start',
    color: 'rgba(60, 60, 60, 1)',
  },
  desc: {
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 10,
  },
})

export default HistoryScreen
