import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Svg, { Line } from 'react-native-svg';

const DiaryContentScreen = ({ route, navigation }) => {
    const [date, setDate] = useState(''); // 선택한 날짜를 저장
//    console.log('전달된 날짜:', date); // 전달된 날짜 로그 출력
    const [content, setContent] = useState(''); // 다이어리 내용 저장
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [apiBaseUrl, setApiBaseUrl] = useState('');

    useEffect(() => {
        const getDataFromAsyncStorage = async () => {
            try {
                const selectedDate = await AsyncStorage.getItem('selectedDate');
                const url = await AsyncStorage.getItem('API_BASE_URL');
                setDate(selectedDate); // 날짜 설정
                setApiBaseUrl(url);
            } catch (error) {
                console.error('Failed to load data from AsyncStorage:', error);
            }
        };

        getDataFromAsyncStorage();
    }, []);

    useEffect(() => {
            // 다이어리 내용 불러오기
            const fetchDiaryContent = async () => {
                if (!date) {
                    Alert.alert('오류', '날짜 값이 유효하지 않습니다.');
                    return;
                }
                try {
                    const response = await axios.get(`${apiBaseUrl}/diary/${date}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 200) {
                        setContent(response.data.content); // 서버에서 받은 다이어리 내용 저장
                    }
                } catch (error) {
                    Alert.alert("오류", "다이어리 내용을 가져오는 중 문제가 발생했습니다.");
                } finally {
                    setLoading(false); // 로딩 완료
                }
            };

            if (apiBaseUrl && date) {
                fetchDiaryContent();
            }
        }, [apiBaseUrl, date]);

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단바 */}
            <View style={styles.header}>
                <View style={styles.leftHeader}>
                    <AntDesign
                        name='left'
                        size={25}
                        style={{ marginHorizontal: 10 }}
                        onPress={() => navigation.goBack()}
                    />
                </View>
                <View style={styles.centerHeader}>
                    <Text style={{ fontSize: 20, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
                </View>
                <View style={styles.rightHeader}>
                </View>
            </View>
                    

            {/* 날짜 표시 */}
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{date}</Text>
            </View>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 다이어리 입력 칸 */}
            <View style={styles.inputContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#000" />
                ) : (
                    <TextInput
                        style={styles.textInput}
                        value={content}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                        editable={false} // 수정 불가능하게 설정
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // 스타일은 기존과 동일
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 50, paddingHorizontal: 10,  borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor: "#E0E0E0", },
    leftHeader: { flex: 1,  alignItems: 'flex-start' },
    centerHeader: { flex: 2, alignItems: 'center' },
    rightHeader: { flex: 1, marginRight: 10, alignItems: 'flex-end' },
    dateContainer: { alignItems: 'center', marginTop: 20 },
    dateText: { fontSize: 25, fontWeight: '400' },
    divider: { borderBottomColor: '#D3D3D3', borderBottomWidth: 1, marginVertical: 10, marginHorizontal: 40, paddingTop: 5 },
    inputContainer: { paddingHorizontal: 40, paddingTop: 5 },
    textInput: { fontSize: 16, color: '#000', borderColor: 'transparent', borderBottomWidth: 0 },
});

export default DiaryContentScreen;
