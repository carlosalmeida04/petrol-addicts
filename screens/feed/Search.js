import React from 'react'
import { SafeAreaView, View, Dimensions } from 'react-native'

import Modal from "react-native-modal"

import { Text, Button } from "@ui-kitten/components"

export default function Search() {

    const [open, setOpen] = React.useState(false)

    return (
        <>
            <SafeAreaView style={{ backgroundColor: "#fff", flex: 1, justifyContent: "center", alignItems: "center" }}>





                <Button onPress={() => setOpen(true)}>Open modal</Button>
            </SafeAreaView>
            <Modal isVisible={open}

            >
                <View style={{ flex: 1, backgroundColor: "#eee" }}>
                    <Text>I am the modal content!</Text>
                    <Button onPress={() => setOpen(false)}>Fechar</Button>
                </View>
            </Modal>
        </>
    )
}



