import React, { useState, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, PanResponder, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import creatures from "../data/companions.json";
import { getTeamMembers, toggleTeamMember as toggleTeamMemberStore, subscribe } from "../lib/teamStore";
import { getCompanionHealth, initializeHealth, subscribe as subscribeHealth } from "../lib/companionHealthStore";

const getCompanionImage = (imageName: string) => {
  const imageMap: { [key: string]: any } = {
    "aron.png": require("../companionImages/aron.png"),
    "Slumberpaw.png": require("../companionImages/Slumberpaw.png"),
    "Flitterfinch.png": require("../companionImages/Flitterfinch.png"),
    "Tickhare.png": require("../companionImages/Tickhare.png"),
  };
  return imageMap[imageName] || require("../companionImages/aron.png");
};

// Map each companion to their background
const getCompanionBackground = (companionName: string) => {
  const backgroundMap: { [key: string]: any } = {
    "Tickhare": require("../companionImages/backgrounds/snowy.jpg"),
    "Slumberpaw": require("../companionImages/backgrounds/forest.jpg"),
    "Flitterfinch": require("../companionImages/backgrounds/meadow.png"),
  };
  return backgroundMap[companionName] || require("../companionImages/backgrounds/meadow.png");
};

// Map each companion to their elemental indicator image
// Change the indicator for each companion by modifying the mapping below
const getElementalIndicator = (companionName: string) => {
  const indicatorMap: { [key: string]: any } = {
    "Tickhare": require("./companions_assets/Power.png"),
    "Slumberpaw": require("./companions_assets/Elemental.png"),
    "Flitterfinch": require("./companions_assets/Swift.png"),
    // Add more companions here as needed
  };
  return indicatorMap[companionName] || require("./companions_assets/Power.png");
};

// Adjust image positioning for each companion in the navbar
// Modify these values to position each creature's head in the circle
const getNavImageStyle = (companionName: string) => {
  const imageStyles: { [key: string]: any } = {
    "Tickhare": {
      width: "100%",
      height: "100%",
      transform: [{ translateX: 12 }, { translateY: 15 }, { scale: 2.5 }],
    },
    "Slumberpaw": {
      width: "100%",
      height: "100%",
      transform: [{ translateX: 10 }, { translateY: 32 }, { scale: 3 }],
    },
    "Flitterfinch": {
      width: "100%",
      height: "100%",
      transform: [{ translateX: -10 }, { translateY: 32 }, { scale: 2.3 }],
    },
  };
  return imageStyles[companionName] || { width: "100%", height: "100%" };
};

// Filter to only show companions the user has
const userCompanions = creatures.filter(
  (c) => c.name === "Tickhare" || c.name === "Slumberpaw" || c.name === "Flitterfinch"
);

export default function Companions() {
  const [selectedCompanionId, setSelectedCompanionId] = useState<number>(userCompanions[0]?.id || 1);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<number[]>(getTeamMembers());
  const [showMenu, setShowMenu] = useState(false);
  
  // Subscribe to team changes
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setTeamMembers(getTeamMembers());
    });
    return unsubscribe;
  }, []);

  // Initialize health for all companions on mount
  useEffect(() => {
    userCompanions.forEach((c) => {
      initializeHealth(c.id, c.baseStats.health);
    });
  }, []);

  // Subscribe to health changes from battle
  useEffect(() => {
    const unsubscribe = subscribeHealth(() => {
      // Update health for all companions from the store
      setCompanionStats(prev => {
        const updated = { ...prev };
        userCompanions.forEach((c) => {
          if (updated[c.id]) {
            updated[c.id] = {
              ...updated[c.id],
              health: getCompanionHealth(c.id),
            };
          } else {
            // If companion stats don't exist yet, create them
            updated[c.id] = {
              attack: c.baseStats.attack,
              maxHp: c.baseStats.health,
              defense: c.baseStats.defense,
              health: getCompanionHealth(c.id),
              hunger: c.name === "Flitterfinch" ? 0 : 65,
            };
          }
        });
        return updated;
      });
    });
    return unsubscribe;
  }, []);

  // Refresh health from store when page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Update health for all companions from the store when page is focused
      setCompanionStats(prev => {
        const updated = { ...prev };
        userCompanions.forEach((c) => {
          const storeHealth = getCompanionHealth(c.id);
          if (updated[c.id]) {
            updated[c.id] = {
              ...updated[c.id],
              health: storeHealth,
            };
          } else {
            updated[c.id] = {
              attack: c.baseStats.attack,
              maxHp: c.baseStats.health,
              defense: c.baseStats.defense,
              health: storeHealth,
              hunger: c.name === "Flitterfinch" ? 0 : 65,
            };
          }
        });
        return updated;
      });
    }, [])
  );
  const [companionOrder, setCompanionOrder] = useState<number[]>(() => userCompanions.map(c => c.id));
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showHungryModal, setShowHungryModal] = useState(false);
  const [hungryCompanionId, setHungryCompanionId] = useState<number | null>(null);
  
  // State for each companion's stats
  const [companionStats, setCompanionStats] = useState<{ [key: number]: { attack: number; maxHp: number; defense: number; health: number; hunger: number } }>(() => {
    const initial: { [key: number]: { attack: number; maxHp: number; defense: number; health: number; hunger: number } } = {};
    userCompanions.forEach((c) => {
      // Initialize health from store or use base health
      initializeHealth(c.id, c.baseStats.health);
      const storedHealth = getCompanionHealth(c.id);
      initial[c.id] = {
        attack: c.baseStats.attack,
        maxHp: c.baseStats.health,
        defense: c.baseStats.defense,
        health: storedHealth, // Use health from store
        hunger: c.name === "Flitterfinch" ? 0 : 65, // Flitterfinch starts at 0 hunger
      };
    });
    return initial;
  });

  const selectedCompanion = userCompanions.find((c) => c.id === selectedCompanionId) || userCompanions[0];
  // Always get the latest health from the store
  const currentStats = companionStats[selectedCompanionId];
  const storeHealth = getCompanionHealth(selectedCompanionId);
  const stats = currentStats ? {
    ...currentStats,
    health: storeHealth, 
  } : {
    attack: selectedCompanion?.baseStats.attack || 0,
    maxHp: selectedCompanion?.baseStats.health || 0,
    defense: selectedCompanion?.baseStats.defense || 0,
    health: storeHealth || selectedCompanion?.baseStats.health || 0,
    hunger: 65,
  };

  const updateStat = (stat: "attack" | "maxHp" | "defense", delta: number) => {
    setCompanionStats((prev) => ({
      ...prev,
      [selectedCompanionId]: {
        ...prev[selectedCompanionId],
        [stat]: Math.max(0, (prev[selectedCompanionId]?.[stat] || 0) + delta),
      },
    }));
  };

  const toggleTeamMember = (companionId: number) => {
    const companion = userCompanions.find(c => c.id === companionId);
    const stats = companionStats[companionId];
    
    // Check if companion is hungry (hunger is 0)
    if (stats && stats.hunger === 0 && !teamMembers.includes(companionId)) {
      // Show hungry modal
      setHungryCompanionId(companionId);
      setShowHungryModal(true);
      return;
    }
    
    // Use the teamStore function
    toggleTeamMemberStore(companionId);
  };

  const moveCompanion = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setCompanionOrder((prev) => {
      const newOrder = [...prev];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed);
      return newOrder;
    });
  };

  const createPanResponder = (index: number) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        setDraggingIndex(index);
      },
      onPanResponderMove: (evt, gestureState) => {
        setDragPosition({ x: gestureState.moveX, y: gestureState.moveY });
        
        // Find which item we're hovering over
        const buttonWidth = 60; 
        const buttonGap = 8; 
        const scrollOffset = 0; 
        const hoverIndex = Math.floor((gestureState.moveX - scrollOffset) / (buttonWidth + buttonGap));
        
        if (hoverIndex >= 0 && hoverIndex < companionOrder.length && hoverIndex !== index) {
          setHoverIndex(hoverIndex);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (hoverIndex !== null && draggingIndex !== null && hoverIndex !== draggingIndex) {
          moveCompanion(draggingIndex, hoverIndex);
        }
        setDraggingIndex(null);
        setDragPosition(null);
        setHoverIndex(null);
      },
      onPanResponderTerminate: () => {
        setDraggingIndex(null);
        setDragPosition(null);
        setHoverIndex(null);
      },
    });
  };

  const HealthBar = ({ value, maxValue, color }: { value: number; maxValue: number; color: string }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    return (
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Top Navbar */}
      <View style={styles.topNavbar}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navbarContent}
        >
          {companionOrder.map((companionId, index) => {
            const companion = userCompanions.find(c => c.id === companionId);
            if (!companion) return null;
            
            const isOnTeam = teamMembers.includes(companion.id);
            const isDragging = draggingIndex === index;
            const isHovered = hoverIndex === index && draggingIndex !== null && draggingIndex !== index;
            const panResponder = createPanResponder(index);
            
            return (
              <View
                key={companion.id}
                {...panResponder.panHandlers}
                style={[
                  styles.navButton,
                  selectedCompanionId === companion.id && styles.navButtonActive,
                  isDragging && styles.navButtonDragging,
                  isHovered && styles.navButtonHovered,
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (draggingIndex === null) {
                      setSelectedCompanionId(companion.id);
                    }
                  }}
                >
                  <View style={[
                    styles.navImageCircle,
                    selectedCompanionId === companion.id && styles.navImageCircleActive,
                    isOnTeam && styles.navImageCircleTeam,
                    isDragging && styles.navImageCircleDragging,
                  ]}>
                    <Image
                      source={getCompanionImage(companion.image)}
                      style={[styles.navImage, getNavImageStyle(companion.name)]}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

      {/* Selected Companion Details */}
      {selectedCompanion && (
        <View style={styles.companionDetails}>
          <View style={styles.companionImageContainer}>
            {/* Background Image */}
            <Image
              source={getCompanionBackground(selectedCompanion.name)}
              style={styles.companionBackground}
              resizeMode="cover"
              blurRadius={5}
            />
            {/* Black Overlay*/}
            <View style={styles.backgroundOverlay} />
            
            {/* 3 Dots Menu Button */}
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowMenu(true)}
            >
              <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            {/* Companion Image and Name */}
            <View style={styles.companionContent}>
              <View style={styles.imageWrapper}>
                <Image
                  source={getCompanionImage(selectedCompanion.image)}
                  style={styles.companionImage}
                  resizeMode="contain"
                />
                {/* Feed Button */}
                <TouchableOpacity 
                  style={styles.feedButton}
                  onPress={() => setShowFeedModal(true)}
                >
                  <Image
                    source={require("./companions_assets/drumstick.png")}
                    style={styles.feedButtonIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {/* Elemental Indicator */}
                <Image
                  source={getElementalIndicator(selectedCompanion.name)}
                  style={styles.elementalIndicator}
                  resizeMode="contain"
                />
              </View>
              
              <Text style={styles.companionName}>{selectedCompanion.name}</Text>
            </View>
          </View>

          {/* Health and Hunger Bars */}
          <View style={styles.barsContainer}>
            <View style={styles.barLabelContainer}>
              <Text style={styles.barLabel}>Health</Text>
              <HealthBar value={stats.health} maxValue={stats.maxHp} color="#4CAF50" />
            </View>
            <View style={styles.barLabelContainer}>
              <Text style={styles.barLabel}>Hunger</Text>
              <HealthBar value={stats.hunger} maxValue={100} color="#FFA500" />
            </View>
          </View>

          {/* Stats with +/- buttons */}
          <View style={styles.statsContainer}>
            {/* Attack Power */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Attack Power</Text>
              <View style={styles.statControls}>
                <TouchableOpacity
                  style={styles.statButton}
                  onPress={() => updateStat("attack", -1)}
                >
                  <Text style={styles.statButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.statValue}>{stats.attack}</Text>
                <TouchableOpacity
                  style={styles.statButton}
                  onPress={() => updateStat("attack", 1)}
                >
                  <Text style={styles.statButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Max HP */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Max HP</Text>
              <View style={styles.statControls}>
                <TouchableOpacity
                  style={styles.statButton}
                  onPress={() => updateStat("maxHp", -1)}
                >
                  <Text style={styles.statButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.statValue}>{stats.maxHp}</Text>
                <TouchableOpacity
                  style={styles.statButton}
                  onPress={() => updateStat("maxHp", 1)}
                >
                  <Text style={styles.statButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Defense */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Defense</Text>
              <View style={styles.statControls}>
                <TouchableOpacity
                  style={styles.statButton}
                  onPress={() => updateStat("defense", -1)}
                >
                  <Text style={styles.statButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.statValue}>{stats.defense}</Text>
                <TouchableOpacity
                  style={styles.statButton}
                  onPress={() => updateStat("defense", 1)}
                >
                  <Text style={styles.statButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </View>
        )}
      </ScrollView>

      {/* Feed Modal */}
      <Modal
        visible={showFeedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFeedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require("./companions_assets/feed.png")}
              style={styles.modalFeedImage}
              resizeMode="contain"
            />
            <Text style={styles.modalTitle}>Feed Your Companion?</Text>
            <Text style={styles.modalText}>
              Would you like to feed {selectedCompanion?.name}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowFeedModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={() => {
                  // Increase hunger when fed
                  setCompanionStats((prev) => ({
                    ...prev,
                    [selectedCompanionId]: {
                      ...prev[selectedCompanionId],
                      hunger: Math.min(100, (prev[selectedCompanionId]?.hunger || 65) + 50),
                    },
                  }));
                  setShowFeedModal(false);
                }}
              >
                <Text style={styles.modalButtonTextConfirm}>Feed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Companion Menu Overlay */}
      {showMenu && (
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={styles.menuOverlayBackdrop}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                const stats = companionStats[selectedCompanionId];
                // Check if companion is hungry before adding to team
                if (stats && stats.hunger === 0 && !teamMembers.includes(selectedCompanionId)) {
                  setHungryCompanionId(selectedCompanionId);
                  setShowMenu(false);
                  setShowHungryModal(true);
                } else {
                  toggleTeamMember(selectedCompanionId);
                  setShowMenu(false);
                }
              }}
            >
              <Text style={styles.menuItemText}>
                {teamMembers.includes(selectedCompanionId) ? "Remove from Team" : "Add to Team"}
              </Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Add release logic here
                setShowMenu(false);
              }}
            >
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>Release</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Hungry Companion Modal */}
      <Modal
        visible={showHungryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHungryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {hungryCompanionId && (
              <>
                <Image
                  source={require("./companions_assets/hungry.png")}
                  style={styles.modalFeedImage}
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>
                  {userCompanions.find(c => c.id === hungryCompanionId)?.name} Refuses to Join
                </Text>
                <Text style={styles.modalText}>
                  {userCompanions.find(c => c.id === hungryCompanionId)?.name} refuses to join your team because they're hungry!
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setShowHungryModal(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={() => {
                      setShowHungryModal(false);
                      setShowFeedModal(true);
                    }}
                  >
                    <Text style={styles.modalButtonTextConfirm}>Feed</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topNavbar: {
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 60,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navbarContent: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
  },
  navButton: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  navButtonActive: {
    // Active state handled by circle border
  },
  navButtonDragging: {
    opacity: 0.5,
    transform: [{ scale: 1.1 }],
  },
  navButtonHovered: {
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 2,
  },
  navImageCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  navImageCircleActive: {
    borderColor: "#007AFF",
    borderWidth: 3,
  },
  navImageCircleTeam: {
    borderColor: "#4CAF50",
    borderWidth: 3,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  navImageCircleDragging: {
    opacity: 0.7,
    transform: [{ scale: 1.1 }],
  },
  navImage: {
    width: "100%",
    height: "100%",
  },
  reorderIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    padding: 2,
  },
  container: {
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingBottom: 24,
  },
  companionDetails: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 0,
  },
  companionImageContainer: {
    width: "100%",
    minHeight: 360,
    borderRadius: 0,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  companionBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  companionContent: {
    position: "relative",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  companionImage: {
    width: 200,
    height: 280,
    borderWidth: 0,
    borderColor: "#FFFFFF",
    borderRadius: 0,
  },
  feedButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  feedButtonIcon: {
    width: 28,
    height: 28,
  },
  elementalIndicator: {
    position: "absolute",
    top: 8,
    left: -20,
    width: 40,
    height: 40,
  },
  companionName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  barsContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 32,
    gap: 16,
  },
  barLabelContainer: {
    width: "100%",
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  barContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 10,
  },
  statsContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  statControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  statButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "center",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "80%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalFeedImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#E0E0E0",
  },
  modalButtonConfirm: {
    backgroundColor: "#4CAF50",
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuOverlayBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menuContent: {
    position: "absolute",
    top: 225, 
    right: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  menuItemDanger: {
    color: "#E53935",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
});
