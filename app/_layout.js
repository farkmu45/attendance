import { Stack } from 'expo-router/stack'

export default function Layout() {
  return (
    <Stack

    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false, title:'Home' }} />
      <Stack.Screen name='history/[id]' options={{ headerTitle:"Detail Attend"}} />
      <Stack.Screen name='login' options={{ headerShown: false }} />
      <Stack.Screen name='CameraScreen' options={{ headerShown: false }} />
    </Stack>
  )
}
