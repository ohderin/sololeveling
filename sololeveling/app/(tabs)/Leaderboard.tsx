import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoBox from "../components/leaderboardEntry";
import ProfileModal from "../components/ProfileModal";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Leaderboard() {
    const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('alltime');
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<{name: string, tasks: number, rank: number} | null>(null);
    const [rewardsExpanded, setRewardsExpanded] = useState(true);

    // Monthly Reward Theme System
    const monthlyRewards = {
        theme: "🎃 Halloween Spooktacular",
        description: "Trick or treat for spooky rewards this month!",
        tiers: [
            {
                rank: "1st Place",
                threshold: 1,
                reward: "👻 Ghost King Crown",
                rewardDescription: "Ethereal crown for the supreme spook",
                color: "#8B0000"
            },
            {
                rank: "Top 3",
                threshold: 3,
                reward: "🦇 Vampire Bat Wings",
                rewardDescription: "Dark wings for the night's elite",
                color: "#4B0082"
            },
            {
                rank: "Top 10",
                threshold: 10,
                reward: "🎭 Phantom Mask",
                rewardDescription: "Mysterious mask for the shadows",
                color: "#FF4500"
            },
            {
                rank: "Top 50",
                threshold: 50,
                reward: "🕷️ Spider Web Badge",
                rewardDescription: "Web-spinning badge for the crafty",
                color: "#2F4F4F"
            },
            {
                rank: "Top 100",
                threshold: 100,
                reward: "🍭 Candy Corn Emblem",
                rewardDescription: "Sweet treat emblem for participants",
                color: "#FF8C00"
            }
        ]
    };

    // Weekly leaderboard 
    const weeklyNames = [
        "Ethan 8 points",
        "Sophie 7 points",
        "Mason 6 points",
        "Jasmine 5 points",
        "Isaac 4 points",
        "Gavin 3 points",
        "Bella 3 points",
        "Xander 2 points",
        "Victor 2 points",
        "Diana 2 points",
        "Fiona 2 points",
        "Paige 1 points",
        "Tyler 1 points",
        "Nina 1 points",
        "Aaron 1 points",
        "Kevin 1 points",
        "Lila 1 points",
        "User 1 points",
        "Owen 0 points",
        "Hannah 0 points",
        "Ryan 0 points",
        "Quinn 0 points",
        "Wendy 0 points",
        "Yara 0 points",
        "Carlos 0 points",
        "Uma 0 points"
    ];

    // Monthly leaderboard 
    const monthlyNames = [
        "Aaron 100 points",
        "User 75 points",
        "Nina 8 points",
        "Tyler 12 points",
        "Paige 18 points",
        "Fiona 22 points",
        "Diana 25 points",
        "Victor 33 points",
        "Xander 37 points",
        "Bella 41 points",
        "Gavin 44 points",
        "Isaac 48 points",
        "Mason 52 points",
        "Jasmine 55 points",
        "Sophie 58 points",
        "Kevin 60 points",
        "Lila 62 points",
        "Owen 67 points",
        "Ethan 70 points",
        "Hannah 76 points",
        "Ryan 79 points",
        "Quinn 81 points",
        "Wendy 88 points",
        "Yara 91 points",
        "Carlos 95 points",
        "Uma 99 points"
    ];

    // All time leaderboard 
    const allTimeNames = [
        "Uma 1247 points",
        "Carlos 1189 points",
        "User 1150 points",
        "Yara 1156 points",
        "Wendy 1098 points",
        "Quinn 1042 points",
        "Ryan 987 points",
        "Hannah 923 points",
        "Ethan 876 points",
        "Owen 834 points",
        "Lila 792 points",
        "Kevin 756 points",
        "Sophie 723 points",
        "Jasmine 691 points",
        "Mason 658 points",
        "Isaac 627 points",
        "Gavin 596 points",
        "Bella 567 points",
        "Xander 538 points",
        "Victor 512 points",
        "Diana 487 points",
        "Fiona 463 points",
        "Paige 441 points",
        "Tyler 420 points",
        "Nina 400 points",
        "Aaron 381 points"
    ];

    // Get the appropriate data based on selected period
    const getCurrentData = () => {
        switch (selectedPeriod) {
            case 'weekly':
                return weeklyNames;
            case 'monthly':
                return monthlyNames;
            case 'alltime':
                return allTimeNames;
            default:
                return monthlyNames;
        }
    };

    // Sort by highest to lowest points
    const sortedNames = getCurrentData().sort((a, b) => {
        const getPoints = (text: string) => {
            const parts = text.split(' ');
            return parseInt(parts[parts.length - 2]);
        };
        return getPoints(b) - getPoints(a);
    });

    // Handle profile press
    const handleProfilePress = (name: string, tasks: number, rank: number) => {
        setSelectedProfile({ name, tasks, rank });
        setProfileModalVisible(true);
    };

    const closeProfileModal = () => {
        setProfileModalVisible(false);
        setSelectedProfile(null);
    };

    // Get reward tier for a player's rank
    const getRewardTier = (rank: number) => {
        for (const tier of monthlyRewards.tiers) {
            if (rank <= tier.threshold) {
                return tier;
            }
        }
        return null; 
    };

    // Get user's rank (assuming user is "User" for demo)
    const getUserRank = () => {
        const sortedData = getCurrentData().sort((a, b) => {
            const getPoints = (text: string) => {
                const parts = text.split(' ');
                return parseInt(parts[parts.length - 2]);
            };
            return getPoints(b) - getPoints(a);
        });
        
        const userRank = sortedData.findIndex(name => name.includes('User')) + 1;
        return userRank;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ImageBackground 
                source={require('../placeholderImages/theme_background.jpg')} 
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <ScrollView 
                    contentContainerStyle={{
                alignItems: "center",
                        paddingBottom: 50,
                        paddingHorizontal: 0,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Leaderboard</Text>
                    </View>

                    {/* Transparent Spacer */}
                    <View style={styles.transparentSpacer} />

                    {/* Time Period Switch */}
                    <View style={[styles.switchContainer, { marginHorizontal: screenWidth < 400 ? 2 : 20 }]}>
                        <TouchableOpacity 
                            style={[styles.switchButton, selectedPeriod === 'weekly' && styles.switchButtonActive]}
                            onPress={() => setSelectedPeriod('weekly')}
                        >
                            <Text style={[styles.switchText, selectedPeriod === 'weekly' && styles.switchTextActive]}>
                                Weekly
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.switchButton, selectedPeriod === 'monthly' && styles.switchButtonActive]}
                            onPress={() => setSelectedPeriod('monthly')}
                        >
                            <Text style={[styles.switchText, selectedPeriod === 'monthly' && styles.switchTextActive]}>
                                Monthly
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.switchButton, selectedPeriod === 'alltime' && styles.switchButtonActive]}
                            onPress={() => setSelectedPeriod('alltime')}
                        >
                            <Text style={[styles.switchText, selectedPeriod === 'alltime' && styles.switchTextActive]}>
                                All Time
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Monthly Rewards Section */}
                    {selectedPeriod === 'monthly' && (
                        <View style={[styles.rewardsContainer, { marginHorizontal: screenWidth < 400 ? 2 : 20 }]}>
                            <TouchableOpacity 
                                style={styles.rewardsHeader}
                                onPress={() => setRewardsExpanded(!rewardsExpanded)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.rewardsHeaderContent}>
                                    <Text style={styles.rewardsTheme}>{monthlyRewards.theme}</Text>
                                    <Text style={styles.rewardsDescription}>{monthlyRewards.description}</Text>
                                </View>
                                <Text style={styles.expandIcon}>
                                    {rewardsExpanded ? '▼' : '▶'}
                                </Text>
                            </TouchableOpacity>
                            
                            {rewardsExpanded && (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rewardsScroll}>
                                    {monthlyRewards.tiers.map((tier, index) => (
                                        <View key={index} style={[styles.rewardTier, { borderColor: tier.color }]}>
                                            <Text style={[styles.tierRank, { color: tier.color }]}>{tier.rank}</Text>
                                            <Text style={styles.tierReward}>{tier.reward}</Text>
                                            <Text style={styles.tierDescription}>{tier.rewardDescription}</Text>
                                        </View>
                ))}
            </ScrollView>
                            )}
                        </View>
                    )}

                    {/* Your Rank Section */}
                    <View style={styles.yourRankContainer}>
                        <View style={styles.yourRankHeader}>
                            <Text style={styles.yourRankTitle}>👤 Your Performance</Text>
                            <View style={styles.yourRankBadge}>
                                <Text style={styles.yourRankBadgeText}>#{getUserRank()}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.yourRankStats}>
                            <View style={styles.yourRankStatItem}>
                                <Text style={styles.yourRankStatIcon}>📊</Text>
                                <View style={styles.yourRankStatContent}>
                                    <Text style={styles.yourRankStatValue}>
                                        {selectedPeriod === 'weekly' ? '1' : 
                                         selectedPeriod === 'monthly' ? '75' : '1150'}
                                    </Text>
                                    <Text style={styles.yourRankStatLabel}>Tasks Completed</Text>
                                </View>
                            </View>
                            
                            <View style={styles.yourRankStatItem}>
                                <Text style={styles.yourRankStatIcon}>🏆</Text>
                                <View style={styles.yourRankStatContent}>
                                    <Text style={styles.yourRankStatValue}>
                                        {getUserRank() <= 3 ? 'Top 3' : 
                                         getUserRank() <= 10 ? 'Top 10' : 
                                         getUserRank() <= 50 ? 'Top 50' : 'Rising'}
                                    </Text>
                                    <Text style={styles.yourRankStatLabel}>Performance Tier</Text>
                                </View>
                            </View>
                        </View>

                        {selectedPeriod === 'monthly' && getRewardTier(getUserRank()) && (
                            <View style={styles.yourRewardSection}>
                                <Text style={styles.yourRewardTitle}>Your Reward</Text>
                                <View style={styles.yourRewardCard}>
                                    <Text style={[styles.yourRewardEmoji, { color: getRewardTier(getUserRank())?.color }]}>
                                        {getRewardTier(getUserRank())?.reward}
                                    </Text>
                                    <Text style={styles.yourRewardDescription}>
                                        {getRewardTier(getUserRank())?.rewardDescription}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Leaderboard Content Container */}
                    <View style={[styles.leaderboardContentContainer, { marginHorizontal: screenWidth < 400 ? 2 : 20 }]}>
                        {/* Top 3 Podium */}
                        <View style={styles.podiumContainer}>
                            <Text style={styles.podiumTitle}>Top Performers</Text>
                            
                            {/* Podium Layout */}
                            <View style={styles.podiumLayout}>
                                {/* 2nd Place */}
                                <View style={styles.podiumSide}>
                                    <View style={styles.podiumRankContainerSilver}>
                                        <Text style={styles.rankNumber}>2</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.podiumEntrySilver}
                                        onPress={() => {
                                            const name = sortedNames[1] ? sortedNames[1].split(' ')[0] : '';
                                            const tasks = sortedNames[1] ? parseInt(sortedNames[1].split(' ')[1]) : 0;
                                            handleProfilePress(name, tasks, 2);
                                        }}
                                    >
                                        <Image 
                                            source={require('../placeholderImages/default_profile.png')} 
                                            style={styles.podiumImage} 
                                        />
                                        <Text style={styles.podiumName}>{sortedNames[1] ? sortedNames[1].split(' ')[0] : ''}</Text>
                                        <Text style={styles.podiumTasks}>{sortedNames[1] ? sortedNames[1].split(' ')[1] + ' tasks' : ''}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* 1st Place - Center */}
                                <View style={styles.podiumCenter}>
                                    <View style={styles.podiumRankContainerGold}>
                                        <Text style={styles.rankNumber}>1</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.podiumEntryCenter}
                                        onPress={() => {
                                            const name = sortedNames[0] ? sortedNames[0].split(' ')[0] : '';
                                            const tasks = sortedNames[0] ? parseInt(sortedNames[0].split(' ')[1]) : 0;
                                            handleProfilePress(name, tasks, 1);
                                        }}
                                    >
                                        <Image 
                                            source={require('../placeholderImages/default_profile.png')} 
                                            style={styles.podiumImageCenter} 
                                        />
                                        <Text style={styles.podiumNameCenter}>{sortedNames[0] ? sortedNames[0].split(' ')[0] : ''}</Text>
                                        <Text style={styles.podiumTasksCenter}>{sortedNames[0] ? sortedNames[0].split(' ')[1] + ' tasks' : ''}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* 3rd Place */}
                                <View style={styles.podiumSide}>
                                    <View style={styles.podiumRankContainerBronze}>
                                        <Text style={styles.rankNumber}>3</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.podiumEntryBronze}
                                        onPress={() => {
                                            const name = sortedNames[2] ? sortedNames[2].split(' ')[0] : '';
                                            const tasks = sortedNames[2] ? parseInt(sortedNames[2].split(' ')[1]) : 0;
                                            handleProfilePress(name, tasks, 3);
                                        }}
                                    >
                                        <Image 
                                            source={require('../placeholderImages/default_profile.png')} 
                                            style={styles.podiumImage} 
                                        />
                                        <Text style={styles.podiumName}>{sortedNames[2] ? sortedNames[2].split(' ')[0] : ''}</Text>
                                        <Text style={styles.podiumTasks}>{sortedNames[2] ? sortedNames[2].split(' ')[1] + ' tasks' : ''}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Rest of Leaderboard */}
                        <View style={styles.leaderboardContainer}>
                            <Text style={styles.leaderboardTitle}>Full Rankings</Text>
                            <ScrollView 
                                style={styles.fullRankingsScrollView}
                                showsVerticalScrollIndicator={true}
                                nestedScrollEnabled={true}
                            >
                                {sortedNames.slice(3).map((name, index) => (
                                    <View key={index + 3} style={styles.rankedEntry}>
                                        <View style={styles.rankContainer}>
                                            <Text style={styles.rankNumber}>{index + 4}</Text>
                                        </View>
                                        <InfoBox 
                                            text={name} 
                                            width="85%" 
                                            onProfilePress={() => {
                                                const playerName = name.split(' ')[0];
                                                const tasks = parseInt(name.split(' ')[1]);
                                                handleProfilePress(playerName, tasks, index + 4);
                                            }}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
        </View>
                </ScrollView>
                
                {/* Profile Modal */}
                {selectedProfile && (
                    <ProfileModal
                        visible={profileModalVisible}
                        onClose={closeProfileModal}
                        name={selectedProfile.name}
                        tasksCompleted={selectedProfile.tasks}
                        rank={selectedProfile.rank}
                        rewardTier={selectedPeriod === 'monthly' ? getRewardTier(selectedProfile.rank) : null}
                    />
                )}
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: screenWidth < 400 ? 16 : 20,
    width: '100%',
  },
  headerTitle: {
    fontSize: screenWidth < 400 ? 24 : 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  transparentSpacer: {
    height: screenWidth < 400 ? 20 : 24,
    width: '100%',
  },
  leaderboardContentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: screenWidth < 400 ? 16 : 20,
    marginBottom: screenWidth < 400 ? 15 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: screenWidth < 400 ? 8 : 12,
    marginBottom: screenWidth < 400 ? 12 : 16,
    width: screenWidth < 400 ? '95%' : '100%', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
    minHeight: screenWidth < 400 ? 40 : 50,
  },
  rewardsHeaderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  rewardsTheme: {
    fontSize: screenWidth < 400 ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: screenWidth < 400 ? 2 : 4,
    lineHeight: screenWidth < 400 ? 22 : 24,
  },
  rewardsDescription: {
    fontSize: screenWidth < 400 ? 12 : 14,
    color: '#666',
    textAlign: 'center',
  },
  rewardsScroll: {
    marginTop: 8,
  },
  rewardTier: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: screenWidth < 400 ? 8 : 12,
    marginRight: screenWidth < 400 ? 8 : 12,
    minWidth: screenWidth < 400 ? 100 : 120,
    borderWidth: 2,
    alignItems: 'center',
  },
  tierRank: {
    fontSize: screenWidth < 400 ? 10 : 12,
    fontWeight: 'bold',
    marginBottom: screenWidth < 400 ? 2 : 4,
  },
  tierReward: {
    fontSize: screenWidth < 400 ? 10 : 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: screenWidth < 400 ? 2 : 4,
    textAlign: 'center',
  },
  tierDescription: {
    fontSize: screenWidth < 400 ? 8 : 10,
    color: '#666',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  switchButtonActive: {
    backgroundColor: '#007AFF',
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  switchTextActive: {
    color: '#FFFFFF',
  },
  yourRankContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 20,
    padding: screenWidth < 400 ? 20 : 24,
    marginBottom: screenWidth < 400 ? 15 : 20,
    marginHorizontal: screenWidth < 400 ? 0 : 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  yourRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenWidth < 400 ? 16 : 20,
  },
  yourRankTitle: {
    fontSize: screenWidth < 400 ? 18 : 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  yourRankBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: screenWidth < 400 ? 12 : 16,
    paddingVertical: screenWidth < 400 ? 6 : 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  yourRankBadgeText: {
    color: '#FFFFFF',
    fontSize: screenWidth < 400 ? 14 : 16,
    fontWeight: 'bold',
  },
  yourRankStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: screenWidth < 400 ? 16 : 20,
  },
  yourRankStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    borderRadius: 12,
    padding: screenWidth < 400 ? 12 : 16,
    marginHorizontal: screenWidth < 400 ? 2 : 4,
  },
  yourRankStatIcon: {
    fontSize: screenWidth < 400 ? 20 : 24,
    marginRight: screenWidth < 400 ? 8 : 12,
  },
  yourRankStatContent: {
    flex: 1,
  },
  yourRankStatValue: {
    fontSize: screenWidth < 400 ? 16 : 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  yourRankStatLabel: {
    fontSize: screenWidth < 400 ? 11 : 12,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  yourRewardSection: {
    backgroundColor: 'rgba(60, 60, 60, 0.8)',
    borderRadius: 16,
    padding: screenWidth < 400 ? 16 : 20,
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  yourRewardTitle: {
    fontSize: screenWidth < 400 ? 16 : 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: screenWidth < 400 ? 12 : 16,
  },
  yourRewardCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    borderRadius: 12,
    padding: screenWidth < 400 ? 16 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  yourRewardEmoji: {
    fontSize: screenWidth < 400 ? 24 : 26,
    marginBottom: screenWidth < 400 ? 8 : 12,
  },
  yourRewardDescription: {
    fontSize: screenWidth < 400 ? 12 : 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: screenWidth < 400 ? 16 : 20,
  },
  podiumContainer: {
    width: '100%',
    marginBottom: 20,
  },
  podiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  podiumLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: screenWidth < 400 ? 10 : 20,
    width: '100%',
  },
  podiumSide: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  podiumCenter: {
    alignItems: 'center',
    flex: 1.2,
    justifyContent: 'flex-start',
  },
  podiumEntry: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    width: '90%',
    borderWidth: 2,
    borderColor: '#C0C0C0',
  },
  podiumEntrySilver: {
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: screenWidth < 400 ? 8 : 12,
    marginTop: 8,
    width: screenWidth < 400 ? '95%' : '90%',
    borderWidth: 2,
    borderColor: '#C0C0C0',
  },
  podiumEntryBronze: {
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: screenWidth < 400 ? 8 : 12,
    marginTop: 8,
    width: screenWidth < 400 ? '95%' : '90%',
    borderWidth: 2,
    borderColor: '#CD7F32',
  },
  podiumEntryCenter: {
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    borderRadius: 16,
    padding: screenWidth < 400 ? 12 : 16,
    marginTop: 8,
    width: screenWidth < 400 ? '95%' : '90%',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  podiumImage: {
    width: screenWidth < 400 ? 40 : 50,
    height: screenWidth < 400 ? 40 : 50,
    borderRadius: screenWidth < 400 ? 20 : 25,
    marginBottom: 8,
  },
  podiumImageCenter: {
    width: screenWidth < 400 ? 60 : 70,
    height: screenWidth < 400 ? 60 : 70,
    borderRadius: screenWidth < 400 ? 30 : 35,
    marginBottom: 10,
  },
  podiumName: {
    fontSize: screenWidth < 400 ? 12 : 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumNameCenter: {
    fontSize: screenWidth < 400 ? 14 : 16,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumTasks: {
    fontSize: screenWidth < 400 ? 10 : 12,
    color: '#666666',
    textAlign: 'center',
  },
  podiumTasksCenter: {
    fontSize: screenWidth < 400 ? 11 : 14,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '600',
  },
  leaderboardContainer: {
    width: '100%',
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  fullRankingsScrollView: {
    maxHeight: screenHeight * 0.35, 
    marginTop: 8,
  },
  rankedEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  podiumRankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  podiumRankContainerGold: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  podiumRankContainerSilver: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  podiumRankContainerBronze: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#CD7F32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
