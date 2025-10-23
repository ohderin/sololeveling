import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, FlatList } from "react-native";
import { getTasks, subscribe, Task } from "../lib/taskStore";


export default function Tasks() {
  
  const [tasks, setTasks] = useState<Task[]>(getTasks());

  useEffect(() => {
    const unsub = subscribe(() => setTasks(getTasks()));
    return unsub;
  }, []);
  
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
            {item.desc ? <Text>{item.desc}</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text>No tasks yet</Text>}
      />
      <Button title="Add Task" onPress={() => router.push('/pages/createTask')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
