import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Badge = ({ 
  type = 'affiliated', 
  size = 'medium', 
  showIcon = true, 
  showLabel = false,
  style 
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'organization':
        return {
          color: '#FFD700',
          icon: '🏢',
          label: 'Verified Organization',
          image: require('../assets/images/goldtick.png')
        };
      case 'affiliated':
      default:
        return {
          color: '#1DA1F2',
          icon: '✓',
          label: 'Verified',
          image: require('../assets/images/bluetick.png')
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          containerSize: 16,
          iconSize: 12,
          fontSize: 10
        };
      case 'large':
        return {
          containerSize: 32,
          iconSize: 24,
          fontSize: 14
        };
      case 'medium':
      default:
        return {
          containerSize: 24,
          iconSize: 18,
          fontSize: 12
        };
    }
  };

  const config = getBadgeConfig();
  const sizeConfig = getSizeConfig();

  return (
    <View style={[styles.container, style]}>
      {showIcon && (
        <Image 
          source={config.image}
          style={[
            styles.badgeIcon,
            {
              width: sizeConfig.iconSize,
              height: sizeConfig.iconSize
            }
          ]}
        />
      )}
      {showLabel && (
        <Text style={[
          styles.badgeLabel,
          {
            fontSize: sizeConfig.fontSize,
            color: config.color
          }
        ]}>
          {config.label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    resizeMode: 'contain',
  },
  badgeLabel: {
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default Badge; 