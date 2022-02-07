import React from 'react'
import { Text, Image, TouchableOpacity, SafeAreaView, View } from 'react-native'

import styles from "../../styles/main"

function Landing({ navigation }) {


    return (
        <SafeAreaView style={styles.containerMain}>

            <View style={{ height: "50%" }}>
                <Image style={styles.logo} source={require("../../assets/img/logo.png")} />
            </View>

            <View style={styles.bottomView}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")} >
                    <Text style={{ fontWeight: '600', fontSize: 12, }}>Iniciar sessão</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonBorder} onPress={() => navigation.navigate("Register")} >
                    <Text style={{ color: '#000', fontWeight: '600', fontSize: 12 }}>Registar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default Landing
