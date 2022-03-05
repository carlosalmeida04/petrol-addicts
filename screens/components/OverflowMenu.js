import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Icon, Text, Divider, OverflowMenu, MenuItem } from '@ui-kitten/components'


export default function OverflowMenuButton() {

    const [visible, setVisible] = useState(false);
    const RenderButton = () => (
        <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name={"more-vertical-outline"} fill="black" style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
    )
    return (
        <View style={{ marginStart: "auto", justifyContent: "center", marginEnd: "1%" }} >
            <OverflowMenu
                style={styles.buttonContainer}
                anchor={RenderButton}
                visible={visible}
                placement={"bottom start"}
                onBackdropPress={() => setVisible(false)}>
                <MenuItem title='Editar' accessoryRight={<Icon name="edit-outline" fill="black" style={{ width: 20, height: 20 }} />} />
                <Divider />
                <MenuItem title='Apagar' accessoryRight={<Icon name="trash-outline" fill="black" style={{ width: 20, height: 20 }} />} />
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