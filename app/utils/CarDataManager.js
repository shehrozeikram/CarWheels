// Global car data management utility

// Initialize global car data if not exists
if (!global.carDataManager) {
  global.carDataManager = {
    cars: {},
    listeners: [],
  };
}

// Add a car to the global data manager
export const addCarToManager = (carId, carData) => {
  if (!global.carDataManager.cars[carId]) {
    global.carDataManager.cars[carId] = carData;
  }
};

// Update car data globally
export const updateCarData = (carId, updates) => {
  if (global.carDataManager.cars[carId]) {
    global.carDataManager.cars[carId] = {
      ...global.carDataManager.cars[carId],
      ...updates
    };
    
    // Notify all listeners about the update
    global.carDataManager.listeners.forEach(listener => {
      if (listener.carId === carId || listener.carId === 'all') {
        listener.callback(global.carDataManager.cars[carId]);
      }
    });
  }
};

// Get car data from manager
export const getCarData = (carId) => {
  return global.carDataManager.cars[carId] || null;
};

// Add a listener for car updates
export const addCarUpdateListener = (carId, callback) => {
  const listener = { carId, callback };
  global.carDataManager.listeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    const index = global.carDataManager.listeners.indexOf(listener);
    if (index > -1) {
      global.carDataManager.listeners.splice(index, 1);
    }
  };
};

// Update car bidding information
export const updateCarBidding = (carId, bidAmount, bidderName) => {
  const car = global.carDataManager.cars[carId];
  if (car) {
    const updatedCar = {
      ...car,
      currentBid: bidAmount,
      highestBidder: bidderName,
      bids: car.bids || [],
    };
    
    // Add new bid to bids array
    updatedCar.bids.push({
      id: Date.now(),
      amount: bidAmount,
      bidder: bidderName,
      timestamp: Date.now(),
    });
    
    // Update the car data
    updateCarData(carId, updatedCar);
    
    return updatedCar;
  }
  return null;
};

// Initialize car data from static data
export const initializeCarData = (staticCarData) => {
  Object.keys(staticCarData).forEach(category => {
    staticCarData[category].forEach(car => {
      if (car.id) {
        addCarToManager(car.id, car);
      }
    });
  });
};

// Get all cars for a specific model/category with real-time updates
export const getCarsForModel = (model, staticCarData) => {
  const staticCars = staticCarData[model] || [];
  
  // Map static cars to their updated versions from global manager
  const updatedStaticCars = staticCars.map(car => {
    const globalCar = global.carDataManager.cars[car.id];
    return globalCar || car;
  });
  
  // Get user-created ads from global.carListings for this model
  const userCreatedCars = [];
  if (global.carListings && global.carListings[model]) {
    global.carListings[model].forEach(car => {
      // Add user-created cars to global manager if not already there
      if (car.id && !global.carDataManager.cars[car.id]) {
        addCarToManager(car.id, car);
      }
      
      // Get the updated version from global manager
      const globalCar = global.carDataManager.cars[car.id];
      if (globalCar) {
        userCreatedCars.push(globalCar);
      }
    });
  }
  
  // Combine static cars and user-created cars
  const allCars = [...userCreatedCars, ...updatedStaticCars];
  
  // Sort cars: Featured ads first, then by date (newest first)
  return allCars.sort((a, b) => {
    // First priority: Featured ads come first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    
    // Second priority: Newer ads come first (higher ID = newer)
    return b.id - a.id;
  });
};

// Add a listener for model updates (when any car in a model is updated)
export const addModelUpdateListener = (model, staticCarData, callback) => {
  const listener = { 
    carId: 'all', 
    callback: () => {
      // When any car is updated, get the updated cars for this model
      const updatedCars = getCarsForModel(model, staticCarData);
      callback(updatedCars);
    }
  };
  
  global.carDataManager.listeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    const index = global.carDataManager.listeners.indexOf(listener);
    if (index > -1) {
      global.carDataManager.listeners.splice(index, 1);
    }
  };
}; 