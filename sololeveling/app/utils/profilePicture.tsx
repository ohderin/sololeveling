import React from 'react';
import { Image, ImageStyle, View, StyleSheet } from 'react-native';

// Available companion images
const companionImages = [
  'aron.png',
  'Flitterfinch.png',
  'Slumberpaw.png',
  'Tickhare.png',
  'Wearywise.png',
];

// Color tints to apply
const colorTints = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B739', // Orange
  '#52BE80', // Green
  '#EC7063', // Coral
  '#5DADE2', // Light Blue
  '#F1948A', // Pink
  '#82E0AA', // Light Green
  '#F4D03F', // Gold
];

// Helper function to generate a consistent hash from a string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Get profile picture data for a user (deterministic based on name)
export function getProfilePictureData(name: string): {
  image: string;
  color: string;
  isDefault: boolean;
} {
  const hash = hashString(name);
  
  // 10% chance of using default profile
  const useDefault = hash % 10 === 0;
  
  if (useDefault) {
    return {
      image: 'default_profile.png',
      color: '#CCCCCC',
      isDefault: true,
    };
  }
  
  // Select companion image based on hash
  const imageIndex = hash % companionImages.length;
  const selectedImage = companionImages[imageIndex];
  
  // Select color based on hash (different from image selection)
  const colorIndex = (hash * 7) % colorTints.length; // Multiply by prime for different distribution
  const selectedColor = colorTints[colorIndex];
  
  return {
    image: selectedImage,
    color: selectedColor,
    isDefault: false,
  };
}

// Get the require source for an image
export function getImageSource(imageName: string) {
  switch (imageName) {
    case 'aron.png':
      return require('../companionImages/aron.png');
    case 'Flitterfinch.png':
      return require('../companionImages/Flitterfinch.png');
    case 'Slumberpaw.png':
      return require('../companionImages/Slumberpaw.png');
    case 'Tickhare.png':
      return require('../companionImages/Tickhare.png');
    case 'Wearywise.png':
      return require('../companionImages/Wearywise.png');
    case 'default_profile.png':
      return require('../placeholderImages/default_profile.png');
    default:
      return require('../placeholderImages/default_profile.png');
  }
}

// Component to render a profile picture with color tint
interface ProfilePictureProps {
  name: string;
  style?: ImageStyle;
  size?: number;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ name, style, size = 40 }) => {
  const { image, color, isDefault } = getProfilePictureData(name);
  const imageSource = getImageSource(image);
  
  if (isDefault) {
    return (
      <Image 
        source={imageSource} 
        style={[style, { width: size, height: size, borderRadius: size / 2 }]} 
      />
    );
  }
  
  // Apply color tint using a View overlay
  return (
    <View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
        }
      ]}
    >
      <Image 
        source={imageSource} 
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} 
      />
      <View 
        style={[
          styles.tintOverlay, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: 0.25, // Subtle tint effect
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  tintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

