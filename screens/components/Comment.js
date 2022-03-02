import React from 'react'
import { StyleSheet, TouchableOpacity, Image, View } from "react-native"
import { Layout, Text } from "@ui-kitten/components"

export default function Comment() {

    const text = "Lorem ipsum dolor sit amet, asdsadsadsadsadsad2yu1g321t673t21v13f21sadadsasadsad"
    console.log(text.length)
    return (
        <Layout>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.row, { marginStart: "1%" }]}>
                    <Image
                        style={styles.image}
                        source={{
                            uri: "https://avatars.dicebear.com/api/personas/Carlos Almeida.png"
                        }}
                    />
                    <Text category="p1" style={{ fontWeight: "bold" }}>Carlos Almeida</Text>
                </TouchableOpacity>
                <View style={styles.text}>
                    <Text category="p2" style={{ marginTop: "0.5%" }}>{text}</Text>
                </View>

            </View>
        </Layout>
    )
}
const styles = StyleSheet.create({
    row: {
        flexDirection: "row"
    },
    image: {
        borderRadius: 100,
        height: 30,
        width: 30,
    },
    text: {
        flexShrink: 1
    }
})
