import apiService from './apiService';

const managedVehiclesService = {
  getManagedVehicles: async (perPage = 12) => {
    try {
      console.log('ManagedVehiclesService: Fetching managed vehicles with per_page:', perPage);
      // Use GET request with query parameters
      const response = await apiService.get(`/managed-by-us-vehicles?per_page=${perPage}`);
      
      console.log('ManagedVehiclesService: API Response:', response);
      return response;
    } catch (error) {
      console.log('ManagedVehiclesService: Error fetching managed vehicles:', error);
      throw error;
    }
  }
};

export default managedVehiclesService; 