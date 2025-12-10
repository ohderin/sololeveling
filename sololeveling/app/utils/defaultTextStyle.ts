import { TextStyle, StyleSheet } from "react-native";

// Helper function to get the correct font family based on fontWeight
// Note: Font names must match exactly what's registered in useFonts
export const getAfacadFont = (fontWeight?: TextStyle['fontWeight']): string => {
  // Convert fontWeight to string if it's a number
  const weight = typeof fontWeight === 'number' ? fontWeight.toString() : fontWeight;
  
  // Map fontWeight to the correct Afacad font variant
  // These names must match the keys used in useFonts hook
  if (weight === '700' || weight === 'bold' || weight === '800' || weight === '900') {
    return "Afacad_700Bold";
  } else if (weight === '600' || weight === 'semibold') {
    return "Afacad_600SemiBold";
  } else if (weight === '500' || weight === 'medium') {
    return "Afacad_500Medium";
  }
  // Default to regular weight
  return "Afacad_400Regular";
};

// Default text style with Afacad font
export const defaultTextStyle: TextStyle = {
  fontFamily: "Afacad_400Regular",
};

// Helper to create a text style with the correct Afacad font variant
export const createTextStyle = (style: TextStyle): TextStyle => {
  const fontFamily = getAfacadFont(style.fontWeight);
  return {
    ...style,
    fontFamily,
  };
};

