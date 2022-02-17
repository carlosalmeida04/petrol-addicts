import React from 'react'
import { View } from 'react-native'
import { Spinner } from '@ui-kitten/components'

export default function Loading() {
    return (
        <View style={{ backgroundColor: "#ffffff", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Spinner status={"success"} size={"large"} />
        </View>
    )
}





