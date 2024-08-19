import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import Logo from '../assets/image/Logo.png'; 

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

// 서버로부터 받은 데이터를 GiftedChat 형식으로 변환
const formatMessagesForGiftedChat = (messages) => {
    return messages.map((message) => ({
        _id: Math.random().toString(36).substring(7), // 랜덤 ID 생성
        text: message.message,
        createdAt: new Date(`${message.date}T${message.time}`), 
        user: {
            _id: message.chatFrom === "USER" ? 1 : 2, 
            name: message.chatFrom === "USER" ? "User" : "ChatBot", 
            avatar: message.chatFrom === "USER" ? null : Logo, 
        },
    }));
};

const ChatDateScreen = ({ route, navigation }) => {
    const { selectdate } = route.params; 
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchChattingData = async () => {
            if (apiBaseUrl && selectdate) {
                try {
                    const date = encodeURIComponent(selectdate);
                    const response = await axios.get(`${apiBaseUrl}/chat/getlist/${date}`, {
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                    });

                    if (response.status === 200) {
                        // 서버에서 받은 데이터 정렬: 최신 메시지가 하단에 오도록
                        const sortedData = response.data.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
                        const reversedData = sortedData.slice().reverse(); // 역순으로 변환
                        const formattedMessages = formatMessagesForGiftedChat(reversedData);
                        setMessages(formattedMessages);
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('ChatRecording1')} />
                <Text style={styles.headerText}>대화 기록</Text>
            </View>
            <View style={{ flex: 1 }}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <GiftedChat
                        messages={messages}
                        renderBubble={ChatBox}
                        renderTime={TimeText}
                        renderInputToolbar={() => null} // 입력창 없애기
                        scrollToBottom
                        scrollToBottomComponent={() => null} 
                        user={{
                            _id: 1,
                        }}
                    />
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
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        width: '80%',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatDateScreen;