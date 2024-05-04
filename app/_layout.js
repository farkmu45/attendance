import { Stack } from 'expo-router/stack'
import { RootSiblingParent } from 'react-native-root-siblings';

export default function Layout() {
  return (
    <RootSiblingParent>
    <Stack
    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false, title:'Home' }} />
      <Stack.Screen name='history/[id]' options={{ headerTitle:"Detail Attend"}} />
      <Stack.Screen name='login' options={{ headerShown: false }} />
      <Stack.Screen name='CameraScreen' options={{ headerShown: false }} />
    </Stack>
    </RootSiblingParent>
  )
}
