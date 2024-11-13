import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExamScreen = ({ navigation }) => {
    const [testData, setTestData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [testId, setTestId] = useState('');
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [showStory, setShowStory] = useState(false);
    const [randomType] = useState(Math.random() < 0.5 ? 'SDQ' : 'KDSQ');

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
                    const response = await axios.get(`${apiBaseUrl}/question?type=${randomType}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 200) {
                        setTestId(response.data.testId);
                        setTestData(response.data.testList);
                    } else {
                        Alert.alert('테스트 가져오기 실패', '테스트 질문을 가져오는 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    Alert.alert('테스트 가져오기 실패', '테스트 질문을 가져오는 중 문제가 발생했습니다.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [apiBaseUrl]);

    const handleAnswerSelect = (answerValue) => {
        setAnswers((prev) => ({
            ...prev,
            [testData[currentQuestionIndex].question]: answerValue,
        }));
    };

    const handleNextQuestion = () => {
        if (answers[testData[currentQuestionIndex].question] === undefined) {
            Alert.alert("질문에 대한 답변을 선택해주세요."); // 경고 메시지 표시
            return;
        }
        else if (currentQuestionIndex < testData.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setShowStory(false);
        } else {
            handleSubmit(); // 마지막 질문이면 제출 함수 호출
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            setShowStory(false);
        }
    };

    const handleSubmit = async() => {
        const results = Object.keys(answers).reduce((acc, question) => {
            acc[question] = answers[question];
            return acc;
        }, {});
        try {
            const response = await axios.post(`${apiBaseUrl}/question?testId=${testId}`,JSON.stringify(results), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                Alert.alert('제출 완료', '테스트 결과가 정상적으로 제출되었습니다.');
                const totalScore = response.data.totalScore;
                const description = response.data.description;
                navigation.navigate('ExamResult', {
                    totalScore,
                    description,
                });
            } else {
                Alert.alert('제출 실패', '테스트 제출 중 문제가 발생했습니다.');
            }
        } catch (error) {
            Alert.alert('제출 실패', '테스트 제출 문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStory = () => {
        setShowStory((prev) => !prev);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('ExamList')} />
                <Text style={{ fontSize: 20, fontWeight: '700', width: '80%', textAlign: 'center' }}>인지기능 검사</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loader} />
            ) : (
                <ScrollView contentContainerStyle={{justifyContent: 'center',alignItems: 'center',}}>
                    <View style={{width:'90%', alignItems:'center'}}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>진행상황</Text>
                        <Text style={styles.progressNumber}>{currentQuestionIndex + 1} / {testData.length}</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={{ ...styles.progressFill, width: `${((currentQuestionIndex + 1) /  testData.length) * 100}%` }} />
                    </View>
                    <View style={[styles.questionBox, showStory && styles.questionBoxActive]}>
                        <TouchableOpacity onPress={handleToggleStory} style={styles.storyButton}>
                            <Text style={styles.storybuttontext}>{showStory ? '스토리 접기' : '스토리 보기'}</Text>
                        </TouchableOpacity>
                        <ScrollView contentContainerStyle={styles.questionContent}>
                            <View style={styles.centeredContent}>
                                {showStory ? (
                                    <View style={styles.storyContent}>
                                        <Text style={styles.storyText}>{testData[currentQuestionIndex].story}</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.questionText}>{testData[currentQuestionIndex].question}</Text>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.answerOptions}>
                        <TouchableOpacity onPress={() => handleAnswerSelect(0)} style={[styles.optionButton, answers[testData[currentQuestionIndex].question] === 0 && styles.selectedOptionButton]}>
                            <Text style={styles.buttontext}>아니다</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleAnswerSelect(1)} style={[styles.optionButton, answers[testData[currentQuestionIndex].question] === 1 && styles.selectedOptionButton]}>
                            <Text style={styles.buttontext}>그렇다</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleAnswerSelect(2)} style={[styles.optionButton, answers[testData[currentQuestionIndex].question] === 2 && styles.selectedOptionButton]}>
                            <Text style={styles.buttontext}>아주 그렇다</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity onPress={handlePreviousQuestion} disabled={currentQuestionIndex === 0} style={styles.prevButton}>
                            <Text style={styles.prevButtonText}>이전</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextQuestion} style={styles.nextButton}>
                            <Text style={styles.nextButtonText}>{currentQuestionIndex === testData.length - 1 ? '제출' : '다음'}</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#000',
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
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical:20,
        //padding: 10,
    },
    progressText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    progressNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    progressBar: {
        width: '100%',
        height: 15,
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0C9C57',
        borderRadius:10,
    },
    questionBox: {
        width:'100%',
        height: 250, // Height increased for the question box
        marginVertical: 20,
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden', 
    },
    centeredContent: {
        marginTop:10,
        flexGrow: 1, 
        //flex: 1, // Flex가 1로 설정되어 질문 상자의 전체 높이를 차지하게 함
        justifyContent: 'center', // 세로 방향 중앙 정렬
        alignItems: 'center', // 가로 방향 중앙 정렬
        paddingVertical: 20, // 위아래 여백 조정 (필요에 따라 조정)
        paddingHorizontal:20,
    },
    questionContent: {
        flexGrow: 1, 
        alignItems: 'center',
    },
    questionText: { 
        fontSize: 20,
        textAlign: 'center',
    },
    questionBoxActive: {
        backgroundColor: '#E4E4E4', // 회색 배경색 추가
    },
    storyButton: {
        //marginTop: 10,
        padding: 10,
        backgroundColor: '#27A96C',
        borderRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        right: 7,
        top: 7,
        zIndex: 1,
    },
    storyContent: {
        marginTop: 10,
        backgroundColor: '#E4E4E4',
        borderRadius: 5,
        padding: 10,
    },
    storyText: {
        fontSize: 20,
        color: '#000',
    },
    answerOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    optionButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius:5,
        padding: 10,
        marginHorizontal: 2, // Adjust margin to make buttons stick together
        alignItems: 'center',
        justifyContent:'center',
        height:70,
    },
    storybuttontext:{
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
        color:'#fff'
    },
    buttontext:{
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '500',
        color:'#000'
    },
    selectedOptionButton: {
        borderColor: '#999fa2',
        backgroundColor: '#d1e7dd',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    prevButton: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#0C9C57',
        borderRadius:5,
        backgroundColor: 'transparent',
        padding: 15,
        alignItems: 'center',
        marginRight:10,
    },
    nextButton: {
        flex: 1,
        borderRadius:5,
        backgroundColor: '#0C9C57',
        padding: 15,
        alignItems: 'center',
        marginLeft:10,
    },
    prevButtonText: {
       fontSize:18,
       fontWeight:'600',
    },
    nextButtonText: {
        color: 'white',
        fontSize:18,
        fontWeight:'600',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ExamScreen;