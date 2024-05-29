import React, { useEffect, useState, useCallback } from "react";
import {View, Text,SafeAreaView, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, useColorScheme} from 'react-native'
import { GiftedChat, Send, Bubble, InputToolbar, Time } from 'react-native-gifted-chat'
import Logo from '../assets/image/Logo.png'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'

//채팅창 디자인
const ChatBox = (props) => {
    return(
        <Bubble{...props}
        wrapperStyle={{ 
            right : {
                borderTopRightRadius:25,
                borderBottomRightRadius:25,
                borderTopLeftRadius:25,
                borderBottomLeftRadius:25,
                backgroundColor:'#93C9C0',
                //backgroundColor: '#70B1A1',
                //backgroundColor: '#424242',
                padding:5,
            },
            left : {
                borderTopRightRadius:25,
                borderBottomRightRadius:25,
                borderTopLeftRadius:25,
                borderBottomLeftRadius:25,
                padding:5,

            }
        }}
        textStyle={{
            right:{
                fontSize:18,
                //color:'#000',
            },
            left:{
                fontSize:18,
            }
        }}
        />
    )
}

//시간 텍스트 디자인
const TimeText = (props) => {
    return(
        <Time{...props}
        timeTextStyle={{
            right:{
                fontSize:12,
            },
            left:{
                fontSize:12,
            }
        }}
        />
    )
}

//입력창 디자인
const InputStyle = (props) => {
    return(
        <InputToolbar
            {...props}
            containerStyle={{
                minHeight: 40, // 최소 높이 설정
                borderTopWidth: 0,
                marginVertical: 5, 
                paddingHorizontal:5,
            }}
            primaryStyle={{
                borderRadius:20,
                borderWidth:1,
                borderColor:'#E0E0E0',
                height: 45, // 입력창의 높이 설정
                alignItems:'center',
                
            }}
            textInputProps={{
                fontSize:16, 
                marginLeft:15,
            }}
    
        />
    )
}

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
            disabled={!props.text} /*text 빈배열일때 disabled*/
            >
            <FontAwesome6 name='circle-arrow-up' size={28} />
        </Send>
    );
};


const ChatScreen = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
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
        ])
    }, [])

    //채팅창에 렌더링
    const onSend = useCallback((messages = []) => {
        // console.log('previousMessages: ',previousMessages)
        console.log('messages: ', messages)
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    //채팅 전달
    const MessageSend = async(messageList) =>{

    };

    //채팅 생성
    const createMessage = async(message)=>{

    };
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{justifyContent:'center', fontSize:20, fontWeight:'700', fontStyle:'italic', color:'#000'}}>Remember Me</Text>
            </View>
            <GiftedChat
            placeholder={'메세지를 입력하세요...'}
            alwaysShowSend={true}
            messages={messages}
            scrollToBottom={true}
            textInputProps={{ keyboardAppearance: 'dark', autoCorrect: false}}
            renderBubble={(props)=>ChatBox(props)}
            renderTime={(props)=>TimeText(props)}
            renderSend={(props) => SendButton(props)}
            renderInputToolbar={(props)=>InputStyle(props)}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
                name: 'User',
            }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      //alignItems:'center',
    },
    header:{
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height: 50,
        overflow: "hidden",
    },
});
export default ChatScreen;