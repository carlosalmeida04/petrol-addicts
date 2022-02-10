import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'


import Ionicons from "@expo/vector-icons/Ionicons"

export default function Post({ route, navigation }) {

    const params = route.params

    return (
        <ScrollView style={{ backgroundColor: "#fff" }} >
            <View style={[styles.row, { alignItems: "center", marginBottom: "1%", marginTop: "2%" }]}>
                <Image style={{ borderRadius: 100, }}
                    source={{
                        width: 40,
                        height: 40,
                        uri: `https://avatars.dicebear.com/api/personas/${params.name}.png`
                    }}
                />
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("PublicProfile", { uid: params.uid, title: params.name })
                    }}
                >
                    <Text style={styles.poster}>{params.name}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.seperator} />
            <Image
                style={styles.image}
                source={{
                    uri: params.img
                }}
            />
            <View style={styles.seperator} />
            <View style={[styles.row, { marginTop: "1%" }]}>

                <TouchableOpacity>
                    <Ionicons name='heart-outline' size={35} />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginStart: "2%" }}
                    onPress={() => navigation.navigate("Comments", {
                        postId: params.id
                    })}>
                    <Ionicons name='chatbox-outline' size={33} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Car", { carro: params.car, title: params.car })
                    }}
                    style={{ marginStart: "auto", marginEnd: "1%", flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name='car-sport-outline' size={25} />
                    <Text style={{ fontWeight: "bold", marginStart: "2%" }}>{params.car}</Text>
                </TouchableOpacity>

            </View>

            <View style={[styles.row, { marginTop: "1%" }]}>
                <Text style={styles.poster}>{params.name}</Text>
                <Text style={{ marginStart: "1%" }}>{params.desc}</Text>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    poster: {
        fontWeight: "bold",
        marginStart: "2%",
    },
    row: {
        flexDirection: "row",
        flexShrink: 1,
        marginStart: "2%",
        alignItems: "center"
    },
    seperator: {
        width: "100%",
        height: 1,
        backgroundColor: "#eeeeee"
    },
    image: {
        flex: 1,
        width: undefined,
        height: undefined,
        aspectRatio: 1.5,
        resizeMode: "contain"
    }
})