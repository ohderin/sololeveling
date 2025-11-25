import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable, Image, Modal} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Battle() {
  const [result, setResult] = useState("");
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [battleModalVisible, setBattleModalVisible] = useState(false);
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [enemyMove, setEnemyMove] = useState<string | null>(null);



  function takeDamage(amount: number, recipient: string) {
      if (recipient === "enemy") {
          setEnemyHealth((prevHealth) => Math.max(prevHealth - amount, 0));
      } else if (recipient === "player") {
          setPlayerHealth((prevHealth) => Math.max(prevHealth - amount, 0));
      }
  }
  function heal() {
      setPlayerHealth((prevHealth) => Math.min(prevHealth + 100, 100));
      setEnemyHealth((prevHealth) => Math.min(prevHealth + 100, 100));
  }

  function combatLogic(playerInput: string) {
  const choices = ["rock", "paper", "scissors"];
  const computerInput = choices[Math.floor(Math.random() * choices.length)];

  // Show player move immediately (you already do this before calling combatLogic)
  setSelectedMove(playerInput);

  // Hide both icons first
  setEnemyMove(null);

  // STEP 1 — wait 1.5 seconds, THEN show enemy move
  setTimeout(() => {
    setEnemyMove(computerInput);

    // STEP 2 — wait ANOTHER 1.5 seconds, THEN apply health + result
    setTimeout(() => {
      if (playerInput === computerInput) {
      } else if (
        (playerInput === "rock" && computerInput === "scissors") ||
        (playerInput === "paper" && computerInput === "rock") ||
        (playerInput === "scissors" && computerInput === "paper")
      ) {
        takeDamage(10, "enemy");
      } else {
        takeDamage(10, "player");
      }

      // Hide both icons after combat resolves (optional)
      setSelectedMove(null);
      setEnemyMove(null);

    }, 1500); // END second delay (apply damage)

  }, 1500); // END first delay (show enemy)
}

  function renderEnemyMove() {
    if (!enemyMove) return null;
    if (enemyMove === "rock") {
      return (
        <View style={{ backgroundColor: "blue", width:'100%', height:'100%'}}>
          <FontAwesome5 name="magic" size={35} color="white" />
        </View>
      );
    } else if (enemyMove === "paper") {
      return (
        <View style={{ backgroundColor: "red", width:'100%', height:'100%'}}>
          <FontAwesome5 name="fist-raised" size={35} color="white" />
        </View>
      );
    } else if (enemyMove === "scissors") {
      return (
        <View style={{ backgroundColor: "green", width:'100%', height:'100%'}}>
          <FontAwesome5 name="wind" size={35} color="white" />
        </View>
      );
    }

    return (
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Text>Enemy chose: {enemyMove}</Text>
      </View>
    );
}

  function handlePlayerMove(move: string) {
    setSelectedMove(move);          // hide other buttons
    combatLogic(move);                 // run the battle round
    setTimeout(() => {
      setSelectedMove(null);        // show buttons again
    }, 3000); // 3 seconds
}

  return (
    <>
      <View style={styles.container}>


        
        <View style={styles.enemyDescription}>
          <View style={styles.companionPortraitContainer}>
            <Image source={require('../companionImages/Flitterfinch.png')} style={styles.companionPortraitStyle} />
          </View>
          <Text style={styles.title}>Flitterfinch</Text>
          <Text style={styles.title}>Level: 20</Text>
        </View>

        <Text style={styles.subtitle}>Select Team</Text>
        <View style={styles.selectTeamContainer}>
          <Pressable style={styles.teamButton} onPress={() => setTeamModalVisible(true)}>
            <Ionicons name="add" size={35} color="#7c7c7cff" />
          </Pressable>
          <Pressable style={styles.teamButton} onPress={() => setTeamModalVisible(true)}>
            <Ionicons name="add" size={35} color="#7c7c7cff" />
          </Pressable>
          <Pressable style={styles.teamButton} onPress={() => setTeamModalVisible(true)}>
            <Ionicons name="add" size={35} color="#7c7c7cff" />
          </Pressable>
        </View>

        <Pressable style={styles.startBattleButton} onPress={() => setBattleModalVisible(true)}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ color: "white", fontSize: 18 }}>Start Battle</Text>
            <MaterialCommunityIcons name="sword-cross" size={20} color="white" />
          </View>
        </Pressable>

        <Modal visible={teamModalVisible} animationType="slide" transparent onRequestClose={() => setTeamModalVisible(false)}>
          <View style={styles.backdrop}>
            <View style={styles.bottomSheet}>
              <Text style={{ margin: 16 }}>Select Your Team</Text>
              <Pressable onPress={() => setTeamModalVisible(false)} style={{ padding: 16 }}>
                <Text>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>

      <Modal visible={battleModalVisible}>
          <View style={styles.battleContainer}>
            <Pressable onPress={() => setBattleModalVisible(false)}>
              <Ionicons name="arrow-back-outline" size={35} color="black" />
            </Pressable>
            <View style={styles.playerCompanionContainer}>
              <Text style={styles.title}>Slumberpaw</Text>
              <View style={styles.healthBar}>
                <View style={[styles.healthFill, { width: `${playerHealth}%` }]} />
              </View>
              <Image source={require('../companionImages/Slumberpaw.png')} style={styles.companionStyle} />
            </View>

            <View style={styles.enemyCompanionContainer}>
              <Text style={styles.title}>Flitterfinch</Text>
              <View style={styles.healthBar}>
                <View style={[styles.healthFill, { width: `${enemyHealth}%` }]} />
              </View>
              <Image source={require('../companionImages/Flitterfinch.png')} style={styles.companionStyle} />
            </View>

            <Pressable onPress={() => heal()}>
              <Text>Heal 10 Health</Text>
            </Pressable>
            {selectedMove === null || selectedMove === "rock" ? (
              <Pressable style={styles.buttonRock} onPress={() => handlePlayerMove("rock")}>
                <FontAwesome5 name="magic" size={35} color="white" />
              </Pressable>
            ) : null}

            {selectedMove === null || selectedMove === "paper" ? (
              <Pressable style={styles.buttonPaper} onPress={() => handlePlayerMove("paper")}>
                <FontAwesome5 name="fist-raised" size={35} color="white" />
              </Pressable>
            ) : null}

            {selectedMove === null || selectedMove === "scissors" ? (
              <Pressable style={styles.buttonScissors} onPress={() => handlePlayerMove("scissors")}>
                <FontAwesome5 name="wind" size={35} color="white" />
              </Pressable>
            ) : null}
            <View style={styles.enemyMoveContainer}>
              {renderEnemyMove()}
            </View>

          </View>
        </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  battleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  container: {
    flex: 1,
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
  buttonScissors: {
    position: "absolute",
    bottom: 50,
    height: 90,
    width: 90,
    right: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "green",
  },
  buttonPaper: {
    position: "absolute",
    bottom: 50,
    height: 90,
    width: 90,
    left: 40,
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
  },
  buttonRock: {
    position: "absolute",
    bottom: 50,
    height: 90,
    width: 90,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#017AFF",
  },
  enemyMoveContainer: {
    position: "absolute",
    top: 100,
    right: 280,
    height: 90,
    width: 90,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  title: { fontSize: 20, marginBottom: 10 },

  healthBar: {
    width: "50%",
    height: 25,
    borderColor: "#000",
    borderWidth: 2,
    backgroundColor: "#333",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },

  healthFill: {
    height: "100%",
    backgroundColor: "red",
  },

  companionStyle: {
    width: 200,
    height: 200,
    alignItems: "center",
  },
  companionPortraitStyle: {
    width: 150,
    height: 150,
    marginTop: 5,
  },
  companionPortraitContainer:{
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#7c7c7cff",
    alignItems: "center",
    overflow: "hidden",
  },
  playerCompanionContainer: {
    position: "absolute",
    bottom: 180,
    right: 100,
    alignItems: "center",
    width: "100%",
  },
  enemyCompanionContainer: {
    position: "absolute",
    top: 40,
    left: 100,
    alignItems: "center",
    width: "100%",
  },
  enemyDescription:{
    alignItems: "center",
    width: "100%",
    marginTop: 50,
  },
  selectTeamContainer: {
    width: '100%',
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between"
  },
  teamButton: {
    backgroundColor: "#DDD",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#7c7c7cff",
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  startBattleButton: {
    marginTop: 20,
    borderColor: "red",
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backdrop: {
    position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    width: "100%",
    height: "50%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderColor: "#ccc",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
  },
});
