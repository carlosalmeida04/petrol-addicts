import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, Image, View } from "react-native"

import { Layout, Text } from "@ui-kitten/components"
import { useNavigation } from "@react-navigation/native"

import { getDoc, doc, db } from '../../firebase/firebasehandler'

export default function Comment({ id, comment, uid }) {

    const navigation = useNavigation()
    const [userName, setUserName] = useState({ name: "" })

    useEffect(() => {
        getDoc(doc(db, "users", uid)).then((doc) => {
            setUserName({
                ...userName,
                name: doc.data().name
            })
        })
    }, [])

    return (
        <Layout level="1">
            <View style={{ marginBottom: "2%", marginTop: "2%" }} key={id}>
                <TouchableOpacity style={styles.row}
                    onPress={() => navigation.navigate("PublicProfile", { uid: uid, title: userName.name })}>
                    <Image
                        style={styles.image}
                        source={{
                            uri: `https://avatars.dicebear.com/api/initials/${userName.name}.png`
                        }}
                    />
                    <Text category="h6" style={{ fontWeight: "bold", marginStart: "1%" }}>{userName.name}</Text>
                </TouchableOpacity>

                <View style={styles.comment}>
                    <Text category="p2" style={{ marginTop: "1%" }} numberOfLines={4}>{comment}</Text>
                </View>
            </View>
            {/* <View style={styles.container}>
                <Divider />
            </View> */}
        </Layout>
    )
}
const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        height: 45,
        marginStart: "4%",
        marginEnd: "4%"
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
    }
})
