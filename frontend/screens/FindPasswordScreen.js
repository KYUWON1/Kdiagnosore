import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, SafeAreaView, StyleSheet, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FindPasswordScreen = ({ navigation }) => {
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const passwordreset = async () => {
        //비밀번호 수정
        navigation.navigate('Login'); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('FindPasswordVerify')}/>
                <Text style={{ fontSize: 20, fontWeight: '700', width:'80%', textAlign:'center'}}>비밀번호 찾기</Text>
            </View>
            <View style={{ marginTop: 20, alignItems: 'center'  }}>
                <Text style={styles.label}>새 비밀번호</Text>
                    <TextInput
                            style={styles.input}
                            value={Password}
                            placeholder='대소문자, 특수문자, 숫자~~'
                            onChangeText={setPassword}
                            secureTextEntry
                    />
                    <Text style={styles.label}>새 비밀번호 확인</Text>
                    <TextInput
                            style={styles.input}
                            value={ConfirmPassword}
                            placeholder='대소문자, 특수문자, 숫자~~'
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={passwordreset}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>완료</Text>
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

export default FindPasswordScreen;