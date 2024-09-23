import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation })  => {
    const [selectRole, setSelectRole] = useState('user');

    const handleSelection = (role) => {
        setSelectRole(role);
    };
    const handleNext = () => {
        if(selectRole==='user'){navigation.navigate('UserForm');}
        else if(selectRole==='protector'){navigation.navigate('ProtectorVerify')}
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('Login')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>회원가입</Text>
            </View>
            <View style={styles.title}>
                <Text style={styles.maintitle}>가입유형 선택</Text>
            </View>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <TouchableOpacity
                style={[
                styles.button1,
                selectRole === 'user' ? styles.selectedButton : styles.unselectedButton
                ]}
                onPress={() => handleSelection('user')}
                >
                <Text style={selectRole === 'user' ? styles.selectedtext : styles.unselectedtext}>사용자</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                    styles.button1,
                    selectRole === 'protector' ? styles.selectedButton : styles.unselectedButton
                    ]}
                    onPress={() => handleSelection('protector')}
                >
                    <Text style={selectRole === 'protector' ? styles.selectedtext : styles.unselectedtext}>보호자</Text>
                </TouchableOpacity>
            
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={{ fontSize: 20, color: '#fff' }}>다음 단계</Text>
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
    title: {
        marginVertical: 30,
        alignItems: 'center',
    },
    maintitle: {
        width: '90%',
        textAlign:'center',
        fontSize: 30,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        width: '90%',
    }, 
    button: {
        marginVertical: 50,
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
    },
    button1: {
        marginVertical: 10,
        width: 200,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 10,
    },
    selectedButton: {
        backgroundColor: '#6A5B92',  // 선택된 버튼의 배경색 (녹색)
      },
    unselectedButton: {
        backgroundColor: '#f0f0f0',  
    },
    selectedtext: {
        fontSize: 21,
        color: '#fff',
      },
    unselectedtext: {
        fontSize: 21,
        color: '#000',
      },
});

export default RegisterScreen;