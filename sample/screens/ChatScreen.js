import React, { useEffect, useState } from "react";
import {View, Text,SafeAreaView, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform} from 'react-native'


const ChatScreen = ({navigation}) => {
    const today = new Date();
    const getCurrentDate = () => {
        return today.getFullYear()+"년 "+today.getMonth()+"월 "+today.getDate()+"일 "+today.toLocaleTimeString("ko-KR");
    }
    const [userChat, setUserChat] = useState("");

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{justifyContent:'center', fontSize:20, fontWeight:'700', fontStyle:'italic', color:'#000'}}>Remember Me</Text>
            </View>
            <View style={styles.dateview}>
                <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
            <ScrollView>
                {/*채팅창 구현*/}
            </ScrollView>
            <KeyboardAvoidingView style={styles.message} behavior={Platform.select({ios:'padding', android:undefined})}>
                <TextInput 
                style={styles.input} 
                placeholder="메세지 보내기"
                value={userChat}
                onChangeText={setUserChat}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems:'center',
    },
    header:{
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height: 50,
        overflow: "hidden",
    },
    dateview:{
        width:'60%',
        height:30,
        alignItems:'center',
        marginVertical:30,
        backgroundColor:"#E0E0E0",
        borderRadius:20,
        justifyContent:'center',
    },
    date:{
        textAlign:'center',
        fontSize:15,
        color:"#000",
    },
    input:{
        width:'90%',
        height:45,
        borderColor:"#E0E0E0",
        borderWidth:1,
        borderRadius:10,
        backgroundColor:"white",
        paddingVertical:10,
        paddingHorizontal:10,
        marginVertical:10,
        fontSize:18,
    },
    message:{
        width:'100%',
        alignItems:'center'
    },
});
export default ChatScreen;