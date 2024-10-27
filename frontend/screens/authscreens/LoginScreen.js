import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Image, View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import Checkbox from "expo-checkbox";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const LoginScreen = ({ navigation }) => {
    const [ID, setID] = useState("");
    const [Password, setPassword] = useState("");
    const [isLoginChecked, setIsLoginChecked] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState("");
    const [apiBaseUrl, setApiBaseUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const getApiBaseUrl = async () => {
            try {
                const url = await AsyncStorage.getItem('API_BASE_URL');
                if (url) {
                    setApiBaseUrl(url);
                }
            } catch (e) {
                console.error('Failed to load API base URL:', e);
            }
        };

        getApiBaseUrl();
    }, [navigation]);

    useEffect(() => {
        if (apiBaseUrl) { 
            autoLogin(apiBaseUrl);
        }
    }, [apiBaseUrl]);

    const autoLogin = async (url) => {
        try {
            const storedID = await AsyncStorage.getItem('userID');
            const storedChecked = JSON.parse(await AsyncStorage.getItem('isLoginChecked'));
            const storedPassword = await AsyncStorage.getItem('Password');
            
            if (storedChecked && storedID && storedPassword) {
                const success = await handleLogin(storedID, storedPassword, storedChecked, true); // 자동 로그인 시도
                if (success) return; // 성공 시 바로 리턴하여 로그인 화면을 건너뜁니다.
            }
            setIsLoading(false); // 자동 로그인이 실패하면 로딩 종료
        } catch (e) {
            console.error('Failed to load login data:', e);
            setIsLoading(false); // 에러 발생 시 로딩 종료
        }
    };

    const handleLogin = async (userId, password, ischeck, isAutoLogin = false) => {
        try {
            const data = {
                userId: userId,
                password: password,
                pushToken: expoPushToken || ""
            };
            const response = await axios.post(`${apiBaseUrl}/login`, JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const token = response.headers.authorization; 
                axios.defaults.headers.common['Authorization'] = token;
                if(ischeck && !isAutoLogin){
                    await AsyncStorage.setItem('userID', userId);
                    await AsyncStorage.setItem('Password', password); 
                    await AsyncStorage.setItem('isLoginChecked', JSON.stringify(ischeck));
                }
                const authType = response.data.role;
                if (authType === 'user') {
                    navigation.replace('UserNavigator');
                } else if (authType === 'protector') {
                    navigation.replace('ProtectorNavigator');
                }
                return true; // 로그인 성공 시 true 반환
            } else {
                Alert.alert('로그인 실패', response.data.message || '로그인 중 오류가 발생했습니다.');
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response) {
                Alert.alert('로그인 실패', error.response.data.message || '로그인 중 오류가 발생했습니다.');
            } else if (error.request) {
                Alert.alert('로그인 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                Alert.alert('로그인 실패', '네트워크 오류가 발생했습니다.');
            }
            return false;
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#000" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ marginTop: 100, fontSize: 15, color: '#828282' }}>인지기능 훈련 챗봇</Text>
            <Text style={{ justifyContent: 'center', fontSize: 30, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
            <Image source={require('../../assets/image/Logo.png')} style={{ width: 80, height: 80, marginVertical: 30 }} />
            <TextInput
                style={styles.input}
                value={ID}
                placeholder='아이디'
                onChangeText={setID}
            />
            <TextInput
                style={styles.input}
                value={Password}
                placeholder='비밀번호'
                secureTextEntry
                onChangeText={setPassword}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', marginLeft: 5, marginTop: 10 }}>
                <Checkbox
                    value={isLoginChecked}
                    onValueChange={setIsLoginChecked}
                    style={{ marginRight: 10, borderColor: 'gray' }}
                    color={isLoginChecked ? 'black' : undefined}
                />
                <Text style={{ textAlign: 'center', fontSize: 17, color: '#828282' }}>로그인 상태 유지</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleLogin(ID, Password, isLoginChecked)}>
                <Text style={{ fontSize: 20, color: '#fff' }}>로그인</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity>
                    <Text onPress={() => navigation.navigate('FindIdVerify')} style={{ textAlign: 'center', fontSize: 17, color: '#828282' }}>아이디 찾기</Text>
                </TouchableOpacity>
                <Text style={styles.textborder}>|</Text>
                <TouchableOpacity>
                    <Text onPress={() => navigation.navigate('FindPasswordVerify')} style={{ textAlign: 'center', fontSize: 17, color: '#828282' }}>비밀번호 찾기</Text>
                </TouchableOpacity>
                <Text style={styles.textborder}>|</Text>
                <TouchableOpacity>
                    <Text onPress={() => navigation.navigate('Register')} style={{ textAlign: 'center', fontSize: 17, color: '#828282' }}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        fontSize: 18,
    },
    button: {
        marginVertical: 15,
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
    },
    textborder: {
        fontSize: 17,
        color: '#828282',
        marginHorizontal: 10,
    }
});

export default LoginScreen;
