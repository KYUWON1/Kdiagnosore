import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterAcceptScreen from "../screens/RegisterAcceptScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="RegisterAccept" component={RegisterAcceptScreen}/>
    </Stack.Navigator>
    );
};

export default AuthNavigator;