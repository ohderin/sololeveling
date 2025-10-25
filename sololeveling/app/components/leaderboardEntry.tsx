import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoBoxProps {
  text: string;           // text content
  width?: number | string; // optional width (e.g. 200 or '80%')
  height?: number;        // optional height (default auto)
  backgroundColor?: string; // optional color
}

const InfoBox: React.FC<InfoBoxProps> = ({
  text,
}) => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '5%',
    borderRadius: 6,
    marginVertical: 8,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  text: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default InfoBox;
