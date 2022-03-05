import { createUserWithEmailAndPassword, auth, onAuthStateChanged } from "../../firebase/firebasehandler"
import { TouchableWithoutFeedback, Platform, Alert, KeyboardAvoidingView, View } from 'react-native'
import { Button, Text, Input, Icon } from '@ui-kitten/components'
import { doc, setDoc, db } from "../../firebase/firebasehandler"
import React, { useState, useEffect } from 'react'


import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from "../../styles/main"




export default function Register({ navigation }) {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [passowrdConfirm, setPasswordConfirm] = useState("")
    const [email, setEmail] = useState("")

    const [secureTextEntry, setSecureTextEntry] = useState(true);


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
        if (passowrdConfirm === "" && password === "" && email === "" && name === "") {
            Alert.alert("Campos", "Os campos não podem estar vazio!")
        } else if (password != passowrdConfirm) {
            Alert.alert("Palavras-passe", "As palavras-passe não combinam.", [
                {
                    text: "Tentar novamente", onPress: () => {
                        setPassword("")
                        setPasswordConfirm("")
                    }
                }
            ])
        } else if (name === "") {
            Alert.alert("Nome", "Preencha o seu nome.")
        } else if (email === "") {
            Alert.alert("E-mail", "Preencha o seu e-mail.")
        } else {
            createUserWithEmailAndPassword(auth, email, password).then((user) => {
                const uuid = user.user.uid
                setUsers(name, email).then(() => {
                    setUserInfo("1", uuid)
                })
            }).catch(error => {
                const errorCode = error.code
                if (errorCode === "auth/email-already-in-use") {
                    Alert.alert("Registo", "O e-mail que introduziu já se encontra em uso!")
                }
            })
        }
    }



    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    }

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    )

    return (
        <KeyboardAvoidingView style={styles.containerMain} behavior={Platform.OS === "ios" ? "padding" : false}>
            <View style={{ marginBottom: "20%" }}>
                <Text category="h1">Registo</Text>
                <Text category="c1" >Petrol-Addicts</Text>
            </View>
            <Input
                size="large"
                status="basic"
                label='Nome'
                placeholder='Sílvia Raquel'
                keyboardType='email-address'
                value={name}
                accessoryLeft={<Icon name={"person-outline"} />}
                onChangeText={text => setName(text)}
                style={styles.input}
            />
            <Input

                status="basic"
                size="large"
                label='O seu e-mail'
                placeholder='email@exemplo.com'
                value={email}
                accessoryLeft={<Icon name={"email-outline"} />}
                onChangeText={text => setEmail(text)}
                style={styles.input}
            />
            <Input
                status="basic"
                label='Palavra-passe'
                size="large"
                placeholder='palavrapasse123'
                value={password}
                accessoryRight={renderIcon}
                accessoryLeft={<Icon name={"lock-outline"} />}
                secureTextEntry={secureTextEntry}
                onChangeText={text => setPassword(text)}
                style={styles.input}
            />
            <Input
                size="large"
                status="basic"
                label='Confirme a palavra-passe'
                placeholder='palavrapasse123'
                value={passowrdConfirm}
                accessoryRight={renderIcon}
                secureTextEntry={secureTextEntry}
                accessoryLeft={<Icon name={"lock-outline"} />}
                onChangeText={text => setPasswordConfirm(text)}
                style={[styles.input, { marginBottom: 15 }]}
            />
            <Button appearance="filled" onPress={handleRegister} style={styles.button} size="large">
                Registar
            </Button>
        </KeyboardAvoidingView>
    )
}
