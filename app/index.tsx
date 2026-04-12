import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getAccessToken } from '../utils/AuthStorageUtils';
import { useTheme } from '../context/ThemeContext';

export default function Index() {
  const router = useRouter();
  const { colors, hydrated } = useTheme();

  useEffect(() => {
    if (!hydrated) return;

    let alive = true;
    (async () => {
      const token = await getAccessToken();
      if (!alive) return;
      if (token) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    })();

    return () => {
      alive = false;
    };
  }, [hydrated, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
