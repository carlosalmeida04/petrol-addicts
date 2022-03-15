import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../../../components/Header'
import { uploadImage } from '../../../../components/Reducers'


export default function Overview() {

    // no final para publicar, enviar os argumentos para a funçao: imgURI, carro e desc: uploadImage(imgUri, carro, desc)
    return (
        <View>
            <Header buttonOnPress={() => { }} buttonText="Publicar" title={"Resumo"} />
            <Text>Overview</Text>
        </View>
    )
}