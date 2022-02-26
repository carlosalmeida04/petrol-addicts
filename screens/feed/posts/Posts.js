import React, { useEffect, useState, useCallback } from 'react'
import { View, ScrollView, Image, TouchableOpacity, RefreshControl, StyleSheet, SafeAreaView, Dimensions } from 'react-native'
import { Icon, Layout, Text, Divider } from '@ui-kitten/components'
import { getDocs, db, collection, query, orderBy, doc, getDoc } from "../../../firebase/firebasehandler"

import { setLike, removeLike } from "../../components/Reducers/"

import Loading from "../../Loading"

const win = Dimensions.get("window")
const ratio = win.width / 541

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

            postsSnapshot.forEach(
                (doc) => {
                    posts.push({
                        id: doc.id,
                        name: doc.data().name,
                        desc: doc.data().desc,
                        car: doc.data().car,
                        img: doc.data().downloadUrl,
                        uid: doc.data().uid
                    })
                }
            )
            return posts
        } catch (e) {
            console.log(e)
        }
    }
    // async function userHasLike(uid, postId) {
    //     try {
    //         const likeRef = doc(db, "users", uid, "likes", postId)
    //         const likeSnapShot = await getDoc(likeRef)
    //         if (likeSnapShot.exists()) {
    //             return true
    //         } else {
    //             return false
    //         }

    //     } catch (e) {
    //         console.log(e)
    //     }


    // }

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
        <Layout level={"1"}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: "#fff", height: "100%" }}
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                contentContainerStyle={{ flexGrow: 1 }}
            >

                {isloaded ? posts.length === 0 ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>Ainda não temos publicações! :(</Text>
                    </View>
                    :
                    posts.map((postData) => (
                        <View style={styles.postView} key={postData.id}>
                            <View style={styles.poster}>
                                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("PublicProfile", { uid: postData.uid, title: postData.name })}>
                                    <Image
                                        source={{
                                            height: 40,
                                            width: 40,
                                            uri: `https://avatars.dicebear.com/api/personas/${postData.name}.png`
                                        }}
                                    />
                                    <Text style={styles.textB} category="s1">{postData.name}</Text>
                                </TouchableOpacity>
                            </View>
                            <Divider />
                            <View style={styles.imageView}>
                                <Image

                                    style={styles.image}
                                    source={{ uri: postData.img }}
                                />
                            </View>
                            <Divider />
                            <View style={styles.row}>
                                { }
                                <TouchableOpacity onPress={() => removeLike(postData.id, postData.uid)} >
                                    <Icon
                                        style={styles.icon}
                                        fill='black'
                                        name='heart-outline'
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate("Comments", { postId: postData.id })}>
                                    <Icon
                                        style={styles.icon}
                                        fill='black'
                                        name='message-square-outline'
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.textB} category="s1">{postData.name}</Text>
                                <View style={styles.text}>
                                    <Text category="c1" >{postData.desc}</Text>
                                </View>
                            </View>
                        </View>
                    )) : <Loading />}
            </ScrollView>
        </Layout >
    )
}

const styles = StyleSheet.create({
    poster: {
        fontWeight: "bold",
        marginStart: "1%",
    },
    row: {
        flexDirection: "row",
        flexShrink: 1,
        marginStart: "1%",
        alignItems: "center",
        marginBottom: "1%",
    },
    seperator: {
        width: "100%",
        height: 1,
        backgroundColor: "#616161"
    },
    image: {
        flex: 1,
        width: win.width,
        height: null,
        resizeMode: "cover"
    },
    imageView: {
        aspectRatio: 3 / 2,
    },
    icon: {
        width: 40,
        height: 35,
    },
    postView: {
        marginTop: "2%",
        marginBottom: "2%"
    },
    textB: {
        marginStart: "1%",
        fontWeight: "bold"
    },
    text: {
        flexShrink: 1,
        marginStart: "1%",
    }
})