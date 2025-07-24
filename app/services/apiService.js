import { API_CONFIG } from '../config/api';

class ApiService {
  // Simple GET request
  async get(endpoint) {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      console.log('API GET:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        // Create error object with response data for validation errors
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.response = data;
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      console.log('API Error:', error);
      throw error;
    }
  }

  // Simple POST request
  async post(endpoint, data) {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      console.log('API POST:', url, data);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        // Create error object with response data for validation errors
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.response = responseData;
        error.status = response.status;
        throw error;
      }

      return responseData;
    } catch (error) {
      console.log('API Error:', error);
      throw error;
    }
  }
}

export default new ApiService(); 