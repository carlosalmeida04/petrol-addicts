import React, { useEffect, useState, } from 'react'
import { View, Image, TouchableOpacity, StyleSheet, } from 'react-native'
import { Icon, Layout, Text, Divider, } from '@ui-kitten/components'

import { useNavigation } from "@react-navigation/native"
import { getLikeById, updateLike } from "./Reducers"
import { auth } from '../../firebase/firebasehandler'

import OverflowMenuButton from './OverflowMenu'
import moment from 'moment';

import "moment/locale/pt"


export default function PostsCard({ name, desc, img, uid, id, likes, postedAt, comments }) {

    const [currentLikeState, setCurrentLikeState] = useState({ state: false, counter: likes })
    const [aspectRatio, setAspectRatio] = useState({ apr: 0 })
    const navigation = useNavigation()


    useEffect(() => {
        Image.getSize(img, (srcWith, srcHeight) => {
            setAspectRatio({
                ...aspectRatio,
                apr: (srcWith / srcHeight)
            })
        })

        getLikeById(id, auth.currentUser.uid).then((res) => {
            setCurrentLikeState({
                ...currentLikeState,
                state: res
            })
        })
    }, [])

    function handleUpdateLike() {
        setCurrentLikeState({
            state: !currentLikeState.state,
            counter: currentLikeState.counter + (currentLikeState.state ? -1 : 1)
        })
        updateLike(id, auth.currentUser.uid, currentLikeState.state)
    }


    return (
        <Layout level={"1"}>
            <View style={styles.postView} key={id}>
                <View style={[styles.poster, { flexDirection: "row", flex: 1 }]}>
                    <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("PublicProfile", { uid: uid, title: name })}>
                        <Image
                            style={{
                                borderRadius: 100
                            }}
                            source={{
                                height: 35,
                                width: 35,
                                uri: `https://avatars.dicebear.com/api/initials/${name}.png`
                            }}
                        />
                        <Text style={[styles.textB, { marginStart: "3%" }]} category="s1">{name}</Text>
                    </TouchableOpacity>
                    {uid === auth.currentUser.uid ? <OverflowMenuButton postId={id} /> : false}
                </View>
                <Divider />
                <View >
                    <Image
                        style={[styles.image, { aspectRatio: aspectRatio.apr }]}
                        source={{ uri: img }}
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

                    <TouchableOpacity onPress={() => navigation.navigate("Comments", { postId: id })}>
                        <Icon
                            style={styles.icon}
                            fill='black'
                            name='message-square-outline'
                        />
                    </TouchableOpacity>
                </View>
                <Text style={{ marginStart: "2%", fontSize: 10 }}>{currentLikeState.counter} gostos & {comments} comentários</Text>
                <View style={styles.row}>
                    <Text style={styles.textB} category="s1">{name}</Text>
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
        width: undefined,
        height: undefined,
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