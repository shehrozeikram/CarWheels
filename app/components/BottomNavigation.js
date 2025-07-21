import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BottomNavigation = ({ 
  activeTab = 'Home',
  onHomePress,
  onAdsPress,
  onChatPress,
  onMorePress,
  onSellPress,
  style = {}
}) => {
  return (
    <View style={[styles.bottomNav, style]}>
      <TouchableOpacity 
        style={styles.bottomNavItem}
        onPress={onHomePress}
      >
        <Text style={styles.bottomNavIcon}>🏠</Text>
        <Text style={activeTab === 'Home' ? styles.bottomNavLabelActive : styles.bottomNavLabel}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.bottomNavItem}
        onPress={onAdsPress}
      >
        <Text style={styles.bottomNavIcon}>📢</Text>
        <Text style={activeTab === 'Ads' ? styles.bottomNavLabelActive : styles.bottomNavLabel}>
          My Ads
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sellNowButton} onPress={onSellPress}>
        <Text style={styles.sellNowPlus}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.bottomNavItem}
        onPress={onChatPress}
      >
        <Text style={styles.bottomNavIcon}>💬</Text>
        <Text style={activeTab === 'Chat' ? styles.bottomNavLabelActive : styles.bottomNavLabel}>
          Chat
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.bottomNavItem}
        onPress={onMorePress}
      >
        <Text style={styles.bottomNavIcon}>☰</Text>
        <Text style={activeTab === 'More' ? styles.bottomNavLabelActive : styles.bottomNavLabel}>
          More
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    height: 70, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    zIndex: 10, 
    elevation: 10,
    direction: 'ltr'
  },
  bottomNavItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  bottomNavIcon: { 
    fontSize: 24, 
    marginBottom: 2 
  },
  bottomNavLabel: { 
    fontSize: 12, 
    color: '#888' 
  },
  bottomNavLabelActive: { 
    fontSize: 12, 
    color: '#900C3F', 
    fontWeight: '700' 
  },
  sellNowButton: { 
    width: 62, 
    height: 62, 
    borderRadius: 31, 
    backgroundColor: '#900C3F', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30, 
    zIndex: 20, 
    elevation: 6, 
    shadowColor: '#900C3F', 
    shadowOpacity: 0.18, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 2 } 
  },
  sellNowPlus: { 
    color: '#fff', 
    fontSize: 36, 
    fontWeight: 'bold', 
    marginTop: -2 
  },
});

export default BottomNavigation; 