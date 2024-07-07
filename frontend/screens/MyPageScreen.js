import React from "react";
import {View, Text, SafeAreaView, StyleSheet} from 'react-native'


const MyPageScreen = ({navigation}) => {
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize:20, fontWeight:700}}>내 정보</Text>
            </View>
            <View style={styles.mypage}>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>이름</Text>
                    <Text style={styles.infocontent}>username</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>아이디</Text>
                    <Text style={styles.infocontent}>userID</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>전화번호</Text>
                    <Text style={styles.infocontent}>00000000000</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>보호자 이름</Text>
                    <Text style={styles.infocontent}>guardianname</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infotitle}>보호자 전화번호</Text>
                    <Text style={styles.infocontent}>00000000000</Text>
                </View>
            </View>
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
    mypage:{
        width:'90%,',
        marginTop:20,
        paddingHorizontal:20,

    },
    info:{
        flexDirection:'row',
        marginHorizontal:10,
        marginVertical:10,
        paddingVertical:10,
    },
    infotitle:{
        fontSize:18,
        fontWeight:'600',
        width:'40%',
    },
    infocontent:{
        marginLeft:20,
        fontSize:18,
    },

});

export default MyPageScreen;