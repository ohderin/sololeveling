import React, { useEffect, useMemo, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import creatures from "../data/companions.json";
import { getEquippedCompanionId, setEquippedCompanionId, subscribe } from "../lib/taskStore";

export default function Companions() {
  const [equippedId, setEquippedIdState] = useState<number | null>(getEquippedCompanionId());

  useEffect(() => {
    const unsub = subscribe(() => setEquippedIdState(getEquippedCompanionId()));
    return unsub;
  }, []);

  const equipped = useMemo(() => {
    const id = equippedId ?? 1;
    return creatures.find((c) => c.id === id) ?? creatures[0];
  }, [equippedId]);

  const handleEquip = (id: number) => {
    setEquippedCompanionId(id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>My Characters</Text>
      <TouchableOpacity style={styles.equippedCard} onPress={() => router.push("/pages/myCompanion" as any)}> 
        <Image source={require("../companionImages/aron.png")} style={{ width: 80, height: 80 }} />
        <Text style={styles.equippedName}>{equipped.name}</Text>
        <Text style={styles.equippedLabel}>Equipped</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        {creatures.slice(0, 10).map((c) => {
          const isEquipped = c.id === (equippedId ?? 1);
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.slot, isEquipped && styles.slotEquipped]}
              onPress={() => handleEquip(c.id)}
            >
              <Image source={require("../companionImages/aron.png")} style={{ width: 48, height: 48 }} />
              <Text style={styles.slotName}>{c.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  equippedCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9FAFB",
    width: 140,
    marginBottom: 16,
  },
  equippedName: {
    marginTop: 8,
    fontWeight: "600",
  },
  equippedLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    rowGap: 12,
    paddingHorizontal: 16,
  },
  slot: {
    width: 96,
    height: 96,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  slotEquipped: {
    borderColor: "#007AFF",
  },
  slotName: {
    marginTop: 6,
    fontSize: 12,
  },
});
