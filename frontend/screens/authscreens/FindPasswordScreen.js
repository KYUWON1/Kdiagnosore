import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, TextInput, SafeAreaView, StyleSheet, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FindPasswordScreen = ({ navigation }) => {
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [apiBaseUrl, setApiBaseUrl] = useState('');

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

    const passwordreset = async () => {
        if (Password !== ConfirmPassword) {
            Alert.alert('오류', '비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/user/password/reset`, {
                password: Password,
                passwordCheck: ConfirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                Alert.alert('성공', '비밀번호가 성공적으로 변경되었습니다.');
                navigation.navigate('Login');
            } else {
                Alert.alert('오류', response.data.message || '비밀번호 변경 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                // 서버에서 응답을 받았지만 상태 코드는 2xx 범위를 벗어났습니다.
                Alert.alert('오류', error.response.data.message || '비밀번호 변경 중 오류가 발생했습니다.');
            } else if (error.request) {
                // 요청이 만들어졌지만 응답을 받지 못했습니다.
                Alert.alert('오류', '서버에서 응답을 받지 못했습니다.');
            } else {
                // 다른 에러
                Alert.alert('오류', '네트워크 오류가 발생했습니다.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('FindPasswordVerify')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>비밀번호 찾기</Text>
            </View>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={styles.label}>새 비밀번호</Text>
                <TextInput
                    style={styles.input}
                    value={Password}
                    placeholder='대소문자, 특수문자, 숫자~~'
                    placeholderTextColor="#A9A9A9"
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Text style={styles.label}>새 비밀번호 확인</Text>
                <TextInput
                    style={styles.input}
                    value={ConfirmPassword}
                    placeholder='대소문자, 특수문자, 숫자~~'
                    placeholderTextColor="#A9A9A9"
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={passwordreset}>
                    <Text style={{ fontSize: 20, color: '#fff', fontWeight:'600' }}>비밀번호 변경</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor: "#E0E0E0",
        overflow: "hidden",
    },
    label: {
        width: '90%',
        marginTop: 20,
        marginLeft: 10,
        fontSize: 18,
        fontWeight:'500',
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
        marginVertical: 30,
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0C9C57',
        borderRadius: 10,
    }
});

export default FindPasswordScreen;
