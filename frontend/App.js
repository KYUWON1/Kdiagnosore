import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './screens/SplashScreen';
import AppNavigator from './navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializePushNotifications } from './services/notificationService';

const URL = 'http://10.0.2.2:8080';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await AsyncStorage.setItem('API_BASE_URL', URL);

        initializePushNotifications();
        setTimeout(() => setIsLoading(false), 3000);
      } catch (e) { 
        console.error('Failed to initialize app:', e);
      }
    };

    initialize();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? <SplashScreen /> : <AppNavigator />}
    </NavigationContainer>
  );
}

export default App;
