import React, { useState, useEffect, useCallback } from 'react'
import { Image, View, TouchableOpacity, Platform, StyleSheet, Alert, TextInput, KeyboardAvoidingView, StatusBar, SafeAreaView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useNavigation, useFocusEffect } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker'

import { Text, Divider } from "@ui-kitten/components"
import Ionicons from "@expo/vector-icons/Ionicons"

import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import {
    storage, uploadBytesResumable,
    getDownloadURL,
    ref, auth, doc,
    setDoc, db,
    Timestamp,
} from '../../../firebase/firebasehandler';



export default function Create() {

    let headerMarginTop
    const [image, setImage] = useState(null)
    const [imagePicked, setImagePicked] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(50)
    const [desc, setDesc] = useState("")
    const [carro, setCarro] = useState("")
    const [name, setName] = useState("")
    const [opened, setOpened] = useState(false)
    const navigatin = useNavigation()


    if (Platform.OS !== "ios") {
        headerMarginTop = StatusBar.currentHeight
    }

    async function getName() {
        try {
            return await AsyncStorage.getItem("name")
        } catch (e) {
            console.log(e)
        }
    }
    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })
        if (!result.cancelled) {
            const imgUri = result.uri
            setImage(imgUri)
            setImagePicked(true)
        }
    }

    async function createPost(downlodUrl) {
        getName().then((nome) => { setName(nome) })
        const postId = uuidv4()
        try {
            const post = await setDoc(doc(db, "posts", postId), {
                postedAt: Timestamp.fromDate(new Date()),
                name: name,
                uid: auth.currentUser.uid,
                desc: desc,
                car: carro,
                comments: 0,
                likes: 0,
                downloadUrl: downlodUrl
            })
            return post
        } catch (e) {
            console.log(e)
        }
    }

    async function uploadImage() {

        if (desc === "" || carro === "") {
            Alert.alert("Informação", "Tem de introduzir uma descrição e o carro que quer publicar.")
        } else {
            let filename = image.substring(image.lastIndexOf("/") + 1)

            const extention = filename.split(".").pop()
            const name = filename.split(".").slice(0, -1).join(".")
            filename = name + Date.now() + "." + extention


            let imgUri = await fetch(image)
            const blob = await imgUri.blob()
            const postFolderRef = uuidv4()

            const metadata = {
                contentType: 'image/jpeg'
            }

            const storageRef = ref(storage, `posts/${postFolderRef}/${filename}`)
            const uploadTask = uploadBytesResumable(storageRef, blob, metadata)

            uploadTask.on("state_changed",
                (snapshot) => {
                    setUploadProgress(snapshot.bytesTransferred / snapshot.totalBytes * 100)
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            console.log("storage/unauthorized")
                            break;
                        case 'storage/canceled':
                            console.log("storage/canceled")
                            break;
                        case 'storage/unknown':
                            console.log("storage/unknown")
                            break;
                    }
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        createPost(downloadUrl).then(() => {
                            setImage(null)
                            setImagePicked(false)
                            setUploadProgress(0)
                            setCarro("")
                            setDesc("")
                            blob.close()
                            imgUri = null
                            Alert.alert("Sucesso", "Publicado com sucesso!")
                        }).catch(alert)
                    })
                })
        }

    }

    function removeImage() {
        setImagePicked(false)
        setImage(null)
    }

    useFocusEffect(
        useCallback(() => {
            const pick = pickImage()

            return pick, setImage(false), setImagePicked(false)
        }, [])
    )

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : false} style={{ backgroundColor: "#fff" }}>
            <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }} scrollEnabled={true} >
                <View style={{ backgroundColor: "#3366FF", width: `${uploadProgress}%`, height: 1 }} />
                {/* {imagePicked &&
                    <TouchableOpacity
                        onPress={removeImage}
                        style={{ marginStart: "auto", position: "relative", }}>
                        <Ionicons name='close-outline' size={30} />
                </TouchableOpacity>}*/}
                {image && <Image source={{ uri: image }} style={styles.image} />}

                {/*{imagePicked &&
                    <>
                        <TextInput
                            style={styles.input}

                            placeholder='Descrição'
                            onChangeText={text => setDesc(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Carro e modelo'
                            onChangeText={text => setCarro(text)}
                        />
                    </>
                } */}
            </SafeAreaView >
        </KeyboardAvoidingView>

    )
}


const styles = StyleSheet.create({
    input: {
        borderColor: "#eeeeee",
        borderBottomWidth: 1,
        borderRadius: 5,
        height: 40,
        width: "100%",
        paddingStart: 10
    },
    image: {
        flex: 1,
        width: undefined,
        height: undefined,
        resizeMode: "contain",
        position: "relative",
        top: "-4.5%",
        zIndex: - 1
    },
    buttonView: {
        flexDirection: "row",
        alignItems: "center",
        marginStart: "auto"
    }
})