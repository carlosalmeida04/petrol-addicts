import React, { useEffect, useState, useCallback } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'

import Ionicons from "@expo/vector-icons/Ionicons"

import { getDocs, db, collection, query, orderBy, doc, setDoc } from "../../firebase/firebasehandler"

import Loading from "../Loading"
export default function Posts({ navigation }) {


    const [posts, setPosts] = useState([])
    const [isloaded, setLoaded] = useState(false)
    const [refresh, setRefresh] = useState(false)

    async function getPosts() {
        try {
            const postsRef = collection(db, "posts")
            const postsQuery = query(postsRef, orderBy("postedAt", "desc"))
            const postsSnapshot = await getDocs(postsQuery)
            const posts = []
            postsSnapshot.forEach((doc) => {
                posts.push({
                    id: doc.id,
                    name: doc.data().name,
                    desc: doc.data().desc,
                    car: doc.data().car,
                    img: doc.data().downloadUrl,
                    uid: doc.data().uid
                })
            })
            return posts
        } catch (e) {
            console.log(e)
        }
    }
    async function getComments(postId) {
        const commentRef = doc(collection(db, "posts", postId, "comments"))
        const snapshot = await setDoc(commentRef, {

        })
        console.log(snapshot)
    }

    useEffect(() => {
        isloaded || getPosts().then((postReturn) => {
            setPosts(postReturn)
            setLoaded(true)
        })
    }, [])

    const onRefresh = useCallback(() => {
        setRefresh(true)
        getPosts().then((postReturn) => {
            setPosts(postReturn)
            setRefresh(false)
        })
    }, [])

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#fff" }}
            refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
        >
            {isloaded ?
                posts.map(posts => (
                    <View style={{ marginVertical: "2%" }} key={posts.id}>
                        <View style={[styles.row, { alignItems: "center", marginBottom: "1%", marginTop: "2%" }]}>
                            <Image style={{ borderRadius: 100, }}
                                source={{
                                    width: 40,
                                    height: 40,
                                    uri: `https://avatars.dicebear.com/api/personas/${posts.name}.png`
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("PublicProfile", { uid: posts.uid, title: posts.name })
                                }}
                            >
                                <Text style={styles.poster}>{posts.name}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.seperator} />
                        <Image
                            style={styles.image}
                            source={{
                                uri: posts.img
                            }}
                        />
                        <View style={styles.seperator} />
                        <View style={[styles.row, { marginTop: "1%" }]}>

                            <TouchableOpacity>
                                <Ionicons name='heart-outline' size={35} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ marginStart: "2%" }} onPress={() => navigation.navigate("Comments")}>
                                <Ionicons name='chatbox-outline' size={33} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("Car", { carro: posts.car, title: posts.car })
                                }}
                                style={{ marginStart: "auto", marginEnd: "1%", flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name='car-sport-outline' size={25} />
                                <Text style={{ fontWeight: "bold", marginStart: "2%" }}>{posts.car}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={[styles.row, { marginTop: "1%" }]}>
                            <Text style={styles.poster}>{posts.name}</Text>
                            <Text style={{ marginStart: "1%" }}>{posts.desc}</Text>
                        </View>
                    </View>
                )) : <Loading />}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    poster: {
        fontWeight: "bold",
        marginStart: "2%",
    },
    row: {
        flexDirection: "row",
        flexShrink: 1,
        marginStart: "2%",
        alignItems: "center"
    },
    seperator: {
        width: "100%",
        height: 1,
        backgroundColor: "#eeeeee"
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        aspectRatio: 1.5,
        resizeMode: "contain"
    }
})