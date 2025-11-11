import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import React, { use, useState } from "react";
import { Text, View, StyleSheet, Button, TextInput, Pressable, Switch, Alert } from "react-native";

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [eyeIconName, setEyeIconName] = useState<React.ComponentProps<typeof Ionicons>['name']>('eye-off'); // Initial icon: eye-off
    const [remember, setRemember] = useState(false);

    const username = useState("");
    const password = useState("");

    let usernameVerified = "useremail@gmail.com";
    let passwordVerified = "password123";

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
        setEyeIconName(prevName => (prevName === 'eye' ? 'eye-off' : 'eye'));
    };

    const verifyLogin = () => {
      const email = username[0].trim();
      const pass = password[0];

      if (!email) {
        Alert.alert("Missing email", "Please enter your email address.");
        return;
      }

      // basic email validation: must contain '@' and a common TLD
      const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|io|gov|mil|co|us|uk)$/i;
      if (!emailRegex.test(email)) {
        Alert.alert("Invalid email", "Please enter a valid email address (e.g. user@example.com).");
        return;
      }

      if (!pass) {
        Alert.alert("Missing password", "Please enter your password.");
        return;
      }

      if (email === usernameVerified && pass === passwordVerified) {
        router.push('/Tasks');
      } else {
        Alert.alert("Login failed", "Incorrect email or password.");
      }
    };

    return (
        <View style={styles.container}>

            <View style={{ flexDirection: 'row'}}>
                <Text style={styles.boldSubtitle}>Solo</Text>
                <Text style={styles.subtitle}>Leveling</Text>
            </View>
            <View style={{ height: '5%' }} />
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subTitleSmall}>Sign in to your account</Text>
            <View style={{ height: '8%' }} />
            <Text style={styles.description} >Email</Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor="#C7C7C7"
                style={{
                height: 50, backgroundColor: '#E9E9E9', width: '100%', paddingHorizontal: 10, borderRadius: 6, color: '#000'
                }}
                onChangeText={(text) => username[1](text)}
                value={username[0]}
            />
            <View style={{ height: '4%' }} />
            <Text style={styles.description} >Password</Text>
            <View style={{alignItems: 'flex-start', flexDirection: 'row',}}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#C7C7C7"
                    style={{
                    height: 50, backgroundColor: '#E9E9E9', width: '100%', paddingHorizontal: 10, borderRadius: 6, color: '#000'
                    }}
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => password[1](text)}
                    value={password[0]}
                />
                <Pressable onPress={togglePasswordVisibility} style={{ justifyContent: 'center', marginLeft: -35, alignSelf: 'center' }}>
                    <Ionicons name={eyeIconName} size={24} color="gray" />
                </Pressable>
            </View>
            <View style={{ height: '1%' }} />
            <View style={{ flexDirection: 'row'}}>
            </View>
            <Text style={styles.description} >Forgot your password?</Text>
            <View style={{ height: '12%' }} />
            <Pressable
                style={{ width: "100%" }}
                onPress={verifyLogin}
            >
                <Text style={{ fontSize: 18, textAlignVertical: 'center', textAlign: 'center', height: 50, backgroundColor: '#017AFF', borderRadius: 6, color: '#FFFFFF', fontWeight: '800' }}>
                    Login
                </Text>
            </Pressable>

            <View style={{ height: '2%' }} />

            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <Text style={styles.description}>Dont have an account? </Text>
                <Text style={styles.descriptionBold}>Sign up</Text>
            </View>

            <View style={{ height: '2%' }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%',}}>
                <View style={styles.horizontalLineLeft} />
                <Text style={{ marginHorizontal: 10, color: 'black', fontSize: 14 }}>OR</Text>
                <View style={styles.horizontalLineRight} />
            </View>

            <View style={{ height: '2%' }} />

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <View style={{borderRadius: 100, borderColor: '#C7C7C7', borderWidth: 2, height: 60, width: 60, justifyContent: 'center', alignItems: 'center',}}>
                    <Ionicons name="logo-apple" size={30} style={{ alignSelf: 'center'}} />
                </View>
                <View style={{ width: '10%',}} />
                <View style={{borderRadius: 100, borderColor: '#C7C7C7', borderWidth: 2, height: 60, width: 60, justifyContent: 'center', alignItems: 'center',}}>
                    <Ionicons name="logo-google" size={30} style={{ alignSelf: 'center'}} />
                </View>
            </View>
        </View>
    );

    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  subtitle: {
    fontSize: 20,
    color: "Black",
    marginBottom: 20,
    fontWeight: "300",
  },
  boldSubtitle: {
    fontSize: 20,
    color: "Black",
    marginBottom: 20,
    fontWeight: "800",
  },
  title: {
    fontSize: 35,
    color: "Black",
    marginBottom: 10,
    fontWeight: "800",
  },
  subTitleSmall: {
    fontSize: 18,
    color: "black",
  },
  description: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 6,
  },
  descriptionBold: {
    fontSize: 14,
    color: "#017AFF",
    textAlign: "center",
    fontWeight: "800",
  },
  horizontalLineLeft: {
    borderBottomColor: 'black', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    width: '45%', 
    left: 0,
  },
  horizontalLineRight: {
    borderBottomColor: 'black', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    width: '45%', 
    right: 0,
  },
});