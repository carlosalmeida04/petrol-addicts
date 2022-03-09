import React, { useState, useEffect, useCallback } from 'react'
import { Image, View, TouchableOpacity, Platform, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useNavigation, useFocusEffect } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker'

import { Text, Divider, Icon, Input, Button } from "@ui-kitten/components"
import Header from "../../components/Header"

import { getName } from "../../components/Reducers"


import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import {
    storage, uploadBytesResumable,
    getDownloadURL,
    ref, auth, doc,
    setDoc, db,
    Timestamp,
} from '../../../firebase/firebasehandler';





export default function Create({ navigation }) {


    const [image, setImage] = useState(null)
    const [imagePicked, setImagePicked] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [aspectRatio, setAspectRatio] = useState(0)
    const [desc, setDesc] = useState("")
    const [carro, setCarro] = useState("")
    const [name, setName] = useState("")




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
            Image.getSize(imgUri, (srcWith, srcHeight) => {
                setAspectRatio(srcWith / srcHeight)
            })
        }
    }

    async function createPost(downlodUrl, filename) {
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
                downloadUrl: downlodUrl,
                fileName: filename
            })
            return post
        } catch (e) {
            console.log(e)
        }
    }

    async function uploadImage() {

        if (desc === "" || carro === "") {
            Alert.alert("Informação", "Tens de introduzir uma descrição e declarar o carro a publicar.")
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

            const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${postFolderRef}/${filename}`)
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
                        createPost(downloadUrl, filename).then(() => {
                            setImage(null)
                            setImagePicked(false)
                            setUploadProgress(0)
                            setCarro("")
                            setDesc("")
                            blob.close()
                            imgUri = null
                            Alert.alert("Sucesso", "Publicado com sucesso!")
                            navigation.goBack()
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
            getName().then((nome) => setName(nome))
            return pick, setImage(false), setImagePicked(false)
        }, [])
    )

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : false} style={{ backgroundColor: "#fff" }}>
            <Header title={"Criar publicação"} buttonOnPress={uploadImage} />
            <ScrollView style={{ backgroundColor: "#fff", height: "100%" }} scrollEnabled={true} >
                <View style={{ backgroundColor: "#3366FF", width: `${uploadProgress}%`, height: 1 }} />

                {image &&
                    <View style={styles.image} >
                        <TouchableOpacity onPress={() => {
                            removeImage()
                            pickImage()
                        }}>
                            <Image source={{ uri: image }} style={{ aspectRatio: aspectRatio }} />
                        </TouchableOpacity>
                    </View>}

                {imagePicked &&
                    <KeyboardAvoidingView style={{ width: "95%", marginEnd: "2.5%", marginStart: "2.5%" }} behavior={Platform.OS === "ios" ? "padding" : false}>
                        <Input
                            style={styles.input}
                            placeholder='Descrição'
                            onChangeText={text => setDesc(text)}
                            size={"large"}
                        />
                        <Input
                            style={styles.input}
                            placeholder='Carro e modelo'
                            onChangeText={text => setCarro(text)}
                            size={"large"}
                        />
                    </KeyboardAvoidingView>
                }
            </ScrollView >
        </KeyboardAvoidingView>

    )
}


const styles = StyleSheet.create({
    input: {
        width: "100%",
        marginBottom: "2%"
    },
    buttonView: {
        flexDirection: "row",
        width: "95%",
        marginStart: "2.5%",
        marginEnd: "2.5%",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: undefined,
        marginBottom: "2%"
    }
})