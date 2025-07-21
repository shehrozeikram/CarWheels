import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const ErrorModal = ({ 
  visible, 
  onClose, 
  title = 'Error', 
  message = 'Something went wrong. Please try again.',
  icon = '❌',
  action = 'try_again',
  actionText = 'Try Again',
  showCancel = false,
  cancelText = 'Cancel'
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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

      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      shakeAnim.setValue(0);
    }
  }, [visible]);

  const getActionButtonText = () => {
    switch (action) {
      case 'try_again':
        return 'Try Again';
      case 'ok':
        return 'OK';
      case 'close':
        return 'Close';
      case 'retry':
        return 'Retry';
      case 'dismiss':
        return 'Dismiss';
      default:
        return actionText || 'Try Again';
    }
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
          onPress={showCancel ? onClose : undefined}
        />
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                {
                  translateX: shakeAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-10, 10],
                  }),
                },
              ],
            }
          ]}
        >
          {/* Error Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>
              {message}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{getActionButtonText()}</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ef4444',
  },
  iconText: {
    fontSize: 40,
  },
  content: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ErrorModal; 