import React, {useState, useEffect} from "react";
import {View, Text,SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyPageModScreen = ({navigation}) => {
    const [userInfo, setUserInfo] = useState(null);
    const [UserName, setUserName] = useState("");
    const [UserID, setUserID] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [PhoneNum, setPhoneNum] = useState("");
    const [ProtectorName, setProtectorName] = useState("");
    const [ProtectorNum, setProtectorNum] = useState("");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:8080/user/profile');
                setUserInfo(response.data);
                if (response.data) {
                setUserName(response.data.userName);
                setUserID(response.data.userId);
                setEmail(response.data.email);
                setPassword(response.data.password);
                setPhoneNum(response.data.phoneNum);
                setProtectorName(response.data.protectorName);
                setProtectorNum(response.data.protectorNum);
                }
            } catch (err) {
                console.error('Error verifying code:', err);
                }
        };
        fetchUserInfo();
    }, []);

    const handlerModify = async() => {
        const data = {
            userName: UserName,
            protectorName: ProtectorName
        };

        try {
            const response = await axios.post('http://10.0.2.2:8080/user/profile/update', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                Alert.alert('변경 완료', '회원정보가 변경되었습니다.');
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
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('Setting1')}/>
                <Text style={{fontSize:20, fontWeight:700, width:'80%', textAlign:'center'}}>회원정보 수정</Text>
            </View>
            <KeyboardAwareScrollView style={{ marginTop:20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.label}>이름</Text>
                    <TextInput
                        style={styles.input}
                        value={UserName}
                        onChangeText={setUserName}
                    />
                    <Text style={styles.label}>아이디</Text>
                    <Text style={styles.idstyle}>{UserID}</Text>
                    <Text style={styles.label}>이메일</Text>
                    <TextInput
                        style={styles.input}
                        value={Email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.label}>비밀번호</Text>
                    <View style={styles.fixlabel}>
                        <TextInput
                            style={styles.input1}
                            value={Password}
                            onChangeText={setPassword}
                            editable={false} //입력 비활성화
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.button1} onPress={()=>navigation.navigate('PasswordMod')}>
                            <Text style={{ fontSize: 20, color: '#fff' }}>수정</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>전화번호</Text>
                    <View style={styles.fixlabel}>
                        <Text style={styles.idcontent}>{PhoneNum}</Text>
                        <TouchableOpacity style={styles.button1} onPress={()=>navigation.navigate('PhoneNumMod')}>
                                <Text style={{ fontSize: 20, color: '#fff' }}>수정</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>보호자 이름</Text>
                    <TextInput
                        style={styles.input}
                        value={ProtectorName}
                        onChangeText={setProtectorName}
                    />
                    <Text style={styles.label}>보호자 전화번호</Text>
                    <View style={styles.fixlabel}>
                        <Text style={styles.idcontent}>{ProtectorNum}</Text>
                        <TouchableOpacity style={styles.button1} onPress={()=>navigation.navigate('ProtectorNumMod')}>
                                <Text style={{ fontSize: 20, color: '#fff' }}>수정</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handlerModify}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>변경하기</Text>
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
        flexDirection:'row',
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
        fontWeight: 'bold'
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
        width:'50%',
        height:50,
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
    button1:{
        marginVertical:15,
        width:50,
        height:28,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#000',
        borderRadius:10,
    },
    idcontent: {
        width: '80%',
        height:50,
        backgroundColor:"white",
        paddingVertical:10,
        paddingHorizontal:7,
        marginVertical:10,
        fontSize:18,
    },
    idstyle: {
        width: '90%',
        height:50,
        backgroundColor:"white",
        paddingVertical:10,
        paddingHorizontal:7,
        marginVertical:10,
        fontSize:18,
    },

});

export default MyPageModScreen;