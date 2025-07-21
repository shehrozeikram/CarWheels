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
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ContactSellerModal = ({ 
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
    logo: require('../assets/images/badge.png')
  }
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
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

  const contactOptions = [
    {
      id: 'call',
      title: 'Call Seller',
      subtitle: 'Speak directly with the seller',
      icon: '📞',
      color: '#1275D7',
      action: () => handleAction('call')
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Send a WhatsApp message',
      icon: '📱',
      color: '#25D366',
      action: () => handleAction('whatsapp')
    },
    {
      id: 'sms',
      title: 'Send SMS',
      subtitle: 'Send a text message',
      icon: '💬',
      color: '#FF6B35',
      action: () => handleAction('sms')
    },
    {
      id: 'chat',
      title: 'In-App Chat',
      subtitle: 'Chat within the app',
      icon: '💭',
      color: '#8B5CF6',
      action: () => handleAction('chat')
    }
  ];

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
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image source={sellerInfo.logo} style={styles.sellerLogo} />
              <View style={styles.headerText}>
                <Text style={styles.sellerName}>{sellerInfo.name}</Text>
                <Text style={styles.sellerSubtitle}>Contact Seller</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Options */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Choose how you'd like to contact</Text>
            
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactOption}
                onPress={option.action}
                activeOpacity={0.8}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
                  <Text style={styles.optionIconText}>{option.icon}</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={styles.optionArrow}>
                  <Text style={styles.arrowIcon}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              All contact methods are secure and private
            </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: width - 40,
    maxWidth: 400,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  sellerSubtitle: {
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIconText: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default ContactSellerModal; 