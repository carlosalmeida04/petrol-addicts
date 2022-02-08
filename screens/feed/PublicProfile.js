import React, { useEffect, useState, useCallback } from 'react'
import { TouchableOpacity, Text, Image, View, SafeAreaView, ScrollView } from 'react-native'

import { db, getDoc, doc, collection, getDocs, query, orderBy, where } from "../../firebase/firebasehandler"

import { useFocusEffect } from '@react-navigation/native'
import Ionicons from "@expo/vector-icons/Ionicons"


import Loading from '../Loading'

export default function PerfilPublico({ route, navigation }) {

    const params = route.params

    const [userInfo, setUserInfo] = useState({})
    const [posts, setPosts] = useState([])
    const [isloaded, setLoaded] = useState(false)

    async function getUserInfo() {
        const usersDoc = doc(db, "users", params.uid)
        try {
            const usersDocSnap = await getDoc(usersDoc)
            usersDocSnap.exists() ? setUserInfo({ nome: usersDocSnap.data().name, bio: usersDocSnap.data().bio }) : console.log("Doc não existente")
            return usersDocSnap.data().name
        } catch (e) {
            console.log(e)
        }
    }



    async function getUserPosts() {
        try {
            const postsRef = collection(db, "posts")
            const postsQuery = query(postsRef, where("uid", "==", params.uid), orderBy("postedAt", "desc"))
            const postSnapshot = await getDocs(postsQuery)
            const posts = []
            postSnapshot.forEach((doc) => {
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


    useFocusEffect(
        useCallback(() => {
            isloaded || getUserInfo().then(() => {
                getUserPosts().then((postReturn) => {
                    setPosts(postReturn)
                    setLoaded(true)
                })
            })
            return () => {
                setLoaded(false)
                setUserInfo({})
            }
        }, [])
    )

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
            {isloaded ? (
                <>
                    <View style={{ marginStart: "2.5%", width: "95%", flexDirection: "row", alignItems: "center" }}>

                        <Image style={{ marginTop: "2%", borderRadius: 100, }}
                            source={{
                                width: 100,
                                height: 100,

                                uri: `https://avatars.dicebear.com/api/personas/${userInfo.nome}.png`
                            }}
                        />

                        <View style={{ flexDirection: "column", marginStart: "2%", flexShrink: 1 }}>
                            <Text style={{ fontWeight: "bold" }}>{userInfo.nome}</Text>
                            {
                                /* MAXIMO 120 CARACTERES */
                            }
                            <Text>{userInfo.bio}</Text>
                        </View>



                    </View>


                    <Ionicons name='apps-outline' style={{ textAlign: "center" }} size={30} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: "1%" }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#dbdbdb' }} />
                    </View>
                    <ScrollView>
                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                            {
                                posts.map(posts => (
                                    <View key={posts.id} style={{ height: 130, width: "33.3333333%" }}>
                                        <TouchableOpacity onPress={() => navigation.navigate("Post", {
                                            id: posts.id,
                                            img: posts.img,
                                            name: posts.name,
                                            desc: posts.desc,
                                            car: posts.car,
                                            uid: posts.uid
                                        })}>
                                            <Image
                                                style={{ resizeMode: "cover" }}
                                                source={{
                                                    height: "100%",
                                                    width: "100%",
                                                    uri: posts.img
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>
                </>
            ) : <Loading />}
        </SafeAreaView>
    )
}