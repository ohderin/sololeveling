import React from "react";
import { Text, View, StyleSheet, ScrollView} from "react-native";
import InfoBox from "../components/leaderboardEntry";

export default function Leaderboard() {

    const names = [
        "Aaron 3 points",
        "Nina 8 points",
        "Tyler 12 points",
        "Paige 18 points",
        "Fiona 22 points",
        "Diana 25 points",
        "Victor 33 points",
        "Xander 37 points",
        "Bella 41 points",
        "Gavin 44 points",
        "Isaac 48 points",
        "Mason 52 points",
        "Jasmine 55 points",
        "Sophie 58 points",
        "Kevin 60 points",
        "Lila 62 points",
        "Owen 67 points",
        "Ethan 70 points",
        "Hannah 76 points",
        "Ryan 79 points",
        "Quinn 81 points",
        "Wendy 88 points",
        "Yara 91 points",
        "Carlos 95 points",
        "Uma 99 points"
    ];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{
                alignItems: "center",
                paddingBottom: '205%',  // ensures last item isn’t cut off
            }}
            showsVerticalScrollIndicator={false}>
                {names.map((name, index) => (
                    <InfoBox key={index} text={name} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
