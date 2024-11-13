import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExamResultScreen = ({ route,navigation }) => {
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const { totalScore, description } = route.params; 

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

    const renderIcon = (score) => {
        if (score <= 3) {
            return <Image source={require('../../assets/image/Best.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }}/>;
        } else if (score <= 5) {
            return <Image source={require('../../assets/image/Good.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }}/>;
        } else if (score <= 7) {
            return <Image source={require('../../assets/image/Danger.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }}/>;
        } else {
            return <Image source={require('../../assets/image/Hospital.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('ExamList',{ refresh: true })} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>인지기능 검사</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.noticeTitle}>검사 결과</Text>
                
                <View style={styles.noticeBox}>
                    <View style={styles.noticeview}>
                    <Text style={styles.noticeText}>{totalScore}점</Text>
                    </View>
                    {renderIcon(totalScore)}
                    <View style={styles.noticeview}>
                    <Text style={styles.noticeText1}>{description}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ExamList', { refresh: true })}>
                    <Text style={styles.buttonText}>확인</Text>
                </TouchableOpacity>
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
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor: "#E0E0E0",
        overflow: "hidden",
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
    },
    noticeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 30,
        textAlign: 'center',
    },
    noticeBox: {
        marginVertical:20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '80%',
        alignItems: 'center',
        borderColor: '#ccc', // 회색 테두리 색상
        borderWidth: 1, // 테두리 두께
        borderRadius: 10, // 둥근 모서리
    },
    noticeview:{
        marginVertical:40,
    },
    noticeText: {
        fontSize:30,
        fontWeight:'600',
        textAlign: 'center',
    },
    noticeText1: {
        fontSize: 20,
        fontWeight:'600',
        textAlign: 'center',
        lineHeight: 24,
    },
    button:{
        marginVertical:10,
        width:'50%',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0C9C57',
        borderRadius:10,
    },
    buttonText: {
        fontSize: 20, 
        color: '#fff', 
        fontWeight:'600'
    },
});

export default ExamResultScreen;