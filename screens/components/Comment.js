import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, Image, View } from "react-native"

import { Layout, Text } from "@ui-kitten/components"
import { useNavigation } from "@react-navigation/native"

import { getDoc, doc, db, auth } from '../../firebase/firebasehandler'

import OverflowMenu from "./OverflowMenu"

import moment from 'moment'
import "moment/locale/pt"

export default function Comment({ id, comment, uid, createdAt, postID }) {

    const navigation = useNavigation()
    const [userName, setUserName] = useState({ name: "" })

    useEffect(() => {
        getDoc(doc(db, "users", uid)).then((doc) => {
            setUserName({
                ...userName,
                name: doc.data().name,

            })
        })
    }, [])

    return (
        <Layout level="1">
            <View style={{ marginBottom: "2%", marginTop: "2%" }} key={id}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.row}
                        onPress={() => {
                            console.log(uid);
                            // console.log(userName.name);
                            //ISTO NAO ESTA A MANDAR NADA PARA OS PARAMETROS
                            navigation.navigate("PublicProfile", { params: { uid: uid, title: userName.name, "teste": "teste" } })
                        }}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: `https://avatars.dicebear.com/api/initials/${userName.name}.png`
                            }}
                        />
                        <Text category="h6" style={{ fontWeight: "bold", marginStart: "1%" }}>{userName.name}</Text>

                    </TouchableOpacity>
                    {uid === auth.currentUser.uid ? <OverflowMenu commentId={id} fromComments={true} postId={postID} /> : false}

                </View>
                <View style={styles.comment}>
                    <Text category="p2" style={{ marginTop: "1%" }} numberOfLines={4}>{comment}</Text>
                </View>
            </View>
            <Text style={styles.fromDate}>{moment(createdAt.toDate()).fromNow()}</Text>
            {/* <View style={styles.container}>
                <Divider />
            </View> */}
        </Layout >
    )
}
const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        height: 45,
        marginStart: "2.2%",
        marginEnd: "2%"
    },
    image: {
        borderRadius: 100,
        height: 35,
        width: 35,
    },
    comment: {
        flexShrink: 1,
        marginStart: "5%",
        marginEnd: "5%",
    },
    container: {
        marginStart: "4%",
        marginEnd: "4%"
    },
    fromDate: {
        fontSize: 10,
        marginTop: "0.5%",
        marginStart: "5%",
        opacity: .5
    }
})
