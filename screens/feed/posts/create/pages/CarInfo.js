import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../../../../components/Header'

export default function CarInfo({ navigation, route }) {

    const params = route.params

    function navigateNextScreen() {
        navigation.navigate("Overview")
    }

    return (
        <View>
            <Header buttonOnPress={navigateNextScreen} buttonText={"Seguinte"} title="Informações do carro" />
            <Text>{params.car}</Text>
        </View>
    )
}