import React from "react";
import { TouchableOpacity, View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FindIdScreen = ({ route, navigation }) => {
    const { userId } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('FindIdVerify')}/>
                <Text style={{ fontSize: 20, fontWeight: '700', width:'80%', textAlign:'center'}}>아이디 찾기</Text>
            </View>
            <View style={{ marginTop: 20,alignItems: 'center'  }}>
                <Text style={styles.content}>입력한 정보와 일치하는 아이디입니다.</Text>
                <View style={styles.idcontent}>
                    <Text style={{ fontSize : 20, textAlign:'center'}}>아이디 : {userId}</Text>
                </View>
                <View style={styles.buttonlayout}>
                    <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Login')}>
                        <Text style={{ fontSize: 20, color: '#fff', fontWeight:'500' }}>로그인 하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button1} onPress={()=>navigation.navigate('FindPasswordVerify')}>
                        <Text style={{ fontSize: 20, color: '#0C9C57', fontWeight:'600' }}>비밀번호 찾기</Text>
                    </TouchableOpacity>
                </View>
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
    content:{
        //width:'90%',
        marginVertical:30,
        fontSize:18,
    },
    idcontent:{
      width:'85%',
      height:150,
      justifyContent:'center',
      borderColor:"#E0E0E0",
      borderWidth:1,
      borderRadius:10,
      backgroundColor:"white",
      paddingVertical:10,
      paddingHorizontal:10,
      marginVertical:20,
      fontSize:18,
      shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonlayout:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width:'85%',
        marginVertical:20,
    },
    button:{
        marginVertical:15,
        width:'45%',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0C9C57',
        borderRadius:10,
    },
    button1:{
        marginVertical:15,
        width:'45%',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        borderWidth:2,
        borderColor:'#0C9C57',
    },
});

export default FindIdScreen;
