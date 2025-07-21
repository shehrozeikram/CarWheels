import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from 'react-native';

const Header = ({ 
  title, 
  onBackPress, 
  rightComponent,
  showBackButton = true,
  backgroundColor = '#900C3F',
  titleColor = '#fff',
  style = {}
}) => {
  return (
    <View style={[styles.header, { backgroundColor }, style]}>
      {showBackButton ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Image 
            source={require('../assets/images/back_arrow.png')} 
            style={[styles.backArrowImage, { tintColor: titleColor }]} 
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
      
      <Text style={[styles.headerTitle, { color: titleColor }]} numberOfLines={1}>
        {title}
      </Text>
      
      {rightComponent ? (
        rightComponent
      ) : (
        <View style={styles.backButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    direction: 'ltr',
  },
  backButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  backArrowImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
});

export default Header; 