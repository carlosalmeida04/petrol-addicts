import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, } from 'react-native'
import { doc, getDocs, db, collection, setDoc, auth, Timestamp, query, orderBy } from "../../firebase/firebasehandler"
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import 'react-native-get-random-values'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function Comments({ route }) {


    const [comment, setComment] = useState("")
    const [name, setName] = useState("")

    const postId = route.params.postId


    async function getName() {
        try {
            return await AsyncStorage.getItem("name")
        } catch (e) {
            console.log(e)
        }
    }

    async function makeComment() {
        try {
            const commentId = uuidv4()
            const addCommentColl = doc(db, "posts", postId, "comments", commentId)
            await setDoc(addCommentColl, {
                comment: comment,
                uid: auth.currentUser.uid,
                name: name,
                createdAt: Timestamp.fromDate(new Date())
            })
        } catch (e) {
            console.log(e)
        }

    }

    async function getComments() {
        try {
            const commentQuery = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "desc"))
            const commentSnapshot = await getDocs(commentQuery)
            commentSnapshot.forEach((doc) => {
                console.log(doc.id + "=>" + doc.data().comment)
            })

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getName().then((name) => {
            setName(name)
        })
        getComments()
    }, [])


    return (
        <>
            <ScrollView style={{ height: "100%", backgroundColor: "#fff" }}>

            </ScrollView>
            <SafeAreaView style={styles.commentView}>

                <TextInput
                    style={styles.commentInput}
                    onChangeText={text => setComment(text)}
                    placeholder='Comentario'
                    value={comment}
                />
                <TouchableOpacity
                    onPress={() => {
                        makeComment().then(() => {
                            setComment("")
                        })
                    }}
                    style={{ alignItems: "center", height: 40, justifyContent: "center", marginStart: "2%" }}>
                    <Text style={{ color: "#F5A962" }}>Publicar</Text>
                </TouchableOpacity>

            </SafeAreaView>
        </>

    )
}


const styles = StyleSheet.create({
    commentInput: {
        height: 40,
        paddingStart: 10,
        borderRadius: 5,
        width: "80%",
        backgroundColor: "#eee"
    },
    commentView: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        justifyContent: "center",
        backgroundColor: "#fff",
    }
})