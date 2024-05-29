import React from "react";
import {View, Text,SafeAreaView, StyleSheet} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const MyPageModScreen = ({navigation}) => {
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name='left' size={25} style={{marginHorizontal:10,}} onPress={()=>navigation.navigate('Setting1')}/>
                <Text style={{fontSize:20, fontWeight:700}}>내 정보 수정</Text>
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
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        height: 50,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor:"#E0E0E0",
        overflow: "hidden",
    },

});

export default MyPageModScreen;