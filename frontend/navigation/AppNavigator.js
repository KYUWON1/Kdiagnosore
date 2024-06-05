import React,{useContext} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, ActivityIndicator } from 'react-native';

import AuthStack from './AuthNavigator'
import ChatStack from './ChatNavigator'

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const {isLoading, userToken} = useContext(AuthContext);
    if(isLoading){
        return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size={'large'}/>
        </View>
        )
    }
    return(
        <NavigationContainer>
            {userToken !== null ? <ChatStack/> : <AuthStack/>}
        </NavigationContainer>
    );
};

export default AppNavigator;