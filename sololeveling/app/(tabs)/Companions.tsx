import React, { useState } from "react";
import { Text, View, StyleSheet, Image, Button } from "react-native";
import creatures from "../data/companions.json";
import LevelBar from "../components/levelBar";
  
export default function Companions() {

  const [attack, setAttack] = useState(0);
  const [defense, setDefense] = useState(0);
  const [speed, setSpeed] = useState(0);

  return (
    <View style={styles.container}>
      <Text>Companion Name: {creatures[0].name}</Text>
      <Image source={require(`../companionImages/aron.png`)} style={{ width: 100, height: 100 }} />
      <View style={styles.levelContainer}>
        <LevelBar label="Attack" level={attack} maxLevel={10} color="#FF0000" />
        <Button title="  +  " onPress={() => setAttack(Math.min(attack + 1, 10))} />
      </View>
      <View style={styles.levelContainer}>
        <LevelBar label="Defense" level={defense} maxLevel={10} color="#0000FF" />
        <Button title="  +  " onPress={() => setDefense(Math.min(defense + 1, 10))} />
      </View>
      <View style={styles.levelContainer}>
        <LevelBar label="Health" level={speed} maxLevel={10} color="#00FF11" />
        <Button title="  +  " onPress={() => setSpeed(Math.min(speed + 1, 10))} />
      </View>
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
  levelContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },
  barBackground: {
    height: 20,
    width: '100%',
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});
