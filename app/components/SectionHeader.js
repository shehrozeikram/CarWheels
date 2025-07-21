import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SectionHeader = ({ 
  title, 
  onViewAllPress, 
  viewAllText = "View All",
  style = {},
  titleStyle = {},
  viewAllStyle = {}
}) => {
  return (
    <View style={[styles.sectionHeaderRow, style]}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      {onViewAllPress && (
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={[styles.viewAll, viewAllStyle]}>{viewAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 6,
    direction: 'ltr',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
  viewAll: {
    color: '#900C3F',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default SectionHeader; 