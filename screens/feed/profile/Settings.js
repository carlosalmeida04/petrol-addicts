import { Alert, TouchableOpacity, View, StyleSheet } from 'react-native'
import { auth, signOut } from "../../../firebase/firebasehandler"

import { Layout, Text, Icon, Divider } from '@ui-kitten/components'

import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Settings({ navigation }) {

    async function logOut() {
        try {
            await AsyncStorage.setItem("isLoggedIn", "0")
            await AsyncStorage.removeItem("userID")
            await AsyncStorage.removeItem("name")
            signOut(auth).then(() => {
                navigation.replace("Landing")
            })
        } catch (e) {
            console.log(e)
        }
    }
    async function clearStorage() {
        try {
            await Alert.alert("Alerta",
                "Atenção, ao limpar a chache a sua sessão irá ser terminada e os dados da aplicação serão removidos!",
                [
                    { text: 'Ok', onPress: () => AsyncStorage.clear().then(() => console.log("Done.")) },
                    { text: 'Cancelar', style: "cancel" }
                ],
            )

        } catch (e) {
            console.log(e)
        }

    }


    return (
        <Layout style={{ height: "100%" }} level="1">

            {/* Conta*/}
            <View style={styles.section}>

                <Text category={"h4"}>Conta</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Change", {
                    title: "Alteral e-mail"
                })}>
                    <Text category={"p1"}>Alterar e-mail</Text>
                    <Icon name={"email-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Change", {
                    title: "Alterar palavra-passe"
                })}>
                    <Text category={"p1"}>Alterar palavra-passe</Text>
                    <Icon name={"lock-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
            </View>

            <View style={styles.section}>

                <Text category={"h4"}>Perfil</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Change", {
                    title: "Alterar nome"
                })}>
                    <Text category={"p1"}>Alterar nome</Text>
                    <Icon name={"person-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Change", {
                    title: "Alterar biografia"
                })}>
                    <Text category={"p1"}>Alterar biografia</Text>
                    <Icon name={"edit-2-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
            </View>
            <View style={styles.section}>

                <Text category={"h4"}>Aplicação</Text>
                <TouchableOpacity style={styles.button} onPress={clearStorage}>
                    <Text category={"p1"}>Limpar cache</Text>
                    <Icon name={"trash-2-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity style={styles.button} onPress={logOut}>
                    <Text category={"p1"} style={{color: "red"}}>Terminar sessão</Text>
                    <Icon name={"log-out-outline"} fill="red" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
            </View>

        </Layout >
    )
}


const styles = StyleSheet.create({

    section: {
        paddingVertical: 15,
        marginHorizontal: "5%"
    },
    icon: {
        height: 27,
        width: 27
    },
    button: {
        flexDirection: "row",
        width: "100%",
        height: 40,
        alignItems: "center",
        justifyContent: "space-between"
    }
})