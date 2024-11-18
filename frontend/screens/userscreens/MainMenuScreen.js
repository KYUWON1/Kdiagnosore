import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Image, View, Text, TextInput, Alert, StatusBar } from 'react-native';
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
                    const response = await axios.get(`${apiBaseUrl}/api/v1/user/profile`, {
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
                <Text style={styles.updetailtext}>매일의 작은 노력이 큰 변화를 만듭니다!</Text>
            </View>
            <View style={styles.boxContainer}>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.box, styles.box1]} onPress={() => navigation.navigate('ChatMain')}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../../assets/image/Chat.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>대화 시작</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.box, styles.box2]} onPress={() => navigation.navigate('Diary')}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../../assets/image/Diary.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>오늘의 기록</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.box, styles.box3]} onPress={() =>  navigation.navigate('Test')}>
                        <View style={styles.imageContainer2}>
                            <Image source={require('../../assets/image/Memory_check.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>기억력 테스트</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.box, styles.box4]} onPress={() => navigation.navigate('ExamList')}>
                        <View style={styles.imageContainer2}>
                            <Image source={require('../../assets/image/Test.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>인지 기능 검사</Text>
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
    header: {
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
    boxContainer: {
        marginTop:20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uptext:{
        fontSize:40,
        marginTop:5,
        fontWeight:'700'
    },
    updetailtext:{
        marginTop:10,
        fontSize:18,
        fontWeight:'500'
    },
    upContainer:{
        backgroundColor: '#FFFFFF', 
        height: 200,
        width: '80%',
        borderRadius: 10,
        justifyContent: 'center',
        marginHorizontal: 15,
        marginTop:50,
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
    box1: {
        backgroundColor: '#81CAF7',  
    },
    box2: {
        backgroundColor: '#FF8181',  
    },
    box3: {
        backgroundColor: '#9A67D9',
    },
    box4: {
        backgroundColor: '#63BDD8', 
    },
    imageContainer: {
        width: 50,  
        height: 50,  
        marginBottom:20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer2: {
        width: 65,  
        height: 65,  
        marginBottom:15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',  
        height: '100%', 
        tintColor: '#FFFFFF',
    },
    boxText: {
        fontSize: 16,
        color: '#fff',
        fontWeight:'700',
    },
    textborder: {
        fontSize: 17,
        color: '#828282',
        marginHorizontal: 10,
    },
});

export default MainMenuScreen;