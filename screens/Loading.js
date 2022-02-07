import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function Loading() {
    return (
        <View style={{ backgroundColor: "#ffffff", height: "100%", marginTop: "70%" }}>
            <ActivityIndicator size="small" color="#F5A962" />
        </View>
    )
}





