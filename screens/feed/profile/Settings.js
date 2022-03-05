import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { auth, signOut } from "../../../firebase/firebasehandler"

import React from 'react'
import Ionicons from "@expo/vector-icons/Ionicons"
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
                    { text: 'Ok', onPress: () => AsyncStorage.clear().then(() => console.log("Done.")) }
                ], { cancelable: false }
            )

        } catch (e) {
            console.log(e)
        }

    }

    return (
        <View style={{ height: "100%" }}>

            {/* Conta*/}
            <Text style={styles.title}>Conta</Text>
            <View style={{ backgroundColor: "#fff", }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ color: "black", fontSize: 16 }}>Alterar e-mail</Text>
                    <Ionicons name='mail' size={28} color={"black"} style={{ marginEnd: "2%" }} />
                </TouchableOpacity>
            </View>
            <View style={{ with: "100%", height: 1, backgroundColor: "#eee" }} />
            <View style={{ backgroundColor: "#fff", marginBottom: "2%" }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ color: "black", fontSize: 16 }}>Alterar palavra-passe</Text>
                    <Ionicons name='key' size={28} color={"black"} style={{ marginEnd: "2%" }} />
                </TouchableOpacity>
            </View>


            {/*Perfil */}
            <Text style={styles.title}>Perfil</Text>
            <View style={{ backgroundColor: "#fff", }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ color: "black" }}>Biografia</Text>
                    <Ionicons name='create' size={28} color={"black"} style={{ marginEnd: "2%" }} />
                </TouchableOpacity>
            </View>
            <View style={{ with: "100%", height: 1, backgroundColor: "#eee" }} />
            <View style={{ backgroundColor: "#fff", marginBottom: "2%", }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ color: "black", fontSize: 16 }}>Nome</Text>
                    <Ionicons name='person' size={28} color="black" style={{ marginEnd: "2%" }} />
                </TouchableOpacity>
            </View>

            {/*Aplicação*/}
            <Text style={styles.title}>Aplicação</Text>
            <View style={{ backgroundColor: "#fff", marginBottom: "2%", }}>
                <TouchableOpacity onPress={clearStorage} style={styles.button}>
                    <Text style={{ fontSize: 16, color: "black" }}>Limpar cache</Text>
                    <Ionicons name='trash' size={28} color={"black"} style={{ marginEnd: "2%" }} />
                </TouchableOpacity>
            </View>

            {/*Terminar sessão*/}
            <Text style={styles.title}>Terminar Sessão</Text>


            <View style={{ backgroundColor: "#fff", }}>
                <TouchableOpacity onPress={logOut} style={styles.button}>
                    <Text style={{ color: "red", fontSize: 16 }}>Terminar Sessão</Text>
                    <Ionicons name='exit-outline' size={28} color={"red"} style={{ marginEnd: "2%" }} />
                </TouchableOpacity>
            </View>

        </View >
    )
}


const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        marginStart: "2%",
        marginBottom: "2%"
    },
    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginStart: "2%",
        alignItems: "center",
        height: 50
    }
})