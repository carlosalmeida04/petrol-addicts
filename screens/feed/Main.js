import React, { useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from "@ui-kitten/components"

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Perfil from './profile/Profile'
import Search from './Search'
import Posts from './posts/Posts'

import BottomTabBar from '../components/BottomTabBar'

const Tab = createBottomTabNavigator()

export default function Main({ navigation }) {

    useEffect(() => {
        navigation.addListener("beforeRemove", (e) => {
            e.preventDefault()
        })
    }, [])

    return (
        <Tab.Navigator
            backBehavior="order"
            screenOptions={{
                headerTitleAlign: "left",
            }}
            tabBar={props => <BottomTabBar {...props} />}
        >
            <Tab.Screen
                name='Posts'
                options={{
                    title: "Feed",
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: "2%" }} onPress={() => navigation.navigate("Create")}>
                            <Icon name="plus-circle-outline" fill="black" style={{ height: 25, width: 25 }} />
                        </TouchableOpacity>
                    )
                }}
                component={Posts}
            />
            <Tab.Screen
                name='Search'
                options={{ title: "Criar Publicação", headerShown: false }}
                component={Search}
            />
            <Tab.Screen
                name='Profile'
                options={{
                    title: "Perfil",
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: "2%" }} onPress={() => navigation.navigate("Settings")}>
                            <Icon name="settings-outline" fill="black" style={{ height: 25, width: 25 }} />
                        </TouchableOpacity>
                    )
                }}
                component={Perfil}
            />
        </Tab.Navigator >
    )
}


