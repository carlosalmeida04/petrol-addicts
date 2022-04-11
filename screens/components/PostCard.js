import React, { useEffect, useState, useMemo } from 'react'
import { View, Image, TouchableOpacity, StyleSheet, } from 'react-native'
import { Icon, Layout, Text, Divider, } from '@ui-kitten/components'

import { useNavigation } from "@react-navigation/native"
import { getLikeById, updateLike, } from "./Reducers"
import { auth, getDoc, doc, db } from '../../firebase/firebasehandler'

import OverflowMenuButton from './OverflowMenu'

import { throttle } from "throttle-debounce"
import moment from 'moment';
import "moment/locale/pt"


export default function PostsCard({ desc, img, uid, id, likes, postedAt, comments, fileName, ap, car }) {

    const [currentLikeState, setCurrentLikeState] = useState({ state: false, counter: likes })
    const [userName, setUserName] = useState({ name: "" })
    const navigation = useNavigation()


    useEffect(() => {
        getDoc(doc(db, "users", uid)).then((doc) => {
            setUserName({
                ...userName,
                name: doc.data().name
            })
        })
        getLikeById(id, auth.currentUser.uid).then((res) => {
            setCurrentLikeState({
                ...currentLikeState,
                state: res
            })
        })
    }, [])

    const handleUpdateLike = useMemo(
        () =>
            throttle(2000, true, (currentLikeStateInst) => {
                setCurrentLikeState({
                    state: !currentLikeStateInst.state,
                    counter:
                        currentLikeStateInst.counter +
                        (currentLikeStateInst.state ? -1 : 1),
                });
                updateLike(id, auth.currentUser.uid, currentLikeStateInst.state);
            }),
        []
    )


    return (
        <Layout level={"1"}>
            <View style={styles.postView} key={id}>
                <View style={[styles.poster, { flexDirection: "row", flex: 1 }]}>
                    <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("PublicProfile", { uid: uid, title: userName.name })}>
                        <Image
                            style={{
                                borderRadius: 100
                            }}
                            source={{
                                height: 35,
                                width: 35,
                                uri: `https://avatars.dicebear.com/api/initials/${userName.name}.png`
                            }}
                        />
                        <Text style={[styles.textB, { marginStart: "3%" }]} category="s1">{userName.name}</Text>
                    </TouchableOpacity>
                    {uid === auth.currentUser.uid ? <OverflowMenuButton postId={id} fileName={fileName} /> : false}
                </View>

                <Divider />

                <View >
                    <Image
                        style={[styles.image, { aspectRatio: ap }]}
                        source={{ uri: img }}
                    />
                </View>

                <Divider />

                <View style={styles.row}>
                    <TouchableOpacity onPress={() => handleUpdateLike(currentLikeState)} >
                        <Icon
                            style={styles.icon}
                            fill={currentLikeState.state ? "red" : "black"}
                            name={currentLikeState.state ? "heart" : "heart-outline"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Comments", { postId: id, car: car })}>
                        <Icon
                            style={styles.icon}
                            fill='black'
                            name='message-square-outline'
                        />
                    </TouchableOpacity>
                </View>

                <Text style={{ marginStart: "2%", fontSize: 10 }}>{currentLikeState.counter} gostos & {comments} comentários</Text>

                <View style={styles.row}>
                    <Text style={styles.textB} category="s1">{userName.name}</Text>
                    <View style={styles.text}>
                        <Text category="c1" >{desc}</Text>
                    </View>
                </View>

                <Text style={{ marginStart: "2%", fontSize: 10 }}>{moment(postedAt.toDate()).fromNow()}</Text>
            </View>
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
    image: {
        flex: 1,
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
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

})