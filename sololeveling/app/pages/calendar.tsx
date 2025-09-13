import React = require("react");
import { Text, View, StyleSheet } from "react-native";

export default function Calendar() {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Weekly calendar displaying tasks and goals
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
  description: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },
});
