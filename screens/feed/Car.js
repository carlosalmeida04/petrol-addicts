import { StyleSheet, View, Image } from 'react-native';
import React from 'react';

import { Text, Layout } from '@ui-kitten/components';

export default function Car({ route }) {

    const params = route.params
    return (
        <Layout level={"1"} style={{ height: "100%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", textAlign: "center", justifyContent: "center" }}>
                <Image style={{ width: 50, height: 50 }} source={require("../../assets/img/car.png")} />
                <Text category={"h3"} style={{ textAlign: "center", padding: 15 }}>{params.car}</Text>
            </View>
            <View style={[styles.columns, styles.container]}>

                <View style={styles.item}>
                    <Image style={styles.image} source={require("../../assets/img/engine.png")} />
                    <Text>{params.engine}</Text>
                </View>

                <View style={styles.item}>
                    <Image style={styles.image} source={require("../../assets/img/trans.png")} />
                    <Text>{params.transmission}</Text>
                </View>

                <View style={styles.item}>
                    <Image style={styles.image} source={require("../../assets/img/piston.png")} />
                    <Text>{params.displacement}</Text>
                </View>


                <View style={styles.item}>
                    <Image style={styles.image} source={require("../../assets/img/axle.png")} />
                    <Text>{params.drive}</Text>
                </View>
                <View style={styles.item}>
                    <Image style={styles.image} source={require("../../assets/img/power-gears.png")} />
                    <Text>{params.power}</Text>
                </View>
                <View style={styles.item}>
                    <Image style={styles.image} source={require("../../assets/img/fuel.png")} />
                    <Text>{params.fuelType}</Text>
                </View>
            </View>

        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        marginStart: "4%",
        marginEnd: "4%"
    },
    columns: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start"
    },
    item: {
        width: "50%",
        flexDirection: "row",
        padding: 7
    },
    image: {
        width: 20,
        height: 20,
        marginStart: "2%",
        marginEnd: "2%"
    }
})

