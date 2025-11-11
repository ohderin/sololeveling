import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Pressable } from "react-native";
import { addTask } from "../lib/taskStore";

export default function CreateTask() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [duration, setDuration] = useState<"daily" | "weekly">("daily");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("high");

    const submit = () => {
        addTask({ 
            id: Date.now().toString(), 
            name: name.trim() || "(no title)", 
            desc: desc.trim() || undefined, 
            createdAt: new Date().toISOString(),
            duration,
            priority
        });
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Tasks</Text>
            
            <Text style={styles.label}>Task Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter Task Name"
                style={styles.input}
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
                value={desc}
                onChangeText={setDesc}
                placeholder="Enter Task Description"
                multiline
                style={[styles.input, styles.textArea]}
            />
            
            <Text style={styles.label}>Task Duration</Text>
            <View style={styles.radioGroup}>
                <Pressable style={styles.radioOption} onPress={() => setDuration("daily")}>
                    <View style={styles.radioCircle}>
                        {duration === "daily" && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={styles.radioLabel}>Daily</Text>
                </Pressable>
                <Pressable style={styles.radioOption} onPress={() => setDuration("weekly")}>
                    <View style={styles.radioCircle}>
                        {duration === "weekly" && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={styles.radioLabel}>Weekly</Text>
                </Pressable>
            </View>
            
            <Text style={styles.label}>Priority</Text>
            <View style={styles.segmentedControl}>
                <Pressable 
                    style={[styles.segment, priority === "low" && styles.segmentActive]} 
                    onPress={() => setPriority("low")}
                >
                    <Text style={[styles.segmentText, priority === "low" && styles.segmentTextActive]}>Low</Text>
                </Pressable>
                <Pressable 
                    style={[styles.segment, priority === "medium" && styles.segmentActive]} 
                    onPress={() => setPriority("medium")}
                >
                    <Text style={[styles.segmentText, priority === "medium" && styles.segmentTextActive]}>Medium</Text>
                </Pressable>
                <Pressable 
                    style={[styles.segment, priority === "high" && styles.segmentActive]} 
                    onPress={() => setPriority("high")}
                >
                    <Text style={[styles.segmentText, priority === "high" && styles.segmentTextActive]}>High</Text>
                </Pressable>
            </View>
            
            <TouchableOpacity style={styles.addButton} onPress={submit}>
                <Text style={styles.addButtonText}>Add Task</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000000",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  radioLabel: {
    fontSize: 16,
    color: "#000000",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 4,
    marginTop: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: "#007AFF",
  },
  segmentText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 32,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
