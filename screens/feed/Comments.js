import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import { doc, getDocs, db, collection, setDoc, auth, Timestamp, query, orderBy } from "../../firebase/firebasehandler"
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import Loading from '../Loading'

export default function Comments({ route, navigation }) {


    const [comment, setComment] = useState("")
    const [name, setName] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [comments, setComments] = useState([])
    const postId = route.params.postId


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
        AsyncStorage.getItem("name").then((name) => setName(name))
        loaded || getComments().then((commentReturn) => {
            setComments(commentReturn)
            setLoaded(true)
        })
    }, [loaded])


    return (
        <>
            {loaded ? <>
                <ScrollView style={{ height: "100%", backgroundColor: "#fff" }}>
                    {
                        comments.length === 0 ?
                            <View style={{ flex: 1, alignItems: "center", marginTop: "80%" }}>
                                <Text>Ainda não há comentários. Seja o primeiro a comentar!</Text>
                            </View>
                            :
                            comments.map((comment) => (
                                <View style={{ flexDirection: "row", alignItems: "center", marginStart: "2%", marginTop: "1%" }} key={comment.id}>
                                    <Image
                                        style={{
                                            borderRadius: 100
                                        }}
                                        source={{
                                            height: 40,
                                            width: 40,
                                            uri: `https://avatars.dicebear.com/api/personas/${comment.name}.png`
                                        }}
                                    />
                                    <View style={{ flexDirection: "row", flexShrink: 1, alignItems: "center" }}>
                                        <TouchableOpacity onPress={() => navigation.navigate("PublicProfile", { uid: comment.uid })}>
                                            <Text style={{ fontSize: 16, fontWeight: "bold", marginStart: "2%" }}>{comment.name}</Text>
                                        </TouchableOpacity>

                                        <Text style={{ fontSize: 15, marginStart: "2%" }}>{comment.comment}</Text>
                                    </View>
                                </View>
                            ))
                    }
                </ScrollView>

            </> :
                <View style={{ backgroundColor: "#fff", height: "100%" }}>
                    <Loading />
                </View>
            }
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
                            setLoaded(false)
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