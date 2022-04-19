import React, { useState, useCallback } from 'react'
import { TouchableOpacity, Image, View, SafeAreaView, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import { db, getDoc, doc, collection, getDocs, query, orderBy, where } from "../../../firebase/firebasehandler"
import { useFocusEffect } from '@react-navigation/native'
import { Icon, Text, Divider, Layout } from '@ui-kitten/components'

import Loading from '../../Loading'


export default function PerfilPublico({ route, navigation }) {

    const params = route.params

    const [userInfo, setUserInfo] = useState({})
    const [posts, setPosts] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [refresh, setRefresh] = useState(false)

    async function getUserInfo() {
        console.log(params)
        try {
            let i = 0;
            console.log(i + " " + params.uid + " " + params.teste);
            const usersDoc = doc(db, "users", params.uid.toString())
            const usersDocSnap = await getDoc(usersDoc)
            setUserInfo({ nome: usersDocSnap.data().name, bio: usersDocSnap.data().bio })
            i++;
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
                    desc: doc.data().desc,
                    car: doc.data().car,
                    img: doc.data().downloadUrl,
                    uid: doc.data().uid,
                    likes: doc.data().likes,
                    comments: doc.data().comments,
                    postedAt: doc.data().postedAt,
                    ap: doc.data().ap,
                    filename: doc.data().fileName
                })
            })
            return posts
        } catch (e) {
            console.log(e)
        }
    }


    const onRefresh = useCallback(() => {
        setRefresh(true)
        getUserInfo().then((posts) => {
            getUserPosts().then(posts => {
                setPosts(posts)
                setRefresh(false)
            })
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            loaded || getUserInfo().then(() => {
                getUserPosts().then((postReturn) => {
                    setPosts(postReturn)
                    setLoaded(true)
                })
            })
            return () => {
                setPosts([])
                setUserInfo({})
                setLoaded(false)
            }
        }, [])


    )

    return (
        <Layout level={"1"} >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ height: "100%" }}
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
            >
                {loaded ?
                    <>
                        <View>
                            <View style={{ marginStart: "2.5%", width: "95%", flexDirection: "row", alignItems: "center" }}>

                                <Image style={{ marginTop: "2%", borderRadius: 100, }}
                                    source={{
                                        width: 100,
                                        height: 100,
                                        uri: `https://avatars.dicebear.com/api/initials/${userInfo.nome}.png`
                                    }}
                                />

                                <View style={{ flexDirection: "column", marginStart: "2%", flexShrink: 1 }}>
                                    <Text style={{ fontWeight: "bold" }}>{userInfo.nome}</Text>
                                    <Text>{userInfo.bio}</Text>
                                </View>

                            </View>
                            <View style={{ alignItems: "center" }}>
                                <Icon name="grid-outline" fill="black" style={styles.icon} />
                            </View>
                            <Divider />
                        </View>
                        {posts.length === 0 ?
                            <View style={styles.center}>
                                <Text category={"label"}>Este utilizador ainda não fez publicações.</Text>
                            </View>
                            : posts.map(posts => (
                                <View style={styles.postsView} key={posts.id}>
                                    <View style={{ height: 130, width: "33.3333333%" }}>
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("Post", {
                                                id: posts.id,
                                                img: posts.img,
                                                desc: posts.desc,
                                                car: posts.car,
                                                uid: posts.uid,
                                                likes: posts.likes,
                                                postedAt: posts.postedAt,
                                                comments: posts.comments,
                                                ap: posts.ap,
                                                filename: posts.filename
                                            })
                                        }}>
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
                                </View>
                            ))}

                    </> : <Loading />}
            </ScrollView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    postsView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }, icon: {
        height: 30,
        width: 30
    }
})