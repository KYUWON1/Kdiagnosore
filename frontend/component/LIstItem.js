import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ListItem({ id, text, date, chatFrom }) {
    const formatDate = date.replace(/-/g, '.'); // '-'를 '.'로 교체
    return (
        <View style={styles.list}>
             <View style={styles.idContainer}>
                <Text style={styles.idText}>{id}</Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={[styles.messageBubble, chatFrom === 'USER' ? styles.userBubble : styles.botBubble]}>
                    <Text style={styles.messageText} numberOfLines={1} ellipsizeMode='tail'>{text}</Text>
                    <View style={[styles.triangle, chatFrom === 'USER' ? styles.userTriangle : styles.botTriangle]} />
                </View>
            </View>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{formatDate}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        alignItems:'center',
        marginHorizontal: 10,
        borderBottomColor: '#B6B6B6',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    idContainer: {
        width: 70,
        alignItems: 'center', 
    },
    idText: {
        fontSize: 18,
        color: '#000',
        paddingVertical: 5,
    },
    contentContainer: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center', 
        marginHorizontal: 10,
    },
    messageBubble: {
        //maxWidth: '90%', 
        padding: 10,
        borderRadius: 15,
        position: 'relative',
    },
    userBubble: {
        backgroundColor: '#d1e7dd',
    },
    botBubble: {
        backgroundColor: '#f0f0f0',
    },
    messageText: {
        fontSize: 18,
        color: '#000',
    },
    dateContainer: {
        width: 100, 
        alignItems: 'center', 
    },
    dateText: {
        fontSize: 18,
        color: '#6D6D6D', 
        paddingVertical: 5,
    },
    triangle: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderWidth: 10,
        borderColor: 'transparent',
    },
    userTriangle: {
        borderTopColor: '#d1e7dd',
        borderBottomWidth: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        marginTop: 8,
        marginLeft: -8,
    },
    botTriangle: {
        borderTopColor: '#f0f0f0',
        borderBottomWidth: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        marginTop: 8,
        marginLeft: -8,
    },
});