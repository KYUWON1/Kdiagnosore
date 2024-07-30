import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"

import LoginScreen from '../screens/LoginScreen';
import FindIdVerifyScreen from "../screens/FindIdVerifyScreen";
import FindIdScreen from "../screens/FindIdScreen";
import FindPasswordVerifyScreen from "../screens/FindPasswordVerifyScreen";
import FindPasswordScreen from "../screens/FindPasswordScreen";
import RegisterScreen from '../screens/RegisterScreen';
import Register_PhoneNumScreen from '../screens/Register_PhoneNumScreen'
import Register_ProtectorNumScreen from "../screens/Register_ProtectorNumScreen";
import RegisterAcceptScreen from "../screens/RegisterAcceptScreen";
import ChatScreen from '../screens/ChatScreen';
import ChatRecordingScreen from "../screens/ChatRecordingScreen";
import MyPageScreen from "../screens/MyPageScreen";
import SettingScreen from "../screens/SettingScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SetAlarmScreen from "../screens/SetAlarmScreen";
import SetAccountScreen from "../screens/SetAccountScreen";
import MyPageModScreen from "../screens/MyPageModScreen";
import PasswordModScreen from "../screens/PasswordModScreen";
import PhoneNumModScreen from "../screens/PhoneNumModScreen";
import ProtectorNumModScreen from "../screens/ProtectorNumModScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="FindIdVerify" component={FindIdVerifyScreen}/>
        <Stack.Screen name="FindId" component={FindIdScreen}/>
        <Stack.Screen name="FindPasswordVerify" component={FindPasswordVerifyScreen}/>
        <Stack.Screen name="FindPassword" component={FindPasswordScreen}/>
        <Stack.Screen name="Register" component={RegisterStack}/>
        <Stack.Screen name="RegisterAccept" component={RegisterAcceptScreen}/>
        <Stack.Screen name="App" component={AppStack}/>
    </Stack.Navigator>
    );
};

const RegisterStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Register1" component={RegisterScreen}/>
            <Stack.Screen name="RegisterPhoneNum" component={Register_PhoneNumScreen}/>
            <Stack.Screen name="RegisterProtectorNum" component={Register_ProtectorNumScreen}/>
        </Stack.Navigator>
    )
}

const AppStack = () => {
    return(
    <Tab.Navigator screenOptions={{
        headerShown:false,
        tabBarInactiveTintColor: "#AAA",
        tabBarActiveTintColor: '#000',

    }}>
        <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
            tabBarLabel:'채팅창',
            tabBarIcon:({color, size})=>(
                <MaterialCommunityIcons name="chat-processing" color={color} size={size}/>
            ),}}/>
        <Tab.Screen
        name="ChatRecording"
        component={ChatRecordingScreen}
        options={{
            tabBarLabel:'대화 기록',
            tabBarIcon:({color, size})=>(
                <FontAwesome name="tasks" color={color} size={size}/>
            ),}}/>
        <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
            tabBarLabel:'내 정보',
            tabBarIcon:({color, size})=>(
                <MaterialCommunityIcons name="account" color={color} size={size}/>
            ),}}/>
        <Tab.Screen
        name="Setting"
        component={SettingStack}
        options={{tabBarLabel:'설정',
            tabBarIcon:({color, size})=>(
                <FontAwesome name="cog" color={color} size={size}/>
            ),}}/>
    </Tab.Navigator>
    )

};

const SettingStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Setting1" component={SettingScreen}/>
            <Stack.Screen name="MyPageMod" component={MyPageModScreen}/>
            <Stack.Screen name="SetAlarm" component={SetAlarmScreen}/>
            <Stack.Screen name="SetAccount" component={SetAccountScreen}/>
            <Stack.Screen name="PasswordMod" component={PasswordModScreen}/>
            <Stack.Screen name="PhoneNumMod" component={PhoneNumModScreen}/>
            <Stack.Screen name="ProtectorNumMod" component={ProtectorNumModScreen}/>
        </Stack.Navigator>
        );
}

export default AppNavigator;