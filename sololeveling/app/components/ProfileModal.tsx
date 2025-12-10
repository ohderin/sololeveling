import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { ProfilePicture } from '../utils/profilePicture';
import { defaultTextStyle, getAfacadFont } from '../utils/defaultTextStyle';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  tasksCompleted: number;
  rank: number;
  rewardTier?: {
    rank: string;
    threshold: number;
    reward: string;
    rewardDescription: string;
    color: string;
  } | null;
}

const { height: screenHeight } = Dimensions.get('window');

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  name,
  tasksCompleted,
  rank,
  rewardTier,
}) => {
  const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,        
        friction: 12,       
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 400,      
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 400,       
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />
          
          {/* Profile content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.profileHeader}>
              <ProfilePicture name={name} size={80} />
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileRank}>Rank #{rank}</Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{tasksCompleted}</Text>
                <Text style={styles.statLabel}>Tasks Completed</Text>
              </View>
              
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{rank <= 3 ? '🏆' : '⭐'}</Text>
                <Text style={styles.statLabel}>
                  {rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : rank === 3 ? 'Bronze' : 'Participant'}
                </Text>
              </View>
            </View>

            {/* Monthly Reward Section */}
            {rewardTier && (
              <View style={styles.rewardContainer}>
                <Text style={styles.sectionTitle}>🏆 Monthly Reward</Text>
                <View style={[styles.rewardBox, { borderColor: rewardTier.color }]}>
                  <Text style={[styles.rewardTitle, { color: rewardTier.color }]}>
                    {rewardTier.reward}
                  </Text>
                  <Text style={styles.rewardSubtitle}>{rewardTier.rank}</Text>
                  <Text style={styles.rewardDescription}>{rewardTier.rewardDescription}</Text>
                </View>
              </View>
            )}

            <View style={styles.achievementsContainer}>
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementText}>🎯 Completed {tasksCompleted} tasks this period</Text>
              </View>
              {tasksCompleted > 0 && (
                <View style={styles.achievementItem}>
                  <Text style={styles.achievementText}>🔥 Active participant</Text>
                </View>
              )}
              {rewardTier && (
                <View style={styles.achievementItem}>
                  <Text style={styles.achievementText}>🏆 Earned {rewardTier.rank} reward!</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#454851',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.7,
    minHeight: screenHeight * 0.4,
    borderTopWidth: 1,
    borderTopColor: '#8a8a8aff',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#8a8a8aff',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    marginBottom: 12,
  },
  profileName: {
    fontFamily: "Afacad_700Bold",
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileRank: {
    fontFamily: getAfacadFont(),
    fontSize: 16,
    color: '#CCCCCC',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(69, 72, 81, 0.95)',
    padding: 16,
    borderRadius: 12,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#8a8a8aff',
  },
  statNumber: {
    fontFamily: "Afacad_700Bold",
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: getAfacadFont(),
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  rewardContainer: {
    marginBottom: 20,
  },
  rewardBox: {
    backgroundColor: 'rgba(69, 72, 81, 0.95)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  rewardTitle: {
    fontFamily: "Afacad_700Bold",
    fontSize: 20,
    marginBottom: 4,
  },
  rewardSubtitle: {
    fontFamily: getAfacadFont(),
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  rewardDescription: {
    fontFamily: getAfacadFont(),
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  achievementsContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: "Afacad_600SemiBold",
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  achievementItem: {
    backgroundColor: 'rgba(69, 72, 81, 0.95)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#8a8a8aff',
  },
  achievementText: {
    fontFamily: getAfacadFont(),
    fontSize: 14,
    color: '#CCCCCC',
  },
});

export default ProfileModal;
