import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const URL = 'http://10.0.2.2:8080';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await AsyncStorage.setItem('API_BASE_URL', URL);
        setTimeout(() => { setIsLoading(false); }, 3000);
      } catch (e) {
        console.error('Failed to set API base URL:', e);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default App;
