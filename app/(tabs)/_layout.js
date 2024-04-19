import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name='home' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name='history' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name='user-circle' color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
