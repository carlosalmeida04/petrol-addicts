import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect } from 'react'

import { doc, getDocs, db, collection } from "../../firebase/firebasehandler"


import Ionicons from "@expo/vector-icons/Ionicons"

export default function Comments({ route }) {


    const postId = route.params.postId

    async function getComments(id) {
        const docRef = collection(db, "posts", id, "comments")
        const snap = await getDocs(docRef)

        snap.forEach((doc) => {
            console.log(doc.data())
        })
    }

    useEffect(() => {
        getComments(postId)
    }, [])

    return (

        <KeyboardAvoidingView behavior='padding'>
            <ScrollView style={{ backgroundColor: "#fff", height: "100%" }}>

            </ScrollView>
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