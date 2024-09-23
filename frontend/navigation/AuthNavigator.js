import React from "react";

import LoginScreen from '../screens/authscreens/LoginScreen';
import RegisterScreen from "../screens/authscreens/RegisterScreen";
import FindIdVerifyScreen from "../screens/authscreens/FindIdVerifyScreen";
import FindIdScreen from "../screens/authscreens/FindIdScreen";
import FindPasswordVerifyScreen from "../screens/authscreens/FindPasswordVerifyScreen";
import FindPasswordScreen from "../screens/authscreens/FindPasswordScreen";
import UserFormScreen from '../screens/authscreens/UserFormScreen';
import UserPhoneScreen from '../screens/authscreens/UserPhoneScreen'
import ProtectorPhone1Screen from "../screens/authscreens/ProtectorPhone1Screen";
import ProtectorFormScreen from "../screens/authscreens/ProtectorFormScreen"
import ProtectorPhone2Screen from "../screens/authscreens/ProtectorPhone2Screen";
import ProtectorVerifyScreen from "../screens/authscreens/ProtectorVerifyScreen";
import AlarmScreen from "../screens/authscreens/AlarmScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({setAuthType}) => {
    return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="FindIdVerify" component={FindIdVerifyScreen}/>
        <Stack.Screen name="FindId" component={FindIdScreen}/>
        <Stack.Screen name="FindPasswordVerify" component={FindPasswordVerifyScreen}/>
        <Stack.Screen name="FindPassword" component={FindPasswordScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="UserForm" component={UserFormScreen}/>
        <Stack.Screen name="UserPhone" component={UserPhoneScreen}/>
        <Stack.Screen name="ProtectorPhone1" component={ProtectorPhone1Screen}/>
        <Stack.Screen name="ProtectorForm" component={ProtectorFormScreen}/>
        <Stack.Screen name="ProtectorPhone2" component={ProtectorPhone2Screen}/>
        <Stack.Screen name="ProtectorVerify" component={ProtectorVerifyScreen}/>
        <Stack.Screen name="Alarm" component={AlarmScreen}/>
    </Stack.Navigator>
    );
};

export default AuthNavigator;