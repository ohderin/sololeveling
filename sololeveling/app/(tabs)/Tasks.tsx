import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTasks, subscribe, Task, toggleTask, getDailyCompletions, hax, removeTask } from "../lib/taskStore";
import { getActionPoints, subscribeToAP } from "../lib/apStore";
import { Alert } from "react-native";
import { defaultTextStyle, getAfacadFont } from "../utils/defaultTextStyle";


export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [ap, setAp] = useState<number>(getActionPoints());
  const [dailyCompletions, setDailyCompletions] = useState<number>(getDailyCompletions());
  const [notCompletedCollapsed, setNotCompletedCollapsed] = useState(false);
  const [completedCollapsed, setCompletedCollapsed] = useState(false);
  const [taskInfoModal, setTaskInfoModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  return (
    <View style={styles.safeArea}>

    <ImageBackground 
            source={require('../companionImages/backgrounds/taskbg.png')} 
            style={styles.backgroundImage}
            resizeMode="cover"
    >
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
            color="#FFF" 
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
              setTaskInfoModal(true);
              setSelectedTask(task);
            } }
          >
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.taskCheckbox}
              onPress={() => toggleTask(task.id)}
            >
              <Ionicons name="ellipse-outline" size={28} color="#007AFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <Modal
            visible={taskInfoModal && selectedTask !== null}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {setTaskInfoModal(false); setSelectedTask(null)}}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.taskModalHeader}>
                  <Text style={styles.taskModalHeaderText}>{selectedTask?.name}</Text>
                </View>
                <Text style={styles.taskModalSubHeaderText}>Description</Text>
                <Text style={styles.taskModalText}>{selectedTask?.desc}</Text>
                <Text style={styles.taskModalSubHeaderText}>Task Duration</Text>
                <Text style={styles.taskModalText}>
                  {selectedTask?.duration === "daily" ? "One day remaining"
                   : selectedTask?.duration === "weekly" ? "7 days remaining"
                   : "No deadline"
                  }
                </Text>
                <Text style={styles.taskModalSubHeaderText}>Priority Level</Text>
                <View style={styles.priorityRow}>
                  <Text style={[styles.taskModalText, styles.priorityText]}>
                    {selectedTask?.priority === "high" ? "High"
                      : selectedTask?.priority === "medium" ? "Medium"
                      : selectedTask?.priority === "low" ? "Low"
                      : "No Priority"}
                  </Text>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor:
                        selectedTask?.priority === "high" ? "#E53E3E" :
                        selectedTask?.priority === "medium" ? "#F6C23E" :
                        selectedTask?.priority === "low" ? "#5eee6fff" :
                        "#D1D5DB" }
                    ]}
                  />
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButtonDelete]}
                    onPress={() => {
                      if (!selectedTask) return;
                      Alert.alert(
                        "Delete task",
                        `Remove "${selectedTask.name}"? This cannot be undone.`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => {
                              removeTask(selectedTask.id);
                              setTaskInfoModal(false);
                              setSelectedTask(null);
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Ionicons name={"trash"} size={30} color="#FFF"/>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButtonCancel]}
                    onPress={() => {setTaskInfoModal(false); setSelectedTask(null)}}
                  >
                    <Text style={styles.modalButtonTextCancel}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        </Modal>

        <Pressable onPress={() => setCompletedCollapsed(!completedCollapsed)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed</Text>
          <Ionicons 
            name={completedCollapsed ? "chevron-down" : "chevron-up"} 
            size={20} 
            color="#FFF" 
          />
        </Pressable>
        {!completedCollapsed && completedTasks.length === 0 && (
          <Text style={styles.emptyText}>No completed tasks</Text>
        )}
        {!completedCollapsed && completedTasks.map((task) => (
          <View 
            key={task.id} 
            style={[styles.taskCard, styles.completedCard]}
          >
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.name}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.taskCheckbox, styles.completedCheckbox]}
              onPress={() => toggleTask(task.id)}
            >
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.bottomButton}
        onPress={() => router.push('/pages/createTask')}
      >
        <Text style={styles.bottomButtonText}>Add new task</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalButtonDelete: {
    backgroundColor: "#E53E3E",
    height: 50,
    width: 50,
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    position: 'absolute',
    left: 24,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: "auto",
    gap: 8,
  },
  priorityDot: {
    width: 14,
    height: 14,
    borderRadius: 14,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 18,
    color: "#FFF",
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
    backgroundColor: "#93E1D8",
    height: 50,
    width: 150,
    borderRadius: 200,
    justifyContent: 'center',
  },
  modalButtonConfirm: {
    backgroundColor: "#4CAF50",
  },
  modalButtonTextCancel: {
    fontSize: 20,
    color: "black",
    fontWeight: "500",
    alignSelf: 'center',
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
    padding: 16,
    alignItems: "center",
    width: "90%",
    height: '50%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  taskModalHeader: {
    width: '100%',
    height: 60,
    backgroundColor: "#9088eeff",
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    padding: 10,
  },
  taskModalHeaderText: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "700",
    flexShrink: 1,
  },
  taskModalSubHeaderText: {
    alignSelf: 'flex-start',
    fontSize: 18,
    color: '#B7B0FF',
    marginBottom: 8,
    marginTop: 24,
  },
  taskModalText: {
    alignSelf: 'flex-start',
    fontSize: 18,
    color: '#FFF',
    flexShrink: 1,
  },
  apContainer: {
    position: "absolute",
    top: 55,
    right: 20,
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
    color: "#B45309",
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 4,
  },
  bossTaskSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 50,
    backgroundColor: "#454851",
    borderRadius: 12,
    marginBottom: 24,
  },
  bossTaskTitle: {
    fontFamily: "Afacad_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },
  bossTaskDesc: {
    fontFamily: getAfacadFont(),
    fontSize: 16,
    color: "#DDDDDD",
    textAlign: "center",
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 36,
    backgroundColor: "#666666",
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6320EE",
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
    color: "#FFFFFF",
    fontSize: 11,
  },
  claimButton: {
    borderWidth: 0,
    borderColor: "#E0E0E0",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#8B90A0",
    alignItems: "center",
  },
  claimButtonActive: {
    backgroundColor: "#93E1D8",
    borderColor: "#93E1D8",
  },
  claimButtonText: {
    fontFamily: "Afacad_500Medium",
    color: "#666666",
    fontSize: 14,
  },
  claimButtonTextActive: {
    fontFamily: "Afacad_600SemiBold",
    color: "#666666",
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
    color: "#FFFFFF",
  },
  emptyText: {
    fontFamily: getAfacadFont(),
    color: "#dfc7f2",
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
    backgroundColor: "#93E1D8",
    paddingVertical: 14,
    paddingHorizontal: 14,
    margin: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  bottomButtonText: {
    fontFamily: "Afacad_600SemiBold",
    color: "#363946",
    fontSize: 16,
  },
});
