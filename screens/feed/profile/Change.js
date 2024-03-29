import { StyleSheet, SafeAreaView, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Layout, Text, Input, Button, Icon } from '@ui-kitten/components'

import { getDoc, doc, db, auth, updateDoc, updateEmail, updatePassword, sendPasswordResetEmail } from "../../../firebase/firebasehandler"

import Loading from "../../Loading"

export default function Change({ route, navigation }) {

    const params = route.params
    const [name, setName] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [bio, setBio] = useState("")
    const [email, setEmail] = useState("")
    const [emailReset, setEmailReset] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPassowordConfirm] = useState("")
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const InputTextLenght = () => (
        <Text category="c1">{bio.length}/120</Text>
    )

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    }

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry} >
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    )

    async function changeEmail() {
        try {
            await updateEmail(auth.currentUser, email)
            await updateDoc(doc(db, "users", auth.currentUser.uid), { email: email })
            Alert.alert("Sucesso", "O teu e-mail foi alterado com sucesso!", [
                {
                    text: "Ok",
                    onPress: () => navigation.goBack()

                }
            ])
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                Alert.alert("Informação", "Termina sessão e volta a autenticar para mudar o e-mail.")
            }
        }
    }

    async function changePassword() {
        try {
            if (password != passwordConfirm) {
                Alert.alert("Informação", "As palavra-passe não coincidem.")
            }
            if (password === "" || passwordConfirm === "") {
                return
            }
            if (password.length < 6) {
                Alert.alert("Informação", "A palavra-passe tem de ter pelo menos 6 caracteres.")
                return
            }
            await updatePassword(auth.currentUser, password)
            Alert.alert("Sucesso", "A tua palavra-passe foi alterada com sucesso!", [
                {
                    text: "Ok",
                    onPress: () => navigation.goBack()

                }
            ])
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                Alert.alert("Informação", "Termina sessão e volta a autenticar para mudar a palavra-passe.")
            }
        }
    }

    async function changeName() {
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), { name: name })
            Alert.alert("Sucesso", "O teu nome foi alterado com sucesso!", [
                {
                    text: "Ok",
                    onPress: () => navigation.goBack()

                }
            ])
        } catch (error) {
            console.log(error)
        }
    }

    async function changeBio() {
        await updateDoc(doc(db, "users", auth.currentUser.uid), { bio: bio })
        Alert.alert("Sucesso", "A tua biografia foi alterada com sucesso!", [
            {
                text: "Ok",
                onPress: () => navigation.goBack()
            }
        ])
    }
    
    async function resetPassword() {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Sucesso", "E-mail enviado com sucesso!", [
                    {
                        text: "Ok",
                        onPress: () => navigation.goBack()
                    }
                ])
            }).catch((error) => {
                Alert.alert("Erro", "Aconteceu um erro inesperado, tenta novamente mais tarde")
                console.log(error)
            })
    }

    useEffect(() => {
        if (params.title === "Alterar e-mail") {
            setEmailReset(auth.currentUser.email)
        }
        else if (params.title === "Alterar nome") {
            loaded || getDoc(doc(db, "users", auth.currentUser.uid)).then((data) => {
                setName(data.data().name)
                setLoaded(true)
            })
        }
        else if (params.title === "Alterar biografia") {
            loaded || getDoc(doc(db, "users", auth.currentUser.uid)).then((data) => {
                setBio(data.data().bio)
                setLoaded(true)
            })
        }
    }, [])




    if (params.title === "Alterar e-mail") {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <Layout level={"1"} style={styles.layout}>
                        <Input
                            placeholder='Insire aqui o teu e-mail'
                            size={"large"}
                            value={emailReset}
                            style={{ padding: 15 }}
                            onChangeText={text => setEmailReset(text)}
                            autoCapitalize={false}
                            keyboardType={"email-address"}
                        />
                    </Layout>
                </TouchableWithoutFeedback>
                <SafeAreaView style={{ position: "absolute", bottom: 0, width: "100%", }}>
                    <Button
                        style={{ marginHorizontal: "4%", marginVertical: "5%" }}
                        size="large"
                        onPress={changeEmail}
                    >Mudar e-mail</Button>
                </SafeAreaView>
            </>
        )
    }
    else if (params.title === "Alterar palavra-passe") {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <Layout level={"1"} style={styles.layout}>
                        <Input
                            placeholder='Nova palavra-passe'
                            size={"large"}
                            value={password}
                            style={{ paddingHorizontal: 15, paddingVertical: 15 }}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry={secureTextEntry}
                            accessoryRight={renderIcon}
                        />
                        <Input
                            placeholder='Repitir a palavra-passe'
                            size={"large"}
                            value={passwordConfirm}
                            style={{ paddingHorizontal: 15 }}
                            onChangeText={text => setPassowordConfirm(text)}
                            secureTextEntry={secureTextEntry}
                            accessoryRight={renderIcon}
                        />
                    </Layout>
                </TouchableWithoutFeedback>
                <SafeAreaView style={{ position: "absolute", bottom: 0, width: "100%", }}>
                    <Button
                        style={{ marginHorizontal: "4%", marginVertical: "5%" }}
                        size="large"
                        onPress={changePassword}
                    >Mudar palavra-passe</Button>
                </SafeAreaView>
            </>
        )
    }

    else if (params.title === "Alterar nome") {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ height: "100%" }}>
                <Layout level={"1"} style={styles.layout}>
                    {loaded ?
                        <>
                            <Input
                                placeholder='Insira aqui o teu nome'
                                size={"large"}
                                value={name}
                                style={{ padding: 15 }}
                                onChangeText={text => setName(text)}

                            />

                            <SafeAreaView style={{ position: "absolute", bottom: 0, width: "100%", }}>
                                <Button
                                    style={{ marginHorizontal: "4%", marginVertical: "5%" }}
                                    size="large"
                                    onPress={changeName}
                                >Mudar nome</Button>
                            </SafeAreaView>
                        </> : <Loading />}
                </Layout>
            </TouchableWithoutFeedback>
        )
    }

    else if (params.title === "Alterar biografia") {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <Layout style={styles.layout}>

                    {loaded ?
                        <>
                            <Input
                                placeholder='Insira aqui o teu biografia'
                                size={"large"}
                                value={bio}
                                style={{ padding: 15 }}
                                onChangeText={text => setBio(text)}
                                multiline={true}
                                maxLength={120}
                                accessoryRight={InputTextLenght}
                            />
                            <SafeAreaView style={{ position: "absolute", bottom: 0, width: "100%", }}>
                                <Button
                                    style={{ marginHorizontal: "4%", marginVertical: "5%" }}
                                    size="large"
                                    onPress={changeBio}
                                >Mudar biografia</Button>
                            </SafeAreaView>
                        </> : <Loading />}

                </Layout >
            </TouchableWithoutFeedback>
        )
    } else if (params.title === "Repor palavra-passe") {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <Layout style={styles.layout}>

                    <Input
                        placeholder='O teu e-mail'
                        size={"large"}
                        value={email}
                        style={{ padding: 15 }}
                        onChangeText={text => setEmail(text)}
                        maxLength={100}
                        autoCapitalize={false}
                        keyboardType={"email-address"}
                    />
                    <SafeAreaView style={{ position: "absolute", bottom: 0, width: "100%", }}>
                        <Button
                            style={{ marginHorizontal: "4%", marginVertical: "5%" }}
                            size="large"
                            onPress={resetPassword}
                        >Enviar e-mail de recuperação</Button>
                    </SafeAreaView>

                </Layout >
            </TouchableWithoutFeedback>
        )
    }

}

const styles = StyleSheet.create({
    layout: {
        height: "100%"
    }
})