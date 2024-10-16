import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, TextInput, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DiaryScreen = ({ navigation }) => {
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [todayDate, setTodayDate] = useState('');  // 화면에 표시될 날짜
    const [todayDateForServer, setTodayDateForServer] = useState(''); // 서버에 전송할 날짜
    const [diaryText, setDiaryText] = useState('');
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [isExistingDiary, setIsExistingDiary] = useState(false); // 다이어리 존재 여부
    const [originalDiaryText, setOriginalDiaryText] = useState(''); //다이어리 수정 여부

    useEffect(() => {
        const loadUserData = async () => {
            const storedApiBaseUrl = await AsyncStorage.getItem('API_BASE_URL');
            setApiBaseUrl(storedApiBaseUrl);
        };

        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            setTodayDate(`${year}.${month}.${day}`);
            setTodayDateForServer(`${year}-${month}-${day}`);
        };

        loadUserData();
        getCurrentDate();
    }, []);

    // 다이어리 내용 가져오기
    useEffect(() => {
        const fetchDiaryContent = async () => {
            if (!apiBaseUrl || !todayDateForServer) return;
            try {
                const response = await axios.get(`${apiBaseUrl}/diary/${todayDateForServer}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    setDiaryText(response.data.content); // 기존 다이어리 내용 설정
                    setOriginalDiaryText(response.data.content);
                    setIsExistingDiary(true); // 다이어리가 이미 존재함을 설정
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // 다이어리가 없으면 새로운 다이어리 생성 준비
                    setIsExistingDiary(false);
                } else {
//                    console.log("오늘의 다이어리 조회 실패: ", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDiaryContent();
    }, [apiBaseUrl, todayDateForServer]);

    // 다이어리 생성 또는 업데이트
    const saveDiary = async () => {
        if (!diaryText.trim()) {
            return;
        }

        if (diaryText === originalDiaryText) {
            return;
        }

        try {
            if (isExistingDiary) {
                // 다이어리 업데이트
                const response = await axios.patch(
                    `${apiBaseUrl}/diary/${todayDateForServer}`,
                    { content: diaryText },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.status === 200) {
                    Alert.alert("성공", "다이어리가 저장되었습니다.");
                }
            } else {
                // 다이어리 생성
                const response = await axios.post(
                    `${apiBaseUrl}/diary`,
                    { content: diaryText, date: todayDateForServer },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.status === 200) {
                    Alert.alert("성공", "다이어리가 생성되었습니다.");
                }
            }
        } catch (error) {
            Alert.alert("오류", "다이어리 저장에 실패했습니다.");
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단바 */}
            <View style={styles.header}>
                <View style={styles.leftHeader}>
                    <AntDesign
                        name='left'
                        size={25}
                        style={{ marginHorizontal: 10 }}
                        onPress={() => {
                            saveDiary(); // 뒤로가기 버튼 클릭 시 다이어리 저장 또는 업데이트
                            navigation.goBack();
                        }}
                    />
                </View>
                <View style={styles.centerHeader}>
                    <Text style={{ fontSize: 20, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
                </View>
                <View style={styles.rightHeader}>
                    <Text style={{ fontSize: 18, color: '#7C95EF' }} onPress={() => navigation.navigate('DiaryList')}>목록</Text>
                </View>
            </View>

            {/* 날짜 표시 */}
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{todayDate}</Text>
            </View>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 다이어리 입력 칸 */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="오늘 하루에 대해 작성해 주세요."
                    placeholderTextColor="#999"
                    value={diaryText}
                    onChangeText={setDiaryText}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    autoCorrect={false}
                />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
    },
    leftHeader: {
        flex: 1,
        marginLeft: 10,
        alignItems: 'flex-start',
    },
    centerHeader: {
        flex: 2,
        alignItems: 'center',
    },
    rightHeader: {
        flex: 1,
        marginRight: 10,
        alignItems: 'flex-end',
    },
    dateContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    dateText: {
        fontSize: 25,
        fontWeight: '400',
    },
    divider: {
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        marginVertical: 10,
        marginHorizontal: 40,
        paddingTop: 5,
    },
    inputContainer: {
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    textInput: {
        fontSize: 16,
        color: '#000',
        borderColor: 'transparent',
        borderBottomWidth: 0,
    },
});

export default DiaryScreen;
