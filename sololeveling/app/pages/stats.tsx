import { Text, View, StyleSheet } from "react-native";

export default function Stats() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Your Progress</Text>
      <Text style={styles.description}>
        get xp and level up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  subtitle: {
    fontSize: 24,
    color: "#666666",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },
});
