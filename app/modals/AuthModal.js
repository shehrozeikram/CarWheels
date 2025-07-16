import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const AuthModal = ({ visible, onClose, onSignIn, onSignUp, action = 'sell', navigation }) => {
  const getActionMessage = () => {
    switch (action) {
      case 'sell':
        return 'Sell Your Car';
      case 'contact_seller':
        return 'Contact Seller';
      case 'create_ad':
        return 'Create Ad';
      case 'manage_ads':
        return 'Manage Ads';
      default:
        return 'Continue';
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'sell':
        return 'Sign in to list your car and reach thousands of potential buyers';
      case 'contact_seller':
        return 'Sign in to contact sellers and get more details about cars';
      case 'create_ad':
        return 'Sign in to create and manage your car advertisements';
      case 'manage_ads':
        return 'Sign in to view and manage your existing advertisements';
      default:
        return 'Sign in to access all features and continue your journey';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header with close button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Icon and Title */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.icon}>🔐</Text>
              </View>
            </View>

            <Text style={styles.title}>Authentication Required</Text>
            <Text style={styles.subtitle}>{getActionMessage()}</Text>
            
            <Text style={styles.description}>
              {getActionDescription()}
            </Text>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✅</Text>
                <Text style={styles.benefitText}>Secure & Private</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🚀</Text>
                <Text style={styles.benefitText}>Quick Setup</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🛡️</Text>
                <Text style={styles.benefitText}>Verified Users</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => {
                onClose();
                if (navigation) {
                  navigation.navigate('SignInScreen', { action });
                } else {
                  onSignIn();
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
              <Text style={styles.signInButtonSubtext}>Already have an account?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => {
                onClose();
                if (navigation) {
                  navigation.navigate('SignUpScreen', { action });
                } else {
                  onSignUp();
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
              <Text style={styles.signUpButtonSubtext}>New to CarWheels?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={onClose}
              activeOpacity={0.6}
            >
              <Text style={styles.skipButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.footerLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>
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
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: width - 40,
    maxWidth: 400,
    maxHeight: height * 0.85,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: 16,
    paddingRight: 16,
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
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#193A7A',
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#193A7A',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  benefitText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  signInButton: {
    backgroundColor: '#193A7A',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#193A7A',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  signInButtonSubtext: {
    color: '#dbeafe',
    fontSize: 13,
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#193A7A',
  },
  signUpButtonText: {
    color: '#193A7A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  signUpButtonSubtext: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#193A7A',
    fontWeight: '600',
  },
});

export default AuthModal; 