import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExamListScreen = ({ navigation }) => {
    const [TestData, setTestData] = useState([]);
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [testable, setTestAble] = useState(true);
    const [dday, setDday] = useState(0);

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
        const fetchData = async () => {
            if (apiBaseUrl) {
                try {
                    const response = await axios.get(`${apiBaseUrl}/question/result`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 200) {
                        setTestData(response.data);
                        try {
                            const response1 = await axios.get(`${apiBaseUrl}/question/status`, {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (response1.status === 200) {
                                setTestAble(response1.data.canTest);
                                setDday(response1.data.dday);

                            } else {
                                Alert.alert('테스트 여부 가져오기 실패', '테스트 여부를 가져오는 중 문제가 발생했습니다.');
                            }
                        } catch (error) {
                            Alert.alert('테스트 여부 가져오기 실패', '테스트 여부를 가져오는 중 문제가 발생했습니다.');
                        }
                    } else {
                        Alert.alert('결과 가져오기 실패', '테스트 결과 목록을 가져오는 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    Alert.alert('결과 가져오기 실패', '테스트 결과 목록을 가져오는 중 문제가 발생했습니다.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [apiBaseUrl]);

    const handleItemPress = (selectdate) => {
        navigation.navigate('ExamDate', { selectdate });

    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('MainMenu')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>인지기능 검사</Text>
            </View>
            <View style={styles.buttonbox}>
                <TouchableOpacity 
                    style={[styles.button, !testable && styles.disabledButton]} 
                    onPress={testable ? () => navigation.navigate('ExamStart') : null}
                    disabled={!testable} // Disable button if testable is false
                >
                    <Text style={{ fontSize: 24, color: '#fff' }}>
                        {testable ? '테스트 시작' : `D-${dday}`} {/* Change button text based on testable state */}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listtitle}>
                <Text style={styles.idtext}>번호</Text>
                <Text style={styles.contenttext}>점수</Text>
                <Text style={styles.datetext}>날짜</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loader} />
            ) : (
                <ScrollView>
                    {TestData.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleItemPress(item.date)}>
                            <View style={styles.listItem}>
                                <Text style={styles.idtext1}>{index + 1}</Text>
                                <Text style={styles.contenttext1} numberOfLines={1}>{item.totalScore}점</Text>
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
    buttonbox:{
        marginTop:20,
        alignItems:'center',
        justifyContent:'center',
    },
    button:{
        marginVertical:15,
        width:'55%',
        height:60,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#000',
        borderRadius:10,
    },
    idtext: {
        width: 70,
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
    contenttext: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#B6B6B6',
    },
    disabledButton: {
        opacity: 0.3, // 비활성화 상태에서의 투명도
    },
    datetext: {
        width: 100,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#B6B6B6',
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

export default ExamListScreen;