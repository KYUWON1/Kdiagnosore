import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import axios from 'axios';

import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

function App() {
  const[isLoading, setIsLoading]=useState(true);
  const[isReady, setIsReady]=useState(""); /*로그인 대기설정*/
  const [isLoggedIn, setIsLoggedIn] = useState(false); /*로그인 여부*/
  const [message, setMessage] = useState("");
  //axios.get('http://192.168.12.202:8081/api/test') expo 버전 : 본인 expo 주소로 바꿔서 실행
  //axios.get('http://10.0.2.2:8080/api/test')  안드로이드 버전
  useEffect(() => {
    setTimeout(() => {setIsLoading(false)}, 3000);
    axios.get('http://192.168.12.202:8081/api/test')
      .then((response) => {
        setMessage(response.data);
        console.log(message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  return (
    <NavigationContainer>
      {isLoading ? <SplashScreen/> :
      <AppNavigator/>
      }     
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default App;