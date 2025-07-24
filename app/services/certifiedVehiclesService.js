import apiService from './apiService';

const certifiedVehiclesService = {
  getCertifiedVehicles: async (perPage = 12) => {
    try {
      console.log('CertifiedVehiclesService: Fetching certified vehicles with per_page:', perPage);
      
      // Use GET request with query parameters instead of POST
      const response = await apiService.get(`/certified-vehicles?per_page=${perPage}`);
      
      console.log('CertifiedVehiclesService: API Response:', response);
      return response;
    } catch (error) {
      console.log('CertifiedVehiclesService: Error fetching certified vehicles:', error);
      throw error;
    }
  }
};

export default certifiedVehiclesService; 