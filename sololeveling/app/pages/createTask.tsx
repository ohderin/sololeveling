import { router, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { addTask } from "../lib/taskStore";


export default function CreateTask() {


    const router = useRouter();
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const submit = () => {
        addTask({ id: Date.now().toString(), name: name.trim() || "(no title)", desc: desc.trim() || undefined, createdAt: new Date().toISOString() });
        router.back();
    };


    return (
        <View style={styles.container}>
        <Text style={styles.subtitle}>Create a New Task</Text>
        <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Task Name"
            style={{
            height: 40, borderColor: 'gray', borderWidth: 1, width: '100%', marginTop: 20, paddingHorizontal: 10
            }}
        />
        <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Task Description"
            style={{
            height: 40, borderColor: 'gray', borderWidth: 1, width: '100%', marginTop: 20, paddingHorizontal: 10
            }}
        />
        <Button title="Submit" onPress={submit} />

        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
});
