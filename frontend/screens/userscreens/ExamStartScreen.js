import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExamStartScreen = ({ navigation }) => {
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [loading, setLoading] = useState(true);

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('ExamList')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>인지기능 검사</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.noticeTitle}>주의사항</Text>

                <ScrollView style={styles.noticeBox}>
                <Text style={styles.noticeText}>
                        지금부터 인지기능 검사를 시작하겠습니다.{"\n\n"}
                        질문에 대해 신중하게 선택하시고{"\n"}
                        다음 버튼을 클릭하여 주시기 바랍니다.{"\n\n"}
                        이 검사는 인지기능 상태를 점검하는 참고 자료일 뿐,
                        정확한 진단을 위해서는 의료 전문가의 상담이 필요합니다.{"\n\n"}
                        시작하시려면 아래의 "시작하기" {"\n"}버튼을 클릭해 주세요.
                    </Text>
                </ScrollView>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Exam')}>
                    <Text style={styles.buttonText}>시작하기</Text>
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
        //flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    noticeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 30,
    },
    noticeBox: {
        paddingHorizontal:20,
        paddingVertical: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#F9F9F9',
        marginVertical: 30,
        width:'90%',
    },
    noticeText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        lineHeight: 24,
    },
    scrollView: {
        flex: 1,
        marginBottom: 20,
    },
    button:{
        marginVertical:30,
        width:'90%',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0C9C57',
        borderRadius:10,
    },
    buttonText: {
        fontSize: 20, 
        color: '#fff',
        fontWeight:'600',
    },
});

export default ExamStartScreen;