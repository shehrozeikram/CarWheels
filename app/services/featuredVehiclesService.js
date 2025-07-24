import apiService from './apiService';

class FeaturedVehiclesService {
  // Get featured vehicles
  async getFeaturedVehicles(perPage = 10) {
    try {
      // Use GET request with query parameters
      const response = await apiService.get(`/featured-vehicles?per_page=${perPage}`);
      return response;
    } catch (error) {
      console.error('FeaturedVehiclesService Error:', error);
      throw error;
    }
  }
}

export default new FeaturedVehiclesService(); 