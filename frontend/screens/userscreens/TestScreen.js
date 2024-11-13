import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, Image, Alert, ActivityIndicator, } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { all } from 'axios';
import Logo from '../../assets/image/Logo.png';

const TestScreen = ({ navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [answers, setAnswers] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [apiBaseUrl, setApiBaseUrl] = useState('');
    const [isTestEnded, setIsTestEnded] = useState(false); // 테스트 종료 여부 상태
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
            // 오늘 날짜 객체 생성
            const today = new Date();

            // 하루 전 날짜 계산
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate());

            // 날짜 형식화 함수
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
                const day = String(date.getDate()).padStart(2, '0');

                return `${year}-${month}-${day}`;
            };
            const date = formatDate(yesterday);
            if (apiBaseUrl) {
                try {
                    console.log(date);
                    const response = await axios.get(`${apiBaseUrl}/test/getlist/${date}`, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                    console.log(response);
                    if (response.status === 200) {
                        setQuestions(response.data);
                        const allAnswered = response.data.every(question => question.answer !== null);
                        if (allAnswered) {
                            setIsTestEnded(true); // 모든 답변이 있을 경우 종료 상태로 설정
                        }
                    } else {
                        Alert.alert('테스트 결과 가져오기 실패', '테스트 목록을 가져오는 중 문제가 발생했습니다.');
                    }
                } catch (error) {
                    Alert.alert('테스트 결과 가져오기 실패', '테스트 목록을 가져오는 중 문제가 발생했습니다.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchChatData();
    }, [apiBaseUrl]);

    
    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            const nextQuestionId = questions[currentIndex + 1].testId;
            setUserInput(answers[nextQuestionId] || ''); 
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            const prevQuestionId = questions[currentIndex - 1].testId;
            setUserInput(answers[prevQuestionId] || ''); 
        }
    };

    const handleSelectOption = (key) => {
        const currentQuestion = questions[currentIndex];
        setAnswers({ ...answers, [currentQuestion.testId]: key });
        setUserInput(''); 
    };

    const handleInputChange = (text) => {
        const currentQuestionId = questions[currentIndex].testId;
        setUserInput(text);
        setAnswers({ ...answers, [currentQuestionId]: text }); // 주관식 답변 저장
    };

    const handleSubmit = async() => {
        const allAnswered = questions.every((question) => {
            const isAnswered = question.gaggwan ? answers[question.testId] !== undefined : true;
            const isOpenEndedAnswered = !question.gaggwan ? answers[question.testId] !== undefined && answers[question.testId] !== "" : true;
            return isAnswered && isOpenEndedAnswered; 
        });
    
        if (!allAnswered) {
            Alert.alert("모든 질문에 응답해 주세요.");
            return;
        }
    
        try {
            // 모든 답변을 순회하며 개별적으로 API 호출
            const promises = Object.entries(answers).map(([testId, answer]) => {
                return axios.post(`${apiBaseUrl}/test/answer`, {
                    testId: testId,
                    answer: answer
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
            });
        
            // 모든 API 호출이 성공적으로 완료되었는지 확인
            const results = await Promise.all(promises);
        
            // 에러 없이 모든 API 호출이 완료된 경우에만 테스트 완료 알림
            if (results.every(response => response.status === 200)) {
                Alert.alert("테스트 완료", "답변이 제출되었습니다.");
                setIsTestEnded(true);
            }
    
        } catch (error) {
            Alert.alert("제출 실패", "답변 제출 중 오류가 발생했습니다.");
        }
    };

    const renderQuestion = () => {
        const currentQuestion = questions[currentIndex];

        if (!currentQuestion) return null;

        const questionText = currentQuestion.question.startsWith("Q ")
            ? currentQuestion.question.substring(2)
            : currentQuestion.question;

        return (
            <View style={styles.questionContainer}>
                <View style={styles.botMessageContainer}>
                    <Image source={Logo} style={styles.logo} />
                    <View style={styles.botMessageBox}>
                        <Text style={styles.botMessage}>
                            {questionText}
                        </Text>
                    </View>
                </View>
                {currentQuestion.gaggawnList ? (
                    <View style={styles.answerContainer}>
                        {Object.keys(currentQuestion.gaggawnList).map((key) => (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.answerButton,
                                    answers[currentQuestion.testId] === key && styles.selectedButton 
                                ]}
                                onPress={() => handleSelectOption(key)}
                            >
                                <Text style={styles.answerText} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={1}>
                                    {currentQuestion.gaggawnList[key].replace(/^\d+\s*/, '')} 
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.answerInputContainer}>
                        <TextInput
                            style={styles.input}
                            multiline={true} // Enable multiline input
                            numberOfLines={5}
                            placeholder="답변을 입력하세요"
                            placeholderTextColor="#A9A9A9"
                            value={userInput}
                            onChangeText={handleInputChange} // 변경된 부분
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.leftHeader}>
                    <AntDesign name='left' size={25} onPress={() => navigation.navigate('MainMenu')} />
                </View>
                <View style={styles.centerHeader}>
                    <Text style={{ fontSize: 20, fontWeight: '700', fontStyle: 'italic', color: '#000' }}>Today's Test</Text>
                </View>
                <View style={styles.rightHeader}>
                    <Text style={{ fontSize: 18, color: '#7C95EF' }} onPress={() => navigation.navigate('TestDrawer')}>목록</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                 {loading ? (
                    <ActivityIndicator size="large" color="#000" style={styles.loader} />
                ) : questions.length === 0 ? (
                    <Text style={styles.introText}>테스트할 질문이 없습니다.</Text>
                ) : (
                    <>
                        {/* 테스트 종료 여부에 따라 다른 메시지 출력 */}
                        <Text style={styles.introText}>
                            {isTestEnded ? "오늘의 테스트는 종료되었습니다." : "오늘의 테스트를 시작합니다!"}
                        </Text>

                        {/* 테스트가 종료되지 않았다면 질문 표시 */}
                        {!isTestEnded && renderQuestion()}
                        {!isTestEnded && (
                            <View style={styles.navigationContainer}>
                                <TouchableOpacity
                                    style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
                                    onPress={handlePrev}
                                    disabled={currentIndex === 0}
                                >
                                    <Text style={styles.navButtonText}>{"<"}</Text>
                                </TouchableOpacity>
                                <Text style={styles.pageIndicator}>
                                    {`${currentIndex + 1} / ${questions.length}`}
                                </Text>
                                <TouchableOpacity
                                    style={styles.navButton} // 항상 navButton 스타일을 적용
                                    onPress={currentIndex === questions.length - 1 ? handleSubmit : handleNext}
                                >
                                    <Text style={styles.navButtonText}>
                                        {currentIndex === questions.length - 1 ? "제출" : ">"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor: "#E0E0E0",
    },
    leftHeader: {
        flex: 1,
        marginLeft: 10,
        alignItems: 'flex-start',
    },
    centerHeader: {
        flex: 2,
        alignItems: 'center',
    },
    rightHeader: {
        flex: 1,
        marginRight: 10,
        alignItems: 'flex-end',
    },
    scrollContainer: {
        flex: 1,
        padding: 20,
    },
    introText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    botMessageContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginVertical: 5,
        padding: 5,
    },
    botMessageBox: {
        padding: 10,
        borderRadius: 25,
        backgroundColor: '#e6e6e6',
        fontSize: 18,
        minWidth: 100,
        maxWidth: '80%',
    },
    botMessage: {
        color: '#000',
        fontSize: 18,
        paddingHorizontal:5,
    },
    logo: {
        width: 35,
        height: 35,
        marginRight: 5,
        marginBottom: 10,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    answerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', 
        alignItems: 'center', 
        marginHorizontal:'5%',
        //width: '100%', 
    },
    answerButton: {
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        marginVertical: 10,
        width: '40%', 
        height:70,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '3%',
    },
    selectedButton: {
        borderColor:'#999fa2',
        backgroundColor: '#d1e7dd'
    },
    answerText: {
        fontSize: 20,
        textAlign: 'center',
    },
    answerInputContainer: {
        marginVertical: 10,
        alignItems:'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        fontSize: 18,
        width:'85%',
        height:100,
    },
    navigationContainer: {
        position: 'absolute',
        bottom: '50%',
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal:40,
    },
    navButton: {
        width:50,
        height:35,
        paddingVertical: 5, // 세로 패딩을 줄여서 텍스트가 중앙에 위치하게 함
        paddingHorizontal: 10, // 가로 패딩은 유지
        backgroundColor: '#0C9C57',
        borderRadius: 5,
        justifyContent:'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    navButtonText: {
        textAlign:'center',
        fontSize: 18,
        color: '#fff',
        fontWeight:'600',
    },
    pageIndicator: {
        fontSize: 18,
    },
});

export default TestScreen;