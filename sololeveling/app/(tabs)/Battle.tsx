import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Pressable, Image, Modal, ImageBackground, Animated, ScrollView, Dimensions, PanResponder, TouchableOpacity, Platform} from "react-native";
import { router } from "expo-router";
import { Ionicons, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { getTeamMembers, subscribe, toggleTeamMember, addTeamMember, removeTeamMember } from "../lib/teamStore";
import { getCompanionHealth, setCompanionHealth, takeCompanionDamage, initializeHealth, subscribe as subscribeHealth } from "../lib/companionHealthStore";
import { getTasks, subscribe as subscribeTasks, Task } from "../lib/taskStore";
import creatures from "../data/companions.json";
import { getActionPoints, spendAPForAttack, spendActionPoints, subscribeToAP } from "../lib/apStore";
import { defaultTextStyle, getAfacadFont } from "../utils/defaultTextStyle";
import { setBattleMusicPlaying } from "../components/BackgroundMusic";
import { getOwnedCompanionNames, addOwnedCompanion, subscribe as subscribeCompanions } from "../lib/companionStore";

// AsyncStorage for AP warning preference
let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  console.log('AsyncStorage not available for AP warning preference');
}

const AP_WARNING_DISMISSED_KEY = '@battle_ap_warning_dismissed';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const getCompanionImage = (imageName: string) => {
  const imageMap: { [key: string]: any } = {
    "aron.png": require("../companionImages/aron.png"),
    "Slumberpaw.png": require("../companionImages/Slumberpaw.png"),
    "Flitterfinch.png": require("../companionImages/Flitterfinch.png"),
    "Tickhare.png": require("../companionImages/Tickhare.png"),
    "Wearywise.png": require("../companionImages/Wearywise.png"),
  };
  return imageMap[imageName] || require("../companionImages/aron.png");
};

// Filter to only show companions the user has
const getUserCompanions = () => {
  const ownedNames = getOwnedCompanionNames();
  return creatures.filter((c) => ownedNames.includes(c.name));
};

