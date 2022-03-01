import React from 'react'
import { Icon, TopNavigation, Layout, TopNavigationAction } from '@ui-kitten/components'
import { Platform, SafeAreaView } from "react-native"


import { useNavigation } from "@react-navigation/native"
import { SafeAreaProvider } from 'react-native-safe-area-context'

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
)
export default function Header({ title, subtitle }) {

    const navigation = useNavigation()
    let marginTop
    if (Platform.OS !== "ios")
        marginTop = 10

    const renderBackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    )

    return (

        <Layout level='1' style={{ marginTop: `${marginTop}%` }}>
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