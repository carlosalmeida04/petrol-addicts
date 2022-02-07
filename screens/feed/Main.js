import React from 'react'
import { TouchableOpacity, SafeAreaView, Text } from 'react-native'
import Ionicons from "@expo/vector-icons/Ionicons"

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Perfil from './Profile'
import Create from './Create'
import Posts from './Posts'


const Tab = createBottomTabNavigator()

export default function Main({ navigation }) {

    return (
        <Tab.Navigator
            backBehavior="order"
            screenOptions={({ route }) => ({
                headerTitleAlign: "left",
                tabBarLabel: () => { return null },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Posts') {
                        size = 28
                        iconName = focused ? 'car-sport' : 'car-sport-outline'
                    } else if (route.name === 'Create Post') {

                        size = 40
                        iconName = focused ? 'add-outline' : 'add-outline'
                    } else if (route.name === 'Profile') {
                        size = 27
                        iconName = focused ? 'person' : 'person-outline'
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarStyle: {
                    backgroundColor: "#fff"
                },
                tabBarActiveTintColor: '#F5A962',
                tabBarInactiveTintColor: 'black',
            })}
        >
            <Tab.Screen name='Posts'
                options={{
                    title: "Feed",
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: "5%" }}>
                            <Ionicons name="md-search-outline" size={25} />
                        </TouchableOpacity>
                    )
                }}
                component={Posts}
            />
            <Tab.Screen name='Create Post'
                options={{
                    title: "Criar Publicação",
                    headerShown: false
                }}
                component={Create}
            />
            <Tab.Screen name='Profile'
                options={{
                    title: "Perfil",
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: "2%" }} onPress={() => navigation.navigate("Settings")}>
                            <Ionicons name="settings-outline" size={25} />
                        </TouchableOpacity>
                    )
                }}
                component={Perfil}
            />
        </Tab.Navigator >
    )
}


