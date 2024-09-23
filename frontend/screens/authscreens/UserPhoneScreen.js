import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPhoneScreen = ({ route, navigation }) => {
    const [PhoneNum, setPhoneNum] = useState("");
    const [VerifyNum, setVerifyNum] = useState("");
    const [receivedCertNum, setReceivedCertNum] = useState("");
    const { UserId, UserName, Email, Password, ConfirmPassword, ProtectorName } = route.params;
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

    const sendSMS = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/check/sendSMS`, {
                phoneNumber: PhoneNum,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                Alert.alert('인증번호 발송 성공', '인증번호가 발송되었습니다.');
                setReceivedCertNum(response.data.certNumber);
            } else {
                Alert.alert('인증번호 발송 실패', response.data.message || '인증번호 발송 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error sending SMS:', error);
            Alert.alert('인증번호 발송 실패', error.response?.data?.message || '서버에서 응답을 받지 못했습니다.');
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/check/verify`, {
                phoneNumber:PhoneNum,
                certNum: VerifyNum,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 && response.data.certificateResponse === 'OK') {
                Alert.alert('인증 성공', '전화번호 인증이 성공적으로 완료되었습니다.');
                navigation.navigate('ProtectorPhone1', { UserId, UserName, Email, Password, ConfirmPassword, ProtectorName, PhoneNum });
            } else {
                Alert.alert('인증 실패', '인증번호가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            Alert.alert('인증 실패', error.response?.data?.message || '서버에서 응답을 받지 못했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('UserForm')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>회원가입</Text>
            </View>
            <View style={styles.title}>
                <Text style={styles.maintitle}>전화번호 인증</Text>
                <Text style={styles.subtitle}>원활한 서비스 이용을 위해 번호 인증을 해주세요.</Text>
            </View>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={styles.label}>휴대전화 번호</Text>
                <View style={styles.fixlabel}>
                    <TextInput
                        style={styles.input1}
                        value={PhoneNum}
                        placeholder='-없이 번호 입력'
                        onChangeText={setPhoneNum}
                        keyboardType="number-pad"
                    />
                    <TouchableOpacity style={styles.button1} onPress={sendSMS}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>인증</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>인증번호</Text>
                <TextInput
                    style={styles.input}
                    value={VerifyNum}
                    onChangeText={setVerifyNum}
                    keyboardType="number-pad"
                />
                <TouchableOpacity style={styles.button} onPress={verifyCode}>
                    <Text style={{ fontSize: 20, color: '#fff' }}>다음 단계</Text>
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
    },
    fixlabel: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        width: '90%',
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
        marginVertical: 50,
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
    },
    button1: {
        marginVertical: 15,
        width: 80,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
    },
});

export default UserPhoneScreen;
