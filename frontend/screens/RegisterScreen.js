import React, {useState} from "react";
import {TouchableOpacity, View, Text, TextInput,SafeAreaView, StyleSheet} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthContext } from "../context/AuthContext";

const RegisterScreen = ({navigation}) => {
    const [userName, setUserName] = useState("");
    const [ID, setID] = useState("");
    const [passsword, setPassword] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [protectorName, setProtectorName] = useState("");
    const [protectorNum, setProtectorNum] = useState("");
    const {register} = useContext(AuthContext);
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize:20, fontWeight:700}}>회원가입</Text>
            </View>
            <KeyboardAwareScrollView style={{marginTop:20}}>
                <View style={{alignItems:'center'}}>
                    <Text style={styles.label}>이름</Text>
                    <TextInput 
                        style={styles.input}
                        value={userName} 
                        onChangeText={setUserName}/>
                    <Text style={styles.label}>아이디</Text>
                    <TextInput 
                        style={styles.input}
                        value={ID} 
                        placeholder='대소문자, 특수문자, 숫자~~'
                        onChangeText={setID}/>
                    <Text style={styles.label}>비밀번호</Text>
                    <TextInput 
                        style={styles.input}
                        value={passsword} 
                        placeholder='대소문자, 특수문자, 숫자~~'
                        onChangeText={setPassword}
                        secureTextEntry/> 
                    <Text style={styles.label}>비밀번호 확인</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder='대소문자, 특수문자, 숫자~~'
                        secureTextEntry/>
                    <Text style={styles.label}>전화번호</Text>
                    <TextInput 
                        style={styles.input}
                        value={phoneNum} 
                        onChangeText={setPhoneNum}
                        keyboardType="number-pad"/>
                    <Text style={styles.label}>보호자 이름</Text>
                    <TextInput 
                        style={styles.input}
                        value={protectorName} 
                        onChangeText={setProtectorName}/>
                    <Text style={styles.label}>보호자 전화번호</Text>
                    <TextInput 
                        style={styles.input}
                        value={protectorNum} 
                        onChangeText={setProtectorNum}
                        keyboardType="number-pad"/>
                    <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('RegisterAccept')}>
                        <Text style={{fontSize:20, color:'#fff'}}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>

        </SafeAreaView>
        
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header:{
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height: 50,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor:"#E0E0E0",
        overflow: "hidden",
    },
    label:{
        width:'90%',
        marginLeft:10,
        fontSize:18,
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
});

export default RegisterScreen;