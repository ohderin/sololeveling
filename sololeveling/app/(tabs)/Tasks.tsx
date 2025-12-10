import { router } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { getTasks, subscribe, Task, toggleTask, getDailyCompletions, hax } from "../lib/taskStore";
import { getActionPoints, subscribeToAP } from "../lib/apStore";
import { defaultTextStyle, getAfacadFont } from "../utils/defaultTextStyle";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [ap, setAp] = useState<number>(getActionPoints());
  const [dailyCompletions, setDailyCompletions] = useState<number>(getDailyCompletions());
  const [notCompletedCollapsed, setNotCompletedCollapsed] = useState(false);
  const [completedCollapsed, setCompletedCollapsed] = useState(false);
  const dingSound = useAudioPlayer(require('../barena_assets/ding!.wav'));

  // Apply SFX volume to ding sound
  useEffect(() => {
    const updateVolume = () => {
      const { getSFXVolume } = require('../lib/soundSettingsStore');
      dingSound.volume = getSFXVolume() * 0.5; // Keep at 50% of SFX volume
    };
    updateVolume();
    const { subscribe } = require('../lib/soundSettingsStore');
    const unsubscribe = subscribe(updateVolume);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // task store listener
    const unsubTasks = subscribe(() => {
      setTasks(getTasks());
      setAp(getActionPoints());
      setDailyCompletions(getDailyCompletions());
    });
    
    // ap store listener
    const unsubAP = subscribeToAP(() => {
      setAp(getActionPoints());
    });
    
    return () => {
      unsubTasks();
      unsubAP();
    };
  }, []);

  const completedTasks = tasks.filter(t => t.completed);
  const notCompletedTasks = tasks.filter(t => !t.completed);
  const dailyGoal = 10;
  const completedCount = Math.min(dailyCompletions, dailyGoal);
  const progress = `${completedCount}/${dailyGoal}`;
  const progressPercentage = (completedCount / dailyGoal) * 100;
  const isProgressComplete = completedCount >= dailyGoal;

  const getTimeRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours} hrs` : "< 12 hrs";
  };

  return (
    <View style={styles.container}>
      <View style={styles.apContainer}>
        <Ionicons name="flash" size={16} color="#F59E0B" />
        <Text style={styles.apText}>{ap}</Text>
      </View>
      
      <View style={styles.bossTaskSection}>
        <Pressable onLongPress={hax}>
          <Text style={styles.bossTaskTitle}>Boss Battle</Text>
        </Pressable>
        <Text style={styles.bossTaskDesc}>Complete All Daily Tasks</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>Progress: {progress} Tasks Completed</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={[styles.claimButton, isProgressComplete && styles.claimButtonActive]}>
          <Text style={[styles.claimButtonText, isProgressComplete && styles.claimButtonTextActive]}>Battle!</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => setNotCompletedCollapsed(!notCompletedCollapsed)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Not Completed</Text>
          <Ionicons 
            name={notCompletedCollapsed ? "chevron-down" : "chevron-up"} 
            size={20} 
            color="#FFFFFF" 
          />
        </Pressable>
        {!notCompletedCollapsed && notCompletedTasks.length === 0 && (
          <Text style={styles.emptyText}>No incomplete tasks</Text>
        )}
        {!notCompletedCollapsed && notCompletedTasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.taskCard}
            onPress={() => {
              // Play sound when marking task as completed (same approach as blippie sound)
              dingSound.seekTo(0);
              dingSound.play();
              toggleTask(task.id);
            }}
          >
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.name}</Text>
              {task.desc && <Text style={styles.taskDescription}>{task.desc}</Text>}
              {task.deadline && (
                <View style={styles.deadlineRow}>
                  <Text style={styles.deadlineLabel}>Deadline: </Text>
                  <Text style={styles.deadlineUrgent}>{getTimeRemaining(task.deadline)}</Text>
                </View>
              )}
            </View>
            <View style={styles.taskCheckbox}>
              <Ionicons name="ellipse-outline" size={28} color="#007AFF" />
            </View>
          </TouchableOpacity>
        ))}

        <Pressable onPress={() => setCompletedCollapsed(!completedCollapsed)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed</Text>
          <Ionicons 
            name={completedCollapsed ? "chevron-down" : "chevron-up"} 
            size={20} 
            color="#FFFFFF" 
          />
        </Pressable>
        {!completedCollapsed && completedTasks.length === 0 && (
          <Text style={styles.emptyText}>No completed tasks</Text>
        )}
        {!completedCollapsed && completedTasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={[styles.taskCard, styles.completedCard]}
            onPress={() => toggleTask(task.id)}
          >
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.name}</Text>
              {task.desc && <Text style={styles.taskDescription}>{task.desc}</Text>}
            </View>
            <View style={[styles.taskCheckbox, styles.completedCheckbox]}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.bottomButton}
        onPress={() => router.push('/pages/createTask')}
      >
        <Text style={styles.bottomButtonText}>Add new task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingTop: 60,
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
    zIndex: 100,
  },
  apText: {
    fontFamily: "Afacad_700Bold",
    color: "#B45309",
    fontSize: 14,
    marginLeft: 4,
  },
  bossTaskSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 50,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginBottom: 24,
  },
  bossTaskTitle: {
    fontFamily: "Afacad_700Bold",
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
    marginBottom: 4,
  },
  bossTaskDesc: {
    fontFamily: getAfacadFont(),
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 36,
    backgroundColor: "#E0E0E0",
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontFamily: "Afacad_600SemiBold",
    color: "#000000",
    fontSize: 11,
  },
  claimButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  claimButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  claimButtonText: {
    fontFamily: "Afacad_500Medium",
    color: "#666666",
    fontSize: 14,
  },
  claimButtonTextActive: {
    fontFamily: "Afacad_600SemiBold",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: "Afacad_700Bold",
    fontSize: 18,
    color: "#000000",
  },
  emptyText: {
    fontFamily: getAfacadFont(),
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  taskCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  completedCard: {
    backgroundColor: "#E8F5E9",
    borderColor: "#A5D6A7",
  },
  taskContent: {
    flex: 1,
    paddingRight: 8,
  },
  taskTitle: {
    fontFamily: "Afacad_600SemiBold",
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
  },
  taskDescription: {
    fontFamily: getAfacadFont(),
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  deadlineLabel: {
    fontFamily: getAfacadFont(),
    fontSize: 12,
    color: "#666666",
  },
  deadlineUrgent: {
    fontFamily: "Afacad_600SemiBold",
    fontSize: 12,
    color: "#FF0000",
  },
  taskCheckbox: {
    justifyContent: "center",
    alignItems: "center",
  },
  completedCheckbox: {
  },
  bottomButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  bottomButtonText: {
    fontFamily: "Afacad_600SemiBold",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
