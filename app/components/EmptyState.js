import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EmptyState = ({ 
  icon = "📭",
  title = "No items found",
  subtitle = "There are no items to display at the moment.",
  actionText,
  onActionPress,
  style = {},
  iconStyle = {},
  titleStyle = {},
  subtitleStyle = {},
  actionStyle = {}
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.icon, iconStyle]}>{icon}</Text>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      {actionText && onActionPress && (
        <TouchableOpacity style={[styles.actionButton, actionStyle]} onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#900C3F',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState; 