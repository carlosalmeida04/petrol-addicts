import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React from 'react'

import { Button, Icon, Layout, Text, Divider } from '@ui-kitten/components'


export default function Post({ route, navigation }) {

    const params = route.params
    const win = Dimensions.get("window")
    const ratio = win.width / 541

    console.log(params)
    return (
        <Layout level={"1"} style={{ height: "100%" }}>
            <View style={styles.postView}>
                <View style={styles.poster}>
                    <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("PublicProfile", { uid: params.uid })}>
                        <Image
                            source={{
                                height: 40,
                                width: 40,
                                uri: `https://avatars.dicebear.com/api/personas/${params.name}.png`
                            }}
                        />
                        <Text style={styles.textB} category="s1">{params.name}</Text>
                    </TouchableOpacity>
                </View>
                <Divider />
                <View style={{ flexDirection: "row", height: 350 * ratio }}>
                    <Image

                        style={{ width: win.width, height: undefined }}
                        source={{ uri: params.img }}
                    />
                </View>
                <Divider />
                <View style={styles.row}>
                    <TouchableOpacity>
                        <Icon
                            style={styles.icon}
                            fill='black'
                            name='heart-outline'
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
                <View style={styles.row}>
                    <Text style={styles.textB} category="s1">{params.name}</Text>
                    <View style={styles.text}>
                        <Text category="c1" >{params.desc}</Text>
                    </View>
                </View>
            </View>
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
        width: null,
        height: null,
        aspectRatio: 1.5,
        resizeMode: "contain"
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