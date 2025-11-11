import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTasks, subscribe, Task, toggleTask } from "../lib/taskStore";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [notCompletedCollapsed, setNotCompletedCollapsed] = useState(false);
  const [completedCollapsed, setCompletedCollapsed] = useState(false);

  useEffect(() => {
    const unsub = subscribe(() => setTasks(getTasks()));
    return unsub;
  }, []);

  const completedTasks = tasks.filter(t => t.completed);
  const notCompletedTasks = tasks.filter(t => !t.completed);
  const progress = `${completedTasks.length}/${tasks.length}`;
  const progressPercentage = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

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
      <Text style={styles.mainTitle}>Tasks</Text>
      
      <View style={styles.bossTaskSection}>
        <Text style={styles.bossTaskTitle}>Boss Battle</Text>
        <Text style={styles.bossTaskDesc}>Complete All Daily Tasks</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>Progress: {progress} Tasks Completed</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimButtonText}>Claim Reward!</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => setNotCompletedCollapsed(!notCompletedCollapsed)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Not Completed</Text>
          <Ionicons 
            name={notCompletedCollapsed ? "chevron-down" : "chevron-up"} 
            size={20} 
            color="#000" 
          />
        </Pressable>
        {!notCompletedCollapsed && notCompletedTasks.length === 0 && (
          <Text style={styles.emptyText}>No incomplete tasks</Text>
        )}
        {!notCompletedCollapsed && notCompletedTasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.taskCard}
            onPress={() => toggleTask(task.id)}
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
              <Ionicons name="checkmark-circle-outline" size={28} color="#007AFF" />
            </View>
          </TouchableOpacity>
        ))}

        <Pressable onPress={() => setCompletedCollapsed(!completedCollapsed)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed</Text>
          <Ionicons 
            name={completedCollapsed ? "chevron-down" : "chevron-up"} 
            size={20} 
            color="#000" 
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
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  bossTaskSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginBottom: 24,
  },
  bossTaskTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 4,
  },
  bossTaskDesc: {
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
    color: "#000000",
    fontSize: 11,
    fontWeight: "600",
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
  claimButtonText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
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
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  emptyText: {
    color: "#999999",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  taskDescription: {
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
    fontSize: 12,
    color: "#666666",
  },
  deadlineUrgent: {
    fontSize: 12,
    color: "#FF0000",
    fontWeight: "600",
  },
  taskCheckbox: {
    justifyContent: "center",
    alignItems: "center",
  },
  completedCheckbox: {
    backgroundColor: "#4CAF50",
    width: 32,
    height: 32,
    borderRadius: 16,
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
