import React from 'react';
import StackProvider from './screens/StackProvider';
import { LogBox } from "react-native"
import { StatusBar } from 'expo-status-bar';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


LogBox.ignoreAllLogs()

export default function App() {

    return (
        <>
            <StatusBar style='auto' />
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <StackProvider />
            </ApplicationProvider>
        </>
    )
}

