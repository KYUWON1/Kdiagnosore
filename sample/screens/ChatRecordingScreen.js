import React from "react";
import {View, Text,SafeAreaView,TextInput, StyleSheet, FlatList, ScrollView} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ListItem from "../component/LIstItem";

const ChatRecordingScreen = ({navigation}) => {
    const recordingdata = [ //임의로 지정
        {id:3, text:"오늘 저녁 뭐 먹었어?", date:'1월 5일'},
        {id:2, text:"오늘 점심 뭐 먹었어?", date:'1월 5일'},
        {id:1, text:"오늘 아침 뭐 먹었어?", date:'1월 5일'},
    ];
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize:20, fontWeight:700}}>대화 기록</Text>
            </View>
            <View style={styles.searchbar}>
                <View style={styles.search}>
                    <Ionicons name="search" size={20} color="#C6C6C6" style={{marginRight:5}}/>
                    <TextInput style={{fontSize:18}} placeholder="검색"/>
                </View>
                <Ionicons name="calendar-sharp" size={35} color="#000" style={{marginLeft:15}}/>
            </View>
            <View style={styles.listtitle}>
                <Text style={{flex:1, textAlign:'center', fontSize:18, fontWeight:600, color:'#B6B6B6'}}>번호</Text>
                <Text style={{flex:4, textAlign:'center', fontSize:18, fontWeight:600, color:'#B6B6B6'}}>제목</Text>
                <Text style={{flex:1, textAlign:'center', fontSize:18, fontWeight:600, color:'#B6B6B6'}}>날짜</Text>
            </View>
            <ScrollView>
                {recordingdata.map(item => (
                    <ListItem key={item.id} id={item.id} text={item.text} date={item.date}/>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header:{
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height: 50,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor:"#E0E0E0",
        overflow: "hidden",
    },
    searchbar:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        marginHorizontal:10,
        marginVertical:20,
    },
    search:{
        flexDirection:'row',
        alignItems:'center',
        width:'80%',
        height:45,
        borderColor:'#E0E0E0',
        borderWidth:1,
        borderRadius:10,
        paddingVertical:10,
        paddingHorizontal:10,
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
});

export default ChatRecordingScreen;