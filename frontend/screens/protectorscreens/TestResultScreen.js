import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import Logo from '../../assets/image/Logo.png'; 

// 채팅창 디자인
const ChatBox = (props) => (
    <Bubble
        {...props}
        wrapperStyle={{
            right: {
                borderRadius: 25,
                backgroundColor: '#d1e7dd',
                padding: 5,
            },
            left: {
                borderRadius: 25,
                padding: 5,
            }
        }}
        textStyle={{
            right: {
                color: '#000',
                fontSize: 18,
            },
            left: {
                fontSize: 18,
            }
        }}
    />
);

// 시간 텍스트 디자인
const TimeText = (props) => (
    <Time
        {...props}
        timeTextStyle={{
            right: {
                color: '#4f4f4f',
                fontSize: 12,
            },
            left: {
                fontSize: 12,
            }
        }}
    />
);

const TestResultScreen = ({ navigation, route }) => {
    const { selectdate } = route.params; 
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

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
        const fetchChattingData = async () => {
            if (apiBaseUrl && selectdate) {
                try {
                    const date = encodeURIComponent(selectdate);
                    const response = await axios.get(`${apiBaseUrl}/test/getlist/${date}`, { 
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                    });

                    if (response.status === 200) {
                        // 서버에서 받은 데이터 저장
                        setData(response.data); // data 상태에 저장
                    } else {
                        Alert.alert('채팅 가져오기 실패', '채팅 기록을 가져오는 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    if (error.response) {
                        console.error('Error response:', error.response);
                        Alert.alert('오류', error.response.data.message || '서버 응답 오류가 발생했습니다.');
                    } else if (error.request) {
                        console.error('Error request:', error.request);
                        Alert.alert('오류', '서버에서 응답을 받지 못했습니다.');
                    } else {
                        console.error('Error message:', error.message);
                        Alert.alert('오류', '네트워크 오류가 발생했습니다.');
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchChattingData();
    }, [apiBaseUrl, selectdate]);

    // 데이터가 로딩 중일 경우 로딩 메시지 표시
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>로딩 중...</Text>
            </SafeAreaView>
        );
    }

    const upperMessages = [
        {
            _id: 1,
            text: data[currentIndex]?.question || "질문 없음",
            createdAt: new Date(`${data[currentIndex]?.date}T${data[currentIndex]?.time}`),
            user: {
                _id: 2,
                name: "ChatBot",
                avatar: Logo,
            },
        },
        {
            _id: 2,
            text: data[currentIndex]?.answer || "답변 없음",
            createdAt: new Date(`${data[currentIndex]?.date}T${data[currentIndex]?.time}`),
            user: {
                _id: 1,
                name: "User",
            },
        },
    ];

    const handleSwipe = (direction) => {
        if (direction === 'next' && currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (direction === 'prev' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('TestList')} />
                <Text style={styles.headerText}>테스트 결과</Text>
            </View>
            <View style={styles.upperContainer}>
                <GiftedChat
                    messages={upperMessages}
                    renderBubble={ChatBox}
                    renderTime={TimeText}
                    renderInputToolbar={() => null}
                    user={{ _id: 1 }}
                    scrollToBottom={false}
                    inverted={false}
                    style={{ flex: 0 }} // flex 설정
                />
            </View>
            <View style={styles.lowerContainer}>
                <Text style={styles.lowerMessageText}>
                    <Text style={styles.boldText}>1. 테스트 질문</Text>{'\n'}
                    <Text style={styles.normalText}>{data[currentIndex]?.question}</Text>{'\n\n'}
                    <Text style={styles.boldText}>2. 사용자 답변</Text>{'\n'}
                    <Text style={styles.normalText}>{data[currentIndex]?.answer || "답변 없음"}</Text>{'\n\n'}
                    <Text style={styles.boldText}>3. 예상 답변</Text>{'\n'}
                    <Text style={styles.normalText}>{data[currentIndex]?.predictAnswer}</Text>{'\n\n'}
                    <Text style={styles.boldText}>4. 예상 이유</Text>{'\n'}
                    <Text style={styles.normalText}>{data[currentIndex]?.reason}</Text>
                </Text>
            </View>
            <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={() => handleSwipe('prev')} disabled={currentIndex === 0}>
                    <Text style={[styles.swipeButton, { opacity: currentIndex === 0 ? 0.5 : 1 }]}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.pageIndicator}>{currentIndex + 1} / {data.length}</Text>
                <TouchableOpacity onPress={() => handleSwipe('next')} disabled={currentIndex === data.length - 1}>
                    <Text style={[styles.swipeButton, { opacity: currentIndex === data.length - 1 ? 0.5 : 1 }]}>{">"}</Text>
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
        borderBottomColor: "#E0E0E0",
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        width: '80%',
        textAlign: 'center',
    },
    upperContainer: {
        margin: 20,
        borderRadius: 15,
        borderWidth: 1,
        padding: 10,
        flexGrow: 2, 
    },
    lowerContainer: {
        flexGrow: 1, 
        margin: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding:15,
        backgroundColor: '#f9f9f9',
    },
    lowerMessageText: {
        fontSize: 16,
    },
    boldText: {
        fontWeight: '800',
        fontSize: 18,
    },
    normalText: {
        fontSize: 18,
    },
    pageIndicator: {
        fontSize: 20,
        marginHorizontal: 10,
    },
    navigationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    swipeButton: {
        fontSize: 20,
        padding: 10,
    },
});

export default TestResultScreen;