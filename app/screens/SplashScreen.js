import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const tireMoveAnim = useRef(new Animated.Value(0)).current;
  const rotationValueRef = useRef(0);

  useEffect(() => {
    // Start animations
    const startAnimations = () => {
      // Main content animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous rotation using different approach
      const animateRotation = () => {
        rotationValueRef.current += 8; // Very fast increment
        tireMoveAnim.setValue(rotationValueRef.current);
        
        requestAnimationFrame(() => {
          setTimeout(animateRotation, 2); // Very fast timeout
        });
      };
      
      setTimeout(animateRotation, 100);

      // Glow effect animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    // Start animations after a short delay
    const timer = setTimeout(startAnimations, 200);

    // Navigate to MainTabs after 4.5 seconds
    const navigationTimer = setTimeout(() => {
      navigation.replace('MainTabs', {
        screen: 'Home'
      });
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(navigationTimer);
    };
  }, [navigation, fadeAnim, scaleAnim, rotateAnim, tireMoveAnim, slideAnim, glowAnim, progressAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Continuous rotation interpolation
  const tireRotation = tireMoveAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
  });

  const tireBounce = tireMoveAnim.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, -2, 0],
  });

  const tireScale = tireMoveAnim.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 1.01, 1],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Animated background */}
      <Animated.View style={[styles.background, { opacity: fadeAnim }]}>
        <View style={styles.backgroundGradient} />
        <View style={styles.backgroundPattern} />
      </Animated.View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Rotating tire - stays in place */}
        <Animated.View
          style={[
            styles.badgeContainer,
            {
              transform: [
                { rotate: tireRotation },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
              },
            ]}
          />
          <Image
            source={require('../assets/images/badge.png')}
            style={styles.badge}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Brand name with elegant typography */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>CarWheels</Text>
        </View>

        {/* Elegant loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  transform: [{ scaleX: progressAnim }],
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#900C3F',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#900C3F',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  badgeContainer: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  badge: {
    width: 120,
    height: 120,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#E8E8E8',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 4,
    marginBottom: 8,
  },
  brandUnderline: {
    width: 80,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  slogan: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F0F0F0',
    textAlign: 'center',
    opacity: 0.95,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 60,
  },
  loadingContainer: {
    width: 200,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    transformOrigin: 'left',
  },
  bottomContent: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: '#F0F0F0',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 1,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feature: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    opacity: 0.7,
  },
});

export default SplashScreen; 