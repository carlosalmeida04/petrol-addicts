import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'


import Ionicons from "@expo/vector-icons/Ionicons"

export default function Comments() {
    return (

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : false} style={{ backgroundColor: "#fff", bottom: 0, position: "absolute", flex: 1 }}>

            <SafeAreaView style={styles.commentView}>
                <TextInput
                    style={styles.commentInput}
                    placeholder='Comentário'
                />
                <TouchableOpacity>
                    <Text style={{ color: "#F5A962" }}>Publicar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>

    )
}


const styles = StyleSheet.create({
    commentInput: {
        height: 40,
        width: "80%",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "black",
        paddingStart: 10,
        marginEnd: "3.5%",
        backgroundColor: "#eee"
    },
    commentView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    }
})