import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainMenuScreen from "../screens/userscreens/MainMenuScreen";
import ChatScreen from '../screens/userscreens/ChatScreen';
import ChatRecordingScreen from "../screens/userscreens/ChatRecordingScreen";
import ChatDateScreen from "../screens/userscreens/ChatDateScreen";
import MyPageScreen from "../screens/userscreens/MyPageScreen";
import SettingScreen from "../screens/userscreens/SettingScreen";
import SetAlarmScreen from "../screens/userscreens/SetAlarmScreen";
import MyPageModScreen from "../screens/userscreens/MyPageModScreen";
import PasswordModScreen from "../screens/userscreens/PasswordModScreen";
import UserPhoneModScreen from "../screens/userscreens/UserPhoneModScreen";
import ProtectorPhoneModScreen from "../screens/userscreens/ProtectorPhoneModScreen";
import DiaryScreen from "../screens/userscreens/DiaryScreen";
import DiaryListScreen from "../screens/userscreens/DiaryListScreen";
import DiaryContentScreen from "../screens/userscreens/DiaryContentScreen";
import TestScreen from "../screens/userscreens/TestScreen";
import TestListScreen from "../screens/userscreens/TestListScreen"
import TestDateScreen from "../screens/userscreens/TestDateScreen"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const UserNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainMenu" component={MainMenuScreen} />
            <Stack.Screen name="ChatMain" component={ChatScreen} />
            <Stack.Screen name="Diary" component={DiaryScreen} />
            <Stack.Screen name="DiaryList" component={DiaryListScreen} />
            <Stack.Screen name="DiaryContent" component={DiaryContentScreen} />
            <Stack.Screen name="Test" component={TestScreen} />
            <Stack.Screen name="TestDrawer" component={TestRecordStack} 
                options={{ animation: 'slide_from_right' }} // 왼쪽에서 오른쪽으로 슬라이드
            />
            <Stack.Screen name="ChatRecordDrawer" component={ChatRecordStack} 
                options={{ animation: 'slide_from_right' }} // 왼쪽에서 오른쪽으로 슬라이드
            />
            <Stack.Screen name="SettingDrawer" component={SettingStack}
                options={{ animation: 'slide_from_right' }} // 오른쪽에서 왼쪽으로 슬라이드
            />
        </Stack.Navigator>
    );
};

const ChatRecordDrawer = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerType: 'front', // Use 'front' for a sliding drawer
                drawerStyle: { width: '100%' },
                drawerPosition: 'left', // Opens from the left
            }}>
            <Drawer.Screen name="ChatRecordStack" component={ChatRecordStack} />
        </Drawer.Navigator>
    );
};

const SettingDrawer = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerType: 'front', // Use 'front' for a sliding drawer
                drawerStyle: { width: '100%' },
                drawerPosition: 'right', // Opens from the right
            }}>
            <Drawer.Screen name="SettingStack" component={SettingStack} />
        </Drawer.Navigator>
    );
};

const ChatRecordStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChatRecording" component={ChatRecordingScreen} />
            <Stack.Screen name="ChatDate" component={ChatDateScreen} />
        </Stack.Navigator>
    );
};

const TestRecordStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TestList" component={TestListScreen} />
            <Stack.Screen name="TestDate" component={TestDateScreen} />
        </Stack.Navigator>
    );
};

const SettingStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen name="MyPage" component={MyPageScreen} />
            <Stack.Screen name="MyPageMod" component={MyPageModScreen} />
            <Stack.Screen name="SetAlarm" component={SetAlarmScreen} />
            <Stack.Screen name="PasswordMod" component={PasswordModScreen} />
            <Stack.Screen name="UserPhoneMod" component={UserPhoneModScreen} />
            <Stack.Screen name="ProtectorPhoneMod" component={ProtectorPhoneModScreen} />
        </Stack.Navigator>
    );
};

export default UserNavigator;