import { React, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';
import Toogle from "../component/Toogle";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = ({ navigation }) => {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        // 알림 설정 버튼 on/off
        setIsOn(previousState => !previousState);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:8080/logout.do');
            if (response.status === 200) {
                Alert.alert('로그아웃 성공', '성공적으로 로그아웃 되었습니다.');
                delete axios.defaults.headers.common['Authorization'];
                navigation.navigate('Login'); // 로그인 화면으로 네비게이트
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
                <Text style={{ fontSize: 20, fontWeight: '700' }}>설정</Text>
            </View>
            <View style={styles.settingalarm}>
                <View style={styles.setting1_box}>
                    <View style={styles.setting1}>
                        <MaterialCommunityIcons name='alarm' size={25} style={{ marginLeft: 15 }} />
                        <Text style={styles.settingcontent}>알림 설정</Text>
                    </View>
                    <Toogle onToggle={handleToggle} isOn={isOn} />
                </View>
                <View>
                    <Text style={styles.alarmdetail}>알림을 설정하면 챗봇이 주기적으로 대화를 신청합니다.</Text>
                </View>
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <MaterialCommunityIcons name='account-circle' size={25} style={{ marginLeft: 15 }} />
                    <Text style={styles.settingcontent}>회원정보 수정</Text>
                </View>
                <AntDesign name='right' size={25} style={{ marginHorizontal: 10, }} onPress={() => navigation.navigate('MyPageMod')} />
            </View>
            <TouchableOpacity style={styles.setting} onPress={handleLogout}>
                <View style={styles.setting1}>
                    <Ionicons name='exit-outline' size={25} style={{ marginLeft: 15 }} />
                    <Text style={styles.settingcontent}>로그아웃</Text>
                </View>
                <AntDesign name='right' size={25} style={{ marginHorizontal: 10 }} />
            </TouchableOpacity>
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
        justifyContent: 'center',
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

