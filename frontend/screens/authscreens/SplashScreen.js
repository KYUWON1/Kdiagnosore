import React from "react";
import {View, Text, Image} from "react-native";
import TypeWriter from 'react-native-typewriter';


export default function SplashScreen(){

    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#27A96C'}}>
            <Image source={require('../../assets/image/Logo.png')} style={{tintColor:'#fff', marginVertical:10, width:80, height:80}}/>
            <TypeWriter style={{fontSize:30, fontStyle:'italic', color:'#fff', fontWeight:'700', marginVertical:10}} typing={1} maxDelay={200}>Remember Me</TypeWriter>
        </View>
    )
}