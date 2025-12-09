import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Button, Image, Pressable, Modal, FlatList, ScrollView } from "react-native";

export default function Account() {

  const banners: Record<string, any> = {
    banner1: require('../companionImages/banner1.jpg'),
    banner2: require('../companionImages/banner2.jpg'),
    banner3: require('../companionImages/banner3.jpg'),
    banner4: require('../companionImages/banner4.jpg'),
    banner5: require('../companionImages/banner5.jpg'),
  };

  const icons: Record<string, any> = {
    icon1: require('../companionImages/Flitterfinch.png'),
    icon2: require('../companionImages/Slumberpaw.png'),
    icon3: require('../companionImages/Tickhare.png'),
    icon4: require('../companionImages/Wearywise.png'),
  };
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedColorIcon, setSelectedColorIcon] = React.useState<string | null>('checkmark-outline');
  const [pfpColor, setPfpColor] = React.useState<string | null>('#017AFF');
  const [pfpBanner, setPfpBanner] = React.useState<string | null>(banners.banner1);

  const [pfpBannerKey, setPfpBannerKey] = React.useState<string>('banner1');
  const [selectedBannerKey, setSelectedBannerKey] = React.useState<string | null>(pfpBannerKey);

  const [pfpIconKey, setPfpIconKey] = React.useState<string>('icon1');
  const [selectedIconKey, setSelectedIconKey] = React.useState<string | null>(pfpIconKey);

  const [bio, setBio] = React.useState<string>("A solo adventurer collecting relics and achievements.");
  const [followers] = React.useState<number>(128);
  const [following] = React.useState<number>(42);
  const [level] = React.useState<number>(7);
  const [xp] = React.useState<number>(420);
  const xpGoal = 500;
  const xpPercent = Math.min(100, Math.round((xp / xpGoal) * 100));
  return (
    <View style={styles.container}>
      <View style={styles.bannerProfileContainer}>
        <Image
          source={banners[pfpBannerKey]}
          style={{ width: '100%', height: '80%' }}
        />
        <View style={styles.profilePicture}>
          {pfpColor && (
            <View style={{ backgroundColor: pfpColor, width: '100%', height: '100%', borderRadius: 400, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }} >
              <Image source={icons[pfpIconKey]} style={styles.iconImage} />
            </View>
          )}
        </View>
      </View>
      <View style={{ height: '1%' }} />
    <View style={styles.headerRow}>
        <View>
          <Text style={styles.boldSubtitle}>Aron_is_the_best</Text>
          <Text style={styles.subtitle}>useremail@gmail.com</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv {level}</Text>
        </View>
      </View>
      <View style={{ height: '2%' }} />

      <View style={{ flexDirection: 'row', marginLeft: '5%'}}>
        <Pressable style={styles.editProfileButton} onPress={() => setModalVisible(true)}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Edit Profile</Text>
        </Pressable>
        <View style={{ width: '3%' }} />
        <Pressable style={styles.settingsButton} onPress={() => router.push('/pages/settingsPage')}>
          <Text style={{ color: 'black', textAlign: 'center', fontSize: 16,}}>Settings</Text>
        </Pressable>
      </View>

      <View style={{ height: '2%' }} />

      <Text style={styles.bioText}>{bio}</Text>

      <View style={{ height: '2%' }} />

      {/* followers / following / small stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>★{Math.floor(xp/100)}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* XP bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBarBackground}>
          <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
        </View>
        <Text style={styles.xpText}>{xp}/{xpGoal} XP • {xpPercent}%</Text>
      </View>

      <Text style={{ fontSize: 18, marginLeft: 16 }}>Top Companions:</Text>


      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <FontAwesome5 name="crown" size={24} color="#FFD700"/>
      </View>

      <View style={styles.topCompanionsContainer}>
        <View style={styles.companionSmallContainer}>
          <View style={styles.innerBorder2}>
            <Image source={icons["icon2"]} style={styles.iconMiniImage} />
            <Text style={styles.iconMiniLabel}>Slumberpaw</Text>
            <Text style={styles.iconMiniStat}>Level 12</Text>
            <Text style={styles.iconMiniStat}>Battles: 221</Text>
          </View>
        </View>
        <View style={styles.companionLargeContainer}>
          <View style={styles.innerBorder1}>
            <Image source={icons["icon1"]} style={styles.iconMiniImage} />
            <Text style={styles.iconMiniLabel}>Flitterfinch</Text>
            <Text style={styles.iconMiniStat}>Level 15</Text>
            <Text style={styles.iconMiniStat}>Battles: 245</Text>
          </View>
        </View>
        <View style={styles.companionSmallContainer}>
          <View style={styles.innerBorder3}>
            <Image source={icons["icon3"]} style={styles.iconMiniImage} />
            <Text style={styles.iconMiniLabel}>Tickhare</Text>
            <Text style={styles.iconMiniStat}>Level 7</Text>
            <Text style={styles.iconMiniStat}>Battles: 101</Text>
          </View>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >

        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)} />

        <View style={styles.modalSheet}>

          <Text style={styles.modalTitle}>Color:</Text>

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

          <Text style={styles.modalTitle}>Banner:</Text>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {Object.keys(banners).map((key) => (
              <Pressable
                key={key}
                style={styles.backgroundOptions}
                onPress={() => setSelectedBannerKey(key)}
              >
                <Image source={banners[key]} style={{ width: '100%', height: '100%' }} />
                {selectedBannerKey === key && (
                  <View style={styles.checkmarkOverlay}>
                    <Ionicons name="checkmark" size={28} color="white" />
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.modalTitle}>Icon:</Text>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {Object.keys(icons).map((key) => (
              <Pressable
                key={key}
                style={styles.iconOptions}
                onPress={() => setSelectedIconKey(key)}
              >
                <Image source={icons[key]} style={styles.iconThumb} />
                {selectedIconKey === key && (
                  <View style={styles.checkmarkOverlay}>
                    <Ionicons name="checkmark" size={28} color="white" />
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>

          
          <Pressable
            style={styles.saveButton}
            onPress={() => {
              setModalVisible(false);
              if (selectedColor) setPfpColor(selectedColor);
              if (selectedBannerKey) setPfpBannerKey(selectedBannerKey);
              if (selectedIconKey) setPfpIconKey(selectedIconKey);
            }}
          >
            <Text style={{ color: "white", fontWeight: "500", fontSize: 18 }}>Save</Text>
          </Pressable>
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
    width: "100%",
    height: "30%",
  },
  topCompanionsContainer: {
    width: "92%",
    alignSelf: "center",
    height: 200,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconMiniImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    resizeMode: "contain",
  },
  iconMiniLabel: {
    fontSize: 14,
    fontWeight: "500",
    alignSelf: "center",
  },
  iconMiniStat: {
    fontSize: 12,
    fontWeight: "400",
    alignSelf: "center",
    marginTop: 5,
  },
  companionSmallContainer: {
    width: "30%",
    height: "90%",
    marginTop: 20,
    borderRadius: 20,
  },
  companionLargeContainer: {
    width: "30%",
    height: "90%",
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 20,
  },
  innerBorder1:{
    width: "100%",
    height: "100%",
    borderWidth: 4,
    borderRadius: 20,
    borderColor: "#fcc618ff",
    backgroundColor: "#fce8a7ff",
  },
  innerBorder3:{
    width: "100%",
    height: "100%",
    borderWidth: 4,
    borderRadius: 20,
    borderColor: "#cd7f32",
    backgroundColor: "#fac793ff",
  },
  innerBorder2:{
    width: "100%",
    height: "100%",
    borderWidth: 4,
    borderRadius: 20,
    borderColor: "#AAA9AD",
    backgroundColor: "#dbdbdbff",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  boldSubtitle: {
    fontSize: 28,
    color: "#000",
    marginLeft: 8,
    marginBottom: 4,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },

  levelBadge: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },

  bioText: {
    marginHorizontal: 16,
    alignSelf: "center",
    color: "#333",
    fontSize: 14,
  },

  statsRow: {
    width: "92%",
    alignSelf: "center",
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#eee",
    marginHorizontal: 8,
  },

  xpContainer: {
    width: "92%",
    alignSelf: "center",
    marginTop: 12,
  },
  xpBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#017AFF",
  },
  xpText: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },

  quickAction: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    marginTop: 6,
    fontSize: 12,
    color: "#017AFF",
    fontWeight: "600",
  },

  /* modal / selection UI */
  modalTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 12,
  },
  checkmarkOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  colorOptions: {
    width: 65,
    height: 150,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  backgroundOptions: {
    width: 125,
    height: 75,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    borderRadius: 8,
    overflow: "hidden",
  },

  iconOptions: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  iconThumb: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  // make icon larger and shift up so only the head shows
  iconImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    height: "70%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },

  /* profile picture */
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
    bottom: "0%",
    left: "5%",
    overflow: "hidden",
  },

  /* buttons */
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
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#f0f0f0",
    alignContent: "center",
    justifyContent: "center",
  },
  saveButton: {
    marginBottom: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#017AFF",
  },
});