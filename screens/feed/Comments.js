import { View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Alert, Image, RefreshControl } from 'react-native'
import { doc, getDocs, db, collection, setDoc, auth, Timestamp, query, orderBy, updateDoc, increment, getDoc } from "../../firebase/firebasehandler"
import { Input, Divider, Text, Icon } from "@ui-kitten/components"
import React, { useEffect, useState, useCallback } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '../Loading'
import Comment from '../components/Comment'

import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'



export default function Comments({ route }) {


    const [comment, setComment] = useState("")
    const [name, setName] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [comments, setComments] = useState([])
    const [carinfo, setCarInfo] = useState({})
    const [refresh, setRefresh] = useState(false)

    const postId = route.params.postId
    const car = route.params.car

    const InputTextLenght = () => (
        <Text category="c1">{comment.length}/80</Text>
    )

    async function makeComment() {

        if (comment === "") {
            Alert.alert("Informação", "Tens de escrever um comentário primeiro.")
        } else {
            try {
                const commentId = uuidv4()
                const addCommentColl = doc(db, "posts", postId, "comments", commentId)
                const postRef = doc(db, "posts", postId)

                await setDoc(addCommentColl, {
                    comment: comment,
                    uid: auth.currentUser.uid,
                    name: name,
                    createdAt: Timestamp.fromDate(new Date())
                })

                await updateDoc(postRef, { comments: increment(1) })
            } catch (e) {
                console.log(e)
            }
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

    async function getCar() {
        try {
            let info
            const carSnapShot = await getDoc(doc(db, "cars", car))

            if (!carSnapShot.exists()) return info = false

            setCarInfo({
                cc: carSnapShot.data().displacement,
                drive: carSnapShot.data().drive,
                engine: carSnapShot.data().engine,
                fuel: carSnapShot.data().fuelType,
                cv: carSnapShot.data().power,
                trans: carSnapShot.data().transmission
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        AsyncStorage.getItem("name").then((name) => setName(name))
        loaded || getComments().then((commentReturn) => {
            setComments(commentReturn)
            getCar().then(() => setLoaded(true))
        })
    }, [loaded])


    const onRefresh = useCallback(() => {
        setRefresh(true)
        getComments().then((comments) => {
            setComments(comments)
            setRefresh(false)
        })
    }, [])

    return (
        <>
            <ScrollView
                style={{ backgroundColor: "#fff" }}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
            >
                {loaded ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", textAlign: "center", justifyContent: "center" }}>
                            <Image style={{ width: 50, height: 50 }} source={require("../../assets/img/car.png")} />
                            <Text category={"h3"} style={{ textAlign: "center", padding: 15 }}>{car}</Text>
                        </View>
                        <View style={[styles.columns, styles.container]}>

                            <View style={styles.item}>
                                <Image style={styles.image} source={require("../../assets/img/engine.png")} />
                                <Text>{carinfo.engine}</Text>
                            </View>

                            <View style={styles.item}>
                                <Image style={styles.image} source={require("../../assets/img/trans.png")} />
                                <Text>{carinfo.trans}</Text>
                            </View>

                            <View style={styles.item}>
                                <Image style={styles.image} source={require("../../assets/img/piston.png")} />
                                <Text>{carinfo.cc}</Text>
                            </View>


                            <View style={styles.item}>
                                <Image style={styles.image} source={require("../../assets/img/axle.png")} />
                                <Text>{carinfo.drive}</Text>
                            </View>
                            <View style={styles.item}>
                                <Image style={styles.image} source={require("../../assets/img/power-gears.png")} />
                                <Text>{carinfo.cv}</Text>
                            </View>
                            <View style={styles.item}>
                                <Image style={styles.image} source={require("../../assets/img/fuel.png")} />
                                <Text>{carinfo.fuel}</Text>
                            </View>
                        </View>

                        <View style={styles.container}>
                            <Divider />
                        </View>
                        {
                            comments.length === 0 ?
                                <View style={styles.center}>
                                    <Text>Ainda não há comentários. Sê o primeiro a comentar!</Text>
                                </View>
                                :
                                <FlatList
                                    data={comments}
                                    keyExtractor={(item) => item.id}
                                    key={({ item }) => item.id}
                                    renderItem={({ item }) => <Comment
                                        id={item.id}
                                        name={item.name}
                                        uid={item.uid}
                                        comment={item.comment} />}
                                />
                        }
                    </View>
                    :
                    <Loading />
                }
            </ScrollView>

            <SafeAreaView style={{ backgroundColor: "#fff", }}>
                <View style={styles.container}>
                    <Divider />
                </View>
                <View style={styles.inputView}>
                    <Input
                        size="large"
                        style={styles.input}
                        onChangeText={text => setComment(text)}
                        placeholder='Comentário'
                        value={comment}
                        maxLength={80}
                        accessoryRight={InputTextLenght}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            makeComment().then(() => {
                                setComment("")
                                setLoaded(false)
                            })
                        }}
                        style={styles.button}
                    >
                        <Icon name="paper-plane-outline" style={{ height: 25, width: 25 }} fill="black" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>

    )
}


const styles = StyleSheet.create({

    input: {
        width: "85%"
    },
    inputView: {
        flexDirection: "row",
        marginEnd: "2%",
        marginStart: "2%"
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        marginStart: "4%",
        marginEnd: "4%"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    columns: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start"
    },
    item: {
        width: "50%",
        flexDirection: "row",
        padding: 7
    },
    image: {
        width: 20,
        height: 20,
        marginStart: "2%",
        marginEnd: "2%"
    }
})