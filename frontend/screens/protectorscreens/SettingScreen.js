import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = ({ navigation }) => {
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

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/logout.do`);
            if (response.status === 200) {
                Alert.alert('로그아웃 성공', '성공적으로 로그아웃 되었습니다.');
                delete axios.defaults.headers.common['Authorization'];
                navigation.replace('Auth'); // 로그인 화면으로 네비게이트
            } else {
                Alert.alert('로그아웃 실패', '로그아웃 중 문제가 발생했습니다.');
            }
        } catch (error) {
            Alert.alert('로그아웃 실패', '로그아웃 중 문제가 발생했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('MainMenu')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width:'80%', textAlign:'center'}}>설정</Text>
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <Text style={styles.settingcontent}>치매에 도움 되는 정보</Text>
                </View>
                <AntDesign name='right' size={25} style={{ marginHorizontal: 10, }} onPress={() => navigation.navigate('Info')} />
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <MaterialCommunityIcons name="account" size={25} style={{ marginLeft: 15 }}/>
                    <Text style={styles.settingcontent}>내 정보</Text>
                </View>
                <AntDesign name='right' size={25} style={{ marginHorizontal: 10, }} onPress={() => navigation.navigate('MyPage')} />
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <MaterialCommunityIcons name='account-circle' size={25} style={{ marginLeft: 15 }} />
                    <Text style={styles.settingcontent}>회원정보 수정</Text>
                </View>
                <AntDesign name='right' size={25} style={{ marginHorizontal: 10, }} onPress={() => navigation.navigate('MyPageMod')} />
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <Ionicons name='exit-outline' size={25} style={{ marginLeft: 15 }} />
                    <Text style={styles.settingcontent}>로그아웃</Text>
                </View>
                <AntDesign name='right' size={25} style={{ marginHorizontal: 10 }} onPress={handleLogout}/>
            </View>
            <View style={styles.settingout}>
                <Text style={{ color: '#B6B6B6', fontSize: 15, textAlign: 'right' }}>회원탈퇴</Text>
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
    setting: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#B6B6B6',
        borderBottomWidth: 1,
        paddingVertical: 20,
    },
    settingalarm: {
        borderBottomColor: '#B6B6B6',
        borderBottomWidth: 1,
        paddingVertical: 20,
    },
    setting1_box: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 20,
    },
    setting1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingcontent: {
        fontSize: 18,
        marginLeft: 10,
    },
    alarmdetail: {
        fontSize: 15,
        marginLeft: 50,
        marginTop: 10,
        color: '#828282',
    },
    settingout: {
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    }
});

export default SettingScreen;