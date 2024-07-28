import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import axios from 'axios';

const PasswordModScreen = ({navigation}) => {
    const [Password, setPassword] = useState("");
    const [NPassword, setNPassword] = useState("");
    const [ConfirmNPassword, setConfirmNPassword] = useState("");

    const handlerModPassword = async() => {
        const data = {
            passwordBefore : Password,
            passwordAfter : NPassword,
            passwordCheck : ConfirmNPassword
        };

        try {
            const response = await axios.post('http://10.0.2.2:8080//user/profile/update/password', JSON.stringify(data), {
            });

            if (response.status === 200) {
                Alert.alert('변경 완료', '비밀번호가 변경되었습니다.');
                navigation.navigate('MyPageMod');
            } else {
                Alert.alert('변경 실패', response.data.message || '변경 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response) {
                // 서버에서 응답을 받았지만 상태 코드는 2xx 범위를 벗어났습니다.
                Alert.alert('변경 실패', error.response.data.message || '변경 중 오류가 발생했습니다.');
            } else if (error.request) {
                // 요청이 만들어졌지만 응답을 받지 못했습니다.
                Alert.alert('변경 실패', '서버에서 응답을 받지 못했습니다.');
            } else {
                // 다른 에러
                Alert.alert('변경 실패', '네트워크 오류가 발생했습니다.');
            }
        }

    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('MyPageMod')}/>
                <Text style={{fontSize:20, fontWeight:700, width:'80%', textAlign:'center'}}>비밀번호 수정</Text>
            </View>
            <View style={{ marginTop:20, alignItems: 'center' }}>
                    <Text style={styles.label}>현재 비밀번호</Text>
                    <TextInput
                            style={styles.input}
                            value={Password}
                            placeholder='대소문자, 특수문자, 숫자~~'
                            onChangeText={setPassword}
                            secureTextEntry
                    />
                    <Text style={styles.label}>새 비밀번호</Text>
                    <TextInput
                            style={styles.input}
                            value={NPassword}
                            placeholder='대소문자, 특수문자, 숫자~~'
                            onChangeText={setNPassword}
                            secureTextEntry
                    />
                    <Text style={styles.label}>새 비밀번호 확인</Text>
                    <TextInput
                            style={styles.input}
                            value={ConfirmNPassword}
                            placeholder='대소문자, 특수문자, 숫자~~'
                            onChangeText={setConfirmNPassword}
                            secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={handlerModPassword}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>변경하기</Text>
                    </TouchableOpacity>
            </View>

         </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
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
        marginTop:20,
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
        marginVertical:50,
        width:'90%',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#000',
        borderRadius:10,
    },

});

export default PasswordModScreen;