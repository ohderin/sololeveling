import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import React from "react"

export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="Tasks"
            options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="list" size={size} color={color} />
                ),
            }} />

            <Tabs.Screen name="Companions" options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="skull" size={size} color={color} />
                ),
            }} />

            <Tabs.Screen name="Account" options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color} />
                ),
            }} />
        </Tabs>
    )
}