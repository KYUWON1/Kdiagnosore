import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FindIdVerifyScreen = ({ navigation }) => {
    const [UserName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [PhoneNum, setPhoneNum] = useState("");
    const [VerifyNum, setVerifyNum] = useState("");

    const idrequest = async () => {
        //아이디 인증 요청
    }
    const idverify = async () => {
        //아이디 인증 확인
        navigation.navigate('FindId'); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('Login')}/>
                <Text style={{ fontSize: 20, fontWeight: '700', width:'80%', textAlign:'center'}}>아이디 찾기</Text>
            </View>
            <KeyboardAwareScrollView style={{ marginTop: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.label}>이름</Text>
                    <TextInput
                        style={styles.input}
                        value={UserName}
                        onChangeText={setUserName}
                    />
                    <Text style={styles.label}>이메일</Text>
                    <TextInput
                        style={styles.input}
                        value={Email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.label}>휴대전화 번호</Text>
                    <View style={styles.fixlabel}>
                        <TextInput
                            style={styles.input1}
                            value={PhoneNum}
                            placeholder='-없이 번호 입력'
                            onChangeText={setPhoneNum}
                            keyboardType="number-pad"
                        />
                        <TouchableOpacity style={styles.button1} onPress={{}}>
                            <Text style={{ fontSize: 20, color: '#fff' }}>인증</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>인증번호</Text>
                    <TextInput
                        style={styles.input}
                        value={VerifyNum}
                        onChangeText={setVerifyNum}
                        keyboardType="number-pad"
                    />
                    <TouchableOpacity style={styles.button} onPress={idverify}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>다음 단계</Text>
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
        marginTop:20,
        marginLeft:10,
        fontSize:18,
    },
    fixlabel:{
        flexDirection:"row", 
        alignItems:"center",
        justifyContent:'space-between', 
        width:'90%'
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
    input1:{
        width:'70%',
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
        marginVertical:30,
        width:'90%',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#000',
        borderRadius:10,
    },
    button1:{
        marginVertical:15,
        width:80,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#000',
        borderRadius:10,
    },
});

export default FindIdVerifyScreen;