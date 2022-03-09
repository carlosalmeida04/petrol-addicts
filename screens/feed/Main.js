import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from "@ui-kitten/components"

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Perfil from './profile/Profile'
import Create from './posts/Create'
import Posts from './posts/Posts'

import BottomTabBar from '../components/BottomTabBar'

const Tab = createBottomTabNavigator()

export default function Main({ navigation }) {

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
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity style={{ marginRight: "2%" }}>
                                <Icon name="search-outline" fill="black" style={{ height: 25, width: 25 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginRight: "2%" }} onPress={() => navigation.navigate("Create")}>
                                <Icon name="plus-circle-outline" fill="black" style={{ height: 25, width: 25 }} />
                            </TouchableOpacity>
                        </View>
                    )
                }}
                component={Posts}
            />
            {/* <Tab.Screen
                name='Create Post'
                options={{ title: "Criar Publicação", headerShown: false }}
                component={Create}
            /> */}
            <Tab.Screen
                name='Profile'
                options={{
                    title: "Perfil",
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: "2%" }} onPress={() => navigation.navigate("Settings")}>
                            <Icon name="settings-2-outline" fill="black" style={{ height: 30, width: 30 }} />
                        </TouchableOpacity>
                    )
                }}
                component={Perfil}
            />
        </Tab.Navigator >
    )
}


