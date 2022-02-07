import React, { useEffect, useState } from 'react'

import { View, Text, TextInput, Image, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { signInWithEmailAndPassword, auth, onAuthStateChanged } from "../../firebase/firebasehandler"
import styles from "../../styles/main"


export default function Login({ navigation }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        const unsubsribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace("Main")
            }
        })
        return unsubsribe
    }, [])


    async function setUserInfo(state, uid) {
        try {

            const setState = await AsyncStorage.setItem("isLoggedIn", state)
            const setUserId = await AsyncStorage.setItem("userID", uid)

            return setState, setUserId
        } catch (e) {
            return console.log(e)
        }
    }

    async function handleLogin() {
        {
            email === "" || password === "" ?
                Alert.alert("Erro na autenticação", "Os campos não podem estar vazios!",
                    [
                        { text: 'Ok' }
                    ],
                    { cancelable: false }
                )
                : signInWithEmailAndPassword(auth, email, password)
                    .then((user) => {
                        const uid = user.user.uid
                        setUserInfo("1", uid)
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        console.log(errorCode)
                        if (errorCode === "auth/invalid-email") {
                            Alert.alert("Erro na autenticação", "Combinação de palavra-passe e e-mail errada! Tente novamente.",
                                [
                                    { text: 'Ok' },
                                ],
                                { cancelable: false }
                            )
                        } else if (errorCode === "auth/wrong-password") {
                            Alert.alert("Erro na autenticação", "Palavra-passe errada.",
                                [
                                    { text: 'Ok' },
                                ],
                                { cancelable: false }
                            )
                        } else if (errorCode === "auth/user-not-found") {
                            Alert.alert("Erro na autenticação", "E-mail não registado!",
                                [
                                    { text: 'Tentar novamente' },
                                    { text: 'Registe-se', onPress: () => navigation.navigate("Register") },
                                ],
                                { cancelable: false }
                            )
                        }

                    })
        }
    }
    return (

        <KeyboardAvoidingView style={styles.containerMain} behavior={Platform.OS === "ios" ? "padding" : false}>
            <View style={{ alignItems: "center" }}>
                <Image source={require('../../assets/img/logo.png')} style={{ height: 300, width: 300 }} />
            </View>
            <TextInput
                onChangeText={text => setEmail(text)}
                style={styles.input}
                placeholder="E-mail"
                autoCapitalize='none'
                keyboardType='email-address'
            />
            <TextInput
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                style={styles.input}
                placeholder="Palavra-passe"
                keyboardType='default'
            />
            <View style={{ marginLeft: "auto", marginRight: "10%", marginBottom: 15 }}>
                <TouchableOpacity >
                    <Text style={styles.forgotPasswordText}>Esqueceste-te da palavra-passe?</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin} >
                <Text style={{ fontSize: 12 }}>Autenticar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView >

    )
}

