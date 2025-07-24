import apiService from './apiService';

class VehiclesService {
  // Get all vehicles
  async getVehicles() {
    try {
      const response = await apiService.get('/vehicles');
      return response;
    } catch (error) {
      console.error('VehiclesService Error:', error);
      throw error;
    }
  }
}

export default new VehiclesService(); 