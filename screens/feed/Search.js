import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, View, Image, ScrollView } from 'react-native'

import { Text, Input, Layout, Icon, Select, IndexPath, SelectItem } from "@ui-kitten/components"
import { getDocs, db, query, collection, where, doc, getDoc } from "../../firebase/firebasehandler"

import { useFocusEffect } from "@react-navigation/native"

export default function Search({ navigation }) {

    const [search, setSearch] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0))
    const [users, setUsers] = useState([])
    const [cars, setCars] = useState({})
    const [hasResults, setHasresults] = useState(true)
    const indexs = ["Pessoas", "Carros"]


    async function getUsers() {
        try {
            const q = query(collection(db, "users"), where("name", "==", search))
            const snapshot = await getDocs(q)
            snapshot.forEach((doc) => console.log(doc.id, " => ", doc.data()))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (selectedIndex - 1 === 0) {
            getDocs(query(collection(db, "users"), where("name", "==", search)))
                .then((data) => {
                    if (data.empty) setHasresults(false)
                    else {
                        let users = []
                        data.forEach((doc) => users.push({ id: doc.id, name: doc.data().name }))
                        setUsers(users)
                        setHasresults(true)
                    }

                })
        } else {
            if (search === "") return
            getDoc(doc(db, "cars", search))
                .then((data) => {
                    if (data.exists()) {
                        let cars = []
                        cars.push({
                            car: search,
                            displacement: data.data().displacement,
                            drive: data.data().drive,
                            engine: data.data().engine,
                            fuelType: data.data().fuelType,
                            power: data.data().power,
                            transmission: data.data().transmission
                        })
                        setCars(cars)
                        setHasresults(true)
                    } else {
                        setHasresults(false)
                    }
                })
        }

    }, [search, selectedIndex])

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                return setCars([]), setHasresults(false), setSearch(""), setUsers([])
            }, 120000);
        }, [])
    )
    return (

        <Layout level="1" style={styles.container} >
            <SafeAreaView>
                <View style={styles.searchView}>
                    <Input
                        onChangeText={text => setSearch(text)}
                        placeholder="Nome de perfil ou carro"
                        size={"medium"}
                        value={search}
                        style={{ width: "68%", paddingHorizontal: 10, }}
                        accessoryLeft={<Icon name="search-outline" fill="black" style={{ width: 10, height: 10, }} />}

                    />
                    <Select
                        onSelect={index => setSelectedIndex(index)}
                        selectedIndex={selectedIndex}
                        value={indexs[selectedIndex - 1]}
                        style={{ width: "30%" }}>
                        {indexs.map((item) => <SelectItem title={item} />)}
                    </Select>
                </View>
            </SafeAreaView>
            <ScrollView style={{ height: "100%" }} contentContainerStyle={{ flexGrow: 1 }}>
                {hasResults ?
                    selectedIndex - 1 === 0 ? users.map((users) => (
                        <View key={users.id}>
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PublicProfile", { uid: users.id, title: users.name })}>

                                <Image
                                    style={{
                                        borderRadius: 100
                                    }}
                                    source={{
                                        height: 45,
                                        width: 45,
                                        uri: `https://avatars.dicebear.com/api/initials/${users.name}.png`
                                    }}
                                />
                                <Text category="p1" style={{ padding: 10, fontSize: 17 }}>{users.name}</Text>

                            </TouchableOpacity>
                        </View>
                    )) : cars.map((car) =>
                        <View View key={car.car} >
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Car", {
                                car: car.car,
                                engine: car.engine,
                                displacement: car.displacement,
                                drive: car.drive,
                                power: car.power,
                                transmission: car.transmission,
                                fuelType: car.fuelType,
                                title: car.car
                            })}>
                                <Image
                                    style={{
                                        borderRadius: 100,
                                        height: 50,
                                        width: 50,
                                    }}
                                    source={require("../../assets/img/car.png")}
                                />
                                <Text category="p1" style={{ padding: 10, fontSize: 17 }}>{car.car}</Text>

                            </TouchableOpacity>
                        </View>
                    )

                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>Não foram encontrados resultados.</Text>
                    </View>
                }
            </ScrollView>
        </Layout >
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%"
    },
    searchView: {
        marginTop: StatusBar.currentHeight,
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 35,
        paddingVertical: 10
    }
})


