import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Image, View, Text, TextInput, Alert } from 'react-native';
import Checkbox from "expo-checkbox";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [ID, setID] = useState("");
    const [Password, setPassword] = useState("");
    const [isLoginChecked, setIsLoginChecked] = useState(false);
    const [apiBaseUrl, setApiBaseUrl] = useState("");

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
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setID("");
            setPassword("");
        });

        return unsubscribe;
    }, [navigation]);

    const handleLogin = async () => {
        const data = {
            userId: ID,
            password: Password
        };

        try {
            const response = await axios.post(`${apiBaseUrl}/login`, JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const token = response.headers.authorization; // 서버로부터 토큰을 받아옵니다.
                axios.defaults.headers.common['Authorization'] = token;
                await AsyncStorage.setItem('userID', ID);
                navigation.navigate('App');
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
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ marginTop: 100, fontSize: 15, color: '#828282' }}>인지기능 훈련 챗봇</Text>
            <Text style={{ justifyContent: 'center', fontSize: 30, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
            <Image source={require('../assets/image/Logo.png')} style={{ width: 80, height: 80, marginVertical: 30 }} />
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
