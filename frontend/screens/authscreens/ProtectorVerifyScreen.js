import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProtectorVerifyScreen = ({ route, navigation }) => {
    const [UserFound, setUserFound] = useState(false);
    const [WardName, setWardName] = useState("");
    const [WardNum, setWardNum] = useState("");
    const [VerifyNum, setVerifyNum] = useState("");
    const [receivedCertNum, setReceivedCertNum] = useState("");
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

    const verifyCode = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/sms/verify`, {
                phoneNumber:WardNum,
                certNum: VerifyNum,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 && response.data.certificateResponse === 'OK') {
                Alert.alert('인증 성공', '전화번호 인증이 성공적으로 완료되었습니다.');
                navigation.navigate('ProtectorForm', { WardName, WardNum });
            } else {
                Alert.alert('인증 실패', '인증번호가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            Alert.alert('인증 실패', error.response?.data?.message || '서버에서 응답을 받지 못했습니다.');
        }
    };

    const handleUserVefiry = async () => {

        const data = {
            userName: WardName,
            phoneNumber: WardNum
        };

        try {
            const response = await axios.get(`${apiBaseUrl}/api/v1/join/check-user?userName=${WardName}&phoneNumber=${WardNum}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setUserFound(true);
                sendSMS();         
            }else {
                Alert.alert('사용자 확인 실패', response.data.message || '사용자 확인 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                Alert.alert('사용자 확인 실패', error.response.data.message || '사용자 확인 오류가 발생했습니다.');
            } else if (error.request) {
                Alert.alert('사용자 확인 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                Alert.alert('사용자 확인 실패', '네트워크 오류가 발생했습니다.');
            }
        }
    };

    const sendSMS = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/sms/send`, {
                phoneNumber: WardNum,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setReceivedCertNum(response.data.certNumber);
                Alert.alert('인증번호 발송', '인증번호가 발송되었습니다.');
            } else {
                Alert.alert('인증번호 발송 실패', response.data.message || '인증번호 발송 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                Alert.alert('인증번호 발송 실패', error.response.data.message || '인증번호 발송 중 오류가 발생했습니다.');
            } else if (error.request) {
                Alert.alert('인증번호 발송 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                Alert.alert('인증번호 발송 실패', '네트워크 오류가 발생했습니다.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('Register')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>회원가입</Text>
            </View>
            <View style={styles.title}>
                <Text style={styles.maintitle}>사용자 전화번호 인증</Text>
                <Text style={styles.subtitle}>보호자 서비스 이용을 위해 현재 서비스를 이용 중인 사용자(피보호자)의 번호 인증을 해주세요.</Text>
            </View>
            <View>
                {UserFound?(
                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <Text style={styles.label}>인증번호</Text>
                        <TextInput
                            style={styles.input}
                            value={VerifyNum}
                            onChangeText={setVerifyNum}
                            keyboardType="number-pad"
                        />
                        <TouchableOpacity style={styles.button} onPress={verifyCode}>
                            <Text style={{ fontSize: 20, color: '#fff', fontWeight:'600' }}>다음 단계</Text>
                        </TouchableOpacity>
                    </View>
                ):(
                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <Text style={styles.label}>이름</Text>
                            <TextInput
                                style={styles.input}
                                value={WardName}
                                onChangeText={setWardName}
                        />
                        <Text style={styles.label}>휴대전화 번호</Text>
                            <TextInput
                                style={styles.input}
                                value={WardNum}
                                placeholder='-없이 번호 입력'
                                placeholderTextColor="#A9A9A9"
                                onChangeText={setWardNum}
                                keyboardType="number-pad"/>
                        <TouchableOpacity style={styles.button} onPress={handleUserVefiry}>
                            <Text style={{ fontSize: 20, color: '#fff', fontWeight:'600' }}>인증번호 발송</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    title: {
        marginTop: 20,
        alignItems: 'center',
    },
    maintitle: {
        width: '90%',
        fontSize: 30,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        width: '90%',
    },
    label: {
        width: '90%',
        marginLeft: 10,
        marginTop: 20,
        fontSize: 18,
        fontWeight:'500',
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
    button: {
        marginVertical: 50,
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0C9C57',
        borderRadius: 10,
    },

});

export default ProtectorVerifyScreen;