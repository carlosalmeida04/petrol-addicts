import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../../../../components/Header'

export default function CarInfo({ navigation, route }) {

    const params = route.params
    return (
        <View>
            <Header buttonOnPress={() => navigation.navigate("Overview")} buttonText={"Seguinte"} title="Informações do carro" />
            <Text>{params.car}</Text>
        </View>
    )
}