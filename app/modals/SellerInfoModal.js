import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SellerInfoModal = ({ 
  visible, 
  onClose, 
  onCall, 
  onSMS, 
  onChat, 
  onWhatsApp,
  sellerInfo = {
    name: 'PakWheels Karachi',
    phone: '+92 300 1234567',
    email: 'karachi@pakwheels.com',
    address: 'Suit No : 303 Third Floor Tariq Centre Main Tariq Road',
    hours: '09:00 AM to 09:00 PM',
    rating: 4.8,
    totalReviews: 1247,
    verified: true,
    memberSince: '2018',
    responseTime: 'Usually responds within 2 hours',
    logo: require('../assets/images/badge.png')
  }
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      // Start animations
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      slideAnim.setValue(height);
    }
  }, [visible]);

  const handleAction = (action) => {
    onClose();
    // Small delay to allow modal to close
    setTimeout(() => {
      switch (action) {
        case 'call':
          onCall && onCall(sellerInfo.phone);
          break;
        case 'sms':
          onSMS && onSMS(sellerInfo.phone);
          break;
        case 'chat':
          onChat && onChat(sellerInfo);
          break;
        case 'whatsapp':
          onWhatsApp && onWhatsApp(sellerInfo.phone);
          break;
      }
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: opacityAnim }
        ]}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image source={sellerInfo.logo} style={styles.sellerLogo} />
              <View style={styles.headerText}>
                <Text style={styles.sellerName}>{sellerInfo.name}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>⭐ {sellerInfo.rating}</Text>
                  <Text style={styles.reviewsText}>({sellerInfo.totalReviews} reviews)</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Verified Badge */}
            {sellerInfo.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.verifiedText}>Verified Seller</Text>
              </View>
            )}

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📞</Text>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{sellerInfo.phone}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📧</Text>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{sellerInfo.email}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📍</Text>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>Address</Text>
                  <Text style={styles.contactValue}>{sellerInfo.address}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>🕒</Text>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>Business Hours</Text>
                  <Text style={styles.contactValue}>{sellerInfo.hours}</Text>
                </View>
              </View>
            </View>

            {/* Seller Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seller Information</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{sellerInfo.memberSince}</Text>
                  <Text style={styles.statLabel}>Member Since</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{sellerInfo.responseTime}</Text>
                  <Text style={styles.statLabel}>Response Time</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleAction('call')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>📞 Call Now</Text>
            </TouchableOpacity>
            
            <View style={styles.secondaryButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleAction('sms')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>💬 SMS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleAction('chat')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>💭 Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleAction('whatsapp')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>📱 WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -10 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  sellerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#16a34a',
    marginRight: 6,
    fontWeight: '700',
  },
  verifiedText: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1275D7',
    elevation: 4,
    shadowColor: '#1275D7',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#1275D7',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SellerInfoModal; 