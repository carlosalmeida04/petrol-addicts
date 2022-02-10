import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import { doc, getDocs, db, collection, setDoc, auth, Timestamp, query, orderBy } from "../../firebase/firebasehandler"
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import 'react-native-get-random-values'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '../Loading'


export default function Comments({ route }) {


    const [comment, setComment] = useState([])
    const [name, setName] = useState("")
    const [loaded, setLoaded] = useState(false)
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
            const comments = []
            commentSnapshot.forEach((doc) => {
                comments.push({
                    id: doc.id,
                    comment: doc.data().comment,
                    name: doc.data().name,
                    uid: doc.data().uid
                })
            })
            return comments
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getName().then((name) => {
            setName(name)
        })
        getComments().then((commentReturn) => {
            setComment(commentReturn)
            setLoaded(true)
        })
    }, [])


    return (
        <>
            {loaded ? <>
                <ScrollView style={{ height: "100%", backgroundColor: "#fff" }}>
                    {
                        comment.map((comment) => (
                            <View style={{ flexDirection: "row", alignItems: "center", marginStart: "2%", marginTop: "1%" }}>
                                <Image
                                    style={{
                                        borderWidth: 0.1,
                                        borderColor: "black",
                                        borderRadius: 100
                                    }}
                                    source={{
                                        height: 35,
                                        width: 35,
                                        uri: `https://avatars.dicebear.com/api/personas/${comment.name}.png`
                                    }}
                                />
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontWeight: "bold", marginStart: "2%" }}>{comment.name}</Text>
                                    <Text style={{ fontSize: 13, flexShrink: 1, marginStart: "2%" }}>{comment.comment}</Text>
                                </View>
                            </View>
                        ))
                    }

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

            </> : <Loading />}

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