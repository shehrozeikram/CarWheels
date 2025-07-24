import apiService from './apiService';

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post('/register', userData);
      return response;
    } catch (error) {
      console.log('AuthService Register Error:', error);
      
      // Handle specific Passport configuration error
      if (error.response && error.response.message && 
          (error.response.message.includes('Personal access client not found') ||
           error.response.message.includes('oauth_clients') ||
           (error.response.message.includes('Table') && error.response.message.includes('not found')))) {
        console.warn('Backend Passport configuration issue detected');
        // Create a more user-friendly error
        const friendlyError = new Error('Backend authentication is not properly configured. Please contact the administrator.');
        friendlyError.response = {
          message: 'Backend authentication is not properly configured. Please contact the administrator.',
          isBackendConfigError: true
        };
        throw friendlyError;
      }
      
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/login', credentials);
      return response;
    } catch (error) {
      console.log('AuthService Login Error:', error);
      
      // Handle specific Passport configuration error
      if (error.response && error.response.message && 
          (error.response.message.includes('Personal access client not found') ||
           error.response.message.includes('oauth_clients') ||
           (error.response.message.includes('Table') && error.response.message.includes('not found')))) {
        console.warn('Backend Passport configuration issue detected');
        // Create a more user-friendly error
        const friendlyError = new Error('Backend authentication is not properly configured. Please contact the administrator.');
        friendlyError.response = {
          message: 'Backend authentication is not properly configured. Please contact the administrator.',
          isBackendConfigError: true
        };
        throw friendlyError;
      }
      
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await apiService.post('/logout', {});
      return response;
    } catch (error) {
      console.log('AuthService Logout Error:', error);
      throw error;
    }
  }
}

export default new AuthService(); 