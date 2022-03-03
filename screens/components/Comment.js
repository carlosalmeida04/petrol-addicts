import React from 'react'
import { StyleSheet, TouchableOpacity, Image, View } from "react-native"

import { Layout, Text, Divider } from "@ui-kitten/components"
import { useNavigation } from "@react-navigation/native"

export default function Comment({ id, name, comment, uid }) {

    const navigation = useNavigation()
    return (
        <Layout level="1">
            <View style={{ marginBottom: "2%" }} key={id}>
                <TouchableOpacity style={styles.row}
                    onPress={() => navigation.navigate("PublicProfile", { uid: uid, title: name })}>
                    <Image
                        style={styles.image}
                        source={{
                            uri: `https://avatars.dicebear.com/api/initials/${name}.png`
                        }}
                    />
                    <Text category="h6" style={{ fontWeight: "bold", marginStart: "1%" }}>{name}</Text>
                </TouchableOpacity>

                <View style={styles.comment}>
                    <Text category="p2" style={{ marginTop: "1%" }} numberOfLines={4}>{comment}</Text>
                </View>
            </View>
            <View style={styles.container}>
                <Divider />
            </View>
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
