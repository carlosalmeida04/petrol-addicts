import { db, getDoc, doc, auth, query, collection, where, getDocs, orderBy } from "../../../firebase/firebasehandler"
import { TouchableOpacity, Image, View, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { Icon, Text, Divider } from '@ui-kitten/components'
import React, { useEffect, useState, useCallback } from 'react'

import Loading from '../../Loading'

export default function Perfil({ navigation }) {


    const [userInfo, setUserInfo] = useState({})
    const [posts, setPosts] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [refresh, setRefresh] = useState(false)

    async function getUserInfo() {
        try {
            const usersDocSnap = await getDoc(doc(db, "users", auth.currentUser.uid))
            setUserInfo({ nome: usersDocSnap.data().name, bio: usersDocSnap.data().bio })
        } catch (e) {
            console.log(e)
        }
    }

    async function getUserPosts() {
        try {
            const postsRef = collection(db, "posts")
            const postsQuery = query(postsRef, where("uid", "==", auth.currentUser.uid), orderBy("postedAt", "desc"))
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

    useEffect(() => {
        loaded || getUserInfo().then(() => {
            getUserPosts().then((postReturn) => {
                setPosts(postReturn)
                setLoaded(true)
            })
        })
    }, [])


    const onRefresh = useCallback(() => {
        setRefresh(true)
        getUserPosts().then((postReturn) => {
            setPosts(postReturn)
            getUserInfo().then(() => {
                setRefresh(false)
            })
        })
    }, [])

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {loaded ?
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
                            <Icon name="grid-outline" fill="black" style={{ height: 30, width: 30 }} />
                        </View>
                        <Divider />

                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                            {posts.length === 0 ?
                                <View style={{ marginTop: "60%", justifyContent: "center", alignItems: "center", flex: 1 }}>
                                    <Text category={"label"}>Ainda não tens publicações feitas.</Text>
                                </View>
                                : posts.map(posts => (
                                    <View key={posts.id} style={{ height: 130, width: "33.3333333%" }}>
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
                                ))}
                        </View>

                    </View > : <Loading />
                }</ScrollView>
        </SafeAreaView >
    )
}