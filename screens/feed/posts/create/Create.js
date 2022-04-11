import React, { useState, useCallback } from 'react'
import { Image, View, TouchableOpacity, Platform, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native'

import { useFocusEffect } from "@react-navigation/native"
import { getName } from "../../../components/Reducers"
import { Input } from "@ui-kitten/components"

import Header from "../../../components/Header"
import * as ImagePicker from 'expo-image-picker'

import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'




export default function Create({ navigation }) {


    const [image, setImage] = useState(null)
    const [imagePicked, setImagePicked] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [aspectRatio, setAspectRatio] = useState(0)
    const [desc, setDesc] = useState("")
    const [carro, setCarro] = useState("")
    const [name, setName] = useState("")

    const postId = uuidv4()

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

    function removeImage() {
        setImagePicked(false)
        setImage(null)
    }

    function navigateNextScreen() {
        if (carro === "") {
            Alert.alert("Informação", "Tens de introduzir o carro que vais publicar.")
            return
        }
        if (desc === "") {
            Alert.alert("Informação", "Tens de introduzir uma descrição.")
            return
        }
        Alert.alert("Informação", "Sabes as especificações do carro que estás a publicar?",
            [
                {
                    onPress: () => navigation.navigate("CarInfo", {
                        car: carro,
                        image: image,
                        name: name,
                        desc: desc,
                        ap: aspectRatio
                    }),
                    text: "Sim",
                },
                {
                    onPress: () => navigation.navigate("Overview", {
                        car: carro,
                        image: image,
                        name: name,
                        desc: desc,
                        fromCarInfo: false,
                        ap: aspectRatio
                    }),
                    text: "Não"
                }
            ], { cancelable: false }
        )

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
            <Header title={"Criar publicação"} buttonOnPress={navigateNextScreen} buttonText={"Seguinte"} />
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
                    </View>
                }

                {imagePicked &&
                    <KeyboardAvoidingView style={{ width: "95%", marginEnd: "2.5%", marginStart: "2.5%" }} behavior={Platform.OS === "ios" ? "padding" : false}>
                        <Input
                            style={styles.input}
                            placeholder='Descrição'
                            onChangeText={text => setDesc(text)}
                            size={"large"}
                            value={desc}
                        />
                        <Input
                            style={styles.input}
                            placeholder='Carro e modelo'
                            onChangeText={text => setCarro(text)}
                            size={"large"}
                            value={carro}
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
        width: Dimensions.get("screen").width,
        height: undefined,
        marginBottom: "2%"
    }
})