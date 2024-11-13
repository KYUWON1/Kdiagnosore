import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Image, View, Text, TextInput, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Checkbox from "expo-checkbox";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainMenuScreen = ({ navigation }) => {
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [userName, setUserName] = useState('');
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
        const fetchData = async () => {
            if (apiBaseUrl) {
                try {
                    const response = await axios.get(`${apiBaseUrl}/user/profile`, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (response.status === 200) {
                        setUserName(response.data.userName);
                    } else {
                        Alert.alert('사용자 이름 가져오기 실패', '사용자 이름을 가져오는 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    Alert.alert('사용자 이름 가져오기 실패', '사용자 이름을 가져오는 중 문제가 발생했습니다.');
                } 
                   
            }
        };
        fetchData();
    }, [apiBaseUrl]);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.rememberMeText}>Remember Me</Text>
                <FontAwesome name="cog" size={30} onPress={() => navigation.navigate('SettingDrawer')} style={styles.settingsIcon} />
            </View>
            <View style={styles.upContainer}>
                <Text style={styles.uptext}>{userName}님</Text>
                <Text style={styles.uptext}>환영합니다!</Text>
                <Text style={styles.updetailtext}>테스트 결과를 확인해 보세요!</Text>
            </View>
            <View style={styles.boxContainer}>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.box, styles.box3]} onPress={() => navigation.navigate('TestList')}>
                        <View style={styles.imageContainer2}>
                            <Image source={require('../../assets/image/Memory_check.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>기억력 테스트</Text>
                        <Text style={styles.boxText}>결과 보기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.box, styles.box4]} onPress={() => navigation.navigate('ExamList')}>
                        <View style={styles.imageContainer2}>
                            <Image source={require('../../assets/image/Test.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>인지 기능 검사</Text>
                        <Text style={styles.boxText}>결과 보기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header:{
        width:'100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor: "#E0E0E0",
    },
    rememberMeText: {
        fontSize: 20,
        fontWeight: '700',
        fontStyle: 'italic',
        color: '#000',
        textAlign: 'center',
        flex: 1,
    },
    settingsIcon: {
        color: '#000',
        position: 'absolute',
        right: 20,
    },
    upContainer:{
        backgroundColor: '#FFFFFF', 
        height: 200,
        width: '80%',
        borderRadius: 10,
        justifyContent: 'center',
        marginHorizontal: 15,
        marginTop:100,
    },uptext:{
        fontSize:40,
        marginTop:5,
        fontWeight:'700'
    },
    updetailtext:{
        marginTop:10,
        fontSize:18,
        fontWeight:'500'
    },
    boxContainer: {
        marginTop: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center', 
        marginBottom: 30, 
    },
    box: {
        width: 150, 
        height: 150, 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 15,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 6 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 6, 
        elevation: 5, 
    },
    box3: {
        backgroundColor: '#9A67D9',
    },
    box4: {
        backgroundColor: '#63BDD8', 
    },
    imageContainer2: {
        width: 65,  
        height: 65,  
        marginBottom: 10, // 이미지와 텍스트 간의 간격 조정
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',  
        height: '100%', 
        tintColor:'#fff',
    },
    boxText: {
        fontSize: 16,
        color: '#fff',
         fontWeight:'700',
        textAlign: 'center', // 텍스트 정렬을 중앙으로 설정
    },
});

export default MainMenuScreen;