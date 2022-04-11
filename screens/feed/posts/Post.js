import { View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'

import { Icon, Layout, Text, Divider } from '@ui-kitten/components'
import { getLikeById, updateLike } from "../../components/Reducers"

import { auth, getDoc, doc, db } from '../../../firebase/firebasehandler'
import moment from 'moment';
import "moment/locale/pt"
import Loading from '../../Loading'

import OverflowMenuButton from '../../components/OverflowMenu'


export default function Post({ route, navigation }) {


    const params = route.params
    const [currentLikeState, setCurrentLikeState] = useState({ state: false, counter: params.likes })
    const [userName, setUserName] = useState("")
    const [loaded, setLoaded] = useState(false)


    useEffect(() => {

        getDoc(doc(db, "users", params.uid)).then((doc) => {
            setUserName(doc.data().name)
            getLikeById(params.id, auth.currentUser.uid).then((res) => {
                setCurrentLikeState({
                    ...currentLikeState,
                    state: res
                })
                setLoaded(true)
            })
        })
        return setUserName(""), setCurrentLikeState({ state: false, counter: 0 })
    }, [])

    function handleUpdateLike() {
        setCurrentLikeState({
            state: !currentLikeState.state,
            counter: currentLikeState.counter + (currentLikeState.state ? -1 : 1)
        })
        updateLike(params.id, auth.currentUser.uid, currentLikeState.state)
    }

    return (
        <Layout level={"1"} style={{ height: "100%" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {loaded ? <View style={styles.postView}>
                    <View style={[styles.poster, { flexDirection: "row", flex: 1 }]}>
                        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("PublicProfile", { uid: params.uid, title: params.name })}>
                            <Image
                                style={{
                                    borderRadius: 100
                                }}
                                source={{
                                    height: 40,
                                    width: 40,
                                    uri: `https://avatars.dicebear.com/api/initials/${userName}.png`
                                }}
                            />
                            <Text style={[styles.textB, { marginStart: "3%" }]} category="s1">{userName}</Text>
                        </TouchableOpacity>
                        {params.uid === auth.currentUser.uid ? <OverflowMenuButton postId={params.id} fileName={params.filename} fromProfile={true} /> : false}
                    </View>
                    <Divider />
                    <View>
                        <Image
                            style={[styles.image, { aspectRatio: params.ap }]}
                            source={{ uri: params.img }}
                        />
                    </View>
                    <Divider />
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => handleUpdateLike()} >
                            <Icon
                                style={styles.icon}
                                fill={currentLikeState.state ? "red" : "black"}
                                name={currentLikeState.state ? "heart" : "heart-outline"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Comments", { postId: params.id })}>
                            <Icon
                                style={styles.icon}
                                fill='black'
                                name='message-square-outline'
                            />

                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginStart: "2%" }} category="c1">{currentLikeState.counter} gostos & {params.comments} comentários</Text>
                    <View style={styles.row}>
                        <Text style={styles.textB} category="s1">{userName}</Text>
                        <View style={styles.text}>
                            <Text category="c1" >{params.desc}</Text>
                        </View>
                    </View>
                    <Text style={{ marginStart: "2%", fontSize: 10 }}>{moment(params.postedAt.toDate()).fromNow()}</Text>
                </View> : <Loading />}

            </ScrollView>
        </Layout >
    )
}

const styles = StyleSheet.create({
    poster: {
        fontWeight: "bold",
        marginStart: "1%",
    },
    postView: {
        marginTop: "2%",
        marginBottom: "2%"
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
        width: undefined,
        height: undefined,
    },
    icon: {
        width: 40,
        height: 35,
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