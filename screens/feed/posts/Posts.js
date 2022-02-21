import React, { useEffect, useState, useCallback } from 'react'
import { View, ScrollView, Image, TouchableOpacity, RefreshControl, StyleSheet, SafeAreaView } from 'react-native'

import Ionicons from "@expo/vector-icons/Ionicons"

import { Button, Icon, Layout, Text } from '@ui-kitten/components'

import { getDocs, db, collection, query, orderBy } from "../../../firebase/firebasehandler"

import { SvgCss } from 'react-native-svg'
import Loading from "../../Loading"

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
        // <ScrollView
        //     
        // >
        //     {isloaded ?
        //         posts.map(posts => (
        //             <View style={{ marginVertical: "2%" }} key={posts.id}>
        //                 <View style={[styles.row, { alignItems: "center", marginBottom: "1%", marginTop: "2%" }]}>
        //                     <Image style={{ borderRadius: 100, }}
        //                         source={{
        //                             width: 40,
        //                             height: 40,
        //                             uri: `https://avatars.dicebear.com/api/personas/${posts.name}.png`
        //                         }}
        //                     />
        //                     <TouchableOpacity
        //                         onPress={() => {
        //                             navigation.navigate("PublicProfile", { uid: posts.uid, title: posts.name })
        //                         }}
        //                     >
        //                         <Text style={styles.poster}>{posts.name}</Text>
        //                     </TouchableOpacity>
        //                 </View>
        //                 <View style={styles.seperator} />
        //                 <Image
        //                     style={styles.image}
        //                     source={{
        //                         uri: posts.img
        //                     }}
        //                 />
        //                 <View style={styles.seperator} />
        //                 <View style={styles.row}>




        //                     <TouchableOpacity
        //                         style={{ marginStart: "2%" }}
        //                         onPress={() => navigation.navigate("Comments", { postId: posts.id })}>
        //                         <Ionicons name='chatbox-outline' size={33} />
        //                     </TouchableOpacity>


        //                     <TouchableOpacity
        //                         onPress={() => { navigation.navigate("Car", { carro: posts.car, title: posts.car }) }}
        //                         style={{ marginStart: "auto", marginEnd: "1%", flexDirection: "row", alignItems: "center" }}>
        //                         <Text style={{ fontWeight: "bold", marginEnd: "2%" }}>{posts.car}</Text>
        //                         <Ionicons name='car-sport-outline' size={25} />
        //                     </TouchableOpacity>

        //                 </View>

        //                 <View style={[styles.row, { marginTop: "1%" }]}>
        //                     <Text style={styles.poster}>{posts.name}</Text>
        //                     <Text style={{ marginStart: "1%" }}>{posts.desc}</Text>
        //                 </View>
        //             </View>
        //         )) : <Loading />}


        // </ScrollView>
        <Layout level={"1"}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: "#fff" }}
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />} >

                {isloaded ? posts.map((postData) => (
                    <View style={styles.postView} key={postData.id}>
                        <View style={styles.poster}>
                            <TouchableOpacity style={styles.row}>
                                <Image
                                    style={{
                                        borderRadius: 100,
                                        borderWidth: 0.1,
                                        borderColor: "#616161"
                                    }}
                                    source={{
                                        height: 40,
                                        width: 40,
                                        uri: `https://avatars.dicebear.com/api/personas/${postData.name}.png`
                                    }} />
                                <Text style={styles.textB} category="s2">{postData.name}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.seperator} />
                        <View>
                            <Image
                                resizeMethod="resize"
                                resizeMode="cover"
                                style={{ aspectRatio: 1 }}
                                source={{ uri: postData.img }}
                            />
                        </View>
                        <View style={styles.seperator} />
                        <View style={styles.row}>
                            <Icon
                                style={styles.icon}
                                fill='red'
                                name='heart'
                            />
                            <Icon
                                style={styles.icon}
                                fill='black'
                                name='message-square-outline'
                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.textB} category="s2">{postData.name}</Text>
                            <View style={styles.text}>
                                <Text category="s2" >{postData.desc}</Text>
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
        marginBottom: "1%"
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
        height: 2,
        backgroundColor: "#616161"
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        aspectRatio: 1.5,
        resizeMode: "contain"
    },
    icon: {
        width: 50,
        height: 35,
    },
    postView: {
        marginTop: "2%",
        marginBottom: "2%"
    },
    textB: {
        fontWeight: "bold",
        marginStart: "1%"
    },
    text: {
        flexShrink: 1,
        marginStart: "1%"
    }
})