import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface InfoBoxProps {
  text: string;           // text content
  width?: number | string; // optional width (e.g. 200 or '80%')
  height?: number;        // optional height (default auto)
  backgroundColor?: string; // optional color
  onProfilePress?: () => void; // callback for profile tap
}

const InfoBox: React.FC<InfoBoxProps> = ({
  text,
  width = '100%',
  onProfilePress,
}) => {
  // Parse the text to separate name and points
  // Format: "Aaron 3 points" -> name: "Aaron", points: "3"
  const parts = text.split(' ');
  const points = parts[parts.length - 2]; // Get the number (second to last part)
  const name = parts.slice(0, -2).join(' '); // Get everything except last 2 parts
  
  return (
    <View style={[styles.container, { width: width || '100%' }]}>
      <TouchableOpacity 
        style={styles.profileSection}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <Image 
          source={require('../placeholderImages/default_profile.png')} 
          style={styles.profileImage} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.taskText}>{points} tasks completed</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
    borderRadius: 6,
    marginVertical: 8,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskText: {
    color: '#666666',
    fontSize: 12,
  },
});

export default InfoBox;
