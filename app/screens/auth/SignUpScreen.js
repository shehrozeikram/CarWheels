import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  I18nManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ErrorModal from '../../modals/ErrorModal';
import InlineError from '../../components/InlineError';
import authService from '../../services/authService';

const SignUpScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleSignUp = async () => {
    // Clear previous errors
    setFullNameError('');
    setEmailError('');
    setMobileError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validation
    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!mobile.trim()) {
      setMobileError('Mobile number is required');
      hasError = true;
    } else if (!isValidMobile(mobile)) {
      setMobileError('Please enter a valid mobile number (03XXXXXXXXX)');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy');
      setErrorModalVisible(true);
      return;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      // API call to register user using auth service
      const userData = {
        name: fullName.trim(),
        email: email.trim(),
        phone: mobile.trim(),
        password: password,
        password_confirmation: confirmPassword
      };

      const response = await authService.register(userData);
      
      // Registration successful
      global.userSession = {
        isLoggedIn: true,
        user: {
          id: response.user?.id || Date.now(),
          name: response.user?.name || fullName,
          email: response.user?.email || email,
          mobile: response.user?.phone || mobile,
          token: response.token || response.access_token
        }
      };
      
      // Navigate directly to SignInScreen after successful registration
      console.log('Registration successful, navigating to SignInScreen');
      navigation.navigate('SignInScreen', {
        returnScreen: route.params?.returnScreen,
        returnParams: route.params?.returnParams,
        action: route.params?.action,
        fromRegistration: true
      });
    } catch (error) {
      console.log('Registration error caught:', error);
      console.log('Error response:', error.response);
      
      // Handle API errors
      console.log('=== ERROR HANDLING DEBUG ===');
      console.log('Error response structure:', error.response);
      console.log('Error response errors:', error.response?.errors);
      console.log('Error response message:', error.response?.message);
      console.log('Has errors object:', !!error.response?.errors);
      console.log('Errors object keys:', Object.keys(error.response?.errors || {}));
      console.log('Errors object length:', Object.keys(error.response?.errors || {}).length);
      
      // Check if this is a validation error
      const hasValidationErrors = error.response && 
                                 error.response.errors && 
                                 Object.keys(error.response.errors).length > 0;
      
      console.log('Has validation errors:', hasValidationErrors);
      
      if (hasValidationErrors) {
        // Handle validation errors from API
        const errors = error.response.errors;
        console.log('Processing validation errors:', errors);
        
        // Clear any previous errors
        setFullNameError('');
        setEmailError('');
        setMobileError('');
        setPasswordError('');
        setConfirmPasswordError('');
        
        if (errors.name && Array.isArray(errors.name)) {
          setFullNameError(errors.name[0]);
        }
        if (errors.email && Array.isArray(errors.email)) {
          console.log('Setting email error:', errors.email[0]);
          setEmailError(errors.email[0]);
        }
        if (errors.phone && Array.isArray(errors.phone)) {
          setMobileError(errors.phone[0]);
        }
        if (errors.password && Array.isArray(errors.password)) {
          setPasswordError(errors.password[0]);
        }
        if (errors.password_confirmation && Array.isArray(errors.password_confirmation)) {
          setConfirmPasswordError(errors.password_confirmation[0]);
        }
        
        console.log('Validation errors processed - no modal should show');
        setIsLoading(false);
        return; // Exit early to prevent showing error modal
      }
      
      // If we reach here, it's not a validation error
      console.log('Not a validation error, showing error modal');
      
      // Check for backend configuration errors
      if (error.response && error.response.isBackendConfigError) {
        console.log('Showing backend config error modal');
        setErrorMessage(error.response.message);
        setErrorModalVisible(true);
      } else if (error.response && error.response.message) {
        // Handle server error messages
        console.log('Showing server error modal:', error.response.message);
        setErrorMessage(error.response.message);
        setErrorModalVisible(true);
      } else {
        // Handle general error message
        console.log('Showing general error modal:', error.message);
        setErrorMessage(error.message || 'Failed to create account. Please try again.');
        setErrorModalVisible(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidMobile = (mobile) => {
    const mobileRegex = /^03\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleSocialSignUp = (provider) => {
    setErrorMessage(`${provider} sign up will be implemented soon!`);
    setErrorModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { direction: 'ltr', paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView 
        style={[styles.container, { direction: 'ltr' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { direction: 'ltr' }]}
          style={{ direction: 'ltr' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
                  <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image source={require('../../assets/images/back_arrow.png')} style={styles.backArrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <View style={styles.headerSpacer} />
        </View>

          {/* Logo and Welcome */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/badge.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeTitle}>Join CarWheels</Text>
            <Text style={styles.welcomeSubtitle}>
              Create your account to start buying and selling cars
            </Text>
          </View>

          {/* Sign Up Form */}
          <View style={styles.formSection}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (fullNameError) setFullNameError('');
                  }}
                  autoCapitalize="words"
                  textAlign="left"
                  textAlignVertical="center"
                  writingDirection="ltr"
                />
              </View>
              <InlineError visible={!!fullNameError} message={fullNameError} />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textAlign="left"
                  textAlignVertical="center"
                  writingDirection="ltr"
                />
              </View>
              <InlineError visible={!!emailError} message={emailError} />
            </View>

            {/* Mobile Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="03XXXXXXXXX"
                  placeholderTextColor="#999"
                  value={mobile}
                  onChangeText={(text) => {
                    setMobile(text);
                    if (mobileError) setMobileError('');
                  }}
                  keyboardType="phone-pad"
                  maxLength={11}
                  textAlign="left"
                  textAlignVertical="center"
                  writingDirection="ltr"
                />
              </View>
              <InlineError visible={!!mobileError} message={mobileError} />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  textAlign="left"
                  textAlignVertical="center"
                  writingDirection="ltr"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>Must be at least 6 characters</Text>
              <InlineError visible={!!passwordError} message={passwordError} />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  textAlign="left"
                  textAlignVertical="center"
                  writingDirection="ltr"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              <InlineError visible={!!confirmPasswordError} message={confirmPasswordError} />
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                  {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Sign Up Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignUp('Google')}
              >
                <Text style={styles.socialIcon}>🔍</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignUp('Facebook')}
              >
                <Text style={styles.socialIcon}>📘</Text>
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignUp('Apple')}
              >
                <Text style={styles.socialIcon}>🍎</Text>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Link */}
          <View style={styles.signInSection}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen', {
              returnScreen: route.params?.returnScreen,
              returnParams: route.params?.returnParams,
              action: route.params?.action
            })}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>



      {/* Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="Error"
        message={errorMessage}
        action="try_again"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#900C3F',
    direction: 'ltr',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    direction: 'ltr',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#900C3F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    direction: 'ltr',
  },
  backButton: {
    padding: 8,
  },
  backArrowImage: {
    width: 22,
    height: 22,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formSection: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    direction: 'ltr',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#666',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 16,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#666',
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    direction: 'ltr',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#900C3F',
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#900C3F',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#193A7A',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#900C3F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#900C3F',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  signUpButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    direction: 'ltr',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    direction: 'ltr',
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  socialIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  signInSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    direction: 'ltr',
  },
  signInText: {
    fontSize: 16,
    color: '#666',
  },
  signInLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#900C3F',
  },
});

export default SignUpScreen; 