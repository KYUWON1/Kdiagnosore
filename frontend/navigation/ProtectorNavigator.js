import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import TestListScreen from '../screens/protectorscreens/TestListScreen';
import TestResultScreen from '../screens/protectorscreens/TestResultScreen';
import SettingScreen from '../screens/protectorscreens/SettingScreen';
import UserModScreen from '../screens/protectorscreens/UserModScreen';
import ProtectorModScreen from "../screens/protectorscreens/ProtectorModScreen";
import MyPageModScreen from "../screens/protectorscreens/MyPageModScreen";
import MyPageScreen from "../screens/protectorscreens/MyPageScreen";
import PasswordModScreen from "../screens/userscreens/PasswordModScreen";
import InfoScreen from "../screens/protectorscreens/InfoScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
 
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const ProtectorNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TestList" component={TestListScreen} />
            <Stack.Screen name="TestResult" component={TestResultScreen} />
            <Stack.Screen name="SettingDrawer" component={SettingDrawer} />
        </Stack.Navigator>
    );
};

const SettingDrawer = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerType: 'slide',
                drawerStyle: { width: '100%' },
                drawerPosition: 'right', // SettingStack은 오른쪽에서 열림
            }}>
            <Drawer.Screen name="SettingStack" component={SettingStack} />
        </Drawer.Navigator>
    );
};

const SettingStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Setting" component={SettingScreen}/>
            <Stack.Screen name="MyPage" component={MyPageScreen}/>
            <Stack.Screen name="MyPageMod" component={MyPageModScreen}/>
            <Stack.Screen name="Info" component={InfoScreen}/>
            <Stack.Screen name="PasswordMod" component={PasswordModScreen}/>
            <Stack.Screen name="UserMod" component={UserModScreen}/>
            <Stack.Screen name="ProtectorMod" component={ProtectorModScreen}/>
        </Stack.Navigator>
        );
}

export default ProtectorNavigator;