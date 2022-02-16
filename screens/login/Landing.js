import React from "react"
import { SafeAreaView, View, TouchableOpacity, Text, Image } from "react-native"

import { Button, Layout } from '@ui-kitten/components';


import styles from "../../styles/main"

function Landing({ navigation }) {


    return (
        <Layout style={styles.containerMain}>

            <View style={{ height: "50%" }}>
                <Image style={styles.logo} source={require("../../assets/img/logo.png")} />
            </View>

            <View style={styles.bottomView}>
                <Button appearance='outline' status="basic" style={styles.buttonBorder}
                    onPress={() => navigation.navigate("Register")}>
                    Registar
                </Button>
                <Button appearance='filled' status="warning" style={styles.button}
                    onPress={() => navigation.navigate("Login")}>
                    Iniciar Sessão
                </Button>
            </View>
        </Layout>
    )


}

export default Landing
