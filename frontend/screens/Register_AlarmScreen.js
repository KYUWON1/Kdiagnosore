import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register_AlarmScreen = ({route,navigation}) => {
    const [UserID, setUserID]=useState("");
    const [UserTime, setUserTime] = useState(new Date(new Date().setHours(12, 0, 0, 0))); //12 pm으로 기본 시간 설정
    const [showPicker, setShowPicker] = useState(false);
    const [apiBaseUrl, setApiBaseUrl] = useState('');

    const handleRegister = async () => {
        const timeString = UserTime.toTimeString().split(' ')[0];
        const data = {
            userId: UserID,
            time:timeString,
        };

        try {
            const response = await axios.post(`${apiBaseUrl}/join/setalarm`, JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                Alert.alert('알람 설정', '알람이 설정되었습니다.');
                //푸시 알림

                navigation.navigate('Login');
            } else {
                Alert.alert('알람 설정 실패', response.data.message || '알람 설정 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                Alert.alert('알람 설정 실패', error.response.data.message || '알람 설정 중 오류가 발생했습니다.');
            } else if (error.request) {
                Alert.alert('알람 설정 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                Alert.alert('알람 설정 실패', '네트워크 오류가 발생했습니다.');
            }
        }
    };

    const setAlarmTime = (event, selectedTime) => {
        const currentTime = selectedTime || UserTime;
        currentTime.setSeconds(0);
        setUserTime(currentTime);
    
        // Android에서는 시간을 선택할 때마다 Picker를 닫지 않음
        if (Platform.OS === 'android') {
          setShowPicker(false);  // 시간을 설정한 후 Picker를 닫음
        }
      };

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
        const loadUserID = async () => {
            const storedUserId = await AsyncStorage.getItem('R_userID');
            setUserID(storedUserId);
        };
        loadUserID();
        setShowPicker(true);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: 700, width: '100%', textAlign: 'center' }}>회원가입</Text>
            </View>
            <View style={styles.title}>
                <Text style={styles.maintitle}>알람 시간 설정</Text>
                <Text style={styles.subtitle}>챗봇이 대화를 신청할 시간을 설정해 주세요.</Text>
                <Text style={styles.subtitle}>시간을 설정에서 변경 가능합니다.</Text>
            </View>
            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                {showPicker ? (
                        <DateTimePicker
                        value={UserTime}
                        mode="time"
                        display="spinner"
                        is24Hour={false}
                        onChange={setAlarmTime}
                    />
                    ) : (
                        Platform.OS === 'android' && (
                            <View style={styles.alrarmbox}>
                            <Text style={styles.selectedTime}>
                                알림 : {UserTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </Text>
                            <TouchableOpacity style={styles.button1} onPress={() => setShowPicker(true)}>
                                <Text style={styles.selectAlarm}>알람 시간 재설정</Text>
                            </TouchableOpacity>
                        </View>
                        )
                    )}
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={{ fontSize: 20, color: '#fff' }}>완료</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

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
        textAlign:'center',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        width: '90%',
        textAlign:'center',
    },
    label: {
        width: '90%',
        marginLeft: 10,
        marginTop: 20,
        fontSize: 18,
    },
    selectedTime: {
        textAlign:'center',
        fontSize: 24,
        marginTop: 20,
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
    selectAlarm: {
        textAlign:'center',
        fontSize: 20,
        color:"#FFF"
    },
    button1:{
        justifyContent:'center',
        backgroundColor:'#65558F',
        width:180,
        height:50,
        marginVertical: 20,
        paddingHorizontal : 5,
        borderRadius: 10,
    },
    alrarmbox:{
        marginVertical: 20,
        alignItems:'center', 
        justifyContent:'center', 
        borderColor:"#000", 
        borderWidth:1,
        paddingHorizontal:50,
        paddingVertical:5,
        borderRadius:10,
    }

});

export default Register_AlarmScreen;