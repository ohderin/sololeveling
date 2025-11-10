import React, { useRef, useState } from "react";
import { View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Image, Animated } from "react-native";
import { useFonts, Jaro_400Regular } from "@expo-google-fonts/jaro";
import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import BattleCharacter from "../components/BattleCharacter";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Battle() {
  const [fontsLoaded] = useFonts({
    Jaro_400Regular,
  });
  const soundRef = useRef<Audio.Sound | null>(null);
  const hitSoundRef = useRef<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const targetVolume = 0.05; // Target volume when unmuted
  const tickharePosition = useRef(new Animated.Value(0)).current; // Animation value for Tickhare position

  // Fade in audio
  const fadeIn = async (sound: Audio.Sound, duration: number = 1000) => {
    const steps = 20;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      const volume = (i / steps) * targetVolume;
      await sound.setVolumeAsync(volume);
    }
  };

  // Play hit sound effect
  const playHitSound = async () => {
    try {
      if (!hitSoundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          require("../barena_assets/hit.mp3"),
          { volume: 0.1 }
        );
        hitSoundRef.current = sound;
      }
      
      // Reset and play the sound
      await hitSoundRef.current.replayAsync();
    } catch (error) {
      console.error("Error playing hit sound:", error);
    }
  };

  // Animate Tickhare attack (move right and back)
  const animateTickhareAttack = () => {
    // Reset position
    tickharePosition.setValue(0);
    
    // Animate forward (to the right)
    Animated.sequence([
      Animated.timing(tickharePosition, {
        toValue: screenWidth * 0.15, // Move right
        duration: 200,
        useNativeDriver: true,
      }),
      // Animate back (return to original position)
      Animated.timing(tickharePosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle button press - play sound and animate
  const handleButtonPress = (action: string) => {
    console.log(`${action} selected`);
    playHitSound();
    animateTickhareAttack();
  };

  // Toggle volume on/off
  const toggleVolume = async () => {
    if (!soundRef.current) return;
    
    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;

      if (isMuted) {
        // Unmute - fade in to target volume
        await soundRef.current.setVolumeAsync(0);
        const steps = 20;
        const duration = 500; // Quick fade in
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
          await new Promise(resolve => setTimeout(resolve, stepDuration));
          const volume = (i / steps) * targetVolume;
          await soundRef.current.setVolumeAsync(volume);
        }
        setIsMuted(false);
      } else {
        // Mute - fade out to 0
        const currentVolume = status.volume || targetVolume;
        const steps = 20;
        const duration = 500; // Quick fade out
        const stepDuration = duration / steps;
        
        for (let i = steps; i >= 0; i--) {
          await new Promise(resolve => setTimeout(resolve, stepDuration));
          const volume = (i / steps) * currentVolume;
          await soundRef.current.setVolumeAsync(volume);
        }
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Error toggling volume:", error);
    }
  };

  // Fade out audio
  const fadeOut = async (sound: Audio.Sound, duration: number = 1000) => {
    const currentStatus = await sound.getStatusAsync();
    if (!currentStatus.isLoaded) return;
    
    const currentVolume = currentStatus.volume || 0.25;
    const steps = 20;
    const stepDuration = duration / steps;
    
    for (let i = steps; i >= 0; i--) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      const volume = (i / steps) * currentVolume;
      await sound.setVolumeAsync(volume);
    }
    await sound.stopAsync();
  };

  // Load and play audio when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const loadAndPlayAudio = async () => {
        try {
          // Set audio mode
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
          });

          // Load the sound
          const { sound } = await Audio.Sound.createAsync(
            require("../barena_assets/Elona OST - Battle 2.mp3"),
            { shouldPlay: true, isLooping: true, volume: 0 }
          );

          if (isMounted) {
            soundRef.current = sound;
            // Start fade in
            fadeIn(sound);
          }
        } catch (error) {
          console.error("Error loading audio:", error);
        }
      };

      loadAndPlayAudio();

      // Cleanup function - fade out when leaving
      return () => {
        isMounted = false;
        if (soundRef.current) {
          fadeOut(soundRef.current).then(() => {
            soundRef.current?.unloadAsync();
            soundRef.current = null;
          });
        }
        if (hitSoundRef.current) {
          hitSoundRef.current.unloadAsync();
          hitSoundRef.current = null;
        }
      };
    }, [])
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground 
      source={require("../barena_assets/b_arena_background.png")} 
      style={styles.container}
      resizeMode="contain"
      imageStyle={styles.backgroundImageStyle}
    >
      {/* Volume Toggle Button - Top Left */}
      <TouchableOpacity 
        style={styles.volumeButton}
        onPress={toggleVolume}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isMuted ? "volume-mute" : "volume-high"} 
          size={28} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>

      {/* Tickhare - Player's creature (reflected over y-axis, flipped horizontally) */}
      <Animated.View 
        style={[
          styles.tickhareContainer,
          {
            transform: [{ translateX: tickharePosition }],
          },
        ]}
      >
        <BattleCharacter
          imageSource={require("../companionImages/Tickhare.png")}
          name="Tickhare"
          currentHealth={100}
          maxHealth={100}
          elementalIndicator={require("../barena_assets/Power.png")}
          flipped={true}
          healthBarColor="#00FF00"
          showHealthNumbers={true}
          elementalPosition={{ top: 10, right: 10 }} // CHANGE POSITION HERE - overlaps image
        />
      </Animated.View>
      
      {/* Wearywise - Enemy (not reflected, normal) */}
      <View style={styles.wearywiseContainer}>
        <BattleCharacter
          imageSource={require("../companionImages/Wearywise.png")}
          name="Wearywise"
          currentHealth={100}
          maxHealth={100}
          elementalIndicator={require("../barena_assets/Elemental.png")}
          flipped={false}
          healthBarColor="#00FF00"
          showHealthNumbers={false}
          elementalPosition={{ top: 10, right: 10 }} // CHANGE POSITION HERE - overlaps image
        />
      </View>

      {/* Rock Paper Scissors Buttons - Bottom of screen */}
      <View style={styles.rpsButtonContainer}>
        {/* Red Button (Left) */}
        <TouchableOpacity 
          style={[styles.rpsButton, styles.rpsButtonLower, styles.rpsButtonRedBorder]}
          onPress={() => handleButtonPress("Rock")}
          activeOpacity={0.7}
        >
          <Svg width={70} height={70} style={styles.rpsButtonSvg}>
            <Defs>
              <RadialGradient id="redGradient" cx="47%" cy="47%" r="43%">
                <Stop offset="0%" stopColor="#FF6666" stopOpacity="1" />
                <Stop offset="50%" stopColor="#FF0000" stopOpacity="1" />
                <Stop offset="100%" stopColor="#660000" stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Circle cx="35" cy="35" r="38" fill="url(#redGradient)" />
          </Svg>
        </TouchableOpacity>
        
        {/* Blue Button (Middle) - Highest */}
        <TouchableOpacity 
          style={[styles.rpsButton, styles.rpsButtonHigher, styles.rpsButtonBlueBorder]}
          onPress={() => handleButtonPress("Paper")}
          activeOpacity={0.7}
        >
          <Svg width={70} height={70} style={styles.rpsButtonSvg}>
            <Defs>
              <RadialGradient id="blueGradient" cx="47%" cy="47%" r="43%">
                <Stop offset="0%" stopColor="#6666FF" stopOpacity="1" />
                <Stop offset="50%" stopColor="#0000FF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#000066" stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Circle cx="35" cy="35" r="38" fill="url(#blueGradient)" />
          </Svg>
        </TouchableOpacity>
        
        {/* Green Button (Right) */}
        <TouchableOpacity 
          style={[styles.rpsButton, styles.rpsButtonLower, styles.rpsButtonGreenBorder]}
          onPress={() => handleButtonPress("Scissors")}
          activeOpacity={0.7}
        >
          <Svg width={70} height={70} style={styles.rpsButtonSvg}>
            <Defs>
              <RadialGradient id="greenGradient" cx="47%" cy="47%" r="43%">
                <Stop offset="0%" stopColor="#66FF66" stopOpacity="1" />
                <Stop offset="50%" stopColor="#00FF00" stopOpacity="1" />
                <Stop offset="100%" stopColor="#006600" stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Circle cx="35" cy="35" r="38" fill="url(#greenGradient)" />
          </Svg>
          <View style={styles.rpsButtonImageContainer}>
            <Image 
              source={require("../barena_assets/Scissors.png")}
              style={styles.rpsButtonImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Fallback color for empty space
  },
  backgroundImageStyle: {
    width: "100%",
    height: "100%",
  },
  volumeButton: {
    position: "absolute",
    top: 35,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  tickhareContainer: {
    position: "absolute",
    width: screenWidth * 0.6, // 30% of screen width - CHANGE SIZE HERE
    left: screenWidth * 0.01, // 10% from left - CHANGE POSITION HERE
    top: screenHeight * 0.34, // 30% from top - CHANGE POSITION HERE
  },
  wearywiseContainer: {
    position: "absolute",
    width: screenWidth * 0.4, // 30% of screen width - CHANGE SIZE HERE
    right: screenWidth * 0.15, // 10% from right - CHANGE POSITION HERE
    top: screenHeight * 0.12, // 30% from top - CHANGE POSITION HERE
  },
  rpsButtonContainer: {
    position: "absolute",
    bottom: 80, // Above navbar (adjust based on navbar height)
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 2000, // Higher than creatures
    paddingHorizontal: 20,
  },
  rpsButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginHorizontal: 15,
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Android shadow
    overflow: "hidden", // Important for gradient to respect border radius
    position: "relative",
  },
  rpsButtonRedBorder: {
    borderColor: "#AA0000", // Dark red border
  },
  rpsButtonBlueBorder: {
    borderColor: "#0000AA", // Dark blue border
  },
  rpsButtonGreenBorder: {
    borderColor: "#00AA00", // Dark green border
  },
  rpsButtonSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  rpsButtonHigher: {
    bottom: 0, // Middle button at base level
  },
  rpsButtonLower: {
    bottom: -20, // Red and green buttons 20px lower
  },
  rpsButtonImageContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  rpsButtonImage: {
    width: "80%",
    height: "80%",
  },
});
