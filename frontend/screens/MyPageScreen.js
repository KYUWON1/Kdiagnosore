import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import axios from 'axios';

const MyPageScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:8080/user/profile');
                setUserInfo(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserInfo();
    }, []);

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 20, fontWeight: '700' }}>내 정보</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!userInfo) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 20, fontWeight: '700' }}>내 정보</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: '700' }}>내 정보</Text>
            </View>
            <View style={styles.mypage}>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>이름</Text>
                    <Text style={styles.infocontent}>{userInfo.userName}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>아이디</Text>
                    <Text style={styles.infocontent}>{userInfo.userId}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>이메일</Text>
                    <Text style={styles.infocontent}>{userInfo.email}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>전화번호</Text>
                    <Text style={styles.infocontent}>{userInfo.phoneNum}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>보호자 이름</Text>
                    <Text style={styles.infocontent}>{userInfo.protectorName}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>보호자 전화번호</Text>
                    <Text style={styles.infocontent}>{userInfo.protectorNum}</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#E0E0E0',
        overflow: 'hidden',
    },
    mypage: {
        width: '90%',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    info: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 8,
    },
    infotitle: {
        fontSize: 18,
        fontWeight: '600',
        width: '45%',
    },
    infocontent: {
        marginLeft: 20,
        fontSize: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default MyPageScreen;
