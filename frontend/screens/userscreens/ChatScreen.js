import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { GiftedChat, Send, Bubble, InputToolbar, Time } from 'react-native-gifted-chat';
import Logo from '../../assets/image/Logo.png';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from "react-native";

// 채팅창 디자인
const ChatBox = (props) => {
    return (
        <Bubble {...props}
            wrapperStyle={{
                right: {
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    backgroundColor: '#d1e7dd',
                    padding: 5,
                },
                left: {
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    padding: 5,
                }
            }}
            textStyle={{
                right: {
                    color:'#000',
                    fontSize: 18,
                },
                left: {
                    fontSize: 18,
                }
            }}
        />
    );
};

// 시간 텍스트 디자인
const TimeText = (props) => {
    return (
        <Time {...props}
            timeTextStyle={{
                right: {
                    color:'#4f4f4f',
                    fontSize: 12,
                },
                left: {
                    fontSize: 12,
                }
            }}
        />
    );
};

// 입력창 디자인
const InputStyle = (props) => {
    return (
        <InputToolbar
            {...props}
            containerStyle={{
                minHeight: 40,
                borderTopWidth: 0,
                marginVertical: 5,
                paddingHorizontal: 5,
            }}
            primaryStyle={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                height: 45,
                alignItems: 'center',
            }}
            textInputProps={{
                fontSize: 16,
                marginLeft: 15,
            }}
        />
    );
};

// 전송 버튼 디자인
const SendButton = (props) => {
    const { text } = props;
    return (
        <Send
            {...props}
            containerStyle={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: text ? 1 : 0.3,
                marginHorizontal: 10,
            }}
            disabled={!props.text}
        >
            <FontAwesome6 name='circle-arrow-up' size={28} />
        </Send>
    );
};

const ChatScreen = ({navigation}) => {
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [loading, setLoading] = useState(true);

        // 서버로부터 받은 데이터를 GiftedChat 형식으로 변환
    const formatMessagesForGiftedChat = (messages) => {
        return messages.map((message, index) => ({
            _id: `${message.date}-${message.time}-${Math.random().toString(36).substring(7)}`,
            text: message.message,
            createdAt: new Date(`${message.date}T${message.time}`), 
            user: {
                _id: message.chatFrom === "USER" ? 1 : 2, 
                name: message.chatFrom === "USER" ? "User" : "ChatBot", 
                avatar: message.chatFrom === "USER" ? null : Logo, 
            },
        }));
    };

    useEffect(() => {
        const loadUserData = async () => {
            const storedUserId = await AsyncStorage.getItem('userID');
            const storedApiBaseUrl = await AsyncStorage.getItem('API_BASE_URL');
            setUserId(storedUserId);
            setApiBaseUrl(storedApiBaseUrl);

        };

        loadUserData();

        const fetchChattingData = async () => {
            // 현재 날짜를 YYYY-MM-DD 형식으로 설정
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');  // 월을 2자리로 맞춤
            const day = String(today.getDate()).padStart(2, '0');         // 일을 2자리로 맞춤
            const date = `${year}-${month}-${day}`;
            
            if (apiBaseUrl && date) {
                try {
                    const checkchat = await axios.get(`${apiBaseUrl}/chat/getlist`, {
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                    });
                    const filteredData = checkchat.data.filter(chat => chat.date === date);
                    if (checkchat.status === 200 && filteredData.length > 0) {
                        try{
                            const response = await axios.get(`${apiBaseUrl}/chat/getlist/${date}`, {
                                headers: { 
                                    'Content-Type': 'application/json'
                                },
                            });

                            const sortedData = response.data.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
                            const reversedData = sortedData.slice().reverse();
                            const formattedMessages = formatMessagesForGiftedChat(reversedData);
                            setMessages((prevMessages) => GiftedChat.append(prevMessages, formattedMessages));
                        }
                        catch (error) {
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
                        }
                    }
                    else if(checkchat.status === 200){
                        setMessages([
                            {
                                _id: 1,
                                text: '안녕하세요! 반가워요 :D',
                                createdAt: new Date(),
                                user: {
                                    _id: 2,
                                    name: 'ChatBot',
                                    avatar: Logo,
                                },
                            },
                        ]);
                    }
                    else{
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
    }, [apiBaseUrl]);

    

    // 채팅창에 렌더링
    const onSend = useCallback(async (messages = []) => {
        const sendTime = Date.now();  // 채팅 입력 시각 기록
        console.log('User sent a message at:', new Date(sendTime));  // 사용자 입력 시간 로그


        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const userMessage = messages[0].text;

        try {
            const response = await axios.post(`${apiBaseUrl}/chat/question`, { message: userMessage }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                const chatbotMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: response.data.message,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'ChatBot',
                        avatar: Logo,
                    },
                };
                const receiveTime = Date.now();  // 서버 응답 시각 기록
                console.log('ChatBot responded at:', new Date(receiveTime));  // 서버 응답 시간 로그

                const responseTime = (receiveTime - sendTime) / 1000;
                console.log(`userId: ${userId}`);  // 응답 시간 로그
                console.log(`Response time: ${responseTime} seconds`);  // 응답 시간 로그

                setMessages(previousMessages => GiftedChat.append(previousMessages, chatbotMessage));
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
        }
    }, [apiBaseUrl]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
            <View style={styles.leftHeader}>
                <AntDesign name='left' size={25} onPress={() => navigation.navigate('MainMenu')} />
            </View>
            <View style={styles.centerHeader}>
                <Text style={{ fontSize: 20, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
            </View>
            <View style={styles.rightHeader}>
                <TouchableOpacity onPress={() => navigation.navigate('ChatRecordDrawer')}>
                    <Text style={{ fontSize: 18, color: '#7C95EF' }}>목록</Text> 
                </TouchableOpacity>
            </View>
            </View>
            <GiftedChat
                placeholder={'메세지를 입력하세요...'}
                alwaysShowSend={true}
                messages={messages}
                scrollToBottom={true}
                textInputProps={{ keyboardAppearance: 'dark', autoCorrect: false }}
                renderBubble={(props) => ChatBox(props)}
                renderTime={(props) => TimeText(props)}
                renderSend={(props) => SendButton(props)}
                renderInputToolbar={(props) => InputStyle(props)}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                    name: userId || 'User', // 저장된 유저 아이디를 사용
                }}
            />
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
        justifyContent: 'space-between', // 요소들 사이에 공간 분배
        alignItems: 'center',
        width: '100%',
        height: 50,
        paddingHorizontal: 10, // 필요한 경우 패딩 추가
    },
    leftHeader: {
        flex: 1,
        marginLeft:10,
        alignItems: 'flex-start', // 왼쪽 정렬
    },
    centerHeader: {
        flex: 2,
        alignItems: 'center', // 가운데 정렬
    },
    rightHeader: {
        flex: 1,
        marginRight:10,
        alignItems: 'flex-end', // 오른쪽 정렬
    },
});

export default ChatScreen;
