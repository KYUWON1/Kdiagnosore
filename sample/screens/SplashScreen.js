import React from "react";
import {View, Text, Image} from "react-native";

export default function SplashScreen(){
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Image source={require('../assets/image/Logo.png')} style={{marginVertical:10, width:80, height:80}}/>
            <Text style={{fontSize:30, fontStyle:'italic', fontWeight:'700', marginVertical:10}}>Remember Me</Text>
        </View>
    )
}