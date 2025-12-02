import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Button, Image, Pressable, Modal, FlatList, ScrollView } from "react-native";

export default function Account() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedColorIcon, setSelectedColorIcon] = React.useState<string | null>('checkmark-outline');
  const [pfpColor, setPfpColor] = React.useState<string | null>('#017AFF');


  return (
    <View style={styles.container}>
      <View style={styles.bannerProfileContainer}>
        <Image
          source={require('../companionImages/banner1.jpg')}
          style={{ width: '100%', height: '80%' }}
        />
        <View style={styles.profilePicture}>
          {pfpColor && (
            <View style={{ backgroundColor: pfpColor, width: '100%', height: '100%', borderRadius: 400 }} />
          )}
        </View>
      </View>
      <View style={{ height: '1%' }} />
      <Text style={styles.boldSubtitle}>Aron_is_the_best</Text>
      <Text style={styles.subtitle}>useremail@gmail.com</Text>
      <View style={{ height: '2%' }} />
      <View style={{ flexDirection: 'row', marginLeft: '5%'}}>
        <Pressable style={styles.editProfileButton} onPress={() => setModalVisible(true)}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Edit Profile</Text>
        </Pressable>
        <View style={{ width: '3%' }} />
        <Pressable style={styles.settingsButton} onPress={() => router.push('/pages/settingsPage')}>
          <Text style={{ color: '#7c7c7cff', textAlign: 'center', fontSize: 16, fontWeight: '500' }}>
            Settings
          </Text>
        </Pressable>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >

        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)} />

        <View style={styles.modalSheet}>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.colorOptions}>
              <Pressable style={{ backgroundColor: '#F78DA7', borderColor: '#D78C9E', width: 65, height: 65, borderRadius: 100, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#F78DA7')}}>
                              {selectedColor === '#F78DA7' && (
                                <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                              )}
              </Pressable>
              <Pressable style={{ backgroundColor: '#8ED1FC', borderColor: '#79B1D4', width: 65, height: 65, borderRadius: 100, borderWidth: 3, marginTop: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#8ED1FC')}}>
                              {selectedColor === '#8ED1FC' && (
                                <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                              )}
              </Pressable>
            </View>
            <View style={styles.colorOptions}>
              <Pressable style={{ backgroundColor: '#CF2E2E', borderColor: '#B93535', width: 65, height: 65, borderRadius: 100, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#CF2E2E')}}>
                            {selectedColor === '#CF2E2E' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
              <Pressable style={{ backgroundColor: '#0693E3', borderColor: '#0D81C1', width: 65, height: 65, borderRadius: 100, borderWidth: 3, marginTop: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#0693E3')}}>
                            {selectedColor === '#0693E3' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
            </View>
            <View style={styles.colorOptions}>
              <Pressable style={{ backgroundColor: '#FF6900', borderColor: '#D25701', width: 65, height: 65, borderRadius: 100, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#FF6900')}}>
                            {selectedColor === '#FF6900' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
              <Pressable style={{ backgroundColor: '#9B51E0', borderColor: '#8E52C7', width: 65, height: 65, borderRadius: 100, borderWidth: 3, marginTop: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#9B51E0')}}>
                            {selectedColor === '#9B51E0' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
            </View>
            <View style={styles.colorOptions}>
              <Pressable style={{ backgroundColor: '#FCB900', borderColor: '#DBA306', width: 65, height: 65, borderRadius: 100, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#FCB900')}}>
                            {selectedColor === '#FCB900' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
              <Pressable style={{ backgroundColor: '#EEEEEE', borderColor: '#CCCCCC', width: 65, height: 65, borderRadius: 100, borderWidth: 3, marginTop: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#EEEEEE')}}>
                            {selectedColor === '#EEEEEE' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
            </View>
            <View style={styles.colorOptions}>
              <Pressable style={{ backgroundColor: '#7BDCB5', borderColor: '#71C1A1', width: 65, height: 65, borderRadius: 100, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#7BDCB5')}}>
                            {selectedColor === '#7BDCB5' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
              <Pressable style={{ backgroundColor: '#ABB8C3', borderColor: '#8D98A1', width: 65, height: 65, borderRadius: 100, borderWidth: 3, marginTop: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#ABB8C3')}}>
                            {selectedColor === '#ABB8C3' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
            </View>
            <View style={styles.colorOptions}>
              <Pressable style={{ backgroundColor: '#00D084', borderColor: '#13B97B', width: 65, height: 65, borderRadius: 100, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#00D084')}}>
                            {selectedColor === '#00D084' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}  
              </Pressable>
              <Pressable style={{ backgroundColor: '#313131', borderColor: '#3C3C3C', width: 65, height: 65, borderRadius: 100, borderWidth: 3, marginTop: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => {setSelectedColor('#313131')}}>
                            {selectedColor === '#313131' && (
                              <Ionicons name={selectedColorIcon as any} size={32} color="white" />
                            )}
              </Pressable>
            </View>
          </ScrollView>

          <Button title="Save" onPress={() => {setModalVisible(false), setPfpColor(selectedColor)}} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  bannerProfileContainer: {
    width: '100%',
    height: '30%',
  },
  colorOptions:{
    width: 65,
    height: 150,
    marginRight: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    height: '70%',
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 400,
    backgroundColor: "#017AFF",
    borderWidth: 6,
    borderColor: "#F5F5F5",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: '0%',
    left: '5%',
  },
  boldSubtitle: {
    fontSize: 30,
    color: "Black",
    marginLeft: '5%',
    marginBottom: 5,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginLeft: '5%',
  },
  editProfileButton: {
    width: 120,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#017AFF",
    alignContent: "center",
    justifyContent: "center",
  },
  settingsButton: {
    width: 120,
    height: 40,
    borderRadius: 6,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#7c7c7cff",
    alignContent: "center",
    justifyContent: "center",
  }
});
