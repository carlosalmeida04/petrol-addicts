import { StyleSheet } from 'react-native'
import React from 'react'
import { Layout, Text } from '@ui-kitten/components'

export default function Change({ route }) {

    const params = route.params





    async function changeEmail() {

    }

    async function changePassword() {

    }

    if (params.title === "Alteral e-mail") {
        return (
            <Layout level={"1"} style={styles.layout}>
                <Text>Alerar e-mail</Text>
            </Layout>
        )
    } else if (params.title === "Alterar palavra-passe") {
        return (
            <Layout style={styles.layout}>
                <Text>Alterar palavra-passe</Text>
            </Layout>
        )
    }
    else if (params.title === "Alterar nome") {
        return (
            <Layout style={styles.layout}>
                <Text>Alterar nome</Text>
            </Layout>
        )
    }
    else if (params.title === "Alterar biografia") {
        return (
            <Layout style={styles.layout}>
                <Text>Alterar biografia</Text>
            </Layout>
        )
    }

}

const styles = StyleSheet.create({
    layout: {
        height: "100%"
    }
})