import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DiaryListScreen = ({ navigation }) => {
    const [diaryData, setDiaryData] = useState([]);
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [loading, setLoading] = useState(true);

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
        const fetchDiaryData = async () => {
            if (apiBaseUrl) {
                try {
                    const response = await axios.get(`${apiBaseUrl}/api/v1/diary/list`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 200) {
                        setDiaryData(response.data);
                    } else {
                        Alert.alert('다이어리 가져오기 실패', '다이어리 목록을 가져오는 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    Alert.alert('다이어리 가져오기 실패', '다이어리 목록을 가져오는 중 문제가 발생했습니다.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchDiaryData();
    }, [apiBaseUrl]);

    const handleItemPress = async (date) => {
            try {
                // 선택한 날짜를 AsyncStorage에 저장
                await AsyncStorage.setItem('selectedDate', date);
                // DiaryContentScreen으로 이동
                navigation.navigate('DiaryContent');
            } catch (error) {
                console.error('Failed to save the date to AsyncStorage:', error);
            }
        };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('Diary')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>다이어리 목록</Text>
            </View>

            <View style={styles.listtitle}>
                <Text style={styles.idtext}>번호</Text>
                <Text style={styles.contenttext}>내용</Text>
                <Text style={styles.datetext}>날짜</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loader} />
            ) : (
                <ScrollView>
                    {diaryData.slice().reverse().map((item, index)  => (
                        <TouchableOpacity key={index} onPress={() => handleItemPress(item.date)}>
                            <View style={styles.listItem}>
                                <Text style={styles.idtext1}>{index + 1}</Text>
                                <Text style={styles.contenttext1} numberOfLines={1}>{item.content}</Text>
                                <Text style={styles.datetext1}>{item.date.replace(/-/g, '.')}</Text>
                            </View>
                        </TouchableOpacity>
                    )).reverse()}
                </ScrollView>
            )}
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
    headerText: {
        fontSize: 20,
        fontWeight: '700',
    },
    listtitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        borderBottomColor: '#B6B6B6',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    idtext: {
        width: 70,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#B6B6B6',
    },
    contenttext: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#B6B6B6',
    },
    datetext: {
        width: 100,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#B6B6B6',
    },
    idtext1: {
        width: 70,
        textAlign: 'center',
        fontSize: 18,
        
    },
    contenttext1: {
        flex: 1,
        textAlign: 'center',
        fontSize:18,
    },
    datetext1: {
        width: 100,
        textAlign: 'center',
        fontSize: 18,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
        paddingVertical: 10,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DiaryListScreen;
