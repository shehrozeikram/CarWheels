import { Platform } from 'react-native';

// Utility function to get consistent TextInput props for iOS RTL handling
export const getTextInputProps = (additionalProps = {}) => {
  return {
    textAlign: 'left',
    textAlignVertical: 'center',
    writingDirection: 'ltr',
    ...additionalProps
  };
};

// Common TextInput styles that include RTL handling
export const commonTextInputStyles = {
  textAlign: 'left',
  writingDirection: 'ltr',
};

// Platform-specific TextInput props
export const getPlatformTextInputProps = () => {
  if (Platform.OS === 'ios') {
    return {
      textAlign: 'left',
      textAlignVertical: 'center',
      writingDirection: 'ltr',
    };
  }
  return {};
}; 