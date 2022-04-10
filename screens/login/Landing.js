import React, { useEffect } from "react"
import { View, Image } from "react-native"

import { Button, Layout } from '@ui-kitten/components'


import styles from "../../styles/main"

export default function Landing({ navigation }) {

    useEffect(() => {

        navigation.addListener("beforeRemove", (e) => {
            e.preventDefault()
        })
    }, [])
    return (
        <Layout style={styles.containerMain}>

            <View style={{ height: "50%" }}>
                <Image style={styles.logo} source={require("../../assets/img/logo.png")} />
            </View>

            <View style={styles.bottomView}>
                <Button appearance='outline' status={"basic"} style={styles.buttonBorder}
                    onPress={() => navigation.navigate("Register")}>
                    Registar
                </Button>
                <Button appearance='filled' style={styles.button}
                    onPress={() => navigation.navigate("Login")}>
                    Iniciar Sessão
                </Button>
            </View>
        </Layout>
    )
}
