import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { StatusBar } from 'expo-status-bar'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Landing from './login/Landing'
import Main from './feed/Main'
import Settings from './feed/profile/Settings'
import Car from './feed/Car'
import PerfilPublico from './feed/profile/PublicProfile'
import Post from './feed/posts/Post'
import Comments from './feed/Comments'
import Register from './login/Register'
import Login from './login/Login'
import Header from "./components/Header"
import Create from './feed/posts/create/Create'
import Overview from './feed/posts/create/pages/Overview'
import CarInfo from './feed/posts/create/pages/CarInfo'
import Change from './feed/profile/Change'

const Stack = createNativeStackNavigator()

export default function StackProvider() {
    let routeName
    const [userState, setUserState] = useState("")


    async function importAll() {
        try {
            const keys = await AsyncStorage.getAllKeys()
            const result = await AsyncStorage.multiGet(keys)
            return console.log(result)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        //importAll()
        AsyncStorage
            .getItem("isLoggedIn")
            .then((value) => {
                if (value === null) {
                    AsyncStorage.setItem("isLoggedIn", "0")
                        .then(() => setUserState("0"))
                } if (value === "0") {
                    setUserState("0")
                } else if (value === "1") {
                    setUserState("1")
                }
            })
    }, [userState])

    if (userState === "") {
        return null
    }
    else if (userState === "1") {
        routeName = "Main"
    }
    else if (userState === "0") {
        routeName = "Landing"
    }

    return (
        <NavigationContainer>
            <StatusBar style='auto' />
            <Stack.Navigator initialRouteName={routeName} >
                <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={Main} options={{ headerShown: false, gestureEnabled: false }} />
                <Stack.Screen name="Settings" component={Settings}
                    options={{
                        header: () => (
                            <Header title="Definições" subtitle="" />
                        )
                    }} />
                <Stack.Screen name="Car" component={Car}
                    options={({ route }) => ({
                        header: () => (
                            <Header title="Carro" subtitle={route.params.title} />
                        )
                    })} />
                <Stack.Screen name="PublicProfile" component={PerfilPublico}
                    options={({ route }) => ({
                        header: () => (
                            <Header subtitle={route.params.title} title="Perfil" />
                        )
                    })} />
                <Stack.Screen name='Comments' component={Comments}
                    options={{
                        header: () => (
                            <Header title="Comentários" />
                        )
                    }} />
                <Stack.Screen name='Post' component={Post}
                    options={{
                        header: () => (
                            <Header title="Publicação" />
                        )
                    }} />
                <Stack.Screen name='Change' component={Change}
                    options={({ route }) => ({ header: () => <Header title={route.params.title} /> })} />
                <Stack.Group>
                    <Stack.Screen name='Create' component={Create} options={{ headerShown: false }} />
                    <Stack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
                    <Stack.Screen name="CarInfo" component={CarInfo} options={{ headerShown: false }} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

