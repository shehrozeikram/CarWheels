import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { clearAllNotifications, removeNotification } from '../utils/NotificationUtils';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(global.notifications || []);

  useEffect(() => {
    setNotifications(global.notifications || []);
  }, [global.notifications]);

  const handleNotificationPress = (notification, index) => {
    removeNotification(index);
    setNotifications(global.notifications || []);
    navigation.navigate('CarDetailScreen', { car: notification.car });
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setNotifications([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* iOS blue status bar area */}
        {Platform.OS === 'ios' && <SafeAreaView style={{ backgroundColor: '#900C3F' }} />}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/images/back_arrow.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>We'll notify you when something important happens</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item, idx) => idx.toString()}
            contentContainerStyle={styles.notificationList}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationPress(item, index)}>
                <View style={styles.notificationIcon}>
                  <Text style={styles.notificationIconText}>💰</Text>
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>New bid on your car</Text>
                  <Text style={styles.notificationDetail}>{item.car?.title || 'Car'}</Text>
                  <Text style={styles.notificationBid}>Bid: PKR {item.bidAmount?.toLocaleString() || ''} by {item.bidderName || 'Someone'}</Text>
                  <Text style={styles.notificationTime}>{item.time ? new Date(item.time).toLocaleString() : ''}</Text>
                </View>
                <View style={styles.notificationIndicator} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafd' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#900C3F',
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 24,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  backIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  clearAllButton: {
    padding: 8,
  },
  clearAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  notificationList: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  notificationItem: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#f3f4f6', 
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  notificationIconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
    paddingTop: 4,
  },
  notificationTitle: { 
    fontWeight: '700', 
    fontSize: 16, 
    color: '#222', 
    marginBottom: 4 
  },
  notificationDetail: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 4,
    fontWeight: '500',
  },
  notificationBid: { 
    fontSize: 13, 
    color: '#d97706', 
    marginBottom: 4,
    fontWeight: '600',
  },
  notificationTime: { 
    fontSize: 12, 
    color: '#888',
    fontWeight: '400',
  },
  notificationIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: { 
    fontSize: 64, 
    marginBottom: 16,
  },
  emptyTitle: { 
    color: '#222', 
    fontSize: 20, 
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: { 
    color: '#666', 
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NotificationScreen; 