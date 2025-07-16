// Authentication Utility Functions

// Check if user is logged in
export const isUserLoggedIn = () => {
  return global.userSession?.isLoggedIn === true;
};

// Get current user data
export const getCurrentUser = () => {
  return global.userSession?.user || null;
};

// Set user session
export const setUserSession = (userData) => {
  global.userSession = {
    isLoggedIn: true,
    user: userData
  };
};

// Clear user session (logout)
export const clearUserSession = () => {
  global.userSession = {
    isLoggedIn: false,
    user: null
  };
};

// Check if user can access protected features
export const canAccessFeature = (feature) => {
  if (!isUserLoggedIn()) {
    return false;
  }

  // Add any additional feature-specific checks here
  switch (feature) {
    case 'sell':
    case 'contact_seller':
    case 'create_ad':
    case 'manage_ads':
      return true;
    default:
      return true;
  }
};

// Get authentication prompt message
export const getAuthPromptMessage = (action) => {
  switch (action) {
    case 'sell':
      return 'Please sign in to sell your car';
    case 'contact_seller':
      return 'Please sign in to contact the seller';
    case 'create_ad':
      return 'Please sign in to create an ad';
    case 'manage_ads':
      return 'Please sign in to manage your ads';
    default:
      return 'Please sign in to continue';
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate mobile number (Pakistani format)
export const isValidMobile = (mobile) => {
  const mobileRegex = /^03\d{9}$/;
  return mobileRegex.test(mobile);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength,
    minLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    strength: password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak'
  };
};

// Format user name for display
export const formatUserName = (user) => {
  if (!user) return 'Guest';
  
  if (user.name) {
    return user.name;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'User';
};

// Get user initials for avatar
export const getUserInitials = (user) => {
  if (!user || !user.name) return 'U';
  
  const names = user.name.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  
  return user.name[0].toUpperCase();
};

// Check if user has completed profile
export const isProfileComplete = (user) => {
  if (!user) return false;
  
  return !!(user.name && user.email && user.mobile);
};

// Get user's ads count
export const getUserAdsCount = () => {
  if (!global.carListings) return 0;
  
  let count = 0;
  const currentUser = getCurrentUser();
  
  if (!currentUser) return 0;
  
  Object.keys(global.carListings).forEach(category => {
    const categoryAds = global.carListings[category];
    const userAds = categoryAds.filter(ad => 
      ad.isUserCreated && 
      ad.formData?.contactInfo?.email === currentUser.email
    );
    count += userAds.length;
  });
  
  return count;
};

// Get user's active ads
export const getUserActiveAds = () => {
  if (!global.carListings) return [];
  
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  const allAds = [];
  
  Object.keys(global.carListings).forEach(category => {
    const categoryAds = global.carListings[category];
    const userAds = categoryAds.filter(ad => 
      ad.isUserCreated && 
      ad.formData?.contactInfo?.email === currentUser.email &&
      ad.status !== 'removed'
    );
    allAds.push(...userAds);
  });
  
  return allAds;
};

// Update user profile
export const updateUserProfile = (updates) => {
  if (!global.userSession?.user) return false;
  
  global.userSession.user = {
    ...global.userSession.user,
    ...updates
  };
  
  return true;
};

// Authentication state for React components
export const useAuthState = () => {
  // This would typically use React's useState and useEffect
  // For now, we'll return a simple object
  return {
    isLoggedIn: isUserLoggedIn(),
    user: getCurrentUser(),
    isLoading: false,
  };
};

export default {
  isUserLoggedIn,
  getCurrentUser,
  setUserSession,
  clearUserSession,
  canAccessFeature,
  getAuthPromptMessage,
  isValidEmail,
  isValidMobile,
  validatePassword,
  formatUserName,
  getUserInitials,
  isProfileComplete,
  getUserAdsCount,
  getUserActiveAds,
  updateUserProfile,
  useAuthState,
}; 