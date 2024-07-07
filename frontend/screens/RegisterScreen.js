import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
    const [UserName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [PhoneNum, setPhoneNum] = useState("");
    const [ProtectorName, setProtectorName] = useState("");
    const [ProtectorNum, setProtectorNum] = useState("");

    const handleRegister = async () => {
        if (Password !== ConfirmPassword) {
            Alert.alert('회원가입 실패', '비밀번호가 일치하지 않습니다.');
            return;
        }

        const formData = new FormData();
        formData.append('userName', UserName);
        formData.append('email', Email);
        formData.append('password', Password);
        formData.append('phoneNum', PhoneNum);
        formData.append('protectorName', ProtectorName);
        formData.append('protectorNum', ProtectorNum);

        try {
            const response = await axios.post('http://10.0.2.2:8080/join', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                Alert.alert('회원가입 성공', '회원가입이 성공적으로 완료되었습니다.');
                navigation.navigate('Login');
            } else {
                Alert.alert('회원가입 실패', response.data.message || '회원가입 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                Alert.alert('회원가입 실패', error.response.data.message || '회원가입 중 오류가 발생했습니다.');
            } else if (error.request) {
                Alert.alert('회원가입 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                Alert.alert('회원가입 실패', '네트워크 오류가 발생했습니다.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: '700' }}>회원가입</Text>
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
                    <Text style={styles.label}>전화번호</Text>
                    <TextInput
                        style={styles.input}
                        value={PhoneNum}
                        onChangeText={setPhoneNum}
                        keyboardType="number-pad"
                    />
                    <Text style={styles.label}>보호자 이름</Text>
                    <TextInput
                        style={styles.input}
                        value={ProtectorName}
                        onChangeText={setProtectorName}
                    />
                    <Text style={styles.label}>보호자 전화번호</Text>
                    <TextInput
                        style={styles.input}
                        value={ProtectorNum}
                        onChangeText={setProtectorNum}
                        keyboardType="number-pad"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>회원가입</Text>
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