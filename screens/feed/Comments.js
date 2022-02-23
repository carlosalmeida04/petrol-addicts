import { View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import { doc, getDocs, db, collection, setDoc, auth, Timestamp, query, orderBy } from "../../firebase/firebasehandler"
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Button, Input, Icon, Divider, Text } from "@ui-kitten/components"

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
            <ScrollView
                style={{ backgroundColor: "#fff" }}
                contentContainerStyle={{ flexGrow: 1 }} >
                {loaded ? comments.length === 0 ?
                    <View style={styles.center}>
                        <Text>Ainda não há comentários. Sê o primeiro a comentar!</Text>
                    </View>
                    :
                    comments.map((comment) => (
                        <View key={comment.id} style={styles.commentView}>
                            <View style={styles.row}>
                                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("PublicProfile", { uid: comment.uid })}>
                                    <Image
                                        style={styles.img}
                                        source={{
                                            uri: `https://avatars.dicebear.com/api/personas/${comment.name}.png`
                                        }}
                                    />
                                    <Text category="p1" style={{ marginStart: "1%", fontWeight: "bold", }}>{comment.name}</Text>
                                </TouchableOpacity>
                                <Text category="p2" style={{ marginStart: "1%" }}>{comment.comment}</Text>
                            </View>
                        </View>
                    )) : <Loading />}
            </ScrollView>
            <Divider />
            <SafeAreaView style={{ backgroundColor: "#fff", }}>
                <View style={styles.inputView}>
                    <Input
                        size="medium"
                        style={styles.input}
                        onChangeText={text => setComment(text)}
                        placeholder='Comentario'
                        value={comment}
                        status="basic"
                    />
                    <Button
                        onPress={() => {
                            makeComment().then(() => {
                                setComment("")
                                setLoaded(false)
                            })
                        }}
                        size="medium"
                        appearance="ghost"
                        status="basic"
                    >
                        Comentar
                    </Button>
                </View>
            </SafeAreaView>
        </>

    )
}


const styles = StyleSheet.create({

    input: {
        width: "80%"
    },
    inputView: {
        flexDirection: "row",
        marginEnd: "7%",
        marginStart: "2%"
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    img: {
        width: 40,
        height: 40,
        borderRadius: 100
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    commentView: {
        marginStart: "2%",
        marginEnd: "2%",
        width: "96%",
        marginBottom: "2%"
    }
})