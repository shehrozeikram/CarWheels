import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

const SearchBar = ({ 
  placeholder = "Search...",
  value = '',
  onChangeText,
  onPress,
  locationText = "All Cities",
  editable = true,
  style = {},
  containerStyle = {}
}) => {
  return (
    <View style={[styles.searchBarContainer, containerStyle]}>
      <TouchableOpacity
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 10 }}
        activeOpacity={0.7}
        onPress={onPress}
      />
      <TextInput
        style={[styles.searchInput, style]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        pointerEvents="none"
        textAlign="left"
        textAlignVertical="center"
        writingDirection="ltr"
      />
      <TouchableOpacity style={styles.cityFilter} pointerEvents="none">
        <Text style={styles.cityFilterText}>| {locationText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 2,
    direction: 'ltr',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
  },
  cityFilter: {
    paddingLeft: 8,
  },
  cityFilterText: {
    color: '#888',
    fontSize: 15,
  },
});

export default SearchBar; 