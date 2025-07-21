import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

const HorizontalScrollSection = ({ 
  children, 
  style = {},
  contentContainerStyle = {},
  showsHorizontalScrollIndicator = false
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      style={[styles.scrollView, style]}
    >
      <View style={[styles.cardRow, { direction: 'ltr' }]}>
        {children}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    direction: 'ltr',
  },
  contentContainer: {
    direction: 'ltr',
  },
  cardRow: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 10,
    direction: 'ltr',
  },
});

export default HorizontalScrollSection; 