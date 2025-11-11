import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Button, Image, Pressable } from "react-native";

export default function Account() {
  return (
    <View style={styles.container}>
      <View style={styles.bannerProfileContainer}>
        <Image
          source={require('../companionImages/banner1.jpg')}
          style={{ width: '100%', height: '80%' }}
        />
        <View style={styles.profilePicture}>
          <Image
            source={require('../companionImages/aron.png')}
            style={{ width: '70%', height: '70%', }}
          />
        </View>
      </View>
      <View style={{ height: '1%' }} />
      <Text style={styles.boldSubtitle}>Aron_is_the_best</Text>
      <Text style={styles.subtitle}>useremail@gmail.com</Text>
      <View style={{ height: '2%' }} />
      <View style={{ flexDirection: 'row', marginLeft: '5%'}}>
        <Pressable style={styles.editProfileButton}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Edit Profile</Text>
        </Pressable>
        <View style={{ width: '3%' }} />
        <Pressable style={styles.settingsButton} onPress={() => router.push('/pages/settingsPage')}>
          <Text style={{ color: '#7c7c7cff', textAlign: 'center', fontSize: 16, fontWeight: '500' }}>
            Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  bannerProfileContainer: {
    width: '100%',
    height: '30%',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 400,
    backgroundColor: "#017AFF",
    borderWidth: 6,
    borderColor: "#F5F5F5",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: '0%',
    left: '5%',
  },
  boldSubtitle: {
    fontSize: 30,
    color: "Black",
    marginLeft: '5%',
    marginBottom: 5,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginLeft: '5%',
  },
  editProfileButton: {
    width: 120,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#017AFF",
    alignContent: "center",
    justifyContent: "center",
  },
  settingsButton: {
    width: 120,
    height: 40,
    borderRadius: 6,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#7c7c7cff",
    alignContent: "center",
    justifyContent: "center",
  }
});
