import React, { useEffect, useState } from "react";
import {TouchableOpacity, StyleSheet,SafeAreaView,Image, View, Text, TextInput} from 'react-native'
import Checkbox from "expo-checkbox";

const LoginScreen = ({navigation}) => {
    const [ID, setID] = useState("");
    const [Passsword, setPassword] = useState("");
    const [isLoginChecked, setIsLoginChecked] = useState(false);

    return(
        <SafeAreaView style={styles.container}>
            <Text style={{marginTop:100, fontSize:15, color:'#828282'}}>인지기능 훈련 챗봇</Text>
            <Text style={{justifyContent:'center', fontSize:30, fontWeight:'700', fontStyle:'italic', color:'#000'}}>Remember Me</Text>
            <Image source={require('../assets/image/Logo.png')} style={{width : 80, height : 80, marginVertical:30}}/>
            <TextInput 
                style={styles.input}
                value={ID} 
                placeholder='아이디'
                onChangeText={setID}/>
            <TextInput 
                style={styles.input}
                value={Passsword} 
                placeholder='비밀번호' 
                secureTextEntry
                onChangeText={setPassword}/>
            <View style={{flexDirection:'row', alignItems: 'center', width:'90%', marginLeft:5, marginTop:10}}>
            <Checkbox
                value={isLoginChecked}
                onValueChange={setIsLoginChecked}
                style={{marginRight:10, borderColor:'gray'}}
                color={isLoginChecked ? 'black':undefined}
            />
            <Text style={{textAlign:'center', fontSize:17, color:'#828282'}}>로그인 상태 유지</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('Appstart')}}>
                <Text style={{fontSize:20, color:'#fff'}}>로그인</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row', alignItems: 'center'}}>
                <Text style={{textAlign:'center', fontSize:17, color:'#828282'}}>아이디 찾기</Text>
                <Text style={styles.textborder}>|</Text>
                <Text style={{textAlign:'center', fontSize:17, color:'#828282'}}>비밀번호 찾기</Text>
                <Text style={styles.textborder}>|</Text>
                <TouchableOpacity> 
                    <Text onPress={()=>navigation.navigate('Register')} style={{textAlign:'center', fontSize:17, color:'#828282'}}>회원가입</Text>
            </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
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
        backgroundColor:'#000',
        borderRadius:10,
    },
    textborder:{
        fontSize:17, 
        color:'#828282',
        marginHorizontal:10,
    }
});

export default LoginScreen;