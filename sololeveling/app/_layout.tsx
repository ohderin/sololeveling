import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Afacad_400Regular, Afacad_500Medium, Afacad_600SemiBold, Afacad_700Bold } from "@expo-google-fonts/afacad";
import { Jaro_400Regular } from "@expo-google-fonts/jaro";
import { Text, TextProps, StyleSheet } from "react-native";
import BackgroundMusic from "./components/BackgroundMusic";

// Global text component with default font
export const DefaultText = (props: TextProps) => {
  return <Text {...props} style={[styles.defaultText, props.style]} />;
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "Afacad_400Regular",
  },
});

const StackLayout = () => {
  const [fontsLoaded] = useFonts({
    Afacad_400Regular,
    Afacad_500Medium,
    Afacad_600SemiBold,
    Afacad_700Bold,
    Jaro_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <BackgroundMusic />
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="pages/settingsPage" options={{ title: "Settings", headerTitleAlign: "center" }} />
        <Stack.Screen 
          name="pages/createTask" 
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="pages/myCompanion"
          options={{
            headerShown: false,
            presentation: 'modal'
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

export default StackLayout;