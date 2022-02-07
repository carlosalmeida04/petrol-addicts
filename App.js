import React from 'react';
import StackProvider from './screens/StackProvider';
import { LogBox } from "react-native"
import { StatusBar } from 'expo-status-bar';

LogBox.ignoreAllLogs()

export default function App() {

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <StackProvider />
        </>

    )
}

