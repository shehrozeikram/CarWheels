import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingSpinner = ({ 
  text = "Loading...",
  size = "large",
  color = "#900C3F",
  style = {},
  textStyle = {}
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[styles.loadingText, textStyle]}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoadingSpinner; 