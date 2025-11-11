import { Stack } from "expo-router";
import React from "react";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="pages/settingsPage" options={{ title: "Settings", headerTitleAlign: "center" }} />
    </Stack>
  );
}

export default StackLayout;