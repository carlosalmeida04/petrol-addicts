import React from 'react'
import { Icon, TopNavigation, Layout, TopNavigationAction, Text } from '@ui-kitten/components'
import { SafeAreaView, StatusBar, TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
)

export default function Header({ title, subtitle }) {

    const navigation = useNavigation()

    const renderBackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    )
    const uploadImage = () => (
        <TouchableOpacity>
            <Text style={{ fontWeight: "bold", color: "#3366FF" }} category="p2">Publicar</Text>
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
                    accessoryRight={title === "Criar publicação" ? uploadImage : false}
                />
            </SafeAreaView>
        </Layout>

    )
}