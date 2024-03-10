import { Link } from 'expo-router'
import { Button, Text, View } from 'react-native'

export default function Page() {
  return (
    <View>
      <Text>History Page</Text>
      <Link href={{ pathname: '/history/[id]', params: { id: 2 } }} asChild>
        <Button title='Go to detail' />
      </Link>
    </View>
  )
}
