import { View, ScrollView, StyleSheet, Dimensions, Image, Alert } from 'react-native'
import { Layout, Input, Text, Divider } from '@ui-kitten/components'
import Header from '../../../../components/Header'
import { useNavigation } from "@react-navigation/native"
import React, { useState } from 'react'

import {
    doc, db,
    setDoc,
    storage, uploadBytesResumable,
    getDownloadURL,
    ref, auth,
    Timestamp,
} from "../../../../../firebase/firebasehandler"


import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

export default function Overview({ route }) {

    const navigation = useNavigation()
    const [uploadProgress, setUploadProgress] = useState(0)

    const params = route.params
    const postId = uuidv4()

    async function createPost(url, filename) {
        const description = params.desc, carro = params.car
        try {
            await setDoc(doc(db, "posts", postId), {
                postedAt: Timestamp.fromDate(new Date()),
                uid: auth.currentUser.uid,
                desc: description,
                car: carro,
                comments: 0,
                likes: 0,
                downloadUrl: url,
                fileName: filename,
                ap: params.ap
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function addCar() {

        try {
            if (!params.fromCarInfo) return
            await setDoc(doc(db, "cars", params.car), {
                createdAt: Timestamp.fromDate(new Date()),
                engine: params.engine,
                fuelType: params.fuel,
                displacement: params.displacement,
                drive: params.drive,
                transmission: params.trans,
                power: params.power
            })
        } catch (e) {
            console.log(e)
        }
    }
    async function uploadImage() {

        const imageUri = params.image
        try {

            let filename = imageUri.substring(imageUri.lastIndexOf("/") + 1)

            const extention = filename.split(".").pop()
            const name = filename.split(".").slice(0, -1).join(".")
            filename = name + Date.now() + "." + extention


            let imgUri = await fetch(imageUri)
            let blob = await imgUri.blob()


            const metadata = {
                contentType: 'image/jpeg'
            }

            const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${postId}/${filename}`)
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
                            setUploadProgress(0)
                            blob.close()
                            imgUri = null
                            addCar().then(() => {
                                Alert.alert("Sucesso", "Publicado com sucesso!")
                                navigation.navigate("Main")
                            }).catch(alert)

                        }).catch(alert)
                    })
                })

        } catch (error) {
            console.log(error)
        }
    }

    const AccessoryRight = ({ text }) => (
        <Text category="s1">{text}</Text>
    )

    return (
        <Layout level={"1"} style={{ height: "100%" }}>
            <Header buttonText="Publicar" title={"Resumo"} buttonOnPress={uploadImage} />
            <View style={{ width: `${uploadProgress}%`, backgroundColor: "#3366FF", height: 2 }} />
            <ScrollView>
                {params.fromCarInfo ?
                    <View style={{ marginBottom: "5%" }}>

                        <View style={styles.image} >
                            <Image source={{ uri: params.image }} style={{ aspectRatio: params.ap }} />
                        </View>
                        <View style={{ padding: "2.5%" }}>
                            <Divider />
                        </View>
                        <View style={styles.carView}>
                            <Text category={"h2"} >{params.car}</Text>
                            <Text category={"p1"} >{params.desc}</Text>
                        </View>

                        <View style={{ width: "100%", alignItems: "center" }} >
                            <View style={{ flexDirection: "row", width: "95%" }}>
                                <Input
                                    label="Tamanho do motor"
                                    size={"large"}
                                    value={params.displacement}
                                    style={{ width: "63%", marginEnd: "2%" }}
                                    disabled={true}
                                    accessoryRight={<AccessoryRight text={"CC"} />}

                                />
                                <Input
                                    label="Formato"
                                    value={params.engine}
                                    size={"large"}
                                    disabled={true}
                                    style={{ width: "35%" }}
                                />
                            </View>

                            <View style={{ width: "95%" }}>
                                <Input
                                    label="Potência"
                                    size={"large"}
                                    style={{ width: "100%" }}
                                    value={params.power}
                                    disabled={true}
                                    accessoryRight={<AccessoryRight text="CV" />}
                                />
                            </View>

                            <View style={{ width: "95%", marginTop: "2%" }}>
                                <Input
                                    label="Combustível"
                                    disabled={true}
                                    value={params.fuel}
                                    style={{ width: "100%" }}
                                    size={"large"}
                                />
                            </View>

                            <View style={{ width: "95%", marginTop: "2%", flexDirection: "row" }}>
                                <Input
                                    label="Transmição"
                                    value={params.trans}
                                    style={{ width: "63%", marginEnd: "2%" }}
                                    size={"large"}
                                    disabled={true}
                                />
                                <Input
                                    label="Tração"
                                    value={params.drive}
                                    style={{ width: "35%" }}
                                    size={"large"}
                                    disabled={true}
                                />
                            </View>
                        </View>
                    </View>
                    :
                    <View>

                        <View style={styles.image} >
                            <Image source={{ uri: params.image }} style={{ aspectRatio: params.ap }} />
                        </View>

                        <View style={{ width: "95%", marginEnd: "2.5%", marginStart: "2.5%" }} behavior={Platform.OS === "ios" ? "padding" : false}>
                            <Input
                                style={styles.input}
                                disabled={true}
                                size={"large"}
                                value={params.desc}
                            />
                            <Input
                                style={styles.input}
                                size={"large"}
                                disabled={true}
                                value={params.car}
                            />
                        </View>
                    </View>
                }

            </ScrollView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    car: {
        height: 50,
        width: 50,
        paddingEnd: "1%"
    },
    carView: {
        alignItems: "center",
        padding: "5%"
    },
    image: {
        width: Dimensions.get("screen").width,
        height: undefined,
        marginBottom: "2%"
    }
})