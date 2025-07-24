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
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { Header } from '../../components';
import InlineError from '../../components/InlineError';
import authService from '../../services/authService';

const SignInScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleSignIn = async () => {
    console.log('SignIn: handleSignIn called');
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // Validate fields
    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) {
      console.log('SignIn: Validation errors, returning');
      return;
    }

    console.log('SignIn: Starting sign in process');
    setIsLoading(true);

    try {
      // Validate email format
      if (!isValidEmail(email.trim())) {
        setEmailError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }
      // API call to login user using auth service
      const loginData = {
        email: email.trim(),
        password: password
      };
      
      console.log('SignIn: Making API call with data:', loginData);
      const response = await authService.login(loginData);
      console.log('SignIn: API response:', response);
      
      // Store user session with API response data
      global.userSession = {
        isLoggedIn: true,
        user: {
          id: response.user?.id || Date.now(),
          email: response.user?.email || email,
          name: response.user?.name || email.split('@')[0],
          mobile: response.user?.phone || 'N/A',
          token: response.token || response.access_token
        }
      };
      
      console.log('SignIn: User session created:', global.userSession);
      
      // Navigate back to the original screen or MainTabs if no return screen specified
      const returnScreen = route.params?.returnScreen;
      const returnParams = route.params?.returnParams;
      
      console.log('SignIn: Navigation params:', { returnScreen, returnParams });
      console.log('SignIn: Action:', route.params?.action);
      
      if (returnScreen) {
        // Check if the return screen is a nested screen within MainTabs
        // Handle both tab names and component names
        const mainTabsScreens = ['Home', 'Ads', 'Chat', 'Profile'];
        const mainTabsComponents = ['Home', 'Ads', 'Chat', 'ProfileScreen'];
        const isNestedScreen = mainTabsScreens.includes(returnScreen) || mainTabsComponents.includes(returnScreen);
        
        // Map component names to tab names for navigation
        const screenNameMap = {
          'ProfileScreen': 'Profile',
          'Home': 'Home',
          'Ads': 'Ads', 
          'Chat': 'Chat'
        };
        const actualScreenName = screenNameMap[returnScreen] || returnScreen;
        
        console.log('SignIn: Return screen analysis:', {
          returnScreen,
          isNestedScreen,
          mainTabsScreens,
          mainTabsComponents,
          actualScreenName,
          returnParams
        });
        
        console.log('SignIn: About to execute navigation logic...');
        
        if (isNestedScreen) {
          // Replace to MainTabs with the specific tab
          console.log('SignIn: Replacing to MainTabs with screen:', actualScreenName);
          console.log('SignIn: Navigation call:', 'navigation.replace("MainTabs", { screen: "' + actualScreenName + '", fromSignIn: true })');
          navigation.replace('MainTabs', {
            screen: actualScreenName,
            fromSignIn: true
          });
        } else if (returnParams) {
          // Replace to the specified screen with params
          console.log('SignIn: Replacing to', returnScreen, 'with params');
          navigation.replace(returnScreen, returnParams);
        } else {
          // Replace to the specified screen
          console.log('SignIn: Replacing to', returnScreen);
          navigation.replace(returnScreen);
        }
      } else {
        // Replace to MainTabs if no return screen specified
        console.log('SignIn: Replacing to MainTabs (default)');
        navigation.replace('MainTabs', {
          screen: 'Home',
          fromSignIn: true
        });
      }
    } catch (error) {
      console.log('SignIn: Error occurred:', error);
      console.log('SignIn: Error response:', error.response);
      
      // Handle API errors
      if (error.response && error.response.isBackendConfigError) {
        console.log('SignIn: Setting backend config error inline');
        setGeneralError(error.response.message);
      } else if (error.response && error.response.error) {
        // Handle server error messages (error field) - show inline
        console.log('SignIn: Setting inline error:', error.response.error);
        setGeneralError(error.response.error);
      } else if (error.response && error.response.message) {
        // Handle server error messages (message field) - show inline
        console.log('SignIn: Setting inline error:', error.response.message);
        setGeneralError(error.response.message);
      } else {
        // Handle general error message - show inline
        console.log('SignIn: Setting inline error:', error.message);
        setGeneralError(error.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSocialLogin = (provider) => {
    setGeneralError(`${provider} login will be implemented soon!`);
  };

  const handleForgotPassword = () => {
    setGeneralError('Password reset functionality will be implemented soon!');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Header
            title="Sign In"
            onBackPress={() => navigation.goBack()}
          />

          {/* Logo and Welcome */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/badge.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              {route.params?.fromRegistration 
                ? 'Your account has been created successfully! Please sign in to continue.'
                : 'Sign in to access your account and continue buying or selling cars'
              }
            </Text>
            {route.params?.fromRegistration && (
              <View style={styles.successMessage}>
                <Text style={styles.successMessageText}>✅ Registration successful!</Text>
              </View>
            )}
          </View>

          {/* Sign In Form */}
          <View style={styles.formSection}>
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
                    if (generalError) setGeneralError('');
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

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                    if (generalError) setGeneralError('');
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
              <InlineError visible={!!passwordError} message={passwordError} />
            </View>

            {/* General Error */}
            <InlineError visible={!!generalError} message={generalError} />

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
              >
                <Text style={styles.socialIcon}>🔍</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <Text style={styles.socialIcon}>📘</Text>
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Text style={styles.socialIcon}>🍎</Text>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpSection}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen', {
              returnScreen: route.params?.returnScreen,
              returnParams: route.params?.returnParams,
              action: route.params?.action
            })}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>




    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#900C3F',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingVertical: 40,
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
    marginTop: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#900C3F',
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
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
  signInButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#900C3F',
  },
  successMessage: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  successMessageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignInScreen; 