import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { GiftedChat, Send, Bubble, InputToolbar, Time } from 'react-native-gifted-chat';
import Logo from '../assets/image/Logo.png';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//채팅창 디자인
const ChatBox = (props) => {
    return (
        <Bubble {...props}
            wrapperStyle={{
                right: {
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    backgroundColor: '#93C9C0',
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
                    fontSize: 18,
                },
                left: {
                    fontSize: 18,
                }
            }}
        />
    );
};

//시간 텍스트 디자인
const TimeText = (props) => {
    return (
        <Time {...props}
            timeTextStyle={{
                right: {
                    fontSize: 12,
                },
                left: {
                    fontSize: 12,
                }
            }}
        />
    );
};

//입력창 디자인
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

//전송 버튼 디자인
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

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const loadUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userID');
            setUserId(storedUserId);
        };

        loadUserId();

        setMessages([
            {
                _id: 1,
                text: '안녕하세요! 반가워요 :D',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: Logo,
                },
            },
        ]);
    }, []);

    //채팅창에 렌더링
    const onSend = useCallback(async (messages = []) => {
        console.log('messages: ', messages)
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const userMessage = messages[0].text;
        try {
            const response = await axios.post('http://10.0.2.2:8080/chat/question', { message: userMessage }, {
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
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{ justifyContent: 'center', fontSize: 20, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        overflow: "hidden",
    },
});

export default ChatScreen;
