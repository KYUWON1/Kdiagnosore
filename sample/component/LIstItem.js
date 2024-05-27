import React from "react";
import { View, Text, StyleSheet} from "react-native";

export default function ListItem({id, text, date}){
    return(
        <View style={styles.list}>
            <Text style={styles.text}>{id}</Text>
            <Text 
            style={styles.titletext} numberOfLines={1}>{text}</Text>
            <Text style={styles.text}>{date}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    list:{
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:10, 
        borderBottomColor:'#B6B6B6', 
        borderBottomWidth:1,
        paddingVertical:10,
    },
    text:{
        flex:1, 
        textAlign:'center', 
        fontSize:18, 
        color:'#000',
        paddingVertical:5,
    },
    titletext:{
        flex:4, 
        width:'50%',
        fontSize:18, 
        fontWeight:500, 
        color:'#000',
        paddingVertical:5,
        paddingHorizontal:10,

    },
})