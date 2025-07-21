import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const BackButton = ({ onPress, style = {}, tintColor = '#fff' }) => {
  return (
    <TouchableOpacity style={[styles.backButton, style]} onPress={onPress} activeOpacity={0.7}>
      <Image 
        source={require('../assets/images/back_arrow.png')} 
        style={[styles.backIcon, { tintColor }]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 22,
    height: 22,
  },
});

export default BackButton; 