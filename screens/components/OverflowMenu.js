import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Icon, Divider, OverflowMenu, MenuItem } from '@ui-kitten/components'

import { deletePost } from './Reducers'
import { useNavigation } from '@react-navigation/native'


export default function OverflowMenuButton({ postId, fileName, fromProfile }) {

    const [visible, setVisible] = useState(false)
    const navigation = useNavigation()
    const RenderButton = () => (
        <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name={"more-vertical-outline"} fill="black" style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
    )

    const handeDeletePost = () => {
        Alert.alert("Aviso", "Tens a certeza que queres apagar esta publicação?",
            [
                {
                    text: "Sim",
                    onPress: async () => {
                        await deletePost(postId, fileName)
                        fromProfile ? navigation.goBack() : false
                    }
                },
                {
                    text: "Cancelar",
                    style: "cancel"
                },
            ], {
            cancelable: false
        })
    }


    return (
        <View style={{ marginStart: "auto", justifyContent: "center", marginEnd: "1%" }} >
            <OverflowMenu
                style={styles.buttonContainer}
                anchor={RenderButton}
                visible={visible}
                placement={"bottom start"}
                onBackdropPress={() => setVisible(false)}>
                <MenuItem title='Apagar' onPress={handeDeletePost} accessoryRight={<Icon name="trash-outline" fill="black" style={{ width: 20, height: 20 }} />} />
            </OverflowMenu>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: "auto",
        marginEnd: "2%"
    },
})