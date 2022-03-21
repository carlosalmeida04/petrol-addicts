import { View, ScrollView, StyleSheet, Dimensions, Image } from 'react-native'
import React from 'react'
import Header from '../../../../components/Header'
import { uploadImage } from '../../../../components/Reducers'

import { Layout, Input, Text, Divider } from '@ui-kitten/components'
export default function Overview({ route }) {
    const params = route.params
    console.log(params)
    // no final para publicar, enviar os argumentos para a funçao: imgURI, carro e desc: uploadImage(imgUri, carro, desc)


    const AccessoryRight = ({ text }) => (
        <Text category="s1">{text}</Text>
    )

    return (
        <Layout level={"1"} style={{ height: "100%" }}>
            <Header buttonOnPress={() => { uploadImage(params.image, params.car, params.des) }} buttonText="Publicar" title={"Resumo"} />
            <ScrollView>
                {params.fromCarInfo ?
                    <View>

                        <View style={styles.carView}>
                            <Text category={"h2"} >{params.car}</Text>
                        </View>
                        <Text>ola</Text>
                        <View style={styles.image} >
                            <Image source={{ uri: params.image }} style={{ aspectRatio: params.ap }} />
                        </View>
                        <View style={{ padding: "2.5%" }}>
                            <Divider />
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