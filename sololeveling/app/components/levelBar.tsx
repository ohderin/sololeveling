import React, { useState } from "react";
import { View, Text, Button, StyleSheet, DimensionValue } from "react-native";

interface LevelBarProps {
    label?: string;
    level: number;
    maxLevel: number;
    color?: string;
    width?: number;
}

const LevelBar: React.FC<LevelBarProps> = ({
    label,
    level,
    maxLevel,
    color = "#4caf50",
    width = 200,
}) => {
  const barWidth: DimensionValue = `${(level / maxLevel) * 100}%`;

   return (
    <View style={styles.container}>
      <View style={[styles.barContainer, { width }]}>
        <View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.text}>
        {level}/{maxLevel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  levelContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  label: {
    fontSize: 18,
  },
  barContainer: {
    width: 200,
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
    marginRight: 10,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  text: {
    color: "black",
    marginTop: 5,
    fontSize: 12,
  },
});

export default LevelBar;
