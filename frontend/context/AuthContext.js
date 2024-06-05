import AsyncStorage from "@react-native-async-storage/async-storage";
import React,{createContext,useState, useEffect} from "react";
import {Alert } from 'react-native';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);  
    const register = () => {
        //회원가입 인증 구현
    } 
    const login = async(username, password) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        try {
            //axios.get('http://192.168.12.202:8081/api/test') expo 버전 : 본인 expo 주소로 바꿔서 실행
            //axios.get('http://10.0.2.2:8080/api/test')  안드로이드 버전
            const response = await axios.post('http://10.0.2.2:8080/login', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
            });

            if (response.status === 200) {
                const token = response.headers.authorization; // 서버로부터 토큰을 받아옵니다.
                Alert.alert('로그인 성공', '로그인이 성공적으로 완료되었습니다.');
                console.log(token);
                setUserToken(token);
                axios.defaults.headers.common['Authorization'] = token;
                const response1 = await axios.get('http://192.168.13.93:8080/user/profile', token, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if(response1.status === 200){
                    setUserInfo(response1.data);
                    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                    AsyncStorage.setItem('userToken', token);
                }
            } else {
                Alert.alert('로그인 실패', response.data.message || '로그인 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                // 서버에서 응답을 받았지만 상태 코드는 2xx 범위를 벗어났습니다.
                Alert.alert('로그인 실패', error.response.data.message || '로그인 중 오류가 발생했습니다.');
            } else if (error.request) {
                 // 요청이 만들어졌지만 응답을 받지 못했습니다.
                Alert.alert('로그인 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                // 다른 에러
                Alert.alert('로그인 실패', '네트워크 오류가 발생했습니다.');
            }
        }
        setIsLoading(false);
    }
    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        console.log(userToken);
        setIsLoading(false);
    }
    const isLoggedIn = async() => {
        try{
            setIsLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userToken = await AsyncStorage.getItem('userToken');
            userInfo = JSON.parse(userInfo);

            if(userInfo){
                setUserToken(userToken);
                setUserInfo(userInfo);
                console.log(userToken);
            }
            setIsLoading(false);
        
        }catch(e) {
            console.error('Error LoggedIn:', e);
        }
    }
    useEffect(() => {
        isLoggedIn();
    }, []);

    return(
        <AuthContext.Provider value={{login, logout, isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    )
}