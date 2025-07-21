import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const NotificationBanner = ({ notification, onDismiss, onPress, visible = true }) => {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible && notification) {
      // Slide in from top
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // Slide out to top
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, notification]);

  if (!visible || !notification) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.bannerContent}
        onPress={() => onPress(notification)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏷️</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={onDismiss}
        >
          <Text style={styles.dismissIcon}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fef3c7',
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
    elevation: 8,
    shadowColor: '#d97706',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 24, // Extra padding for status bar
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d97706',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});

export default NotificationBanner; 