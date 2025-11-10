import React from "react";
import { View, StyleSheet, Image, Text, ImageSourcePropType } from "react-native";
import { Jaro_400Regular } from "@expo-google-fonts/jaro";

interface BattleCharacterProps {
  imageSource: ImageSourcePropType;
  name: string;
  currentHealth: number;
  maxHealth: number;
  elementalIndicator?: string | ImageSourcePropType; // Can be text or image
  flipped?: boolean; // For reflecting over y-axis
  healthBarColor?: string;
  showHealthNumbers?: boolean; // Show health numbers (e.g., "100/100")
  elementalPosition?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  }; // Position for elemental indicator (overlaps image)
}

const BattleCharacter: React.FC<BattleCharacterProps> = ({
  imageSource,
  name,
  currentHealth,
  maxHealth,
  elementalIndicator,
  flipped = false,
  healthBarColor = "#FF0000",
  showHealthNumbers = false,
  elementalPosition = { top: 10, right: 10 }, // Default position
}) => {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.characterContent}>
        {/* Name */}
        <Text style={styles.name}>{name}</Text>
        
        {/* Health Bar */}
        <View style={styles.healthBarContainer}>
          <View style={styles.healthBarBackground}>
            <View
              style={[
                styles.healthBarFill,
                { width: `${healthPercentage}%`, backgroundColor: healthBarColor },
              ]}
            />
          </View>
          {showHealthNumbers && (
            <Text style={styles.healthText}>
              {currentHealth}/{maxHealth}
            </Text>
          )}
        </View>
        
        {/* Character Image Container - relative positioning for absolute child */}
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={[
              styles.characterImage,
              flipped && { transform: [{ scaleX: -1 }] },
            ]}
          />
          
          {/* Elemental Indicator - absolutely positioned to overlap image */}
          {elementalIndicator && (
            <View style={[
              styles.elementalContainer,
              {
                top: elementalPosition.top,
                right: elementalPosition.right,
                bottom: elementalPosition.bottom,
                left: elementalPosition.left,
              }
            ]}>
              {typeof elementalIndicator === "string" ? (
                <Text style={styles.elementalText}>{elementalIndicator}</Text>
              ) : (
                <Image source={elementalIndicator} style={styles.elementalImage} />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  characterContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  name: {
    fontSize: 20,
    fontFamily: "Jaro_400Regular",
    color: "#FFFFFF",
    marginBottom: 5,
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    fontWeight: "400",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
  },
  elementalContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10, // Ensure it appears on top of the image
  },
  elementalText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  elementalImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  characterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  healthBarContainer: {
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  healthBarBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#333333",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  healthBarFill: {
    height: "100%",
    backgroundColor: "#FF0000",
  },
  healthText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 3,
    fontFamily: "Jaro_400Regular",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontWeight: "400",
  },
});

export default BattleCharacter;

