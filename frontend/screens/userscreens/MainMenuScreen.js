import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Image, View, Text, TextInput, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Checkbox from "expo-checkbox";
import axios from 'axios';

const MainMenuScreen = ({ navigation }) => {

    useEffect(() => {
    
    }, []);

    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.rightHeader}>
                <FontAwesome name="cog" size={30} onPress={() => navigation.navigate('SettingDrawer')} />
            </View>
            <Text style={{ marginTop: 100, fontSize: 15, color: '#828282' }}>인지기능 훈련 챗봇</Text>
            <Text style={{ justifyContent: 'center', fontSize: 30, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Remember Me</Text>
            <Image source={require('../../assets/image/Logo.png')} style={{ width: 80, height: 80, marginVertical: 30 }} />
            <View style={styles.boxContainer}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('ChatMain')}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../../assets/image/Chat.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>대화 시작</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Diary')}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../../assets/image/Diary.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>오늘의 기록</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.box} onPress={() =>  navigation.navigate('Test')}>
                        <View style={styles.imageContainer2}>
                            <Image source={require('../../assets/image/Memory_check.png')} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.boxText}>기억력 테스트</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box} onPress={() => Alert.alert("인지 기능 검사")}>
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
    rightHeader: {
        position: 'absolute',
        top: 50,
        right: 20,
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