import { Stack } from 'expo-router';
import { View } from 'react-native';
import Header from '../../components/header';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
