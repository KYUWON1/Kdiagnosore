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
            <View style={styles.upperHalf}>
                <Image source={require('../../assets/image/Logo.png')} style={styles.logo} />
                <Text style={styles.title}>인지기능 훈련 챗봇</Text>
                <Text style={styles.subtitle}>Remember Me</Text>
            </View>
            <View style={styles.loginBox}>
                <TextInput
                    style={styles.input}
                    value={ID}
                    placeholder='아이디'
                    placeholderTextColor="#A9A9A9"
                    onChangeText={setID}
                />
                <TextInput
                    style={styles.input}
                    value={Password}
                    placeholder='비밀번호'
                    placeholderTextColor="#A9A9A9"
                    secureTextEntry
                    onChangeText={setPassword}
                />
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        value={isLoginChecked}
                        onValueChange={setIsLoginChecked}
                        style={styles.checkbox}
                        color={isLoginChecked ? '#27A96C' : undefined}
                    />
                    <Text style={styles.checkboxText}>로그인 상태 유지</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => handleLogin(ID,Password,isLoginChecked)}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <View style={styles.linksContainer}>
                    <TouchableOpacity>
                        <Text onPress={() => navigation.navigate('FindIdVerify')} style={styles.linkText}>아이디 찾기</Text>
                    </TouchableOpacity>
                    <Text style={styles.separator}>|</Text>
                    <TouchableOpacity>
                        <Text onPress={() => navigation.navigate('FindPasswordVerify')} style={styles.linkText}>비밀번호 찾기</Text>
                    </TouchableOpacity>
                    <Text style={styles.separator}>|</Text>
                    <TouchableOpacity>
                        <Text onPress={() => navigation.navigate('Register')} style={styles.linkText}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    upperHalf: {
        alignItems: 'center',
        //justifyContent: 'center',
        width: '100%',
        height: '50%',
        backgroundColor: '#27A96C',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
        top:'25%',
        tintColor:'#fff',
    },
    title: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 5,
        fontWeight:'600',
        top:'26%',
    },
    subtitle: {
        fontSize: 30,
        fontWeight: '700',
        fontStyle: 'italic',
        color: '#fff',
        top:'27%',
    },
    loginBox: {
        paddingVertical:30,
        position: 'absolute',
        top: '42%',
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        width: '100%',
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    checkbox: {
        marginRight: 10,
        borderColor: 'gray',
    },
    checkboxText: {
        fontSize: 17,
        color: '#828282',
    },
    button: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0C9C57',
        borderRadius: 10,
        marginVertical: 15,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight:'600',
    },
    linksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 17,
        color: '#828282',
    },
    separator: {
        fontSize: 17,
        color: '#828282',
        marginHorizontal: 10,
    }
});

export default LoginScreen;