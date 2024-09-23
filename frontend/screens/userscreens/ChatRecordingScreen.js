import React, { useState, useEffect } from "react";
import {View, Text,SafeAreaView,TextInput, StyleSheet, FlatList, ScrollView,  Alert, ActivityIndicator, TouchableOpacity} from 'react-native'
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ListItem from "../../component/LIstItem";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatRecordingScreen = ({navigation}) => {
    const [recordingData, setRecordingData] = useState([]);
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

    useEffect(() => {
        const fetchChatData = async () => {
            if (apiBaseUrl) {
                try {
                    const response = await axios.get(`${apiBaseUrl}/chat/getlist`, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (response.status === 200) {
                        setRecordingData(response.data);
                    } else {
                        Alert.alert('채팅 가져오기 실패', '채팅 목록을 가져오는 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    Alert.alert('채팅 가져오기 실패', '채팅 목록을 가져오는 중 문제가 발생했습니다.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchChatData();
    }, [apiBaseUrl]);

    const handleItemPress = (selectdate) => {
        navigation.navigate('ChatDate', { selectdate });

    };

    return(
        <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('ChatMain')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width:'80%', textAlign:'center'}}>대화 기록</Text>
            </View>
            <View style={styles.listtitle}>
                <Text style={styles.idtext}>번호</Text>
                <Text style={styles.contenttext}>내용</Text>
                <Text style={styles.datetext}>날짜</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loader} />
            ) : (
            <ScrollView>
                 {recordingData.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleItemPress(item.date)}>
                            <ListItem
                                id={index + 1}
                                text={item.message}
                                date={item.date}
                                chatFrom={item.chatFrom}
                            />
                        </TouchableOpacity>
                    )).reverse()} 
            </ScrollView>
            )}
        </SafeAreaView>
    )
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
    headerText: {
        fontSize: 20,
        fontWeight: '700',
    },
    icon: {
        position: 'absolute',
        right: 20, 
    },
    idtext:{
        width:70,
        textAlign:'center', 
        fontSize:18, 
        fontWeight:600, 
        color:'#B6B6B6'
    },
    contenttext:{
        flex:1, 
        textAlign:'center', 
        fontSize:18, 
        fontWeight:600,
        color:'#B6B6B6'
    },
    datetext:{
        width:100,
        textAlign:'center', 
        fontSize:18, 
        fontWeight:600, 
        color:'#B6B6B6'
    },
    listtitle:{
        flexDirection:'row',
         alignItems:'center',
         marginHorizontal:10, 
         marginVertical:10,
         borderBottomColor:'#B6B6B6', 
         borderBottomWidth:1,
         paddingVertical:10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatRecordingScreen;