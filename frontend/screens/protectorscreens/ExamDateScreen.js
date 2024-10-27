import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Modal, Image, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ExamDateScreen = ({ route, navigation }) => {
    const { selectdate } = route.params;
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(0);
    const [description, setDescription] = useState('');
    const [TestData, setTestData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            const storedApiBaseUrl = await AsyncStorage.getItem('API_BASE_URL');
            setApiBaseUrl(storedApiBaseUrl);
        };

        loadUserData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (apiBaseUrl && selectdate) {
                try {
                    const date = encodeURIComponent(selectdate);
                    const response = await axios.get(`${apiBaseUrl}/question/result/${date}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 200) {
                        setTestData(response.data.test);
                        setResult(response.data.result);
                        setDescription(response.data.description);
                    } else {
                        Alert.alert('결과 가져오기 실패', '테스트 결과 목록을 가져오는 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    Alert.alert('결과 가져오기 실패', '테스트 결과 목록을 가져오는 중 문제가 발생했습니다.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [apiBaseUrl]);

    const renderIcon = (score) => {
        if (score <= 3) {
            return <Image source={require('../../assets/image/Best.png')} />;
        } else if (score <= 5) {
            return <Image source={require('../../assets/image/Good.png')} />;
        } else if (score <= 7) {
            return <Image source={require('../../assets/image/Danger.png')} />;
        } else {
            return <Image source={require('../../assets/image/Hospital.png')} />;
        }
    };

    const renderDetail = () => {
        return Object.entries(TestData).map(([question, answer]) => {
            let answerText;
            switch (answer) {
                case 0:
                    answerText = '아니다';
                    break;
                case 1:
                    answerText = '그렇다';
                    break;
                case 2:
                    answerText = '매우 그렇다';
                    break;
                default:
                    answerText = '알 수 없음';
            }

            return (
                <View key={question} style={styles.detailContainer}>
                    <Text style={styles.detailQuestion}>{question}</Text>
                    <View style={styles.answerContainer}>
                            <Entypo name="arrow-right" size={25} color="#7B6EAB" />
                        <Text style={styles.detailAnswer}>{answerText}</Text>
                    </View>
                    <View style={styles.separator} />
                </View>
            );
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('ExamList')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>인지기능 검사 결과</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.noticeTitle}>검사 결과</Text>

                <View style={styles.noticeBox}>
                    <View style={styles.noticeview}>
                        <Text style={styles.noticeText}>{result}점</Text>
                    </View>
                    {renderIcon(result)}
                    <View style={styles.noticeview}>
                        <Text style={styles.noticeText1}>{description}</Text>
                    </View>
                </View>
                {/* 모달 창 */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>검사 세부사항</Text>
                            <ScrollView style={styles.scrollView}>
                                {renderDetail()}
                            </ScrollView>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>세부사항 보기</Text>
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
    content: {
        flex: 1,
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
    noticeview: {
        marginVertical: 40,
    },
    noticeText: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
    },
    noticeText1: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        marginVertical: 10,
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        height: '70%',
        backgroundColor: 'white',
        paddingTop:20,
        borderRadius: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        maxHeight: '70%', // 스크롤뷰의 최대 높이 늘리기
        width: '100%',
    },
    detailContainer: {
        marginBottom: 30, // 질문과 답변 사이 여백 추가
        width: '100%',
        alignItems: 'flex-start', // 왼쪽 정렬
    },
    detailQuestion: {
        fontSize:18,
    },
    answerContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // 가로 중앙 정렬
        alignItems: 'center',
        marginTop:10, // 질문과 답변 사이 여백 추가
    },
    detailAnswer: {
        fontSize:18,
        marginLeft:5,
        fontWeight: '600',
    },
    arrowBackground: {
        backgroundColor: '#7B6EAB', // 보라색 배경
        padding: 2, // 약간의 패딩 추가
        borderRadius: 5, // 모서리 둥글게
    },
    separator: {
        height: 1, // 선의 높이
        backgroundColor: '#E0E0E0', // 선 색상
        width: '100%', // 선 너비
        marginTop: 20, // 선 위 아래 여백
    },
    closeButton: {
        marginTop: 20,
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
    },
});

export default ExamDateScreen;