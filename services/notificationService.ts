import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function solicitarPermissaoNotificacao(): Promise<boolean> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('plantcare', {
      name: 'PlantCare',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function agendarLembreteRega(
  plantaId: number,
  plantaNome: string,
  segundos = 86400
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌿 Hora de regar!',
      body: `Sua planta "${plantaNome}" precisa de água.`,
      data: { plantaId },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: segundos,
      repeats: true,
    },
  });
  return id;
}

export async function notificacaoImediata(
  plantaId: number,
  plantaNome: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌿 Hora de regar!',
      body: `Sua planta "${plantaNome}" precisa de água.`,
      data: { plantaId },
      sound: true,
    },
    trigger: null,
  });
}

export async function cancelarTodasNotificacoes(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}