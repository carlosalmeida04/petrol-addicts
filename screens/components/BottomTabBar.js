import React from "react"
import { SafeAreaView } from "react-native";
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';

export default function BottomTabBar({ navigation, state }) {


    return (
        <SafeAreaView style={{ backgroundColor: "#fff" }}>
            <BottomNavigation
                selectedIndex={state.index}
                onSelect={index => navigation.navigate(state.routeNames[index])}
            >
                <BottomNavigationTab icon={<Icon name={"home-outline"} />} />
                {/* <BottomNavigationTab icon={<Icon name={"plus-square-outline"} />} /> */}
                <BottomNavigationTab icon={<Icon name={"person-outline"} />} />

            </BottomNavigation>
        </SafeAreaView>
    )
}

