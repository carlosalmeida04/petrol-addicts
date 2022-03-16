import { View, SafeAreaView, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Header from '../../../../components/Header'

import { Layout, Text, Divider, Input, Select, SelectItem, IndexPath } from '@ui-kitten/components'

export default function CarInfo({ navigation, route }) {

    const params = route.params

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0))

    function navigateNextScreen() {
        navigation.navigate("Overview")
    }
    const engineIndexes = ["V6", "V8", "V10", "V12", "I6", "I4", "I5", "I3"]
    const displayValue = engineIndexes[selectedIndex.row]


    const renderOptions = (title) => (
        <SelectItem title={title} />
    )
    return (
        <Layout level={"1"} style={{ height: "100%" }}>
            <ScrollView>
                <Header buttonOnPress={navigateNextScreen} buttonText={"Seguinte"} title={"Informações do carro"} subtitle={params.car} />
                <View style={styles.carView}>
                    <Text category={"h2"} >{params.car}</Text>
                </View>

                <View style={{ marginEnd: "2.5%", marginStart: "2.5%" }}>
                    <Divider />
                </View>
                <View style={{ width: "100%", alignItems: "center" }} >
                    <View style={{ flexDirection: "row" }}>
                        <Input
                            placeholder="Cilindrada em CC"
                            size={"large"}
                            style={{ width: "70%" }}
                            keyboardType="number-pad"
                        />
                        <Select
                            onSelect={index => setSelectedIndex(index)}
                            value={displayValue}
                            placeholder="Selecione uma opção"
                            selectedIndex={selectedIndex}
                            size={"large"}
                            style={{ width: "25%" }}
                        >
                            {engineIndexes.map(renderOptions)}

                        </Select>
                    </View>
                </View>
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
    }
})