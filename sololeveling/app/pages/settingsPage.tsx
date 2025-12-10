import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import Slider from '@react-native-community/slider';
import { defaultTextStyle, getAfacadFont } from "../utils/defaultTextStyle";
import { getBGMVolume, getSFXVolume, setBGMVolume, setSFXVolume, subscribe } from "../lib/soundSettingsStore";

export default function SettingsPage() {
  const [bgmVolume, setBgmVolumeState] = useState(getBGMVolume());
  const [sfxVolume, setSfxVolumeState] = useState(getSFXVolume());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setBgmVolumeState(getBGMVolume());
      setSfxVolumeState(getSFXVolume());
    });
    return unsubscribe;
  }, []);

  const handleBGMVolumeChange = async (value: number) => {
    setBgmVolumeState(value);
    // Update volume immediately (don't wait for async)
    setBGMVolume(value);
  };

  const handleSFXVolumeChange = async (value: number) => {
    setSfxVolumeState(value);
    // Update volume immediately (don't wait for async)
    setSFXVolume(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>SOUND</Text>
        <View style={styles.soundOptionContainer}>
          <Ionicons name="musical-notes-outline" size={24} color="#ffffff" style={{ marginLeft: '5%'}} />
          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Text style={[defaultTextStyle, { fontSize: 16, color: 'white', fontFamily: getAfacadFont('500'), flex: 1 }]}>Background Music</Text>
              <Text style={[defaultTextStyle, { fontSize: 14, color: 'white', fontFamily: getAfacadFont(), marginRight: 10 }]}>
                {Math.round(bgmVolume * 100)}%
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={bgmVolume}
              onValueChange={handleBGMVolumeChange}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#007AFF"
              step={0.05}
            />
          </View>
        </View>
        <View style={styles.soundOptionContainer}>
          <Ionicons name="volume-high-outline" size={24} color="#ffffff" style={{ marginLeft: '5%'}} />
          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Text style={[defaultTextStyle, { fontSize: 16, color: 'white', fontFamily: getAfacadFont('500'), flex: 1 }]}>Sound Effects</Text>
              <Text style={[defaultTextStyle, { fontSize: 14, color: 'white', fontFamily: getAfacadFont(), marginRight: 10 }]}>
                {Math.round(sfxVolume * 100)}%
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={sfxVolume}
              onValueChange={handleSFXVolumeChange}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#007AFF"
              step={0.05}
            />
          </View>
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>PERSONALIZATION</Text>
        <View style={styles.optionContainer}>
            <Ionicons name="earth-outline" size={30} color="#FFFFFF" style={{ marginLeft: '5%'}} />
            <Text style={[defaultTextStyle, { marginLeft: '5%', fontSize: 18, color: 'white', fontWeight: '500'}]}>Language</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ position: 'absolute', right: '5%'}} />
        </View>
        <View style={styles.optionContainer}>
            <Ionicons name="color-palette-outline" size={30} color="#FFFFFF" style={{ marginLeft: '5%'}} />
            <Text style={[defaultTextStyle, { marginLeft: '5%', fontSize: 18, color: 'white', fontWeight: '500'}]}>Theme</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ position: 'absolute', right: '5%'}} />
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>ABOUT THE APP</Text>
        <View style={styles.optionContainer}>
            <Ionicons name="heart-outline" size={30} color="#FFFFFF" style={{ marginLeft: '5%'}} />
            <Text style={[defaultTextStyle, { marginLeft: '5%', fontSize: 18, color: 'white', fontWeight: '500'}]}>Rate</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ position: 'absolute', right: '5%'}} />
        </View>
        <View style={styles.optionContainer}>
            <Ionicons name="share-outline" size={30} color="#FFFFFF" style={{ marginLeft: '5%'}} />
            <Text style={[defaultTextStyle, { marginLeft: '5%', fontSize: 18, color: 'white', fontWeight: '500'}]}>Share</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ position: 'absolute', right: '5%'}} />
        </View>
        <View style={styles.optionContainer}>
            <Ionicons name="mail-outline" size={30} color="#FFFFFF" style={{ marginLeft: '5%'}} />
            <Text style={[defaultTextStyle, { marginLeft: '5%', fontSize: 18, color: 'white', fontWeight: '500'}]}>Contact Us</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ position: 'absolute', right: '5%'}} />
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>MORE</Text>
        <View style={styles.optionContainer}>
            <Ionicons name="color-wand-outline" size={30} color="#FFFFFF" style={{ marginLeft: '5%'}} />
            <Text style={[defaultTextStyle, { marginLeft: '5%', fontSize: 18, color: 'white', fontWeight: '500'}]}>Coming Soon</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ position: 'absolute', right: '5%'}} />
        </View>
        <View style={styles.optionContainer}>
            <Ionicons name="help-circle-outline" size={30} color="#FFFFFF" style={{ marginLeft: '5%'}} />
            <Text style={[defaultTextStyle, { marginLeft: '5%', fontSize: 18, color: 'white', fontWeight: '500'}]}>Help</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ position: 'absolute', right: '5%'}} />
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitle}>ACCOUNT</Text>
        <Pressable style={styles.optionContainer} onPress={() => router.replace('/login' as any)}>
            <Ionicons name="log-out-outline" size={30} color="red" style={{ marginLeft: '5%'}} />
            <Text style={[defaultTextStyle, { marginLeft: '5%', fontSize: 18, color: 'red', fontWeight: '500'}]}>Log Out</Text>
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
    backgroundColor: "#363946",
    padding: 20,
  },
  subtitle: {
    ...defaultTextStyle,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: '5%',
    marginTop: '5%',
    marginLeft: '5%',
    fontWeight: "500",
  },
  categoryContainer: {
    width: '98%',
    backgroundColor: "#454851",
    height: 'auto',
    borderRadius: 16,
    borderColor: "#eee",
    borderWidth: 0,
    marginBottom: '5%',
  },
  optionContainer: {
    flexDirection: "row",  
    width: '100%',
    height: 50,
    alignItems: "center",
    marginBottom: '2%',
  },
  soundOptionContainer: {
    flexDirection: "row",
    width: '100%',
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: '5%',
    marginBottom: 8,
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 10,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
