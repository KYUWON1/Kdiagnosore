import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import axios from 'axios';

const ProtectorModScreen = ({navigation}) => {
    const [ProtectorNum, setProtectorNum] = useState("");
    const [VerifyNum, setVerifyNum] = useState("");

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('MyPageMod')}/>
                <Text style={{fontSize:20, fontWeight:700, width:'80%', textAlign:'center'}}>보호자 전화번호 변경</Text>
            </View>
            <View style={styles.title}>
                <Text style={styles.maintitle}>보호자 전화번호 인증</Text>
                <Text style={styles.subtitle}>원활한 서비스 이용을 위해 번호 인증을 해주세요.</Text>
            </View>
            <View style={{ marginTop:20, alignItems: 'center' }}>
                    <Text style={styles.label}>휴대전화 번호</Text>
                    <View style={styles.fixlabel}>
                        <TextInput
                            style={styles.input1}
                            value={ProtectorNum}
                            placeholder='-없이 번호 입력'
                            onChangeText={setProtectorNum}
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
                    <TouchableOpacity style={styles.button} onPress={{}}>
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
    title:{
        marginTop:20,
        alignItems:'center',
    },
    maintitle:{
        width:'90%',
        fontSize:30,
        fontWeight:'700',
    },
    subtitle:{
        marginTop:10,
        fontSize:16,
        width:'90%',
    },
    label:{
        width:'90%',
        marginLeft:10,
        marginTop:20,
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
        marginVertical:50,
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

export default ProtectorModScreen;