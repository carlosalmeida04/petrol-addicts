import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'

import { Text, Input, Layout, Icon } from "@ui-kitten/components"


export default function Search() {

    const [search, setSearch] = useState("")

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Layout level="1" style={styles.container} >
                <SafeAreaView style={styles.searchView}>
                    <Input
                        onChangeText={text => setSearch(text)}
                        placeholder="Pesquisar"
                        size={"medium"}
                        value={search}
                        style={{ width: "80%", paddingHorizontal: 10, marginEnd: "3%" }}
                        accessoryLeft={<Icon name="search-outline" fill="black" style={{ width: 10, height: 10 }} />}
                    />
                    <TouchableOpacity onPress={() => setSearch("")}>
                        <Text style={{ fontWeight: "bold", color: "#3366FF" }} category="p2">Cancelar</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Layout>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%"
    },
    searchView: {
        marginTop: StatusBar.currentHeight,
        flexDirection: "row",
        width: "100%",
        alignItems: "center"
    }
})


