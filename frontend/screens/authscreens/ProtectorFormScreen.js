import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProtectorFormScreen = ({ route, navigation }) => {
    const [UserId, setUserId] = useState("");
    const [UserName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const { WardName, WardNum } = route.params;

    const nextRegister = async () => {
        if (Password !== ConfirmPassword) {
            Alert.alert('비밀번호 확인', '비밀번호가 일치하지 않습니다.');
            return;
        }
        //다음 화면으로 값 넘기기
        navigation.navigate('ProtectorPhone2', {UserId, UserName, Email, Password, WardName, WardNum}); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('ProtectorVerify')}/>
                <Text style={{ fontSize: 20, fontWeight: '700', width:'80%', textAlign:'center'}}>회원가입</Text>
            </View>
            <KeyboardAwareScrollView style={{ marginTop: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.label}>이름</Text>
                    <TextInput
                        style={styles.input}
                        value={UserName}
                        onChangeText={setUserName}
                    />
                    <Text style={styles.label}>아이디</Text>
                   <TextInput
                        style={styles.input}
                        value={UserId}
                        onChangeText={setUserId}
                   />
                    <Text style={styles.label}>이메일</Text>
                    <TextInput
                        style={styles.input}
                        value={Email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.label}>비밀번호</Text>
                    <TextInput
                        style={styles.input}
                        value={Password}
                        placeholder='대소문자, 특수문자, 숫자~~'
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Text style={styles.label}>비밀번호 확인</Text>
                    <TextInput
                        style={styles.input}
                        value={ConfirmPassword}
                        placeholder='대소문자, 특수문자, 숫자~~'
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={nextRegister}>
                        <Text style={{ fontSize: 20, color: '#fff', fontWeight:'600' }}>다음 단계</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header:{
        flexDirection:'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor: "#E0E0E0",
        overflow: "hidden",
    },
    label:{
        width:'90%',
        marginLeft:10,
        fontSize:18,
        fontWeight:'500',
    },
    input:{
      width:'90%',
      height:50,
      borderColor:"#E0E0E0",
      borderWidth:1,
      borderRadius:10,
      backgroundColor:"white",
      paddingVertical:10,
      paddingHorizontal:10,
      marginVertical:10,
      fontSize:18,
    },
    button:{
        marginVertical:15,
        width:'90%',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0C9C57',
        borderRadius:10,
    },
});

export default ProtectorFormScreen;