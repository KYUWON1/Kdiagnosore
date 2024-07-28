import React, {useState, useEffect} from "react";
import {View, Text,SafeAreaView, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const MyPageModScreen = ({navigation}) => {
    const [UserName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("ooooooooo");
    const [PhoneNum, setPhoneNum] = useState("");
    const [ProtectorName, setProtectorName] = useState("");
    const [ProtectorNum, setProtectorNum] = useState("");
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('Setting1')}/>
                <Text style={{fontSize:20, fontWeight:700}}>회원정보 수정</Text>
            </View>
            <View style={{ marginTop:20, alignItems: 'center' }}>
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
                    <View style={{flexDirection:"row", justifyContent:'space-between', width:'90%'}}>
                        <TextInput
                            style={styles.input1}
                            value={Password}
                            placeholder='대소문자, 특수문자, 숫자~~'
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.button1} onPress={{}}>
                            <Text style={{ fontSize: 20, color: '#fff' }}>수정</Text>
                        </TouchableOpacity>
                    </View>
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
                    <TouchableOpacity style={styles.button} onPress={{}}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>정보 변경</Text>
                    </TouchableOpacity>
                </View>

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

});

export default MyPageModScreen;