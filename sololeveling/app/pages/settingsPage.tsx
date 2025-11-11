import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function SettingsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>PERSONALIZATION</Text>
        <View style={styles.optionContainer}>
            <Ionicons name="earth-outline" size={30} color="#666666" style={{ marginLeft: '5%'}} />
            <Text style={{ marginLeft: '5%', fontSize: 18, color: 'black', fontWeight: '500'}}>Language</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" style={{ position: 'absolute', right: '5%'}} />
        </View>
        <View style={styles.optionContainer}>
            <Ionicons name="color-palette-outline" size={30} color="#666666" style={{ marginLeft: '5%'}} />
            <Text style={{ marginLeft: '5%', fontSize: 18, color: 'black', fontWeight: '500'}}>Theme</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" style={{ position: 'absolute', right: '5%'}} />
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>ABOUT THE APP</Text>
        <View style={styles.optionContainer}>
            <Ionicons name="heart-outline" size={30} color="#666666" style={{ marginLeft: '5%'}} />
            <Text style={{ marginLeft: '5%', fontSize: 18, color: 'black', fontWeight: '500'}}>Rate</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" style={{ position: 'absolute', right: '5%'}} />
        </View>
        <View style={styles.optionContainer}>
            <Ionicons name="share-outline" size={30} color="#666666" style={{ marginLeft: '5%'}} />
            <Text style={{ marginLeft: '5%', fontSize: 18, color: 'black', fontWeight: '500'}}>Share</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" style={{ position: 'absolute', right: '5%'}} />
        </View>
        <View style={styles.optionContainer}>
            <Ionicons name="mail-outline" size={30} color="#666666" style={{ marginLeft: '5%'}} />
            <Text style={{ marginLeft: '5%', fontSize: 18, color: 'black', fontWeight: '500'}}>Contact Us</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" style={{ position: 'absolute', right: '5%'}} />
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>MORE</Text>
        <View style={styles.optionContainer}>
            <Ionicons name="color-wand-outline" size={30} color="#666666" style={{ marginLeft: '5%'}} />
            <Text style={{ marginLeft: '5%', fontSize: 18, color: 'black', fontWeight: '500'}}>Coming Soon</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" style={{ position: 'absolute', right: '5%'}} />
        </View>
        <View style={styles.optionContainer}>
            <Ionicons name="help-circle-outline" size={30} color="#666666" style={{ marginLeft: '5%'}} />
            <Text style={{ marginLeft: '5%', fontSize: 18, color: 'black', fontWeight: '500'}}>Help</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" style={{ position: 'absolute', right: '5%'}} />
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>ACCOUNT</Text>
        <Pressable style={styles.optionContainer} onPress={() => router.replace('/login')}>
            <Ionicons name="log-out-outline" size={30} color="red" style={{ marginLeft: '5%'}} />
            <Text style={{ marginLeft: '5%', fontSize: 18, color: 'red', fontWeight: '500'}}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: '5%',
    marginTop: '5%',
    marginLeft: '5%',
    fontWeight: "500",
  },
  categoryContainer: {
    width: '98%',
    backgroundColor: "white",
    height: 'auto',
    borderRadius: 16,
    borderColor: "#eee",
    borderWidth: 1,
    marginBottom: '5%',
  },
  optionContainer: {
    flexDirection: "row",  
    width: '100%',
    height: 50,
    alignItems: "center",
    marginBottom: '2%',
  },
});
