import { Alert, TouchableOpacity, View, StyleSheet } from 'react-native'
import { auth, signOut } from "../../../firebase/firebasehandler"

import { Layout, Text, Icon, Divider } from '@ui-kitten/components'

import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Settings({ navigation }) {

    async function logOut() {
        try {
            await Alert.alert("Alerta",
                "Tens a certeza que queres terminar sessão?",
                [
                    {
                        text: 'Sim', onPress: async () => {
                            await AsyncStorage.setItem("isLoggedIn", "0")
                            signOut(auth).then(() => {
                                navigation.replace("Landing")
                            })
                        }
                    },
                    { text: 'Cancelar', style: "cancel" }
                ],
            )

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
                    title: "Alterar e-mail"
                })}>
                    <Text style={styles.text}>Alterar e-mail</Text>
                    <Icon name={"email-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Change", {
                    title: "Alterar palavra-passe"
                })}>
                    <Text style={styles.text}>Alterar palavra-passe</Text>
                    <Icon name={"lock-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
            </View>

            <View style={styles.section}>

                <Text category={"h4"}>Perfil</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Change", {
                    title: "Alterar nome"
                })}>
                    <Text style={styles.text}>Alterar nome</Text>
                    <Icon name={"person-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Change", {
                    title: "Alterar biografia"
                })}>
                    <Text style={styles.text}>Alterar biografia</Text>
                    <Icon name={"edit-2-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
            </View>
            <View style={styles.section}>

                <Text category={"h4"}>Aplicação</Text>
                <TouchableOpacity style={styles.button} onPress={clearStorage}>
                    <Text style={styles.text}>Limpar cache</Text>
                    <Icon name={"trash-2-outline"} fill="black" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity style={styles.button} onPress={logOut}>
                    <Text category={"p1"} style={[styles.text, { color: "red" }]}>Terminar sessão</Text>
                    <Icon name={"log-out-outline"} fill="red" style={styles.icon} />
                </TouchableOpacity>
                <Divider />
            </View>

        </Layout >
    )
}


const styles = StyleSheet.create({

    section: {
        paddingVertical: 18,
        marginHorizontal: "5%",
    },
    icon: {
        height: 30,
        width: 30
    },
    button: {
        flexDirection: "row",
        width: "100%",
        height: 55,
        alignItems: "center",
        justifyContent: "space-between"
    },
    text: {
        fontSize: 17.5,
    }
})