import React,{useContext} from "react";
import {View, Text,SafeAreaView, StyleSheet} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { AuthContext } from "../context/AuthContext";

const SettingScreen = ({navigation}) => {
    const {logout} = useContext(AuthContext);
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize:20, fontWeight:700}}>설정</Text>
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <MaterialCommunityIcons name="account" size={25} style={{marginLeft:15}}/>
                    <Text style={styles.settingcontent}>내 정보 수정</Text>
                </View>
                <AntDesign name='right' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('MyPageMod')}/>
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <MaterialCommunityIcons name='alarm' size={25} style={{marginLeft:15}}/>
                    <Text style={styles.settingcontent}>알림 설정</Text>
                </View>
                <AntDesign name='right' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('SetAlarm')}/>
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <MaterialCommunityIcons name='account-circle' size={25} style={{marginLeft:15}}/>
                    <Text style={styles.settingcontent}>계정 설정</Text>
                </View>
                <AntDesign name='right' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('SetAccount')}/>
            </View>
            <View style={styles.setting}>
                <View style={styles.setting1}>
                    <Ionicons name='exit-outline' size={25} style={{marginLeft:15}}/>
                    <Text style={styles.settingcontent}>로그아웃</Text>
                </View>
                <AntDesign name='right' size={25} style={{marginHorizontal:10,}} onPress={()=>{logout()}}/>
            </View>
            <View style={styles.settingout}>
                <Text style={{color:'#B6B6B6', fontSize:15, textAlign:'right'}}>회원탈퇴</Text>
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
    setting:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomColor:'#B6B6B6', 
        borderBottomWidth:1,
        paddingVertical:20,
    },
    setting1:{
        flexDirection:'row',
        alignItems:'center',
    },
    settingcontent:{
        fontSize:18,
        marginLeft:10,

    },
    settingout:{
        justifyContent:'center',
        paddingVertical:20,
        paddingHorizontal:20,
    }

});

export default SettingScreen;