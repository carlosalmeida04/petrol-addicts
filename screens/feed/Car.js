import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';


export default function Car({ route }) {

    const params = route.params
    return (
        <SafeAreaView>
            <Text>{params.carro}</Text>
        </SafeAreaView>
    )
}


