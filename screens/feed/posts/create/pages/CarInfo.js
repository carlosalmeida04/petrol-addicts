import { View, SafeAreaView, Alert, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Header from '../../../../components/Header'

import { Layout, Text, Divider, Input, Select, SelectItem, IndexPath } from '@ui-kitten/components'

export default function CarInfo({ navigation, route }) {

    const params = route.params
    const [displacement, setDisplacement] = useState(0)
    const [power, setPower] = useState(0)

    const [engineselectedIndex, engineSetSelectedIndex] = useState(new IndexPath(0))
    const [fuelsSelectedIndex, fuelsSetSelectedIndex] = useState(new IndexPath(0))
    const [transSelectedIndex, transSetSelectedIndex] = useState(new IndexPath(0))
    const [driveSelectedIndex, setDriveSelectedIndex] = useState(new IndexPath(0))

    const engineIndexes = ["V6", "V8", "V10", "V12", "I6", "I4", "I5", "I3"]
    const fuelTypes = ["Hibrído", "Gasolina", "Gasóleo"]
    const trans = ["Automático", "Manual"]
    const drive = ["AWD", "RWD", "FWD"]

    const enginedisplayValue = engineIndexes[engineselectedIndex.row]
    const fuelsDisplayValue = fuelTypes[fuelsSelectedIndex.row]
    const transDisplayValue = trans[transSelectedIndex.row]
    const driveDisplayValue = drive[driveSelectedIndex.row]

    function navigateNextScreen() {
        if (displacement === 0) {
            Alert.alert("Informação", "Tens de indicar a cilindrada.")
            return
        }
        if (power === 0) {
            Alert.alert("Informação", "Tens de indicar a potência.")
            return
        }
        navigation.navigate("Overview", {
            car: params.car,
            displacement: displacement,
            power: power,
            engine: engineIndexes[engineselectedIndex - 1],
            fuel: fuelTypes[fuelsSelectedIndex - 1],
            trans: trans[transSelectedIndex - 1],
            drive: drive[driveSelectedIndex - 1],
            desc: params.desc,
            image: params.image,
            name: params.name,
            fromCarInfo: true,
            ap: params.ap
        })
    }

    const renderOptions = (title) => (
        <SelectItem title={title} />
    )

    const AccessoryRight = ({ text }) => (
        <Text category="s1">{text}</Text>
    )

    return (
        <Layout level={"1"} style={{ height: "100%" }}>
            <Header buttonOnPress={navigateNextScreen} buttonText={"Seguinte"} title={"Informações do carro"} subtitle={params.car} />
            <ScrollView>
                <View>
                    <View style={styles.carView}>
                        <Text category={"h2"} >{params.car}</Text>
                    </View>

                    <View style={{ padding: "2.5%" }}>
                        <Divider />
                    </View>

                    <View style={{ width: "100%", alignItems: "center" }} >

                        <View style={{ flexDirection: "row", width: "95%" }}>
                            <Input
                                label="Tamanho do motor"
                                size={"large"}
                                placeholder="1200"
                                style={{ width: "63%", marginEnd: "2%" }}
                                keyboardType="number-pad"
                                accessoryRight={<AccessoryRight text={"CC"} />}
                                onChangeText={text => setDisplacement(text)}
                                value={displacement}
                            />
                            <Select
                                label="Formato"
                                onSelect={index => engineSetSelectedIndex(index)}
                                value={enginedisplayValue}
                                placeholder="Selecione uma opção"
                                selectedIndex={engineselectedIndex}
                                size={"large"}
                                style={{ width: "35%" }}
                            >
                                {engineIndexes.map(renderOptions).sort()}
                            </Select>

                        </View>
                        <View style={{ width: "95%" }}>
                            <Input
                                label="Potência"
                                placeholder="151"
                                size={"large"}
                                style={{ width: "100%" }}
                                keyboardType="number-pad"
                                accessoryRight={<AccessoryRight text="CV" />}
                                onChangeText={text => setPower(text)}
                                value={power}
                            />
                        </View>

                        <View style={{ width: "95%", marginTop: "2%" }}>
                            <Select
                                label="Combustível"
                                onSelect={index => fuelsSetSelectedIndex(index)}
                                value={fuelsDisplayValue}
                                selectedIndex={fuelsSelectedIndex}
                                style={{ width: "100%" }}
                                size={"large"}
                            >
                                {fuelTypes.map(renderOptions)}
                            </Select>
                        </View>

                        <View style={{ width: "95%", marginTop: "2%", flexDirection: "row" }}>
                            <Select
                                label="Transmição"
                                onSelect={index => transSetSelectedIndex(index)}
                                value={transDisplayValue}
                                selectedIndex={transSelectedIndex}
                                style={{ width: "63%", marginEnd: "2%" }}
                                size={"large"}
                            >
                                {trans.map(renderOptions)}
                            </Select>

                            <Select
                                label="Tração"
                                onSelect={index => setDriveSelectedIndex(index)}
                                value={driveDisplayValue}
                                selectedIndex={driveSelectedIndex}
                                style={{ width: "35%" }}
                                size={"large"}
                            >
                                {drive.map(renderOptions)}
                            </Select>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </Layout >
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