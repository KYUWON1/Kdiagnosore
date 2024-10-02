import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Image, View, Text, TextInput, Alert } from 'react-native';
import Checkbox from "expo-checkbox";
import axios from 'axios';

const MainMenuScreen = ({ navigation }) => {

    useEffect(() => {
    
    }, []);

    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ marginTop: 100, fontSize: 15, color: '#828282' }}>인지기능 훈련 챗봇</Text>
            <Text style={{ justifyContent: 'center', fontSize: 30, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
            <Image source={require('../../assets/image/Logo.png')} style={{ width: 80, height: 80, marginVertical: 30 }} />
            <View style={styles.boxContainer}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('ChatMain')}>
                        <Image source={require('../../assets/image/Chat.png')} style={{ width: 60, height: 60, marginVertical: 20 }} />
                        <Text style={styles.boxText}>대화 시작</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Diary')}>
                        <Image source={require('../../assets/image/Diary.png')} style={{ width: 60, height: 60, marginVertical: 20 }} />
                        <Text style={styles.boxText}>오늘의 기록</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.box} onPress={() => Alert.alert("Box 3 pressed")}>
                        <Image source={require('../../assets/image/Memory_check.png')} style={{ width: 80, height: 80, marginVertical: 10 }} />
                        <Text style={styles.boxText}>기억력 테스트</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box} onPress={() => Alert.alert("Box 4 pressed")}>
                        <Image source={require('../../assets/image/Test.png')} style={{ width: 80, height: 80, marginVertical: 10 }} />
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
    boxContainer: {
        marginTop:20,
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
        borderWidth:2,
        borderColor:"#a9a9a9",
        marginHorizontal: 15, 
    },
    boxText: {
        fontSize: 16,
        color: '#000',
    },
    textborder: {
        fontSize: 17,
        color: '#828282',
        marginHorizontal: 10,
    },
});

export default MainMenuScreen;