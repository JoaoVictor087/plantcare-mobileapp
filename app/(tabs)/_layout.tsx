import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Header from '../../components/header';
import { useTheme } from '../../context/ThemeContext';
import { getAccessToken } from '../../utils/AuthStorageUtils';

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    (async () => {
      const token = await getAccessToken();
      if (!alive) return;
      if (!token) {
        router.replace('/(auth)/login');
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my_plants"
          options={{
            title: 'Minhas Plantas',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="eco" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cuidados-apex"
          options={{
            title: 'Cuidados APEX',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="local-drink" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="options"
          options={{
            title: 'Configurações',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="account-circle" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
