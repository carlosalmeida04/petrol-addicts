import React, { useEffect, useState, useCallback } from 'react'
import { TouchableOpacity, Text, Image, View, SafeAreaView } from 'react-native'

import { db, getDoc, doc } from "../../firebase/firebasehandler"

import { useFocusEffect } from '@react-navigation/native'

import Loading from '../Loading'

export default function PerfilPublico({ route }) {

    const params = route.params

    const [userInfo, setUserInfo] = useState({})
    const [isloaded, setLoaded] = useState(false)

    async function getUserInfo() {
        const usersDoc = doc(db, "users", params.uid)
        try {
            const usersDocSnap = await getDoc(usersDoc)
            usersDocSnap.exists() ? setUserInfo({ nome: usersDocSnap.data().name, bio: usersDocSnap.data().bio }) : console.log("Doc não existente")
            return usersDocSnap.data().name
        } catch (e) {
            console.log(e)
        }
    }


    useFocusEffect(
        useCallback(() => {
            isloaded || getUserInfo().then(() => setLoaded(true))
            return () => {
                setLoaded(false)
                setUserInfo({})
            }
        }, []))

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
            {isloaded ? (
                <>
                    <View style={{ marginStart: "2.5%", width: "95%", flexDirection: "row", alignItems: "center" }}>

                        <Image style={{ marginTop: "2%", borderRadius: 100, }}
                            source={{
                                width: 100,
                                height: 100,

                                uri: `https://avatars.dicebear.com/api/personas/${userInfo.nome}.png`
                            }}
                        />

                        <View style={{ flexDirection: "column", marginStart: "2%", flexShrink: 1 }}>
                            <Text style={{ fontWeight: "bold" }}>{userInfo.nome}</Text>
                            {
                                /* MAXIMO 120 CARACTERES */
                            }
                            <Text>{userInfo.bio}</Text>
                        </View>



                    </View>


                    {/*<View style={{ marginBottom: 10, marginStart: 50, marginEnd: 50 }}>
                        <Button
                            title='Limpar Async Storage'
                            onPress={clearStorage}
                            color="#299993"
                        />
                        </View>*/}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: "1%" }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#dbdbdb' }} />
                    </View>
                </>
            ) : <Loading />}
        </SafeAreaView>
    )
}