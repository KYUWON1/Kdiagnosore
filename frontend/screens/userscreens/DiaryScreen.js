import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { GiftedChat, Send, Bubble, InputToolbar, Time } from 'react-native-gifted-chat';
import Logo from '../../assets/image/Logo.png';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DiaryScreen = ({navigation}) => {
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');
    const [apiBaseUrl, setApiBaseUrl] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            const storedUserId = await AsyncStorage.getItem('userID');
            const storedApiBaseUrl = await AsyncStorage.getItem('API_BASE_URL');
            setUserId(storedUserId);
            setApiBaseUrl(storedApiBaseUrl);
        };

        loadUserData();
    }, []);
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
            <View style={styles.leftHeader}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('MainMenu')} />
            </View>
            <View style={styles.centerHeader}>
                <Text style={{ fontSize: 20, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
            </View>
            <View style={styles.rightHeader}>
            <Text style={{ fontSize: 18, color: '#7C95EF' }}>목록</Text>
            </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between', // 요소들 사이에 공간 분배
        alignItems: 'center',
        width: '100%',
        height: 50,
        paddingHorizontal: 10, // 필요한 경우 패딩 추가
    },
    leftHeader: {
        flex: 1,
        marginLeft:10,
        alignItems: 'flex-start', // 왼쪽 정렬
    },
    centerHeader: {
        flex: 2,
        alignItems: 'center', // 가운데 정렬
    },
    rightHeader: {
        flex: 1,
        marginRight:10,
        alignItems: 'flex-end', // 오른쪽 정렬
    },
});

export default DiaryScreen;