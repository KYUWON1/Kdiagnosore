import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/authscreens/SplashScreen';
import AuthNavigator from './navigation/AuthNavigator';
import UserNavigator from './navigation/UserNavigator';
import ProtectorNavigator from './navigation/ProtectorNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializePushNotifications } from './services/notificationService';

const Stack = createStackNavigator();
const URL = 'http://172.30.1.24:8080';
// 10.0.2.2:8080

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await AsyncStorage.setItem('API_BASE_URL', URL);
//        initializePushNotifications();
        setTimeout(() => setIsLoading(false), 3000);
      } catch (e) {
        console.error('Failed to initialize app:', e);
      }
    };
    initialize();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthNavigator}/>
            <Stack.Screen name="UserNavigator" component={UserNavigator} />
            <Stack.Screen name="ProtectorNavigator" component={ProtectorNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
