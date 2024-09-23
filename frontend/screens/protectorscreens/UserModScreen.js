import React, {useState, useEffect} from "react";
import {View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserModScreen = ({navigation}) => {
    const [error, setError] = useState(null);
    const [apiBaseUrl, setApiBaseUrl] = useState('');

    useEffect(() => {
        const getApiBaseUrl = async () => {
            try {
                const url = await AsyncStorage.getItem('API_BASE_URL');
                if (url) {
                    setApiBaseUrl(url);
                }
            } catch (e) {
                console.error('Failed to load API base URL:', e);
            }
        };

        getApiBaseUrl();
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
        };
        if (apiBaseUrl) {
            fetchUserInfo();
        }
    }, [apiBaseUrl]);

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('MyPageMod')}/>
                <Text style={{fontSize:20, fontWeight:700, width:'80%', textAlign:'center'}}>사용자 전화번호 변경</Text>
            </View>
            <KeyboardAwareScrollView style={{ marginTop:20 }}>
                <View style={{ alignItems: 'center' }}>
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
        fontSize:20,
        fontWeight: 'bold'
    },
    label1:{
        marginLeft:5,
        fontSize:20,
        fontWeight: 'bold'
    },
    fixlabel:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:'space-between',
        width:'90%'
    },
    fixlabel1:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:'space-between',
        width:'90%',
        marginBottom:10,
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

export default UserModScreen;