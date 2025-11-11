import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, Button, ScrollView } from "react-native";
import LevelBar from "../components/levelBar";
import creatures from "../data/companions.json";
import { getEquippedCompanionId, subscribe } from "../lib/taskStore";

export default function MyCompanion() {
  const [attack, setAttack] = useState(0);
  const [defense, setDefense] = useState(0);
  const [health, setHealth] = useState(0);
  const [equippedId, setEquippedId] = useState<number | null>(getEquippedCompanionId());

  useEffect(() => {
    const unsub = subscribe(() => setEquippedId(getEquippedCompanionId()));
    return unsub;
  }, []);

  const companion = useMemo(() => {
    const id = equippedId ?? 1;
    return creatures.find((c) => c.id === id) ?? creatures[0];
  }, [equippedId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Character</Text>
      <LevelBar label="Health" level={100} maxLevel={100} color="#4CAF50" width={300} />
      <LevelBar label="Hunger" level={65} maxLevel={100} color="#FFA500" width={300} />

      <Image
        source={require("../companionImages/aron.png")}
        style={{ width: 200, height: 200, marginVertical: 16 }}
      />

      <Text style={styles.compName}>{companion.name}</Text>

      <View style={styles.statGroup}>
        <View style={styles.levelRow}>
          <LevelBar label="Attack Power" level={attack} maxLevel={10} color="#E53935" width={260} />
          <Button title="+" onPress={() => setAttack(Math.min(attack + 1, 10))} />
        </View>
        <View style={styles.levelRow}>
          <LevelBar label="Max HP" level={health} maxLevel={10} color="#2E7D32" width={260} />
          <Button title="+" onPress={() => setHealth(Math.min(health + 1, 10))} />
        </View>
        <View style={styles.levelRow}>
          <LevelBar label="Defense" level={defense} maxLevel={10} color="#1E88E5" width={260} />
          <Button title="+" onPress={() => setDefense(Math.min(defense + 1, 10))} />
        </View>
      </View>

      <View style={styles.feedButton}>
        <Text style={styles.feedText}>Feed (Cost 1 AP)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  compName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  statGroup: {
    width: "90%",
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    padding: 12,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  feedButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 20,
  },
  feedText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});


