import React, { useState, useEffect } from "react";
import {View, Text,SafeAreaView, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert, Modal, Button} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toogle from "../../component/Toogle";
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const SetAlarmScreen = ({navigation}) => {
    const [isOn, setIsOn] = useState(false);
    const [alarms, setAlarms] = useState([]);
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());

    const handleToggle = () => {
        // 알림 설정 버튼 on/off
        setIsOn(previousState => !previousState);

    }

    const fetchAlarms = async () => {
        if (!apiBaseUrl) return; // API URL이 없으면 요청하지 않음
    
        try {
          const response = await axios.get(`${apiBaseUrl}/user/alarm`);
          if (response.status === 200) {
            setAlarms(response.data.times);
          } else {
            Alert.alert('알람 목록 가져오기 실패', '알람 목록 가져오는 중 문제가 발생했습니다.');
          }
        } catch (error) {
          Alert.alert('알람 목록 가져오기 실패', '알람 목록 가져오는 중 문제가 발생했습니다.');
        }
      };
    
      useEffect(() => {
        const getApiBaseUrl = async () => {
          try {
            const url = await AsyncStorage.getItem('API_BASE_URL');
            if (url) {
              setApiBaseUrl(url);
            } else {
              Alert.alert('API URL 없음', 'API base URL이 설정되지 않았습니다.');
            }
          } catch (e) {
            console.error('Failed to load API base URL:', e);
          }
        };
        
        getApiBaseUrl();
      }, []);
    
      useEffect(() => {
        if (apiBaseUrl) {
          fetchAlarms();
        }
      }, [apiBaseUrl]);

      const handleTimeConfirm = (time) => {
        const currentTime = time || selectedTime;
        currentTime.setSeconds(0);
        setSelectedTime(currentTime);
        handleAdd(currentTime);
        setDatePickerVisibility(false);
      };

      const handleAdd = async (time) => {
        //알람 추가
        const timeString = time.toTimeString().split(' ')[0];
        const data = {
            time:timeString,
        };

        try {
            const response = await axios.post(`${apiBaseUrl}/user/alarm/add`, JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                await fetchAlarms(); 
            } else {
                Alert.alert('알람 추가 실패', response.data.message || '알람 추가 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                Alert.alert('알람 추가 실패', error.response.data.message || '알람 추가 중 오류가 발생했습니다.');
            } else if (error.request) {
                Alert.alert('알람 추가 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                Alert.alert('알람 추가 실패', '네트워크 오류가 발생했습니다.');
            }
        }
      };

      const handleDelete = async (index) => {
        //알람 삭제
        const alarmToDelete = alarms[index];
        const timeString = parseAlarmTime(alarmToDelete);
        const data = {
            time:timeString,
        };

        try {
            const response = await axios.delete(`${apiBaseUrl}/user/alarm/delete`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data)
            });

            if (response.status === 200) {
                await fetchAlarms(); 
                Alert.alert('알람 삭제 성공', '알람이 삭제되었습니다.')
            } else {
                Alert.alert('알람 삭제 실패', response.data.message || '알람 삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                Alert.alert('알람 삭제 실패', error.response.data.message || '알람 삭제 중 오류가 발생했습니다.');
            } else if (error.request) {
                Alert.alert('알람 삭제 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                Alert.alert('알람 삭제 실패', '네트워크 오류가 발생했습니다.');
            }
        }
        
      };

      const parseAlarmTime = (timeString) => {
        const period = timeString.includes('오후') ? 'PM' : 'AM';
        const time = timeString.replace(/(오전|오후)\s?/, '');
        
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0; // 오전 12시의 경우 00시로 변환
        }
        
        // 초를 00으로 설정
        const seconds = '00';
    
        // 시, 분, 초를 두 자리 숫자로 포맷
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${seconds}`;
        
        };

      const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
          <View style={styles.itemContent}>
            <Text style={styles.itemTime}>{item}</Text>
          </View>
            <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
        </View>
      );

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10,}} onPress={() => navigation.navigate('Setting')} />
                <Text style={{ fontSize: 20, fontWeight: 700, width: '80%', textAlign: 'center' }}>알림 설정</Text>
            </View>
            <View style={styles.settingalarm}>
                <View style={styles.setting1_box}>
                    <View style={styles.setting1}>
                        <Text style={styles.settingcontent}>알림 설정</Text>
                    </View>
                    <Toogle onToggle={handleToggle} isOn={isOn} />
                </View>
                <View>
                    <Text style={styles.alarmdetail}>알림을 설정하면 챗봇이 주기적으로 대화를 신청합니다.</Text>
                </View>
            </View>
            <View style={styles.setting}>
                <Text style={styles.settingcontent}>알림 시간</Text>
                <AntDesign name='plus' size={25} style={{ marginHorizontal: 10, color:'#7C95EF'}} onPress={() => setDatePickerVisibility(true)} />
            </View>
            <FlatList
                data={alarms}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                display="spinner"
                textColor="black" 
                value={selectedTime}
                onConfirm={handleTimeConfirm}
                onCancel={() => setDatePickerVisibility(false)}
                confirmTextIOS="추가"
                cancelTextIOS="취소"
                confirmTextStyle={styles.buttonText}
                cancelTextStyle={styles.buttonText}
            />
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        height: 50,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor:"#E0E0E0",
        overflow: "hidden",
    },
    settingalarm: {
        borderBottomColor: '#B6B6B6',
        borderBottomWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    setting1_box: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    setting: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 20,
    },
    setting1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingcontent: {
        fontSize: 18,
        marginLeft: 10,
    },
    alarmdetail: {
        fontSize: 15,
        marginLeft: 10,
        marginTop: 10,
        color: '#828282',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      },
      itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal:10,
        marginVertical:10,
      },
      itemTime: {
        fontSize: 32,
        marginRight: 10,
      },
      deleteButton: {
        marginHorizontal: 5,
        padding: 5,
      },
      deleteButtonText: {
        color:'#7C95EF',
        fontSize:20,
      },
      buttonText: {
        color: '#007AFF', // 버튼 텍스트 색상 (iOS)
        fontSize: 20,
      },




});

export default SetAlarmScreen;