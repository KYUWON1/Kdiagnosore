import { Platform, ToastAndroid } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 푸시 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const initializePushNotifications = async () => {
  // 푸시 알림 등록
  const token = await registerForPushNotificationsAsync();
  if (token) {
    console.log('Token:', token);
    await sendPushTokenToServer(token);
  }

  // 푸시 알림 수신 리스너 설정
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification Received:', notification);
  });

  // 푸시 알림 반응 리스너 설정
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification Response:', response);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      ToastAndroid.show('Failed to get push token for push notification!', ToastAndroid.LONG);
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

// 백엔드로 푸시 토큰 전송
const sendPushTokenToServer = async (token) => {
  try {
    const apiBaseUrl = await AsyncStorage.getItem('API_BASE_URL');
    const response = await axios.post(`${apiBaseUrl}/api/notifications/send`, {
      token: token,
      title: 'Test Notification',
      message: '테스트입니다!',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Notification Response:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
