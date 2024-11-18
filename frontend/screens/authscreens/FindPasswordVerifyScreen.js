import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, TextInput, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FindPasswordVerifyScreen = ({ navigation }) => {
    const [UserId, setUserId] = useState("");
    const [PhoneNum, setPhoneNum] = useState("");
    const [VerifyNum, setVerifyNum] = useState("");
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

    const passwordrequest = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/user/password/request`, {
                userId: UserId,
                phoneNumber: PhoneNum
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                Alert.alert('인증번호 발송', '인증번호가 발송되었습니다.');
            } else {
                Alert.alert('인증번호 발송 실패', response.data.message || '인증번호 발송 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                Alert.alert('인증번호 발송 실패', error.response.data.message || '인증번호 발송 중 오류가 발생했습니다.');
            } else {
                Alert.alert('인증번호 발송 실패', '서버에서 응답을 받지 못했습니다.');
            }
        }
    };

    const passwordverify = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/user/password/verify`, {
                certNum: VerifyNum
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            

            if (response.status === 200 && response.data.certificateResponse === 'OK') {
                navigation.navigate('FindPassword');
            } else {
                Alert.alert('인증 실패', '인증번호가 올바르지 않습니다.');
            }
        } catch (error) {
            if (error.response) {
                Alert.alert('인증 실패', error.response.data.message || '인증 중 오류가 발생했습니다.');
            } else {
                Alert.alert('인증 실패', '서버에서 응답을 받지 못했습니다.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('Login')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>비밀번호 찾기</Text>
            </View>
            <KeyboardAwareScrollView style={{ marginTop: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.label}>아이디</Text>
                    <TextInput
                        style={styles.input}
                        value={UserId}
                        onChangeText={setUserId}
                    />
                    <Text style={styles.label}>휴대전화 번호</Text>
                    <View style={styles.fixlabel}>
                        <TextInput
                            style={styles.input1}
                            value={PhoneNum}
                            placeholder='-없이 번호 입력'
                            placeholderTextColor="#A9A9A9"
                            onChangeText={setPhoneNum}
                            keyboardType="number-pad"
                        />
                        <TouchableOpacity style={styles.button1} onPress={passwordrequest}>
                            <Text style={{ fontSize: 20, color: '#0C9C57', fontWeight:'700' }}>인증</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>인증번호</Text>
                    <TextInput
                        style={styles.input}
                        value={VerifyNum}
                        onChangeText={setVerifyNum}
                        keyboardType="number-pad"
                    />
                    <TouchableOpacity style={styles.button} onPress={passwordverify}>
                        <Text style={{ fontSize: 20, color: '#fff', fontWeight:'600' }}>다음 단계</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
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
        fontWeight:'500'
    },
    fixlabel: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        width: '90%'
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
    input1: {
        width: '70%',
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
    },
    button1: {
        marginVertical: 15,
        width: 80,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:2,
        borderColor:'#0C9C57',
        borderRadius: 10,
    },
});

export default FindPasswordVerifyScreen;
