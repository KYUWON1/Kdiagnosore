import React, {useState} from "react";
import {TouchableOpacity, View, Text,SafeAreaView, StyleSheet} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

const RegisterAcceptScreen = ({navigation}) => {
    return(
        <SafeAreaView style={styles.container}>
            <Octicons name='check-circle' size={70}/>
            <Text style={{fontSize:20, fontWeight:700, marginVertical:10}}>회원가입이 완료되었습니다.</Text> 
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Login')}>
                <Text style={{fontSize:20, color:'#fff'}}>로그인하기</Text>
            </TouchableOpacity>
        </SafeAreaView>
        
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent:'center',
      alignItems:"center",
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
});

export default RegisterAcceptScreen;