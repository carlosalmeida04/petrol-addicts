import { View, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native'
import { signInWithEmailAndPassword, auth, onAuthStateChanged, sendPasswordResetEmail } from "../../firebase/firebasehandler"
import { Button, Text, Input, Icon } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from "../../styles/main"
import main from '../../styles/main'

export default function Login({ navigation }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [secureTextEntry, setSecureTextEntry] = useState(true)

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
                Alert.alert("Erro", "Os campos não podem estar vazios!",
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

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    }

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry} >
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    )

    const resetPassowrd = () => {
        navigation.navigate("Change", { title: "Repor palavra-passe"})
    }

    return (

        <KeyboardAvoidingView style={styles.containerMain} behavior={Platform.OS === "ios" ? "padding" : false}>
            <View style={{ marginBottom: "20%" }}>
                <Text category="h1">Autenticação</Text>
                <Text category="c1" >Petrol-Addicts</Text>
            </View>
            <Input
                //label="E-mail"
                placeholder="email@exemplo.com"
                size="large"
                autoCapitalize='none'
                keyboardType='email-address'
                value={email}
                accessoryLeft={<Icon name={"email-outline"} />}
                style={styles.input}
                onChangeText={text => setEmail(text)}
            />
            <Input
                //Slabel="Palvra-passe"
                size="large"
                placeholder="Palavra-passe"
                value={password}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                accessoryRight={renderIcon}
                accessoryLeft={<Icon name={"lock-outline"} />}
                onChangeText={text => setPassword(text)}
            />
            <View style={{ marginLeft: "auto", marginRight: "7%", marginBottom: 15 }}>
                <Button status={"basic"} size="tiny" appearance="ghost" onPress={resetPassowrd}> Esqueceste-te da palavra-passe?</Button>
            </View>
            <Button style={main.button} appearance="filled" onPress={handleLogin}>Autenticar</Button>
        </KeyboardAvoidingView >

    )
}

