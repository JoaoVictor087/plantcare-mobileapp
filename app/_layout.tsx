import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { AppProviders } from '../providers/AppProviders';
import { solicitarPermissaoNotificacao } from '../services/notificationService';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();

      solicitarPermissaoNotificacao();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}