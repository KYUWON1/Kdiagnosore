import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import axios from 'axios';

import {NavigationContainer} from '@react-navigation/native';
import LoginStack from './navigation/LoginNavigator';
import AppStack from './navigation/AppNavigator';

function App() {
  const[isLoading, setIsLoading]=useState(true);
  const[isReady, setIsReady]=useState(""); /*로그인 대기설정*/
  const [isLoggedIn, setIsLoggedIn] = useState(false); /*로그인 여부*/
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {setIsLoading(false)}, 3000);
    axios.get('http://10.0.2.2:8080/api/test') //웹 버전
    //axios.get('http://192.168.12.222:8081/api/test') //expo 버전
      .then(response => {
        setMessage(response.data);
        console.log(message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  //로그인 인증 구현 안됨 isLoggedIn ? <AppStack/> : <LoginStack/> 대신 <AppStack/> 또는 <LoginStack/>으로 실행
  return (
    <NavigationContainer>
      {isLoading ? <SplashScreen/> :
      <AppStack/> 
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
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  intro: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;