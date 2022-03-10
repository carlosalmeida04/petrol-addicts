import React, { useEffect, useState, useCallback } from 'react'
import { View, ScrollView, RefreshControl, StyleSheet, FlatList } from 'react-native'
import { Layout, Text } from '@ui-kitten/components'
import { getDocs, db, collection, query, orderBy, limit } from "../../../firebase/firebasehandler"

import Loading from "../../Loading"
import PostsCard from '../../components/PostCard'

export default function Posts({ route }) {


    const [posts, setPosts] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [refresh, setRefresh] = useState(false)


    async function getPosts() {
        try {
            const postsRef = collection(db, "posts")
            const postsQuery = query(postsRef, orderBy("postedAt", "desc"), limit(20))
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
                        uid: doc.data().uid,
                        likes: doc.data().likes,
                        comments: doc.data().comments,
                        postedAt: doc.data().postedAt
                    })
                }
            )
            return posts
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        loaded || getPosts().then((postReturn) => {
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
        <Layout level={"1"} style={{ height: "100%" }}>
            {loaded ? posts.length === 0 ?
                <View style={styles.center}>
                    <Text>Ainda não temos publicações! :(</Text>
                </View>
                :
                <FlatList
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={20}
                    refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                    data={posts}
                    renderItem={({ item }) => <PostsCard id={item.id} name={item.name} uid={item.uid} img={item.img} desc={item.desc} likes={item.likes} postedAt={item.postedAt} comments={item.comments} />}
                    keyExtractor={(item) => item.id}
                    key={({ item }) => item.id}
                /> : <Loading />}
        </Layout >
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})