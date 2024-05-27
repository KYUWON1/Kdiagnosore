import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const LoginNavigator = () => {
    return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
    </Stack.Navigator>
    );
};

export default LoginNavigator;