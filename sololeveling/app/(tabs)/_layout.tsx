import { Tabs } from "expo-router"
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons"
import React from "react"

export default () => {
    return (
        <Tabs>
            <Tabs.Screen 
                name="Leaderboard"
                options={{
                    headerShown: false,
                    tabBarLabel: () => null, // hides the name
                    tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="trophy" size={size} color={color} />
                    ),
                }} 
            />

            <Tabs.Screen
                name="Battle"
                options={{
                    headerShown: false,
                    tabBarLabel: () => null, // hides the name
                    tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="fist-raised" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Tasks"
                options={{
                    headerShown: false,
                    tabBarLabel: () => null, // hides the name
                    tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="list" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Companions"
                options={{
                    headerShown: false,
                    tabBarLabel: () => null, // hides the name
                    tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="pets" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Account"
                options={{
                    headerShown: false,
                    tabBarLabel: () => null, // hides the name
                    tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}