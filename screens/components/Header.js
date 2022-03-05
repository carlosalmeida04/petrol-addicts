import React from 'react'
import { Icon, TopNavigation, Layout, TopNavigationAction } from '@ui-kitten/components'
import {  SafeAreaView, StatusBar } from "react-native"

import { useNavigation } from "@react-navigation/native"

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
)

export default function Header({ title, subtitle }) {

    const navigation = useNavigation()

    const renderBackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    )

    return (

        <Layout level='1' style={{ marginTop: StatusBar.currentHeight }}>
            <SafeAreaView >
                <TopNavigation
                    alignment='center'
                    title={title}
                    subtitle={subtitle}
                    accessoryLeft={renderBackAction}
                />
            </SafeAreaView>

        </Layout>

    )
}