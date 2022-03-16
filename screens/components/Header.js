import React from 'react'
import { Icon, TopNavigation, Layout, TopNavigationAction, Text } from '@ui-kitten/components'
import { SafeAreaView, StatusBar, TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
)

export default function Header({ title, subtitle, buttonOnPress, buttonText }) {

    const navigation = useNavigation()

    const renderBackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    )
    const buttonRight = () => (
        <TouchableOpacity onPress={buttonOnPress}>
            <Text style={{ fontWeight: "bold", color: "#3366FF" }} category="p2">{buttonText}</Text>
        </TouchableOpacity>
    )

    return (
        <Layout level='1' style={{ marginTop: StatusBar.currentHeight }}>
            <SafeAreaView >
                <TopNavigation
                    alignment='center'
                    title={title}
                    subtitle={subtitle}
                    accessoryLeft={renderBackAction}
                    accessoryRight={title === "Criar publicação" || "Informações do carro" || "Resumo" ? buttonRight : <></>}
                />
            </SafeAreaView>
        </Layout>
    )
}