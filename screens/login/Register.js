import React, { useState, useEffect } from 'react'
import { Text, TextInput, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { createUserWithEmailAndPassword, auth, onAuthStateChanged } from "../../firebase/firebasehandler"
import { doc, setDoc, db } from "../../firebase/firebasehandler"

import styles from "../../styles/main"

export default function Register({ navigation }) {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [passowrdConfirm, setPasswordConfirm] = useState("")
    const [email, setEmail] = useState("")


    useEffect(() => {
        const unsubsribe = onAuthStateChanged(auth, user => {
            if (user) {
                console.log(user.uid)
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


    async function setUsers(nome, email) {
        try {
            return await setDoc(doc(db, "users", auth.currentUser.uid), {
                email: email,
                name: nome,
                bio: "Isto é a biografia do teu perfil! Edita-a nas definições."
            })
        } catch (e) {
            console.log(e)
        }
    }

    function handleRegister() {
        {
            /*email === "" ?
                Alert.alert("E-mail", "Preencha o seu e-mail", [{ text: 'Ok' }, { cancelable: false }])
                : password === "" ?
                    Alert.alert("Palavra-passe", "Preencha a palavra-passe", [{ text: 'Ok' }, { cancelable: false }])
                    : passowrdConfirm === "" ?
                        Alert.alert("Palavra-passe", "Repita a palavra-passe", [{ text: 'Ok' }, { cancelable: false }])
                        : password.length < 6 ? 
                            Alert.alert("Palavra-passe", "A palavra-passe tem de ter pelo menos 6 caracteres!")
                            : */
            password != passowrdConfirm ? Alert.alert("Palavras-passe", "As palavras-passes não combinam!",
                [
                    {
                        text: "Ok",
                        onPress: () => {
                            setPassword('')
                            setPasswordConfirm('')
                        }
                    }, { cancelable: false }
                ])
                : createUserWithEmailAndPassword(auth, email, password)
                    .then((user) => {
                        const uuid = user.user.uid
                        setUsers(name, email).then(() => {
                            setUserInfo("1", uuid)
                        })
                    })
                    .catch(error => {
                        const errorCode = error.code
                        if (errorCode === "auth/email-already-in-use") {
                            Alert.alert("Registo", "O e-mail que introduziu já se encontra em uso!")
                        }
                    })
        }
    }
    return (
        <SafeAreaView style={styles.containerMain}>
            <Image source={require("../../assets/img/logo.png")} style={styles.logo} />
            <TextInput
                style={styles.input}
                placeholder="Nome"
                keyboardType='default'
                onChangeText={text => setName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                autoCapitalize='none'
                keyboardType='email-address'
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={password}
                placeholder="Palavra-passe"
                onChangeText={text => setPassword(text)}
            />
            <TextInput
                secureTextEntry={true}
                value={passowrdConfirm}
                style={styles.input}
                placeholder="Confirme a palavra-passe"
                onChangeText={text => setPasswordConfirm(text)}
            />
            <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <Text>Registar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