export default function Battle() {
  const [result, setResult] = useState("");
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [companionHealths, setCompanionHealths] = useState<{ [key: number]: number }>({});
  const [battleModalVisible, setBattleModalVisible] = useState(false);
  const [transitionVisible, setTransitionVisible] = useState(false);
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const [showFleeModal, setShowFleeModal] = useState(false);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [enemyMove, setEnemyMove] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<number[]>(getTeamMembers());
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [showCreatureSelect, setShowCreatureSelect] = useState(false);
  const [activeCompanionId, setActiveCompanionId] = useState<number | null>(teamMembers[0] || null);
  const [selectedTeamSlot, setSelectedTeamSlot] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [dyingCompanions, setDyingCompanions] = useState<Set<number>>(new Set());
  const [enemyDying, setEnemyDying] = useState(false);
  const [showEnemyHelpModal, setShowEnemyHelpModal] = useState(false);
  const [showWearywiseWelcomeModal, setShowWearywiseWelcomeModal] = useState(false);
  const [showBattleCompleteOverlay, setShowBattleCompleteOverlay] = useState(false);
  const [userCompanions, setUserCompanions] = useState(getUserCompanions());
  const [ap, setAp] = useState(getActionPoints());
  const [showNoAPWarning, setShowNoAPWarning] = useState(false);
  const [showAPWarningModal, setShowAPWarningModal] = useState(false);
  const [dontShowAPWarning, setDontShowAPWarning] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const teamSlideAnim = useRef(new Animated.Value(0)).current;
  const enemySlideAnim = useRef(new Animated.Value(0)).current;
  const exclamationAnim = useRef(new Animated.Value(0)).current;
  const battleButtonsSlideAnim = useRef(new Animated.Value(0)).current;
  const actionButtonsSlideAnim = useRef(new Animated.Value(1)).current;
  const playerAttackAnim = useRef(new Animated.Value(0)).current;
  const enemyAttackAnim = useRef(new Animated.Value(0)).current;
  const playerHitAnim = useRef(new Animated.Value(0)).current;
  const enemyHitAnim = useRef(new Animated.Value(0)).current;
  const tackleSound = useAudioPlayer(require('../../assets/sounds/Tackle.mp3'));
  const battleMusic = useAudioPlayer(require('../../assets/sounds/Battle.mp3'));
  const errorSound = useAudioPlayer(require('../barena_assets/error.wav'));
  
  // Apply SFX volume to sound effects
  useEffect(() => {
    const updateVolumes = () => {
      const { getSFXVolume } = require('../lib/soundSettingsStore');
      const sfxVol = getSFXVolume();
      tackleSound.volume = sfxVol;
      errorSound.volume = sfxVol;
    };
    updateVolumes();
    const { subscribe } = require('../lib/soundSettingsStore');
    const unsubscribe = subscribe(updateVolumes);
    return unsubscribe;
  }, []);

  // Initialize error sound volume
  useEffect(() => {
    errorSound.volume = 1.0;
  }, []);

  // Play error sound when no AP warning appears
  useEffect(() => {
    if (showNoAPWarning) {
      // Use setTimeout to ensure the warning is visible before playing sound
      const timer = setTimeout(() => {
        errorSound.seekTo(0);
        errorSound.play();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showNoAPWarning]);
  const battleMusicVolumeAnim = useRef(new Animated.Value(0)).current;
  const redPulseAnim = useRef(new Animated.Value(0)).current;
  const deathAnimations = useRef<{ [key: number]: { saturation: Animated.Value; scale: Animated.Value } }>({});
  const enemyDeathAnim = useRef({ saturation: new Animated.Value(1), scale: new Animated.Value(1) }).current;
  const ENEMY_NAME = "Wearywise";
  

  const MAX_VOLUME = 0.05;

  // Start pulsing animation when health is low
  useEffect(() => {
    if (activeCompanionId) {
      const activeCompanion = creatures.find(c => c.id === activeCompanionId);
      if (activeCompanion) {
        const currentHealth = companionHealths[activeCompanionId] ?? getCompanionHealth(activeCompanionId);
        const maxHealth = activeCompanion.baseStats.health;
        const healthPercentage = maxHealth > 0 ? (currentHealth / maxHealth) * 100 : 0;
        
        if (healthPercentage <= 15) {
          // Start pulsing animation
          Animated.loop(
            Animated.sequence([
              Animated.timing(redPulseAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(redPulseAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          ).start();
        } else {
          // Stop pulsing if health is above 15%
          redPulseAnim.stopAnimation();
          redPulseAnim.setValue(0);
        }
      }
    }
  }, [companionHealths, activeCompanionId]);

  // ap changes listener
  useEffect(() => {
    const unsub = subscribeToAP(() => {
      setAp(getActionPoints());
    });
    return unsub;
  }, []);

  // ap 0 warning
  const showAPWarning = () => {
    setShowNoAPWarning(true);
    setTimeout(() => {
      setShowNoAPWarning(false);
    }, 1000);
  };

  // Subscribe to team changes
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const newTeam = getTeamMembers();
      setTeamMembers(newTeam);
      // Hide warning if team is no longer empty
      if (newTeam.length > 0) {
        setHasAttemptedStart(false);
        // Set active companion to first if none selected
        if (!activeCompanionId && newTeam.length > 0) {
          setActiveCompanionId(newTeam[0]);
        }
      }
    });
    return unsubscribe;
  }, [activeCompanionId]);

  // Subscribe to task changes
  useEffect(() => {
    const unsubscribe = subscribeTasks(() => {
      setTasks(getTasks());
    });
    return unsubscribe;
  }, []);

  // Subscribe to companion health changes
  useEffect(() => {
    const unsubscribe = subscribeHealth(() => {
      // Update companionHealths state when health changes in store
      const updatedHealths: { [key: number]: number } = {};
      teamMembers.forEach(companionId => {
        updatedHealths[companionId] = getCompanionHealth(companionId);
      });
      if (activeCompanionId) {
        updatedHealths[activeCompanionId] = getCompanionHealth(activeCompanionId);
      }
      setCompanionHealths(prev => ({
        ...prev,
        ...updatedHealths
      }));
    });
    return unsubscribe;
  }, [teamMembers, activeCompanionId]);

  // Monitor companion health and start death animation if health is 0 or lower
  useEffect(() => {
    const currentTeam = [...teamMembers];
    currentTeam.forEach(companionId => {
      const health = getCompanionHealth(companionId);
      if (health <= 0 && currentTeam.includes(companionId) && !dyingCompanions.has(companionId)) {
        startDeathAnimation(companionId);
      }
    });
  }, [companionHealths, teamMembers, activeCompanionId, battleModalVisible, dyingCompanions]);

  // Ensure active companion health is initialized and in state
  useEffect(() => {
    if (activeCompanionId && battleModalVisible) {
      const companion = creatures.find(c => c.id === activeCompanionId);
      if (companion) {
        // Initialize health if not already set
        const currentHealth = getCompanionHealth(activeCompanionId);
        if (currentHealth === undefined || currentHealth === null) {
          initializeHealth(activeCompanionId, companion.baseStats.health);
        }
        
        // Ensure health is in state
        setCompanionHealths(prev => {
          if (prev[activeCompanionId] === undefined) {
            return {
              ...prev,
              [activeCompanionId]: getCompanionHealth(activeCompanionId)
            };
          }
          return prev;
        });
      }
    }
  }, [activeCompanionId, battleModalVisible]);

  // Animate when battle modal opens
  useEffect(() => {
    if (battleModalVisible) {
      fadeAnim.setValue(0);
      actionButtonsSlideAnim.setValue(0); // Start with action buttons visible (in position)
      battleButtonsSlideAnim.setValue(1); // Start with battle buttons hidden (off-screen below)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
        // Set active companion to first team member if not set
        if (!activeCompanionId && teamMembers.length > 0) {
          const firstCompanionId = teamMembers[0];
          setActiveCompanionId(firstCompanionId);
          // Initialize health for the active companion
          const companion = creatures.find(c => c.id === firstCompanionId);
          if (companion) {
            initializeHealth(firstCompanionId, companion.baseStats.health);
            setCompanionHealths(prev => ({
              ...prev,
              [firstCompanionId]: getCompanionHealth(firstCompanionId)
            }));
          }
        }
    }
  }, [battleModalVisible, teamMembers, activeCompanionId]);

  // Play battle music with fade in/out when battle modal opens/closes
  useEffect(() => {
    if (battleModalVisible) {
      // BGM is already muted when transition starts, just start battle music
      // Start with volume at 0 and fade in
      battleMusicVolumeAnim.setValue(0);
      battleMusic.loop = true;
      battleMusic.volume = 0;
      battleMusic.play();
      
      // Fade in over 1 second
      Animated.timing(battleMusicVolumeAnim, {
        toValue: MAX_VOLUME,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      
      // Update volume based on animation value
      const listener = battleMusicVolumeAnim.addListener(({ value }) => {
        battleMusic.volume = value;
      });
      
      return () => {
        battleMusicVolumeAnim.removeListener(listener);
      };
    } else {
      // Unmute background music when battle ends
      setBattleMusicPlaying(false);
      
      // Fade out over 0.5 seconds
      Animated.timing(battleMusicVolumeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        // Pause after fade out completes
        battleMusic.pause();
        battleMusic.volume = 0;
      });
      
      // Update volume during fade out
      const listener = battleMusicVolumeAnim.addListener(({ value }) => {
        battleMusic.volume = value;
      });
      
      return () => {
        battleMusicVolumeAnim.removeListener(listener);
        battleMusic.pause();
        battleMusic.volume = 0;
      };
    }
  }, [battleModalVisible]);

  // Load AP warning preference on mount
  useEffect(() => {
    const loadAPWarningPreference = async () => {
      if (!AsyncStorage) return;
      try {
        const dismissed = await AsyncStorage.getItem(AP_WARNING_DISMISSED_KEY);
        if (dismissed === 'true') {
          setDontShowAPWarning(true);
        }
    } catch (error) {
        console.error('Error loading AP warning preference:', error);
      }
    };
    loadAPWarningPreference();
  }, []);

  // Actual battle transition function
  const startBattleTransition = () => {
    // Check if team has at least one companion
    if (teamMembers.length === 0) {
      setHasAttemptedStart(true);
      // Play error sound
      errorSound.seekTo(0);
      errorSound.play();
      return; 
    }
    
    // Mute background music when transition begins
    setBattleMusicPlaying(true);
    
    setHasAttemptedStart(false); // Reset when battle starts successfully
    setTransitionVisible(true);
    // Reset animations
    teamSlideAnim.setValue(0);
    enemySlideAnim.setValue(0);
    exclamationAnim.setValue(0);

    // Get screen dimensions 
    const screenHeight = 800; 

    Animated.sequence([
      // Phase 1: Team slides up from left, enemy slides down from right
      Animated.parallel([
        Animated.timing(teamSlideAnim, {
          toValue: 1,
          duration: 600,
        useNativeDriver: true,
      }),
        Animated.timing(enemySlideAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Show exclamation mark
      Animated.timing(exclamationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Phase 3: Pause (delay)
      Animated.delay(800),
      // Phase 4: Both slide off frame
      Animated.parallel([
        Animated.timing(teamSlideAnim, {
          toValue: 2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(enemySlideAnim, {
          toValue: 2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(exclamationAnim, {
        toValue: 0,
          duration: 300,
        useNativeDriver: true,
      }),
      ]),
    ]).start(() => {
      // After transition, show battle scene
      setTransitionVisible(false);
      setEnemyHealth(100);
      // Health is managed per-companion, no need to reset here
      setBattleStarted(false); // Start with battle/creature select buttons
      setShowCreatureSelect(false);
      setBattleModalVisible(true);
    });
  };

  // Wrapper function to check AP warning preference before starting battle
  const handleStartBattleClick = () => {
    const AP_COST_BATTLE = 10;
    
    // Check if user has enough AP
    if (ap < AP_COST_BATTLE) {
      setShowNoAPWarning(true);
      setTimeout(() => setShowNoAPWarning(false), 2000);
      return;
    }
    
    // Check if user has dismissed the warning
    if (dontShowAPWarning) {
      // Spend 10 AP directly if warning is dismissed
      const success = spendActionPoints(AP_COST_BATTLE);
      if (!success) {
        setShowNoAPWarning(true);
        setTimeout(() => setShowNoAPWarning(false), 2000);
        return;
      }
      startBattleTransition();
      return;
    }
    
    // Show warning modal
    setShowAPWarningModal(true);
  };

  // Confirm AP warning and proceed with battle
  const confirmAPWarning = async () => {
    const AP_COST_BATTLE = 10;
    
    // Check if user has enough AP
    if (ap < AP_COST_BATTLE) {
      setShowAPWarningModal(false);
      setShowNoAPWarning(true);
      setTimeout(() => setShowNoAPWarning(false), 2000);
      return;
    }
    
    // Spend 10 AP
    const success = spendActionPoints(AP_COST_BATTLE);
    if (!success) {
      setShowAPWarningModal(false);
      setShowNoAPWarning(true);
      setTimeout(() => setShowNoAPWarning(false), 2000);
      return;
    }
    
    // Save preference if checkbox is checked
    if (dontShowAPWarning && AsyncStorage) {
      try {
        await AsyncStorage.setItem(AP_WARNING_DISMISSED_KEY, 'true');
    } catch (error) {
        console.error('Error saving AP warning preference:', error);
      }
    }
    
    setShowAPWarningModal(false);
    
    // Proceed with battle transition
    startBattleTransition();
  };

  // Cancel AP warning
  const cancelAPWarning = () => {
    setShowAPWarningModal(false);
    setDontShowAPWarning(false);
  };

  const handleStartBattle = () => {
    // Make battle buttons visible first, then animate
    setBattleStarted(true);
    setShowCreatureSelect(false);
    
    // Small delay to ensure render, then animate
    setTimeout(() => {
      // Slide action buttons down and battle buttons up
      Animated.parallel([
        Animated.timing(actionButtonsSlideAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(battleButtonsSlideAnim, {
          toValue: 0,
          duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    }, 50);
  };

  const handleExitBattle = () => {
    // Slide battle buttons down and action buttons up
    Animated.parallel([
      Animated.timing(battleButtonsSlideAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(actionButtonsSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setBattleStarted(false);
      setSelectedMove(null);
      // Reset animations for next time
      battleButtonsSlideAnim.setValue(1); // Hidden below
      actionButtonsSlideAnim.setValue(0); // Visible
    });
  };

  const handleItems = () => {
    // TODO: Implement items functionality
    console.log("Items clicked");
  };

  const handleButtonPress = (action: string) => {
    // check and spend AP before attacking
    if (!spendAPForAttack()) {
      showAPWarning();
          return;
        }
    // TODO: Implement button press action
  };

  const handleFlee = () => {
    setShowFleeModal(true);
  };

  const confirmFlee = () => {
    setShowFleeModal(false);
    setBattleModalVisible(false);
    setBattleStarted(false);
    setSelectedMove(null);
    setEnemyHealth(100);
    const healths: { [key: number]: number } = {};
    teamMembers.forEach(id => {
      healths[id] = getCompanionHealth(id);
    });
    setCompanionHealths(healths);
  };

  const setCompanionAtSlot = (slotIndex: number, companionId: number | null) => {
    const currentTeam = [...teamMembers];
    const companionAtSlot = currentTeam[slotIndex];
    
    // If setting to null, just remove the companion at that slot
    if (companionId === null) {
      if (companionAtSlot) {
        removeTeamMember(companionAtSlot);
      }
      return;
    }
    
    // If the companion is already at this slot, remove it
    if (companionAtSlot === companionId) {
      removeTeamMember(companionId);
      return;
    }
    
    // Remove companion from current slot if exists
    if (companionAtSlot) {
      removeTeamMember(companionAtSlot);
    }
    
    // If companion is already in team elsewhere, remove it first
    const existingIndex = currentTeam.indexOf(companionId);
    if (existingIndex !== -1) {
      removeTeamMember(companionId);
    }
    
    // Add the companion (it will be added to the end, but that's okay)
    // The UI will show teamMembers[0], teamMembers[1], teamMembers[2] regardless of order
    addTeamMember(companionId);
  };

  const handleCreatureSelect = () => {
    setShowCreatureSelect(true);
  };

  const handleCompanionSelect = (companionId: number) => {
    setActiveCompanionId(companionId);
    // Update health state for the newly selected companion
    const companion = creatures.find(c => c.id === companionId);
    if (companion) {
      initializeHealth(companionId, companion.baseStats.health);
      setCompanionHealths(prev => ({
        ...prev,
        [companionId]: getCompanionHealth(companionId)
      }));
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const itemWidth = SCREEN_WIDTH;
    const index = Math.round(offsetX / itemWidth);
    if (teamMembers[index]) {
      setActiveCompanionId(teamMembers[index]);
    }
  };

  // Scroll to active companion when opening creature select
  useEffect(() => {
    if (showCreatureSelect && activeCompanionId && scrollViewRef.current) {
      const index = teamMembers.indexOf(activeCompanionId);
      if (index !== -1) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: index * SCREEN_WIDTH,
            animated: false,
          });
        }, 100);
      }
    }
  }, [showCreatureSelect, activeCompanionId, teamMembers]);



  function takeDamage(amount: number, recipient: string) {
      if (recipient === "enemy") {
          setEnemyHealth((prevHealth) => {
            const newHealth = Math.max(prevHealth - amount, 0);
            // Start enemy death animation if health is 0 or lower
            if (newHealth <= 0 && !enemyDying) {
              setTimeout(() => startEnemyDeathAnimation(), 100);
            }
            return newHealth;
          });
      } else if (recipient === "player" && activeCompanionId) {
          // Apply damage to the active companion only
          takeCompanionDamage(activeCompanionId, amount);
          // Update local state for immediate UI update
          const newHealth = Math.max(getCompanionHealth(activeCompanionId), 0);
          setCompanionHealths(prev => ({
            ...prev,
            [activeCompanionId]: newHealth
          }));
          
          // Start death animation if health is 0 or lower
          if (newHealth <= 0 && !dyingCompanions.has(activeCompanionId)) {
            startDeathAnimation(activeCompanionId);
          }
      }
  }

  function startDeathAnimation(companionId: number) {
    // Mark companion as dying
    setDyingCompanions(prev => new Set(prev).add(companionId));
    
    // Create animation values if they don't exist
    if (!deathAnimations.current[companionId]) {
      deathAnimations.current[companionId] = {
        saturation: new Animated.Value(1),
        scale: new Animated.Value(1),
      };
    }
    
    const anim = deathAnimations.current[companionId];
    
    // Reset animation values
    anim.saturation.setValue(1);
    anim.scale.setValue(1);
    
    // Start death animation: fade saturation and shrink
    Animated.parallel([
      // Fade saturation (opacity from 1 to 0)
      Animated.timing(anim.saturation, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Shrink scale
      Animated.timing(anim.scale, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation completes, remove from team
      removeTeamMember(companionId);
      setDyingCompanions(prev => {
        const newSet = new Set(prev);
        newSet.delete(companionId);
        return newSet;
      });
      
      // Clean up animation ref
      delete deathAnimations.current[companionId];
      
      // Switch to next available companion if this was the active one
      if (activeCompanionId === companionId) {
        // Get fresh team members from store immediately after removal
        const updatedTeam = getTeamMembers();
        
        // Force update teamMembers state to ensure re-render
        setTeamMembers(updatedTeam);
        
        if (updatedTeam.length > 0) {
          const nextCompanionId = updatedTeam[0];
          const nextCompanion = creatures.find(c => c.id === nextCompanionId);
          
          if (nextCompanion) {
            // Initialize health for the new active companion first
            initializeHealth(nextCompanionId, nextCompanion.baseStats.health);
            
            // Update companion healths state immediately with the new companion
            const newHealth = getCompanionHealth(nextCompanionId);
            setCompanionHealths(prev => ({
              ...prev,
              [nextCompanionId]: newHealth
            }));
            
            // Set active companion after health is initialized
            // Use a small delay to ensure state updates propagate
            setTimeout(() => {
              setActiveCompanionId(nextCompanionId);
            }, 0);
          }
          
          // Show action buttons menu when new companion comes in
          setBattleStarted(false);
          // Animate action buttons to be visible and battle buttons to be hidden
          actionButtonsSlideAnim.setValue(0); // 0 = visible
          battleButtonsSlideAnim.setValue(1); // 1 = hidden
        } else {
          // No companions left, exit battle
          setActiveCompanionId(null);
          setBattleModalVisible(false);
          setBattleStarted(false);
        }
      }
    });
  }

  function startEnemyDeathAnimation() {
    setEnemyDying(true);
    
    // Reset animation values
    enemyDeathAnim.saturation.setValue(1);
    enemyDeathAnim.scale.setValue(1);
    
    // Start death animation: fade saturation and shrink
    Animated.parallel([
      // Fade saturation (opacity from 1 to 0)
      Animated.timing(enemyDeathAnim.saturation, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Shrink scale
      Animated.timing(enemyDeathAnim.scale, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation completes, show help modal
      setShowEnemyHelpModal(true);
    });
  }

  async function handleHelpEnemy() {
    // Add Wearywise to owned companions
    await addOwnedCompanion(ENEMY_NAME);
    
    // Update user companions list
    setUserCompanions(getUserCompanions());
    
    // Initialize health for Wearywise
    const wearywise = creatures.find(c => c.name === ENEMY_NAME);
    if (wearywise) {
      initializeHealth(wearywise.id, wearywise.baseStats.health);
    }
    
    // Close help modal and show welcome modal
    setShowEnemyHelpModal(false);
    setShowWearywiseWelcomeModal(true);
  }

  function handleWearywiseWelcomeClose() {
    setShowWearywiseWelcomeModal(false);
    // Show battle complete overlay on select team screen
    setShowBattleCompleteOverlay(true);
    // Close battle modal
    setBattleModalVisible(false);
    setBattleStarted(false);
    setEnemyHealth(100);
    setEnemyDying(false);
    enemyDeathAnim.saturation.setValue(1);
    enemyDeathAnim.scale.setValue(1);
    // Navigate to companions screen
    router.push('/(tabs)/Companions' as any);
  }

  function handleDeclineHelpEnemy() {
    setShowEnemyHelpModal(false);
    setBattleModalVisible(false);
    setBattleStarted(false);
    setEnemyHealth(100);
    setEnemyDying(false);
    enemyDeathAnim.saturation.setValue(1);
    enemyDeathAnim.scale.setValue(1);
  }
  function heal() {
      if (activeCompanionId) {
        const companion = creatures.find(c => c.id === activeCompanionId);
        if (companion) {
          const maxHealth = companion.baseStats.health;
          const currentHealth = getCompanionHealth(activeCompanionId);
          setCompanionHealth(activeCompanionId, Math.min(currentHealth + 100, maxHealth));
          setCompanionHealths(prev => ({
            ...prev,
            [activeCompanionId]: Math.min(currentHealth + 100, maxHealth)
          }));
        }
      }
      setEnemyHealth((prevHealth) => Math.min(prevHealth + 100, 100));
  }

  function combatLogic(playerInput: string) {
  const choices = ["rock", "paper", "scissors"];
  const computerInput = choices[Math.floor(Math.random() * choices.length)];

  // Show player move
  setSelectedMove(playerInput);

  // Hide both icons first
  setEnemyMove(null);

  //wait 1.5 seconds, THEN show enemy move
  setTimeout(() => {
    setEnemyMove(computerInput);

      //wait ANOTHER 1.5 seconds, THEN apply health + result
      setTimeout(() => {
        if (playerInput === computerInput) {
          // Tie - no damage, no animation
        } else if (
          (playerInput === "rock" && computerInput === "scissors") ||
          (playerInput === "paper" && computerInput === "rock") ||
          (playerInput === "scissors" && computerInput === "paper")
        ) {
          // Player wins - player attacks enemy
          // Play tackle sound
          tackleSound.seekTo(0);
          tackleSound.play();
          // Animate player pushing forward (right) and back
          Animated.sequence([
            Animated.timing(playerAttackAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(playerAttackAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          // Enemy gets hit - shiver animation (quick left-right shake) with delay
          Animated.sequence([
            Animated.delay(100), 
            Animated.timing(enemyHitAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
            Animated.timing(enemyHitAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
            Animated.timing(enemyHitAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
            Animated.timing(enemyHitAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
            Animated.timing(enemyHitAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
            Animated.timing(enemyHitAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
          ]).start();
          takeDamage(10, "enemy");
        } else {
          // Enemy wins - enemy attacks player
          // Play tackle sound
          tackleSound.seekTo(0);
          tackleSound.play();
          // Animate enemy pushing forward (left) and back
          Animated.sequence([
            Animated.timing(enemyAttackAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(enemyAttackAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          // Player gets hit - shiver animation (quick left-right shake) with delay
          Animated.sequence([
            Animated.delay(100),
            Animated.timing(playerHitAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
            Animated.timing(playerHitAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
            Animated.timing(playerHitAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
            Animated.timing(playerHitAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
            Animated.timing(playerHitAnim, { toValue: 1, duration: 30, useNativeDriver: true }),
            Animated.timing(playerHitAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
          ]).start();
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
        <View style={{ backgroundColor: "#017AFF", width:'100%', height:'100%', borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
          <FontAwesome5 name="magic" size={35} color="white" />
        </View>
      );
    } else if (enemyMove === "paper") {
      return (
        <View style={{ backgroundColor: "red", width:'100%', height:'100%', borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
          <FontAwesome5 name="fist-raised" size={35} color="white" />
        </View>
      );
    } else if (enemyMove === "scissors") {
      return (
        <View style={{ backgroundColor: "green", width:'100%', height:'100%', borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
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
    setSelectedMove(move);         
    combatLogic(move);              
    setTimeout(() => {
      setSelectedMove(null);        
    }, 3000); 
  }

  return (
    <>
    <ImageBackground 
        source={require('../companionImages/backgrounds/meadow.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={3}
      >
        {/* AP Display - Top Right */}
        <View style={styles.apContainer}>
          <Ionicons name="flash" size={16} color="#F59E0B" />
          <Text style={styles.apText}>{ap}</Text>
        </View>

        {/* Not Enough AP Warning */}
        {showNoAPWarning && (
          <View style={styles.noAPWarning}>
            <Ionicons name="warning" size={16} color="#FFFFFF" />
            <Text style={styles.noAPWarningText}>Not enough AP!</Text>
          </View>
        )}
        <View style={styles.dimOverlay} />
        
        <View style={styles.container}>
          <View style={styles.enemyDescription}>
            <Image source={require('../companionImages/Wearywise.png')} style={styles.companionPortraitStyle} />
            <Text style={styles.title}>Wearywise</Text>
            <Text style={styles.title}>Level: 20</Text>
          </View>

          <View style={styles.whiteBox}>
            <Text style={styles.subtitle}>Select Team</Text>
            <View style={styles.selectTeamContainer}>
              {[0, 1, 2].map((index) => {
                const companionId = teamMembers[index];
                const companion = companionId ? creatures.find(c => c.id === companionId) : null;
                
                return (
                  <Pressable 
                    key={index}
                    style={styles.teamButton} 
                    onPress={() => {
                      setSelectedTeamSlot(index);
                      setTeamModalVisible(true);
                    }}
                  >
                    {companion ? (
                      <Image 
                        source={getCompanionImage(companion.image)} 
                        style={styles.teamCompanionImage}
      resizeMode="contain"
                      />
                    ) : (
                      <Ionicons name="add" size={35} color="#888888" />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {hasAttemptedStart && teamMembers.length === 0 && (
              <Text style={styles.warningText}>Please select atleast one companion!</Text>
            )}

            <Pressable 
              style={[
                styles.startBattleButton,
                (() => {
                  const completedDailyTasks = tasks.filter(task => 
                    task.completed && task.duration === "daily"
                  );
                  return completedDailyTasks.length < 3 ? styles.startBattleButtonDisabled : null;
                })()
              ]} 
              onPress={handleStartBattleClick}
              disabled={(() => {
                const completedDailyTasks = tasks.filter(task => 
                  task.completed && task.duration === "daily"
                );
                return completedDailyTasks.length < 3;
              })()}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={{ color: "white", fontSize: 18, fontFamily: "Afacad_700Bold" }}>Start Battle</Text>
                <MaterialCommunityIcons name="sword-cross" size={20} color="white" />
              </View>
            </Pressable>
          </View>
        </View>
        
        {/* Battle Lock Overlay */}
        {(() => {
          // Calculate today's completed tasks (daily tasks that are completed)
          const completedDailyTasks = tasks.filter(task => 
            task.completed && task.duration === "daily"
          );
          const completedCount = completedDailyTasks.length;
          const isLocked = completedCount < 10;
          
          if (isLocked) {
            return (
              <View style={styles.battleLockOverlay}>
                <View style={styles.battleLockContent}>
                  <Ionicons name="lock-closed" size={80} color="#FFFFFF" />
                  <Text style={styles.battleLockText}>
                    Complete {completedCount}/10 tasks today to unlock battle encounter
                  </Text>
                </View>
              </View>
            );
          }
          return null;
        })()}

        {/* Battle Complete Overlay - on select team screen */}
        {showBattleCompleteOverlay && (
          <View style={styles.battleCompleteOverlay}>
            <View style={styles.battleCompleteContent}>
              <Text style={styles.battleCompleteText}>
                Come back tomorrow for your next daily battle!
              </Text>
            </View>
          </View>
        )}

      </ImageBackground>

        <Modal visible={teamModalVisible} animationType="slide" transparent onRequestClose={() => {
          setTeamModalVisible(false);
          setSelectedTeamSlot(null);
        }}>
          <Pressable 
            style={styles.backdrop}
            onPress={() => {
              setTeamModalVisible(false);
              setSelectedTeamSlot(null);
            }}
          >
            <Pressable 
              style={styles.bottomSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.bottomSheetHeader}>
                <View>
                  <Text style={styles.bottomSheetTitle}>Select Your Team</Text>
                  <Text style={styles.teamCountText}>
                    {teamMembers.length} / 3 selected
                  </Text>
                </View>
                <Pressable onPress={() => {
                  setTeamModalVisible(false);
                  setSelectedTeamSlot(null);
                }} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#333" />
                </Pressable>
              </View>
              <ScrollView 
                contentContainerStyle={styles.companionSelectGrid}
                showsVerticalScrollIndicator={false}
              >
                {userCompanions.map((companion) => {
                  const isInTeam = teamMembers.includes(companion.id);
                  const isSelected = selectedTeamSlot !== null && teamMembers[selectedTeamSlot] === companion.id;
                  const isDisabled = !isInTeam && teamMembers.length >= 3 && selectedTeamSlot === null;
                  
                  return (
                    <Pressable
                      key={companion.id}
                      style={[
                        styles.companionProfileCircle,
                        isInTeam && styles.companionProfileCircleSelected,
                        isSelected && styles.companionProfileCircleActive,
                        isDisabled && styles.companionProfileCircleDisabled
                      ]}
                      disabled={isDisabled}
                      onPress={() => {
                        if (selectedTeamSlot !== null) {
                          // If a slot is selected, replace that slot
                          const currentCompanionInSlot = teamMembers[selectedTeamSlot];
                          if (currentCompanionInSlot === companion.id) {
                            // Remove if clicking the same companion
                            setCompanionAtSlot(selectedTeamSlot, null);
                          } else {
                            // Set companion at the selected slot
                            setCompanionAtSlot(selectedTeamSlot, companion.id);
                          }
                          // Don't close modal - allow multiple selections
                          // Move to next available slot or clear selection
                          if (selectedTeamSlot < 2 && teamMembers.length < 3) {
                            // Auto-advance to next empty slot
                            const nextSlot = selectedTeamSlot + 1;
                            if (!teamMembers[nextSlot]) {
                              setSelectedTeamSlot(nextSlot);
                            } else {
                              setSelectedTeamSlot(null);
                            }
                          } else {
                            setSelectedTeamSlot(null);
                          }
                        } else {
                          // Toggle companion in/out of team (up to 3)
                          if (isInTeam) {
                            // Remove from team
                            toggleTeamMember(companion.id);
                          } else if (teamMembers.length < 3) {
                            // Add to team if under limit
                            toggleTeamMember(companion.id);
                          }
                          // Modal stays open for multiple selections
                        }
                      }}
                    >
                      <Image
                        source={getCompanionImage(companion.image)}
                        style={[
                          styles.companionProfileImage,
                          isDisabled && styles.companionProfileImageDisabled
                        ]}
                        resizeMode="contain"
                      />
                      {isInTeam && (
                        <View style={styles.teamBadge}>
                          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Flee Confirmation Modal */}
        <Modal
          visible={showFleeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFleeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are you sure you want to flee?</Text>
              <Text style={styles.modalText}>
                The enemy will regain their health, but you can try again.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setShowFleeModal(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
      </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={confirmFlee}
                >
                  <Text style={styles.modalButtonTextConfirm}>Flee</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Enemy Help Modal */}
        <Modal
          visible={showEnemyHelpModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowEnemyHelpModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Help {ENEMY_NAME} up?</Text>
              <Text style={styles.modalText}>
                Would you like to help {ENEMY_NAME}? They have a chance to become your companion.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handleDeclineHelpEnemy}
                >
                  <Text style={styles.modalButtonTextCancel}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleHelpEnemy}
                >
                  <Text style={styles.modalButtonTextConfirm}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Wearywise Welcome Modal */}
        <Modal
          visible={showWearywiseWelcomeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleWearywiseWelcomeClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Wearywise took your hand!</Text>
              <Text style={styles.modalText}>
                Welcome Wearywise to your team!
              </Text>
              <View style={[styles.modalButtons, { justifyContent: 'center' }]}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm, { flex: 0, minWidth: 120 }]}
                  onPress={handleWearywiseWelcomeClose}
                >
                  <Text style={styles.modalButtonTextConfirm}>Okay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      {/* Battle Transition Modal */}
      <Modal visible={transitionVisible} animationType="none" transparent>
        <View style={styles.transitionContainer}>
          {/* Team sliding from top in triangular formation */}
      <Animated.View 
        style={[
              styles.transitionTeamContainer,
              {
                transform: [
                  {
                    translateY: teamSlideAnim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [-400, 0, 400], 
                    }),
                  },
                  {
                    translateX: teamSlideAnim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [-200, 0, -200], 
                    }),
                  },
                ],
          },
        ]}
      >
            {teamMembers.slice(0, 3).map((companionId, index) => {
              const companion = creatures.find(c => c.id === companionId);
              if (!companion) return null;
              
              let positionStyle = {};
              if (index === 0) {
                // Top companion
                positionStyle = { position: 'absolute', top: 0, left: 40 };
              } else if (index === 1) {
                // Bottom left companion
                positionStyle = { position: 'absolute', top: 70, left: 0 };
              } else if (index === 2) {
                // Bottom right companion
                positionStyle = { position: 'absolute', top: 70, left: 80 };
              }
              
              return (
                <Image
                  key={companionId}
                  source={getCompanionImage(companion.image)}
                  style={[styles.transitionCompanionImage, positionStyle]}
                  resizeMode="contain"
                />
              );
            })}
      </Animated.View>
      
          {/* Exclamation mark in center */}
          <Animated.View
            style={[
              styles.exclamationContainer,
              {
                opacity: exclamationAnim,
                transform: [
                  {
                    scale: exclamationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.exclamationMark}>!</Text>
          </Animated.View>

          {/* Enemy sliding from bottom */}
          <Animated.View
            style={[
              styles.transitionEnemyContainer,
              {
                transform: [
                  {
                    translateY: enemySlideAnim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [400, 0, -400],
                    }),
                  },
                  {
                    translateX: enemySlideAnim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [200, 0, 200], 
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              source={require('../companionImages/Wearywise.png')}
              style={styles.transitionEnemyImage}
              resizeMode="contain"
            />
          </Animated.View>
      </View>
      </Modal>

      <Modal visible={battleModalVisible} animationType="none">
          <ImageBackground 
            source={require('../companionImages/backgrounds/b_arena_background.png')} 
            style={styles.battleContainer}
            resizeMode="cover"
          >
            <Animated.View style={[styles.battleContent, { opacity: fadeAnim }]}>
            <View style={styles.playerCompanionContainer}>
              {activeCompanionId && (() => {
                const activeCompanion = creatures.find(c => c.id === activeCompanionId);
                if (!activeCompanion) {
                  console.log('Companion not found for ID:', activeCompanionId);
                  return null;
                }
                // Ensure health is initialized
                const storedHealth = getCompanionHealth(activeCompanionId);
                const currentHealth = companionHealths[activeCompanionId] ?? storedHealth ?? activeCompanion.baseStats.health;
                const maxHealth = activeCompanion.baseStats.health;
                const healthPercentage = maxHealth > 0 ? (currentHealth / maxHealth) * 100 : 0;
                // Determine health bar color based on percentage
                let healthColor = "#4CAF50"; // Green (default, > 51%)
                if (healthPercentage <= 15) {
                  healthColor = "#F44336"; // Red (< 15%)
                } else if (healthPercentage <= 50) {
                  healthColor = "#FFC107"; // Yellow (15% - 50%)
                }
                return (
                  <>
                    <Text style={[styles.title, { color: "white", textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 }]}>{activeCompanion.name}</Text>
                    <View style={styles.healthBar}>
                      <View style={[styles.healthFill, { width: `${healthPercentage}%`, backgroundColor: healthColor }]} />
                    </View>
                    <Animated.View
                      style={{
                        transform: [
                          {
                            translateX: playerAttackAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 50], // Push forward (right) 50px
                            }),
                          },
                        ],
                      }}
                    >
                      <Animated.View
                        style={{
                          transform: [
                            {
                              translateX: playerHitAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -8], // Shiver left/right
                              }),
                            },
                          ],
                        }}
                      >
                        <View style={{ position: 'relative' }}>
                          {(() => {
                            if (!activeCompanionId || !activeCompanion) return null;
                            
                            const isDying = dyingCompanions.has(activeCompanionId);
                            const deathAnim = deathAnimations.current[activeCompanionId];
                            
                            // Only apply death animation if companion is actually dying and has animation
                            if (isDying && deathAnim) {
                              return (
                                <Animated.View
                                  style={{
                                    opacity: deathAnim.saturation,
                                    transform: [
                                      {
                                        scale: deathAnim.scale,
                                      },
                                    ],
                                  }}
                                >
                                  <Image source={getCompanionImage(activeCompanion.image)} style={styles.companionStyle} />
                                </Animated.View>
                              );
                            }
                            
                            // Normal companion - fully visible, ensure it renders
                            return (
                              <Image 
                                source={getCompanionImage(activeCompanion.image)} 
                                style={styles.companionStyle}
                                key={`companion-${activeCompanionId}`}
                              />
                            );
                          })()}
                          {/* Red pulsing overlay when health is low */}
                          {healthPercentage <= 15 && !dyingCompanions.has(activeCompanionId) && (
                            <Animated.View
                              style={[
                                styles.redPulseOverlay,
                                {
                                  opacity: redPulseAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.3, 0.7], 
                                  }),
                                },
                              ]}
                              pointerEvents="none"
                            >
                              <LinearGradient
                                colors={['transparent', 'rgba(255, 0, 0, 1)']}
                                style={styles.redPulseGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                              />
                            </Animated.View>
                          )}
                        </View>
                      </Animated.View>
                    </Animated.View>
                  </>
                );
              })()}
            </View>

            <View style={styles.enemyCompanionContainer}>
              <Text style={[styles.title, { color: "white", textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 }]}>Wearywise</Text>
              <View style={styles.healthBar}>
                {(() => {
                  // Determine enemy health bar color based on percentage
                  let enemyHealthColor = "#4CAF50"; // Green (default, > 51%)
                  if (enemyHealth <= 15) {
                    enemyHealthColor = "#F44336"; // Red (< 15%)
                  } else if (enemyHealth <= 50) {
                    enemyHealthColor = "#FFC107"; // Yellow (15% - 50%)
                  }
                  return <View style={[styles.healthFill, { width: `${enemyHealth}%`, backgroundColor: enemyHealthColor }]} />;
                })()}
              </View>
              <Animated.View
                style={{
                  transform: [
                    {
                      translateX: enemyAttackAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -50], // Push forward (left) 50px
                      }),
                    },
                  ],
                }}
              >
                <Animated.View
                  style={{
                    transform: [
                      {
                        translateX: enemyHitAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 8], // Shiver left/right
                        }),
                      },
                    ],
                  }}
                >
                  <Animated.View
                    style={{
                      opacity: enemyDying ? enemyDeathAnim.saturation : 1,
                      transform: [
                        {
                          scale: enemyDying ? enemyDeathAnim.scale : 1,
                        },
                      ],
                    }}
                  >
                    <Image source={require('../companionImages/Wearywise.png')} style={styles.enemyCompanionStyle} />
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            </View>

            {/* Exit Battle Button (center bottom when in battle) */}
            {battleStarted && (
              <Pressable style={styles.exitBattleButton} onPress={handleExitBattle}>
                <Ionicons name="chevron-down" size={40} color="white" style={styles.exitBattleChevron} />
              </Pressable>
            )}

            {/* Action Buttons (Battle, Select Creature, Items, Flee) */}
            <Animated.View style={[
              styles.actionButtonsContainer,
              {
                transform: [
                  {
                    translateY: actionButtonsSlideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 200],
                    }),
                  },
                ],
                opacity: actionButtonsSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}>
              {!battleStarted && !showCreatureSelect && (
                <>
                  <Pressable style={styles.actionButton} onPress={handleStartBattle}>
                    <MaterialCommunityIcons name="sword-cross" size={30} color="#363946" />
                    <Text style={styles.actionButtonText}>Battle</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={handleCreatureSelect}>
                    <Ionicons name="paw" size={30} color="#363946" />
                    <Text style={styles.actionButtonText}>Select Creature</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={handleItems}>
                    <Ionicons name="bag" size={30} color="#363946" />
                    <Text style={styles.actionButtonText}>Items</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={handleFlee}>
                    <Ionicons name="exit-outline" size={30} color="#363946" />
                    <Text style={styles.actionButtonText}>Flee</Text>
                  </Pressable>
                </>
              )}
            </Animated.View>

            {/* Creature Selection Box */}
            {showCreatureSelect && (
              <View style={styles.creatureSelectBox}>
                <Pressable style={styles.closeCreatureSelect} onPress={() => setShowCreatureSelect(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </Pressable>
                
                <View style={styles.creatureSelectContent}>
                  {(() => {
                    if (!activeCompanionId || teamMembers.length === 0) return null;
                    
                    // Circular rotation: rotate the team array so active creature is in the middle
                    const activeIndex = teamMembers.findIndex(id => id === activeCompanionId);
                    const totalCount = teamMembers.length;
                    const middleIndex = Math.floor(totalCount / 2);
                    
                    // Calculate how many positions to rotate to get active to middle
                    // We want: sortedCompanions[middleIndex] = teamMembers[activeIndex]
                    // To achieve this, we need to shift left by (activeIndex - middleIndex)
                    // This moves the element at activeIndex to position middleIndex
                    const shiftAmount = (activeIndex - middleIndex + totalCount) % totalCount;
                    
                    // Create rotated array (circular shift left)
                    const sortedCompanions: number[] = [];
                    for (let i = 0; i < totalCount; i++) {
                      // Shift left: sourceIndex = (i + shiftAmount) % totalCount
                      const sourceIndex = (i + shiftAmount) % totalCount;
                      sortedCompanions.push(teamMembers[sourceIndex]);
                    }
                    
                    return sortedCompanions.map((companionId: number) => {
                      const companion = creatures.find(c => c.id === companionId);
                      if (!companion) return null;
                      
                      const isActive = companionId === activeCompanionId;
                      
                      return (
                        <Pressable
                          key={companionId}
                          style={[
                            styles.creatureSelectItem,
                            isActive && styles.creatureSelectItemActive,
                          ]}
                          onPress={() => handleCompanionSelect(companionId)}
                        >
            <Image 
                            source={getCompanionImage(companion.image)} 
                            style={[
                              styles.creatureSelectImage,
                              isActive ? styles.creatureSelectImageActive : styles.creatureSelectImageSmall
                            ]} 
              resizeMode="contain"
            />
                          <Text style={[
                            styles.creatureSelectName,
                            isActive && styles.creatureSelectNameActive
                          ]}>
                            {companion.name}
                          </Text>
                        </Pressable>
                      );
                    });
                  })()}
          </View>
      </View>
            )}

            {/* Battle Action Buttons */}
            {battleStarted && (
              <Animated.View style={[
                styles.battleButtonsContainer,
                {
                  transform: [
                    {
                      translateY: battleButtonsSlideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 300],
                      }),
                    },
                  ],
                },
              ]}>
                {/* Rock (Blue/Magic) - Top */}
                {selectedMove === null || selectedMove === "rock" ? (
                  <Pressable style={styles.buttonRock} onPress={() => handlePlayerMove("rock")}>
                    <BlurView intensity={20} style={styles.buttonBlur}>
                      <LinearGradient
                        colors={['#1683FF', '#0051D5', '#E657FF']}
                        style={styles.buttonGradient}
                      />
                    </BlurView>
                    <Image 
                      source={require('../barena_assets/magicicon.png')} 
                      style={[styles.buttonIcon, { tintColor: '#FFFFFF' }]}
                      resizeMode="contain"
                    />
                  </Pressable>
                ) : null}

                {/* Paper (Red/Power) - Bottom Left */}
                {selectedMove === null || selectedMove === "paper" ? (
                  <Pressable style={styles.buttonPaper} onPress={() => handlePlayerMove("paper")}>
                    <BlurView intensity={20} style={styles.buttonBlur}>
                      <LinearGradient
                        colors={['#FF2B2B', '#CC0000', '#831EFF']}
                        style={styles.buttonGradient}
                      />
                    </BlurView>
                    <Image 
                      source={require('../barena_assets/powericon.png')} 
                      style={[styles.buttonIcon, { tintColor: '#FFFFFF' }]}
                      resizeMode="contain"
                    />
                  </Pressable>
                ) : null}

                {/* Scissors (Green/Swift) - Bottom Right */}
                {selectedMove === null || selectedMove === "scissors" ? (
                  <Pressable style={styles.buttonScissors} onPress={() => handlePlayerMove("scissors")}>
                    <BlurView intensity={20} style={styles.buttonBlur}>
                      <LinearGradient
                        colors={['#5FD919', '#008800', '#FF4145']}
                        style={styles.buttonGradient}
                      />
                    </BlurView>
                    <Image 
                      source={require('../barena_assets/swifticon.png')} 
                      style={[styles.buttonIcon, { tintColor: '#FFFFFF' }]}
                      resizeMode="contain"
                    />
                  </Pressable>
                ) : null}

                {/* Arrows: Red → Blue → Green → Red */}
                {selectedMove === null && (
                  <>
                    {/* Arrow from Paper (Red) to Rock (Blue) */}
                    <View style={styles.arrowRedToBlue}>
                      <Ionicons name="arrow-down" size={30} color="white" />
                    </View>
                    
                    {/* Arrow from Rock (Blue) to Scissors (Green) */}
                    <View style={styles.arrowBlueToGreen}>
                      <Ionicons name="arrow-forward" size={30} color="white" />
                    </View>
                    
                    {/* Arrow from Scissors (Green) to Paper (Red) */}
                    <View style={styles.arrowGreenToRed}>
                      <Ionicons name="arrow-back" size={30} color="white" />
                    </View>
                  </>
                )}
              </Animated.View>
            )}
            <View style={styles.enemyMoveContainer}>
              {renderEnemyMove()}
            </View>
            </Animated.View>

            {/* Debug Button - Kill Wearywise */}
            {battleModalVisible && (
              <Pressable
                style={styles.debugButton}
                onPress={() => {
                  console.log('Debug button pressed - killing Wearywise');
                  // Set health to 0 and reset dying state
                  setEnemyDying(false);
                  setEnemyHealth(0);
                  // Start death animation after a brief delay to ensure state is updated
                  setTimeout(() => {
                    startEnemyDeathAnimation();
                  }, 50);
                }}
              >
                <Text style={styles.debugButtonText}>DEBUG: Kill Wearywise</Text>
              </Pressable>
            )}
    </ImageBackground>

        </Modal>

        {/* AP Warning Modal */}
        <Modal
          visible={showAPWarningModal}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelAPWarning}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Warning</Text>
              <Text style={styles.modalText}>
                You will spend 10 AP starting this battle. Are you sure you want to proceed?
              </Text>
              
              {/* Do not show again checkbox */}
              <Pressable 
                style={styles.checkboxContainer}
                onPress={() => setDontShowAPWarning(!dontShowAPWarning)}
              >
                <View style={[
                  styles.checkbox,
                  dontShowAPWarning && styles.checkboxChecked
                ]}>
                  {dontShowAPWarning && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Do not show me again</Text>
              </Pressable>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={cancelAPWarning}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={confirmAPWarning}
                >
                  <Text style={styles.modalButtonTextConfirm}>Proceed</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  battleContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  battleContent: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundImageStyle: {
    width: "100%",
    height: "100%",
  },
  apContainer: {
    position: "absolute",
    top: 40,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FCD34D",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  apText: {
    fontFamily: "Afacad_700Bold",
    color: "#B45309",
    fontSize: 14,
    marginLeft: 4,
  },
  noAPWarning: {
    position: "absolute",
    top: 90,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  noAPWarningText: {
    fontFamily: "Afacad_700Bold",
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 6,
  },
  tickhareContainer: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.6, // 30% of screen width - CHANGE SIZE HERE
    left: SCREEN_WIDTH * 0.01, // 10% from left - CHANGE POSITION HERE
    top: SCREEN_HEIGHT * 0.34, // 30% from top - CHANGE POSITION HERE
  },
  wearywiseContainer: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.4, // 30% of screen width - CHANGE SIZE HERE
    right: SCREEN_WIDTH * 0.15, // 10% from right - CHANGE POSITION HERE
    top: SCREEN_HEIGHT * 0.12, // 30% from top - CHANGE POSITION HERE
  },
  rpsButtonContainer: {
    position: "absolute",
    bottom: 80, // Above navbar (adjust based on navbar height)
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 2000, // Higher than creatures
    paddingHorizontal: 20,
  },
  rpsButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginHorizontal: 15,
    borderWidth: 3,
    ...(Platform.select({
      web: {
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.3)",
      } as any,
      default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
      },
    })),
    elevation: 8, // Android shadow
    overflow: "hidden", // Important for gradient to respect border radius
    position: "relative",
  },
  rpsButtonRedBorder: {
    borderColor: "#AA0000", // Dark red border
  },
  rpsButtonBlueBorder: {
    borderColor: "#0000AA", // Dark blue border
  },
  rpsButtonGreenBorder: {
    borderColor: "#00AA00", // Dark green border
  },
  rpsButtonSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  rpsButtonHigher: {
    bottom: 0, // Middle button at base level
  },
  rpsButtonLower: {
    bottom: -20, // Red and green buttons 20px lower
  },
  rpsButtonImageContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  whiteBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    marginTop: "auto",
    marginBottom: 20,
    maxHeight: "45%",
    minHeight: "35%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#333333",
  },
  subtitle: {
    fontFamily: "Afacad_600SemiBold",
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontFamily: getAfacadFont(),
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },
  battleButtonsContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRock: {
    position: "absolute",
    top: 0,
    height: 90,
    width: 90,
    borderRadius: 45,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "white",
    zIndex: 2,
  },
  buttonScissors: {
    position: "absolute",
    bottom: 0,
    right: "15%",
    height: 90,
    width: 90,
    borderRadius: 45,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "white",
    zIndex: 2,
  },
  buttonPaper: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    height: 90,
    width: 90,
    borderRadius: 45,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "white",
    zIndex: 2,
  },
  buttonBlur: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 45,
    overflow: "hidden",
    opacity: 0.65,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
    opacity: 0.9,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 17,
    left: 17,
    zIndex: 10
  },
  arrowRedToBlue: {
    position: "absolute",
    top: 90,
    left: "35%",
    transform: [{ rotate: '-135deg' }],
    zIndex: 10,
  },
  arrowBlueToGreen: {
    position: "absolute",
    bottom: 30,
    left: "46%",
    transform: [{ rotate: '180deg' }],
    zIndex: 10,
  },
  arrowGreenToRed: {
    position: "absolute",
    top: 90,
    right: "35%",
    transform: [{ rotate: '-135deg' }],
    zIndex: 10,
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

  healthBar: {
    width: "50%",
    height: 25,
    borderColor: "#FFF",
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
  redPulseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  redPulseGradient: {
    width: '100%',
    height: '100%',
  },
  enemyCompanionStyle: {
    width: 200,
    height: 230,
    alignItems: "center",
  },
  companionPortraitStyle: {
    width: 280,
    height: 320,
    marginTop: 5,
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
    zIndex: 1,
  },
  title: { 
    fontFamily: "Jaro_400Regular",
    fontSize: 20, 
    marginBottom: 10,
    color: "white",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  selectTeamContainer: {
    width: '100%',
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  teamButton: {
    backgroundColor: "#2d2d2d",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#444444",
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  teamCompanionImage: {
    width: "100%",
    height: "100%",
  },
  startBattleButton: {
    marginTop: 20,
    borderColor: "#6320EE",
    backgroundColor: "#6320EE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  startBattleButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "#666",
    borderColor: "#666",
  },
  backdrop: {
    position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderColor: "#ccc",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    paddingBottom: 20,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  bottomSheetTitle: {
    fontFamily: "Afacad_700Bold",
    fontSize: 20,
    color: "#333",
  },
  teamCountText: {
    fontFamily: getAfacadFont(),
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  companionSelectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 16,
    gap: 20,
  },
  companionProfileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    borderWidth: 3,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  companionProfileCircleSelected: {
    borderColor: "#4CAF50",
    borderWidth: 4,
  },
  companionProfileCircleActive: {
    borderColor: "#2196F3",
    borderWidth: 4,
    backgroundColor: "#E3F2FD",
  },
  companionProfileCircleDisabled: {
    opacity: 0.5,
    borderColor: "#CCCCCC",
  },
  companionProfileImage: {
    width: "100%",
    height: "100%",
  },
  companionProfileImageDisabled: {
    opacity: 0.5,
  },
  teamBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
  },
  transitionContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transitionTeamContainer: {
    position: 'absolute',
    left: 50,
    width: 160,
    height: 150,
  },
  transitionCompanionImage: {
    width: 80,
    height: 80,
  },
  transitionEnemyContainer: {
    position: 'absolute',
    right: 50,
    alignItems: 'center',
  },
  transitionEnemyImage: {
    width: 120,
    height: 120,
  },
  exclamationContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exclamationMark: {
    fontFamily: "Afacad_700Bold",
    fontSize: 120,
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  warningText: {
    fontFamily: "Afacad_500Medium",
    color: '#ff4444',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: '#93E1D8',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 80,
  },
  exitBattleChevron: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    shadowColor: 'rgba(0, 0, 0, 0.75)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },
  exitBattleButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: "Afacad_700Bold",
    color: '#363946',
    fontSize: 16,
    marginTop: 5,
  },
  creatureSelectBox: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#454851',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0,
    borderColor: '#fff',
    minHeight: 180,
  },
  closeCreatureSelect: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#6320EE',
    borderRadius: 15,
    padding: 8,
  },
  creatureSelectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
    width: '100%',
  },
  creatureSelectItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatureSelectItemActive: {
    zIndex: 2,
  },
  creatureSelectImage: {
    width: 120,
    height: 120,
  },
  creatureSelectImageActive: {
    width: 150,
    height: 150,
  },
  creatureSelectImageSmall: {
    width: 80,
    height: 80,
    opacity: 0.7,
  },
  creatureSelectName: {
    fontFamily: "Jaro_400Regular",
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    textAlign: 'center',
  },
  creatureSelectNameActive: {
    fontFamily: "Jaro_400Regular",
    fontSize: 18,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#454851",
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
  modalTitle: {
    fontFamily: "Afacad_700Bold",
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
    color: "#FFF",
  },
  modalText: {
    fontFamily: getAfacadFont(),
    fontSize: 16,
    color: "#FFF",
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
    backgroundColor: "#6320EE",
  },
  modalButtonTextCancel: {
    fontFamily: "Afacad_600SemiBold",
    fontSize: 16,
    color: "#333",
  },
  modalButtonTextConfirm: {
    fontFamily: "Afacad_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  battleLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  battleLockContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  battleLockText: {
    fontFamily: "Afacad_600SemiBold",
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  battleCompleteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#363946',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    elevation: 10000,
  },
  battleCompleteContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  battleCompleteText: {
    fontFamily: "Afacad_700Bold",
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  debugButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
    zIndex: 10001,
    elevation: 10001,
  },
  debugButtonText: {
    fontFamily: "Afacad_700Bold",
    fontSize: 12,
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#6320EE',
    borderColor: '#6320EE',
  },
  checkboxLabel: {
    fontFamily: getAfacadFont(),
    fontSize: 14,
    color: '#FFF',
  },
});
