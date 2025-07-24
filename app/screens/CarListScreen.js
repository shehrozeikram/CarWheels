import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, TextInput, Alert, I18nManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SellModal from '../modals/SellModal';
import AuthModal from '../modals/AuthModal';
import SuccessModal from '../modals/SuccessModal';
import { isUserLoggedIn } from './auth/AuthUtils';
import { Header, SearchBar, CarCard, LoadingSpinner, EmptyState } from '../components';
import { getCarsForModel, initializeCarData, addModelUpdateListener } from '../utils/CarDataManager';
import { getUserAffiliation, getUserBadge } from '../utils/AffiliationManager';
import vehiclesService from '../services/vehiclesService';

// All available car models for comprehensive search
const allCarModels = [
  'Daihatsu Mira', 'Honda City', 'Honda Civic', 'Suzuki Alto', 'Suzuki Cultus', 'Suzuki Mehran',
  'Toyota Corolla', 'Toyota Land Cruiser', 'Toyota Prado', 'Toyota Vitz', 'BMW X5', 'Mercedes C-Class',
  'Jeep Wrangler', 'Jeep Cherokee', 'Jeep Compass', 'Toyota Prius', 'Honda Insight', 'Toyota Camry Hybrid',
  'Toyota Hilux', 'Ford Ranger', 'Mitsubishi L200', 'Toyota Corolla Cross 2024', 'Honda City 2024 VX',
  'Suzuki Swift 2024 VXL', 'Toyota Land Cruiser 2020', 'BMW X5 2021 Imported', 'Mercedes C-Class 2019'
];

// AI Search Engine - Enhanced Natural Language Processing
const aiSearchEngine = {
  // Car brand mappings
  brands: {
    'honda': ['Honda City', 'Honda Civic', 'Honda Insight'],
    'toyota': ['Toyota Corolla', 'Toyota Land Cruiser', 'Toyota Prado', 'Toyota Vitz', 'Toyota Prius', 'Toyota Camry Hybrid', 'Toyota Hilux', 'Toyota Corolla Cross 2024'],
    'suzuki': ['Suzuki Alto', 'Suzuki Cultus', 'Suzuki Mehran', 'Suzuki Swift 2024 VXL'],
    'daihatsu': ['Daihatsu Mira'],
    'bmw': ['BMW X5', 'BMW X5 2021 Imported'],
    'mercedes': ['Mercedes C-Class', 'Mercedes C-Class 2019'],
    'jeep': ['Jeep Wrangler', 'Jeep Cherokee', 'Jeep Compass'],
    'ford': ['Ford Ranger'],
    'mitsubishi': ['Mitsubishi L200'],
  },
  
  // Car type mappings
  types: {
    'sedan': ['Honda City', 'Honda Civic', 'Toyota Corolla', 'Mercedes C-Class', 'Toyota Camry Hybrid'],
    'suv': ['Toyota Land Cruiser', 'Toyota Prado', 'BMW X5', 'Jeep Wrangler', 'Jeep Cherokee', 'Jeep Compass', 'Toyota Corolla Cross 2024'],
    'hatchback': ['Suzuki Alto', 'Suzuki Cultus', 'Toyota Vitz', 'Daihatsu Mira', 'Suzuki Swift 2024 VXL'],
    'compact': ['Suzuki Alto', 'Suzuki Cultus', 'Daihatsu Mira'],
    'luxury': ['Toyota Land Cruiser', 'Toyota Prado', 'BMW X5', 'Mercedes C-Class'],
    'economy': ['Suzuki Alto', 'Suzuki Mehran', 'Daihatsu Mira'],
    'family': ['Honda City', 'Toyota Corolla', 'Suzuki Cultus'],
    'offroad': ['Toyota Land Cruiser', 'Toyota Prado', 'Jeep Wrangler', 'Toyota Hilux', 'Ford Ranger', 'Mitsubishi L200'],
    'hybrid': ['Toyota Prius', 'Honda Insight', 'Toyota Camry Hybrid'],
    'pickup': ['Toyota Hilux', 'Ford Ranger', 'Mitsubishi L200'],
  },
  
  // Price range mappings - now returns all models for price-based searches
  priceRanges: {
    'cheap': allCarModels, // Will be filtered by actual price in CarListScreen
    'affordable': allCarModels,
    'mid range': allCarModels,
    'expensive': allCarModels,
    'luxury': allCarModels,
    'under 30 lacs': allCarModels,
    'under 50 lacs': allCarModels,
    'under 1 crore': allCarModels,
    'under 2 crore': allCarModels,
    'over 1 crore': allCarModels,
    'over 2 crore': allCarModels,
  },
  
  // Feature mappings
  features: {
    'fuel efficient': allCarModels,
    'hybrid': ['Toyota Prius', 'Honda Insight', 'Toyota Camry Hybrid'],
    'diesel': ['Toyota Hilux', 'Ford Ranger', 'Mitsubishi L200'],
    'automatic': allCarModels,
    'manual': allCarModels,
    'new': ['Toyota Corolla Cross 2024', 'Honda City 2024 VX', 'Suzuki Swift 2024 VXL'],
    'used': allCarModels,
    'imported': ['Toyota Land Cruiser 2020', 'BMW X5 2021 Imported', 'Mercedes C-Class 2019'],
    'certified': allCarModels,
    'inspected': allCarModels,
  },
  
  // Location mappings - now returns all models for location-based searches
  locations: {
    'karachi': allCarModels,
    'lahore': allCarModels,
    'islamabad': allCarModels,
    'pakistan': allCarModels,
  },
  
  // Year mappings
  years: {
    '2024': ['Toyota Corolla Cross 2024', 'Honda City 2024 VX', 'Suzuki Swift 2024 VXL'],
    '2023': ['Honda Civic 2023 RS Turbo', 'Suzuki Alto 2023 VXL', 'Toyota Corolla Altis 2023'],
    '2022': ['Honda City 2022 VX', 'Suzuki Alto 2022 VXL', 'Toyota Corolla Altis 2022'],
    '2021': ['Honda City 2021 VX', 'Suzuki Alto 2021 VXL', 'Toyota Corolla Altis 2021'],
    '2020': ['Toyota Land Cruiser 2020', 'BMW X5 2021 Imported'],
    '2019': ['Mercedes C-Class 2019'],
    'new': ['Toyota Corolla Cross 2024', 'Honda City 2024 VX', 'Suzuki Swift 2024 VXL'],
    'recent': ['Honda Civic 2023 RS Turbo', 'Suzuki Alto 2023 VXL', 'Toyota Corolla Altis 2023'],
    'old': ['Daihatsu Mira X Limited ER', 'Suzuki Mehran 2021 VX'],
  }
};

// Enhanced AI Search Function
const processAISearch = (query) => {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(' ');
  let matchedCars = new Set();
  let searchParams = {
    model: null,
    priceRange: null,
    location: null,
    year: null,
    features: [],
    type: null,
    exactPrice: null
  };

  // Extract price information more intelligently
  const pricePatterns = [
    { pattern: /under\s+(\d+(?:\.\d+)?)\s*(?:lacs?|lakhs?)/i, type: 'under', multiplier: 100000 },
    { pattern: /under\s+(\d+(?:\.\d+)?)\s*(?:crore|crores?)/i, type: 'under', multiplier: 10000000 },
    { pattern: /over\s+(\d+(?:\.\d+)?)\s*(?:lacs?|lakhs?)/i, type: 'over', multiplier: 100000 },
    { pattern: /over\s+(\d+(?:\.\d+)?)\s*(?:crore|crores?)/i, type: 'over', multiplier: 10000000 },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:lacs?|lakhs?)\s*(?:and\s+)?(?:below|less|under)/i, type: 'under', multiplier: 100000 },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:crore|crores?)\s*(?:and\s+)?(?:below|less|under)/i, type: 'under', multiplier: 10000000 },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:lacs?|lakhs?)\s*(?:and\s+)?(?:above|more|over)/i, type: 'over', multiplier: 100000 },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:crore|crores?)\s*(?:and\s+)?(?:above|more|over)/i, type: 'over', multiplier: 10000000 },
  ];

  // Check for price patterns
  pricePatterns.forEach(({ pattern, type, multiplier }) => {
    const match = lowerQuery.match(pattern);
    if (match) {
      const amount = parseFloat(match[1]);
      const priceInRupees = amount * multiplier;
      searchParams.exactPrice = { type, amount: priceInRupees };
      
      // Add all car models for price-based filtering
      allCarModels.forEach(car => matchedCars.add(car));
    }
  });

  // Process each word in the query
  words.forEach(word => {
    // Check brands
    if (aiSearchEngine.brands[word]) {
      aiSearchEngine.brands[word].forEach(car => matchedCars.add(car));
      searchParams.model = word;
    }
    
    // Check car types
    if (aiSearchEngine.types[word]) {
      aiSearchEngine.types[word].forEach(car => matchedCars.add(car));
      searchParams.type = word;
    }
    
    // Check price ranges (for simple keywords)
    if (aiSearchEngine.priceRanges[word]) {
      aiSearchEngine.priceRanges[word].forEach(car => matchedCars.add(car));
      searchParams.priceRange = word;
    }
    
    // Check features
    if (aiSearchEngine.features[word]) {
      aiSearchEngine.features[word].forEach(car => matchedCars.add(car));
      searchParams.features.push(word);
    }
    
    // Check locations
    if (aiSearchEngine.locations[word]) {
      aiSearchEngine.locations[word].forEach(car => matchedCars.add(car));
      searchParams.location = word;
    }
    
    // Check years
    if (aiSearchEngine.years[word]) {
      aiSearchEngine.years[word].forEach(car => matchedCars.add(car));
      searchParams.year = word;
    }
  });

  // Handle multi-word phrases
  const phrases = [
    'under 30 lacs', 'under 50 lacs', 'under 1 crore', 'under 2 crore',
    'over 1 crore', 'over 2 crore',
    'fuel efficient', 'new car', 'used car', 'imported car',
    'land cruiser', 'toyota corolla', 'honda civic', 'suzuki alto',
    'i want', 'show me', 'find me', 'looking for', 'need'
  ];

  phrases.forEach(phrase => {
    if (lowerQuery.includes(phrase)) {
      if (aiSearchEngine.priceRanges[phrase]) {
        aiSearchEngine.priceRanges[phrase].forEach(car => matchedCars.add(car));
        searchParams.priceRange = phrase;
      }
      if (aiSearchEngine.features[phrase]) {
        aiSearchEngine.features[phrase].forEach(car => matchedCars.add(car));
        searchParams.features.push(phrase);
      }
      if (aiSearchEngine.brands[phrase]) {
        aiSearchEngine.brands[phrase].forEach(car => matchedCars.add(car));
        searchParams.model = phrase;
      }
    }
  });

  // If no specific matches, do fuzzy matching
  if (matchedCars.size === 0) {
    allCarModels.forEach(car => {
      if (car.toLowerCase().includes(lowerQuery) || 
          lowerQuery.includes(car.toLowerCase().split(' ')[0])) {
        matchedCars.add(car);
      }
    });
  }

  // If still no matches, return all cars for comprehensive search
  if (matchedCars.size === 0) {
    allCarModels.forEach(car => matchedCars.add(car));
  }

  return {
    cars: Array.from(matchedCars),
    searchParams: searchParams
  };
};

const carData = {
  'Daihatsu Mira': [
    {
      id: 1,
      title: 'Daihatsu Mira X SA III',
      price: 'PKR 32 lacs',
      year: '2022',
      km: '36,281 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '9.1',
      sellerEmail: 'sheri@example.com',
      sellerName: 'Sheri',
    },
    {
      id: 2,
      title: 'Daihatsu Mira X Memorial Edition',
      price: 'PKR 29.5 lacs',
      year: '2017',
      km: '86,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 9,
      managed: false,
      inspected: null,
      sellerEmail: 'sheri@example.com',
      sellerName: 'Sheri',
    },
    {
      id: 3,
      title: 'Daihatsu Mira X Limited ER',
      price: 'PKR 23.26 lacs',
      year: '2013',
      km: '152,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 17,
      managed: false,
      inspected: null,
      sellerEmail: 'muhammad.hassan@sgc.org',
      sellerName: 'Muhammad Hassan',
    },
  ],
  'Honda City': [
    {
      id: 1,
      title: 'Honda City 2023 VX',
      price: 'PKR 45 lacs',
      year: '2023',
      km: '18,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.8',
      sellerEmail: 'sara.ahmed@sgc.org',
      sellerName: 'Sara Ahmed',
    },
    {
      id: 2,
      title: 'Honda City 2022 VX',
      price: 'PKR 42 lacs',
      year: '2022',
      km: '32,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: false,
      isStarred: true,
      imagesCount: 15,
      managed: true,
      inspected: '9.0',
      sellerEmail: 'sheri@example.com',
      sellerName: 'Sheri',
    },
    {
      id: 3,
      title: 'Honda City 2021 VX',
      price: 'PKR 38 lacs',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 10,
      managed: false,
      inspected: null,
    },
  ],
  'Honda Civic': [
    {
      id: 1,
      title: 'Honda Civic 2023 RS Turbo',
      price: 'PKR 85 lacs',
      year: '2023',
      km: '12,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.3',
    },
    {
      id: 2,
      title: 'Honda Civic 2022 RS',
      price: 'PKR 78 lacs',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: false,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.1',
    },
    {
      id: 3,
      title: 'Honda Civic 2021 RS',
      price: 'PKR 72 lacs',
      year: '2021',
      km: '42,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: false,
      inspected: null,
    },
  ],
  'Suzuki Alto': [
    {
      id: 1,
      title: 'Suzuki Alto 2023 VXL',
      price: 'PKR 28 lacs',
      year: '2023',
      km: '8,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.9',
      biddingEnabled: true,
      biddingEndTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
      currentBid: 2500000, // PKR 25 lacs
      bids: [
        { id: 1, amount: 2500000, bidder: 'Ahmed Khan', timestamp: Date.now() - 3600000 },
        { id: 2, amount: 2400000, bidder: 'Fatima Ali', timestamp: Date.now() - 7200000 },
      ],
      highestBidder: 'Ahmed Khan',
    },
    {
      id: 2,
      title: 'Suzuki Alto 2022 VXL',
      price: 'PKR 25 lacs',
      year: '2022',
      km: '25,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 10,
      managed: true,
      inspected: '8.7',
      biddingEnabled: true,
      biddingEndTime: Date.now() + (5 * 24 * 60 * 60 * 1000), // 5 days from now
      currentBid: 2200000, // PKR 22 lacs
      bids: [
        { id: 1, amount: 2200000, bidder: 'Muhammad Hassan', timestamp: Date.now() - 1800000 },
      ],
      highestBidder: 'Muhammad Hassan',
    },
    {
      id: 3,
      title: 'Suzuki Alto 2021 VXL',
      price: 'PKR 22 lacs',
      year: '2021',
      km: '38,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 8,
      managed: false,
      inspected: null,
    },
  ],
  'Suzuki Cultus': [
    {
      id: 1,
      title: 'Suzuki Cultus 2023 VXL',
      price: 'PKR 35 lacs',
      year: '2023',
      km: '10,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '8.8',
    },
    {
      id: 2,
      title: 'Suzuki Cultus 2022 VXL',
      price: 'PKR 32 lacs',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.6',
    },
    {
      id: 3,
      title: 'Suzuki Cultus 2021 VXL',
      price: 'PKR 28 lacs',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: false,
      isStarred: false,
      imagesCount: 10,
      managed: false,
      inspected: null,
    },
  ],
  'Suzuki Mehran': [
    {
      id: 1,
      title: 'Suzuki Mehran 2023 VX',
      price: 'PKR 18 lacs',
      year: '2023',
      km: '5,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 8,
      managed: true,
      inspected: '8.5',
    },
    {
      id: 2,
      title: 'Suzuki Mehran 2022 VX',
      price: 'PKR 16 lacs',
      year: '2022',
      km: '22,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 6,
      managed: true,
      inspected: '8.3',
    },
    {
      id: 3,
      title: 'Suzuki Mehran 2021 VX',
      price: 'PKR 14 lacs',
      year: '2021',
      km: '35,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 5,
      managed: false,
      inspected: null,
    },
  ],
  'Toyota Corolla': [
    {
      id: 1,
      title: 'Toyota Corolla Altis 2023',
      price: 'PKR 75 lacs',
      year: '2023',
      km: '15,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.2',
    },
    {
      id: 2,
      title: 'Toyota Corolla Altis 2022',
      price: 'PKR 68 lacs',
      year: '2022',
      km: '32,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '9.0',
    },
    {
      id: 3,
      title: 'Toyota Corolla Altis 2021',
      price: 'PKR 62 lacs',
      year: '2021',
      km: '48,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 12,
      managed: false,
      inspected: null,
    },
  ],
  'Toyota Land Cruiser': [
    {
      id: 1,
      title: 'Toyota Land Cruiser 2023 V8',
      price: 'PKR 3.2 crore',
      year: '2023',
      km: '8,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 20,
      managed: true,
      inspected: '9.5',
    },
    {
      id: 2,
      title: 'Toyota Land Cruiser 2022 V8',
      price: 'PKR 2.8 crore',
      year: '2022',
      km: '25,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.3',
    },
    {
      id: 3,
      title: 'Toyota Land Cruiser 2021 V8',
      price: 'PKR 2.5 crore',
      year: '2021',
      km: '42,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 16,
      managed: false,
      inspected: null,
    },
  ],
  'Toyota Prado': [
    {
      id: 1,
      title: 'Toyota Prado 2023 V6',
      price: 'PKR 2.1 crore',
      year: '2023',
      km: '12,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.4',
    },
    {
      id: 2,
      title: 'Toyota Prado 2022 V6',
      price: 'PKR 1.9 crore',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.2',
    },
    {
      id: 3,
      title: 'Toyota Prado 2021 V6',
      price: 'PKR 1.7 crore',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: false,
      inspected: null,
    },
  ],
  'Toyota Vitz': [
    {
      id: 1,
      title: 'Toyota Vitz 2023 1.3L',
      price: 'PKR 42 lacs',
      year: '2023',
      km: '8,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '9.0',
    },
    {
      id: 2,
      title: 'Toyota Vitz 2022 1.3L',
      price: 'PKR 38 lacs',
      year: '2022',
      km: '25,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.8',
    },
    {
      id: 3,
      title: 'Toyota Vitz 2021 1.3L',
      price: 'PKR 35 lacs',
      year: '2021',
      km: '38,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 10,
      managed: false,
      inspected: null,
    },
  ],
  'Imported cars': [
    {
      id: 1,
      title: 'Toyota Land Cruiser 2020',
      price: 'PKR 2.5 crore',
      year: '2020',
      km: '45,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 20,
      managed: true,
      inspected: '9.5',
    },
    {
      id: 2,
      title: 'BMW X5 2021 Imported',
      price: 'PKR 1.8 crore',
      year: '2021',
      km: '32,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.3',
    },
    {
      id: 3,
      title: 'Mercedes C-Class 2019',
      price: 'PKR 1.2 crore',
      year: '2019',
      km: '58,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: false,
      inspected: null,
    },
  ],
  'Jeep': [
    {
      id: 1,
      title: 'Jeep Wrangler 2022',
      price: 'PKR 1.5 crore',
      year: '2022',
      km: '25,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.0',
    },
    {
      id: 2,
      title: 'Jeep Cherokee 2021',
      price: 'PKR 95 lacs',
      year: '2021',
      km: '38,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.7',
    },
    {
      id: 3,
      title: 'Jeep Compass 2020',
      price: 'PKR 75 lacs',
      year: '2020',
      km: '52,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 10,
      managed: false,
      inspected: null,
    },
  ],
  'Hybrid cars': [
    {
      id: 1,
      title: 'Toyota Prius 2023 Hybrid',
      price: 'PKR 1.1 crore',
      year: '2023',
      km: '12,000 km',
      city: 'Karachi',
      fuel: 'Hybrid',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 15,
      managed: true,
      inspected: '9.4',
    },
    {
      id: 2,
      title: 'Honda Insight 2022',
      price: 'PKR 85 lacs',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Hybrid',
      image: require('../assets/images/stonic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 13,
      managed: true,
      inspected: '9.1',
    },
    {
      id: 3,
      title: 'Toyota Camry Hybrid 2021',
      price: 'PKR 95 lacs',
      year: '2021',
      km: '35,000 km',
      city: 'Islamabad',
      fuel: 'Hybrid',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 11,
      managed: false,
      inspected: null,
    },
  ],
  'Diesel cars': [
    {
      id: 1,
      title: 'Toyota Hilux 2023 Diesel',
      price: 'PKR 1.8 crore',
      year: '2023',
      km: '18,000 km',
      city: 'Karachi',
      fuel: 'Diesel',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 17,
      managed: true,
      inspected: '9.2',
    },
    {
      id: 2,
      title: 'Ford Ranger 2022 Diesel',
      price: 'PKR 1.4 crore',
      year: '2022',
      km: '32,000 km',
      city: 'Lahore',
      fuel: 'Diesel',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '8.9',
    },
    {
      id: 3,
      title: 'Mitsubishi L200 2021',
      price: 'PKR 1.1 crore',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Diesel',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 12,
      managed: false,
      inspected: null,
    },
  ],
  'Duplicate File': [
    {
      id: 1,
      title: 'Honda Civic 2022 Duplicate',
      price: 'PKR 65 lacs',
      year: '2022',
      km: '25,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 10,
      managed: false,
      inspected: null,
    },
    {
      id: 2,
      title: 'Toyota Corolla 2021 Duplicate',
      price: 'PKR 58 lacs',
      year: '2021',
      km: '38,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 8,
      managed: false,
      inspected: null,
    },
    {
      id: 3,
      title: 'Suzuki Swift 2020 Duplicate',
      price: 'PKR 42 lacs',
      year: '2020',
      km: '52,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 6,
      managed: false,
      inspected: null,
    },
  ],
  'Urgent': [
    {
      id: 1,
      title: 'Toyota Vitz 2023 Urgent Sale',
      price: 'PKR 35 lacs',
      year: '2023',
      km: '8,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 12,
      managed: false,
      inspected: null,
    },
    {
      id: 2,
      title: 'Honda City 2022 Urgent',
      price: 'PKR 48 lacs',
      year: '2022',
      km: '22,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 15,
      managed: false,
      inspected: null,
    },
    {
      id: 3,
      title: 'Suzuki Alto 2021 Urgent',
      price: 'PKR 28 lacs',
      year: '2021',
      km: '35,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 9,
      managed: false,
      inspected: null,
    },
  ],
  'Carry Daba': [
    {
      id: 1,
      title: 'Suzuki Carry 2023 Daba',
      price: 'PKR 25 lacs',
      year: '2023',
      km: '12,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: false,
      imagesCount: 8,
      managed: false,
      inspected: null,
    },
    {
      id: 2,
      title: 'Daihatsu Hijet 2022 Daba',
      price: 'PKR 22 lacs',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 6,
      managed: false,
      inspected: null,
    },
    {
      id: 3,
      title: 'Suzuki Carry 2021 Daba',
      price: 'PKR 18 lacs',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 5,
      managed: false,
      inspected: null,
    },
  ],
  'New Cars': [
    {
      id: 1,
      title: 'Toyota Corolla Cross 2024',
      price: 'PKR 1.2 crore',
      year: '2024',
      km: '0 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 20,
      managed: true,
      inspected: '9.8',
    },
    {
      id: 2,
      title: 'Honda City 2024 VX',
      price: 'PKR 85 lacs',
      year: '2024',
      km: '0 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.7',
    },
    {
      id: 3,
      title: 'Suzuki Swift 2024 VXL',
      price: 'PKR 65 lacs',
      year: '2024',
      km: '0 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.6',
    },
  ],
  'Bikes': [
    {
      id: 1,
      title: 'Honda CG 125 2024',
      price: 'PKR 2.8 lacs',
      year: '2024',
      km: '0 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '9.5',
    },
    {
      id: 2,
      title: 'Yamaha YBR 125 2024',
      price: 'PKR 3.2 lacs',
      year: '2024',
      km: '0 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 10,
      managed: true,
      inspected: '9.4',
    },
    {
      id: 3,
      title: 'Suzuki GS 150 2024',
      price: 'PKR 2.5 lacs',
      year: '2024',
      km: '0 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: true,
      isStarred: false,
      imagesCount: 8,
      managed: false,
      inspected: null,
    },
  ],
  'Autostore': [
    {
      id: 1,
      title: 'All Purpose Cleaner',
      price: 'PKR 1,200',
      year: '2024',
      km: 'New',
      city: 'Karachi',
      fuel: 'Product',
      image: require('../assets/images/cleaner.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 6,
      managed: true,
      inspected: null,
    },
    {
      id: 2,
      title: 'Car Care Kit Premium',
      price: 'PKR 2,500',
      year: '2024',
      km: 'New',
      city: 'Lahore',
      fuel: 'Product',
      image: require('../assets/images/carecarkit.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 8,
      managed: true,
      inspected: null,
    },
    {
      id: 3,
      title: 'Car Wax & Polish',
      price: 'PKR 1,800',
      year: '2024',
      km: 'New',
      city: 'Islamabad',
      fuel: 'Product',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: false,
      imagesCount: 5,
      managed: false,
      inspected: null,
    },
  ],
};

// Helper function to extract price from string
const extractPriceFromString = (priceString) => {
  const lowerPrice = priceString.toLowerCase();
  
  // Handle crore prices
  if (lowerPrice.includes('crore')) {
    const match = priceString.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return parseFloat(match[1]) * 10000000; // Convert to rupees
    }
  }
  
  // Handle lacs/lakhs prices
  if (lowerPrice.includes('lac') || lowerPrice.includes('lakh')) {
    const match = priceString.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return parseFloat(match[1]) * 100000; // Convert to rupees
    }
  }
  
  // Handle direct rupee amounts
  const numbers = priceString.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    return parseInt(numbers.join(''));
  }
  
  return 0;
};

// Enhanced AI Search Filter Function
const applyAISearchFilters = (cars, searchParams) => {
  let filtered = [...cars];

  // Filter by exact price (most precise)
  if (searchParams.exactPrice) {
    const { type, amount } = searchParams.exactPrice;
    filtered = filtered.filter(car => {
      const price = extractPriceFromString(car.price);
      if (type === 'under') {
        return price <= amount;
      } else if (type === 'over') {
        return price >= amount;
      }
      return true;
    });
  }
  // Filter by price range (fallback)
  else if (searchParams.priceRange) {
    switch (searchParams.priceRange) {
      case 'cheap':
      case 'under 30 lacs':
        filtered = filtered.filter(car => {
          const price = extractPriceFromString(car.price);
          return price < 3000000; // 30 lacs
        });
        break;
      case 'under 50 lacs':
        filtered = filtered.filter(car => {
          const price = extractPriceFromString(car.price);
          return price < 5000000; // 50 lacs
        });
        break;
      case 'under 1 crore':
        filtered = filtered.filter(car => {
          const price = extractPriceFromString(car.price);
          return price < 10000000; // 1 crore
        });
        break;
      case 'under 2 crore':
        filtered = filtered.filter(car => {
          const price = extractPriceFromString(car.price);
          return price < 20000000; // 2 crore
        });
        break;
      case 'over 1 crore':
        filtered = filtered.filter(car => {
          const price = extractPriceFromString(car.price);
          return price > 10000000; // 1 crore
        });
        break;
      case 'over 2 crore':
        filtered = filtered.filter(car => {
          const price = extractPriceFromString(car.price);
          return price > 20000000; // 2 crore
        });
        break;
      case 'expensive':
      case 'luxury':
        filtered = filtered.filter(car => {
          const price = extractPriceFromString(car.price);
          return price > 5000000; // 50 lacs
        });
        break;
    }
  }

  // Filter by location
  if (searchParams.location) {
    filtered = filtered.filter(car => 
      car.city.toLowerCase().includes(searchParams.location.toLowerCase())
    );
  }

  // Filter by year
  if (searchParams.year) {
    if (searchParams.year === 'new' || searchParams.year === '2024') {
      filtered = filtered.filter(car => car.year === '2024');
    } else if (searchParams.year === 'recent' || searchParams.year === '2023') {
      filtered = filtered.filter(car => car.year === '2023');
    } else if (searchParams.year === '2022') {
      filtered = filtered.filter(car => car.year === '2022');
    } else if (searchParams.year === '2021') {
      filtered = filtered.filter(car => car.year === '2021');
    } else if (searchParams.year === 'old') {
      filtered = filtered.filter(car => parseInt(car.year) < 2020);
    }
  }

  // Filter by features
  if (searchParams.features.length > 0) {
    searchParams.features.forEach(feature => {
      switch (feature) {
        case 'new':
          filtered = filtered.filter(car => car.isNew);
          break;
        case 'used':
          filtered = filtered.filter(car => !car.isNew);
          break;
        case 'fuel efficient':
          filtered = filtered.filter(car => 
            car.fuel === 'Petrol' && parseInt(car.km.replace(/[^\d]/g, '')) < 50000
          );
          break;
        case 'hybrid':
          filtered = filtered.filter(car => car.fuel === 'Hybrid');
          break;
        case 'diesel':
          filtered = filtered.filter(car => car.fuel === 'Diesel');
          break;
        case 'imported':
          filtered = filtered.filter(car => car.title.toLowerCase().includes('imported'));
          break;
        case 'certified':
        case 'inspected':
          filtered = filtered.filter(car => car.inspected !== null);
          break;
        case 'automatic':
          // This would need transmission data in car objects
          break;
        case 'manual':
          // This would need transmission data in car objects
          break;
      }
    });
  }

  return filtered;
};

const CarListScreen = ({ navigation, route }) => {
  const { model, showSuccessMessage, newListing, aiSearchParams, originalQuery } = route.params;
  console.log('CarListScreen - Model:', model, 'Route params:', route.params);
  const insets = useSafeAreaInsets();

  // Sticky bar state
  const [showStickyBar, setShowStickyBar] = useState(false);
  const scrollY = useRef(0);
  
  // Sell modal state
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Car data state - now using state to trigger re-renders
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [isAISearch, setIsAISearch] = useState(false);
  
  // Search state
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Notification state
  const [notificationCount, setNotificationCount] = useState(global.notifications?.length || 0);
  
  // API loading state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Note: Affiliation is now purely manual - no automatic affiliation creation

  // Initialize car data manager with static data and fetch from API
  useEffect(() => {
    const loadVehicles = async () => {
      setIsLoading(true);
      setApiError(null);
      
      try {
        // First, load static data as fallback
        console.log('CarData for Daihatsu Mira:', carData['Daihatsu Mira']);
        initializeCarData(carData);
        
        // Get initial cars for this model from static data
        const initialCars = getCarsForModel(model, carData);
        console.log('Initial cars loaded for model:', model, 'Cars:', initialCars);
        setCars(initialCars);
        
        // Fetch from API
        console.log('Fetching vehicles from API...');
        const apiResponse = await vehiclesService.getVehicles();
        console.log('API Response:', apiResponse);
        
        if (apiResponse && apiResponse.data && apiResponse.data.data) {
          // Transform API data to match our car format
          const apiCars = apiResponse.data.data.map(vehicle => ({
            id: vehicle.id,
            title: vehicle.title || `${vehicle.make?.name} ${vehicle.model?.name}`,
            price: `PKR ${vehicle.price ? parseFloat(vehicle.price).toLocaleString() : 'N/A'}`,
            year: vehicle.year?.toString() || 'N/A',
            km: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A',
            city: vehicle.location || 'N/A',
            fuel: vehicle.fuel_type || 'N/A',
            image: vehicle.images && vehicle.images.length > 0 
              ? { uri: `http://192.168.18.104:8000/${vehicle.images[0]}` }
              : require('../assets/images/alto.webp'),
            isNew: vehicle.condition === 'new',
            isStarred: vehicle.is_featured || false,
            imagesCount: vehicle.images ? vehicle.images.length : 0,
            managed: false, // Not in API response
            inspected: null, // Not in API response
            sellerEmail: vehicle.user?.email,
            sellerName: vehicle.user?.name,
            biddingEnabled: false, // Not in API response
            biddingEndTime: null,
            currentBid: null,
            bids: [],
            highestBidder: null,
          }));
          
          console.log('Transformed API cars:', apiCars);
          setCars(apiCars);
          
          // Apply AI search filters if available
          if (aiSearchParams) {
            setIsAISearch(true);
            const filtered = applyAISearchFilters(apiCars, aiSearchParams);
            setFilteredCars(filtered);
          } else {
            setFilteredCars(apiCars);
          }
        } else {
          // Use static data if API doesn't return expected format
          console.log('Using static data as fallback');
          if (aiSearchParams) {
            setIsAISearch(true);
            const filtered = applyAISearchFilters(initialCars, aiSearchParams);
            setFilteredCars(filtered);
          } else {
            setFilteredCars(initialCars);
          }
        }
      } catch (error) {
        console.error('Error loading vehicles:', error);
        setApiError(error.message);
        
        // Use static data as fallback
        const initialCars = getCarsForModel(model, carData);
        setCars(initialCars);
        
        if (aiSearchParams) {
          setIsAISearch(true);
          const filtered = applyAISearchFilters(initialCars, aiSearchParams);
          setFilteredCars(filtered);
        } else {
          setFilteredCars(initialCars);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVehicles();
    
    // Listen for updates to any car in this model (for static data)
    const unsubscribe = addModelUpdateListener(model, carData, (updatedCars) => {
      // Only update if we're not loading from API
      if (!isLoading) {
        setCars(updatedCars);
        
        // Apply search and AI filters
        let finalFiltered = updatedCars;
        
        // Apply AI filters if they exist
        if (aiSearchParams) {
          finalFiltered = applyAISearchFilters(updatedCars, aiSearchParams);
        }
        
        // Apply search filter if active
        if (searchText.trim() !== '') {
          const searchLower = searchText.toLowerCase();
          finalFiltered = finalFiltered.filter(car => {
            if (car.title.toLowerCase().includes(searchLower)) return true;
            if (car.price.toLowerCase().includes(searchLower)) return true;
            if (car.city.toLowerCase().includes(searchLower)) return true;
            if (car.year.toLowerCase().includes(searchLower)) return true;
            if (car.fuel.toLowerCase().includes(searchLower)) return true;
            if (car.sellerName && car.sellerName.toLowerCase().includes(searchLower)) return true;
            if (car.sellerEmail && car.sellerEmail.toLowerCase().includes(searchLower)) return true;
            return false;
          });
        }
        
        setFilteredCars(finalFiltered);
      }
    });
    
    return unsubscribe;
  }, [model, aiSearchParams]);

  // Show success message if coming from new ad creation
  useEffect(() => {
    if (showSuccessMessage && newListing) {
      setSuccessModalVisible(true);
    }
  }, [showSuccessMessage, newListing]);

  // Update notification count when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setNotificationCount(global.notifications?.length || 0);
    });
    return unsubscribe;
  }, [navigation]);

  const handleSellOption = (option) => {
    setSellModalVisible(false);
    // Handle different sell options here
    console.log('Selected sell option:', option);
    // You can navigate to different screens based on the option
    switch (option) {
      case 'car':
        // Navigate to car selling screen
        break;
      case 'bike':
        // Navigate to bike selling screen
        break;
      case 'autoparts':
        // Navigate to auto parts selling screen
        break;
    }
  };

  // Handler for scroll event
  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    scrollY.current = y;
    setShowStickyBar(y > 60); // Show sticky bar after scrolling 60px
  };

  // AI Search function - same as SearchUsedCars.js
  const handleSearch = (text) => {
    setSearchText(text);
    setIsSearching(text.trim() !== '');
    
    if (text.trim() === '') {
      // Reset to original filtered cars (AI search or all cars)
      if (aiSearchParams) {
        const filtered = applyAISearchFilters(cars, aiSearchParams);
        setFilteredCars(filtered);
      } else {
        setFilteredCars(cars);
      }
    } else {
      // Check if this looks like a natural language query
      const isNaturalLanguage = text.split(' ').length > 1 || 
                               text.includes('under') || 
                               text.includes('in') || 
                               text.includes('with') ||
                               text.includes('for') ||
                               text.includes('cheap') ||
                               text.includes('expensive') ||
                               text.includes('new') ||
                               text.includes('used') ||
                               text.includes('over') ||
                               text.includes('above') ||
                               text.includes('below');

      if (isNaturalLanguage) {
        // Use AI search to get search parameters
        const aiResult = processAISearch(text);
        
        // Apply AI search filters to current cars
        const aiFiltered = applyAISearchFilters(cars, aiResult.searchParams);
        setFilteredCars(aiFiltered);
        setIsAISearch(true);
      } else {
        // Use traditional search within current cars
        const searchLower = text.toLowerCase();
        const searchResults = cars.filter(car => {
          // Search in title
          if (car.title.toLowerCase().includes(searchLower)) return true;
          
          // Search in price
          if (car.price.toLowerCase().includes(searchLower)) return true;
          
          // Search in city
          if (car.city.toLowerCase().includes(searchLower)) return true;
          
          // Search in year
          if (car.year.toLowerCase().includes(searchLower)) return true;
          
          // Search in fuel type
          if (car.fuel.toLowerCase().includes(searchLower)) return true;
          
          // Search in seller name
          if (car.sellerName && car.sellerName.toLowerCase().includes(searchLower)) return true;
          
          // Search in seller email
          if (car.sellerEmail && car.sellerEmail.toLowerCase().includes(searchLower)) return true;
          
          return false;
        });
        
        // Apply existing AI filters if they exist
        if (aiSearchParams) {
          const combinedFiltered = applyAISearchFilters(searchResults, aiSearchParams);
          setFilteredCars(combinedFiltered);
        } else {
          setFilteredCars(searchResults);
        }
        setIsAISearch(false);
      }
    }
  };

  const Root = Platform.OS === 'ios' ? SafeAreaView : View;
  const rootStyle = [styles.safeArea];
  return (
    <Root style={[rootStyle, { direction: 'ltr' }]}>
      {/* Blue background only for top safe area on iOS */}
      {Platform.OS === 'ios' && insets.top > 0 && (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: insets.top, backgroundColor: '#900C3F', zIndex: 100 }} />
      )}
      {/* Sticky Filter/Sort Bar and Results Row */}
      {showStickyBar && (
        <View style={{ position: 'absolute', top: insets.top , left: 0, right: 0, zIndex: 200 }}>
          <View style={styles.filterBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.topTabs, { direction: 'ltr' }]}>
              <TouchableOpacity style={[styles.filterBtn, styles.filterBtnSortFilter]}>
                <Text style={styles.filterBtnSortIcon}>⇅</Text>
                <Text style={styles.filterBtnSortFilterText}>Sort</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterBtn, styles.filterBtnSortFilter]}>
                <View style={styles.filterIconBadgeWrapper}>
                  <Text style={styles.filterBtnFilterIcon}>⛭</Text>
                  <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>1</Text></View>
                </View>
                <Text style={styles.filterBtnSortFilterText}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>Price</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>Location</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>{model}</Text></TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.resultsRow}>
            <Text style={styles.resultsText}>{cars.length} results</Text>
            <TouchableOpacity><Text style={styles.saveSearch}>Save Search</Text></TouchableOpacity>
          </View>
        </View>
      )}
      {/* Top Blue Bar for iOS inside SafeAreaView, for Android as before */}
      {Platform.OS === 'ios' ? <View style={styles.topBlueBar} /> : null}
      {Platform.OS === 'android' ? <View style={styles.topBlueBar} /> : null}
      {/* Main vertical scrollable content */}
      <ScrollView
        style={{ flex: 1, direction: 'ltr' }}
        contentContainerStyle={{ paddingBottom: 80, direction: 'ltr' }}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header/Search Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
            <Image source={require('../assets/images/back_arrow.png')} style={styles.headerBackArrow} />
          </TouchableOpacity>
          <View style={styles.headerSearchWrapper}>
            <TextInput
              style={styles.headerSearchInput}
              placeholder="Search"
              placeholderTextColor="#444"
              value={searchText}
              onChangeText={handleSearch}
              textAlign="left"
              textAlignVertical="center"
              writingDirection="ltr"
            />
            <TouchableOpacity 
              style={styles.headerSearchIconBtn}
              onPress={() => {
                if (searchText.trim() !== '') {
                  handleSearch('');
                }
              }}
            >
              <Text style={styles.headerSearchIcon}>
                {searchText.trim() !== '' ? '✕' : '🔍'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.headerNotificationBtn}
            onPress={() => navigation.navigate('NotificationScreen')}
          >
            <Text style={styles.headerNotificationIcon}>🔔</Text>
            {notificationCount > 0 && (
              <View style={styles.headerNotificationBadge}>
                <Text style={styles.headerNotificationCount}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* Filter/Sort Bar */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.topTabs, { direction: 'ltr' }]}>
            <TouchableOpacity style={[styles.filterBtn, styles.filterBtnSortFilter]}>
              <Text style={styles.filterBtnSortIcon}>⇅</Text>
              <Text style={styles.filterBtnSortFilterText}>Sort</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterBtn, styles.filterBtnSortFilter]}>
              <View style={styles.filterIconBadgeWrapper}>
                <Text style={styles.filterBtnFilterIcon}>⛭</Text>
                <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>1</Text></View>
              </View>
              <Text style={styles.filterBtnSortFilterText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>Price</Text></TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>Location</Text></TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>{model}</Text></TouchableOpacity>
          </ScrollView>
        </View>
        {/* AI Search Info */}
        {isAISearch && originalQuery && (
          <View style={styles.aiSearchInfo}>
            <Text style={styles.aiSearchInfoText}>🤖 AI Search: "{originalQuery}"</Text>
            <Text style={styles.aiSearchInfoSubtext}>Showing filtered results based on your query</Text>
          </View>
        )}

        {/* Local AI Search Indicator */}
        {isAISearch && searchText && !originalQuery && (
          <View style={styles.aiSearchInfo}>
            <Text style={styles.aiSearchInfoText}>🤖 AI Search: "{searchText}"</Text>
            <Text style={styles.aiSearchInfoSubtext}>Searching within current results</Text>
          </View>
        )}

        {/* Results Row */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            {isSearching ? `Search results: ${filteredCars.length}` : `${filteredCars.length} results`}
          </Text>
          <TouchableOpacity><Text style={styles.saveSearch}>Save Search</Text></TouchableOpacity>
        </View>
        
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
            <Text style={styles.loadingText}>Loading vehicles...</Text>
          </View>
        )}
        
        {/* Error State */}
        {apiError && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ API Error: {apiError}</Text>
            <Text style={styles.errorSubtext}>Showing cached data</Text>
          </View>
        )}
        {/* Car List */}
        {filteredCars.map((car) => (
          <TouchableOpacity
            key={car.id}
            style={styles.card}
            onPress={() => navigation.navigate('CarDetailScreen', { car: car })}
          >
            {/* Seller Information */}
            {(car.sellerName || car.sellerEmail || car.formData?.contactInfo?.name || car.formData?.contactInfo?.email) && (
              <View style={styles.sellerInfo}>
                <View style={styles.sellerInfoHeader}>
                  <View style={styles.sellerNameContainer}>
                    <Text style={styles.sellerName}>
                      {car.sellerName || 
                        car.sellerEmail || 
                        (car.formData?.contactInfo?.name) || 
                        (car.formData?.contactInfo?.email)
                      }
                    </Text>
                    {(car.sellerEmail || car.formData?.contactInfo?.email) && (() => {
                      const sellerEmail = car.sellerEmail || car.formData?.contactInfo?.email;
                      const sellerBadge = getUserBadge(sellerEmail);
                      const sellerAffiliation = getUserAffiliation(sellerEmail);
                      console.log('Seller badge for', sellerEmail, ':', sellerBadge);
                      console.log('Seller affiliation for', sellerEmail, ':', sellerAffiliation);
                      return sellerBadge ? (
                        <View style={styles.sellerBadge}>
                          <Image 
                            source={sellerBadge.type === 'organization' ? require('../assets/images/goldtick.png') : require('../assets/images/bluetick.png')}
                            style={styles.sellerBadgeIcon}
                          />
                        </View>
                      ) : null;
                    })()}
                  </View>
                  <TouchableOpacity style={styles.heartButton}>
                    <Text style={styles.heartText}>♡</Text>
                  </TouchableOpacity>
                </View>
                {(car.sellerEmail || car.formData?.contactInfo?.email) && (() => {
                  const sellerEmail = car.sellerEmail || car.formData?.contactInfo?.email;
                  const sellerAffiliation = getUserAffiliation(sellerEmail);
                  return sellerAffiliation?.organizationName ? (
                    <Text style={styles.sellerOrganization}>
                      Affiliated with {sellerAffiliation.organizationName}
                    </Text>
                  ) : null;
                })()}
              </View>
            )}
            
            <View style={styles.cardTopRow}>
              <View style={styles.cardImageWrapper}>
                <Image source={car.image} style={styles.cardImage} resizeMode="cover" />
                {car.isStarred && (
                  <View style={styles.starBadge}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={styles.starBadgeText}>★</Text>
                    </View>
                  </View>
                )}
                {car.isNew && (
                  <View style={styles.newBadge}><Text style={styles.newBadgeText}>new</Text></View>
                )}
                {car.isUserCreated && (
                  <View style={styles.userCreatedBadge}><Text style={styles.userCreatedBadgeText}>Just Posted</Text></View>
                )}
                {car.isFeatured && (
                  <View style={styles.featuredBadge}>
                    <Image source={require('../assets/images/badge.png')} style={styles.featuredBadgeIconOut} />
                    <View style={styles.featuredBadgeTextContainer}>
                      <Text style={styles.featuredBadgeText}>FEATURED</Text>
                    </View>
                  </View>
                )}
                <View style={styles.imageCount}><Text style={styles.imageCountText}>{car.imagesCount}</Text></View>
                
                {car.biddingEnabled && (
                  <View style={styles.biddingBadge}>
                    <Text style={styles.biddingIcon}>🏷️</Text>
                    <Text style={styles.biddingText}>BIDDING</Text>
                    {car.biddingEndTime > Date.now() && (
                      <Text style={styles.biddingTimer}>
                        {Math.floor((car.biddingEndTime - Date.now()) / (1000 * 60 * 60 * 24))}d {Math.floor(((car.biddingEndTime - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View style={styles.cardMainContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{car.title}</Text>
                <Text style={styles.cardPrice}>{car.price}</Text>
                <View style={styles.cardInfoRow}>
                  <Text style={styles.cardInfoIcon}>📅</Text>
                  <Text style={styles.cardInfoText}>{car.year}</Text>
                  <Text style={styles.cardInfoIcon}>⏱️</Text>
                  <Text style={styles.cardInfoText}>{car.km}</Text>
                </View>
                <View style={styles.cardInfoRow}>
                  <Text style={styles.cardInfoIcon}>⛽</Text>
                  <Text style={styles.cardInfoText}>{car.fuel}</Text>
                  <Text style={styles.cardInfoIcon}>📍</Text>
                  <Text style={styles.cardInfoText}>{car.city}</Text>
                </View>
                
                {car.biddingEnabled && (
                  <View style={styles.biddingInfo}>
                    <Text style={styles.biddingCurrentBid}>
                      Current Bid: PKR {car.currentBid?.toLocaleString() || '0'}
                    </Text>
                    <Text style={styles.biddingCount}>
                      {car.bids?.length || 0} bids placed
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {(car.managed || car.certified || car.biddingEnabled) && (
              <>
                <View style={{ height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, marginBottom: 8 }} />
                <View style={styles.badgesRow}>
                  {car.managed && (
                    <View style={styles.badge}><Text style={styles.badgeIcon}>🛞</Text><View style={styles.badgeTextBg}><Text style={styles.badgeText}>MANAGED BY PAKWHEELS</Text></View></View>
                  )}
                  {car.certified && (
                    <View style={styles.badge}>
                      <Image source={require('../assets/images/certified_badge.png')} style={styles.certifiedBadgeIcon} />
                      <View style={styles.badgeTextBg}><Text style={styles.badgeText}>{`INSPECTED ${Math.floor(Math.random() * 6) + 5}/10`}</Text></View>
                    </View>
                  )}
                  {car.biddingEnabled && (
                    <View style={styles.biddingBadgeRow}>
                      <Text style={styles.biddingBadgeIcon}>🏷️</Text>
                      <View style={styles.biddingBadgeTextBg}>
                        <Text style={styles.biddingBadgeText}>LIVE BIDDING</Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </TouchableOpacity>
        ))}
        {/* Car inspection card (static, as in screenshot) */}
        <View style={styles.inspectionCard}>
          <Text style={styles.inspectionCardTitle}>Car inspection</Text>
          <Text style={styles.inspectionCardDesc}>Get your car inspected by our expert over 200 checkpoints</Text>
          <TouchableOpacity><Text style={styles.inspectionCardLink}>Get a car inspected 👨‍🔧</Text></TouchableOpacity>
        </View>
        {/* More car cards for sticky header testing */}
        {filteredCars.map((car, idx) => (
          <TouchableOpacity
            key={`extra-${car.id}-${idx}`}
            style={styles.card}
            onPress={() => navigation.navigate('CarDetailScreen', { car: car })}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.cardImageWrapper}>
                <Image source={car.image} style={styles.cardImage} resizeMode="cover" />
                {car.isStarred && (
                  <View style={styles.starBadge}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={styles.starBadgeText}>★</Text>
                    </View>
                  </View>
                )}
                {car.isNew && (
                  <View style={styles.newBadge}><Text style={styles.newBadgeText}>new</Text></View>
                )}
                {car.isUserCreated && (
                  <View style={styles.userCreatedBadge}><Text style={styles.userCreatedBadgeText}>Just Posted</Text></View>
                )}
                {car.isFeatured && (
                  <View style={styles.featuredBadge}>
                    <Image source={require('../assets/images/badge.png')} style={styles.featuredBadgeIconOut} />
                    <View style={styles.featuredBadgeTextContainer}>
                      <Text style={styles.featuredBadgeText}>FEATURED</Text>
                    </View>
                  </View>
                )}
                <View style={styles.imageCount}><Text style={styles.imageCountText}>{car.imagesCount}</Text></View>
                
                {car.biddingEnabled && (
                  <View style={styles.biddingBadge}>
                    <Text style={styles.biddingIcon}>🏷️</Text>
                    <Text style={styles.biddingText}>BIDDING</Text>
                    {car.biddingEndTime > Date.now() && (
                      <Text style={styles.biddingTimer}>
                        {Math.floor((car.biddingEndTime - Date.now()) / (1000 * 60 * 60 * 24))}d {Math.floor(((car.biddingEndTime - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View style={styles.cardMainContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{car.title} (Extra)</Text>
                <Text style={styles.cardPrice}>{car.price}</Text>
                <View style={styles.cardInfoRow}>
                  <Text style={styles.cardInfoIcon}>📅</Text>
                  <Text style={styles.cardInfoText}>{car.year}</Text>
                  <Text style={styles.cardInfoIcon}>⏱️</Text>
                  <Text style={styles.cardInfoText}>{car.km}</Text>
                </View>
                <View style={styles.cardInfoRow}>
                  <Text style={styles.cardInfoIcon}>⛽</Text>
                  <Text style={styles.cardInfoText}>{car.fuel}</Text>
                  <Text style={styles.cardInfoIcon}>📍</Text>
                  <Text style={styles.cardInfoText}>{car.city}</Text>
                </View>
                
                {car.biddingEnabled && (
                  <View style={styles.biddingInfo}>
                    <Text style={styles.biddingCurrentBid}>
                      Current Bid: PKR {car.currentBid?.toLocaleString() || '0'}
                    </Text>
                    <Text style={styles.biddingCount}>
                      {car.bids?.length || 0} bids placed
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {(car.managed || car.certified || car.biddingEnabled) && (
              <>
                <View style={{ height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, marginBottom: 8 }} />
                <View style={styles.badgesRow}>
                  {car.managed && (
                    <View style={styles.badge}><Text style={styles.badgeIcon}>🛞</Text><View style={styles.badgeTextBg}><Text style={styles.badgeText}>MANAGED BY PAKWHEELS</Text></View></View>
                  )}
                  {car.certified && (
                    <View style={styles.badge}>
                      <Image source={require('../assets/images/certified_badge.png')} style={styles.certifiedBadgeIcon} />
                      <View style={styles.badgeTextBg}><Text style={styles.badgeText}>{`INSPECTED ${Math.floor(Math.random() * 6) + 5}/10`}</Text></View>
                    </View>
                  )}
                  {car.biddingEnabled && (
                    <View style={styles.biddingBadgeRow}>
                      <Text style={styles.biddingBadgeIcon}>🏷️</Text>
                      <View style={styles.biddingBadgeTextBg}>
                        <Text style={styles.biddingBadgeText}>LIVE BIDDING</Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Floating SELL Button */}
      <TouchableOpacity 
        style={styles.sellButton}
        onPress={() => {
          if (!isUserLoggedIn()) {
            setAuthModalVisible(true);
            return;
          }
          setSellModalVisible(true);
        }}
      >
        <Text style={styles.sellButtonText}>SELL</Text>
      </TouchableOpacity>
      
      {/* Sell Modal */}
      <SellModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onSelectOption={handleSellOption}
        navigation={navigation}
      />

      {/* Auth Modal */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSignIn={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignInScreen', {
            returnScreen: 'CarListScreen',
            returnParams: route.params,
            action: 'sell'
          });
        }}
        onSignUp={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignUpScreen', {
            returnScreen: 'CarListScreen',
            returnParams: route.params,
            action: 'sell'
          });
        }}
        action="sell"
        navigation={navigation}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Success!"
        message="Your car ad has been posted successfully!"
        icon="🚗✅"
        action="ok"
      />
    </Root>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafd', direction: 'ltr' },
  topBlueBar: {
    backgroundColor: '#900C3F',
    height: Platform.OS === 'android' ? 36 : 0, // mimic Home.js safe area blue
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#900C3F',
    height: 60,
    paddingHorizontal: 12,
    direction: 'ltr',
    // Remove paddingTop logic, handled by topBlueBar
  },
  headerBackBtn: { padding: 8, marginRight: 4 },
  headerBackArrow: { width: 22, height: 22, resizeMode: 'contain', tintColor: '#fff' },
  headerSearchWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 6, height: 38 },
  headerSearchInput: { flex: 1, fontSize: 16, color: '#222', paddingHorizontal: 10, height: 38, textAlign: 'left', writingDirection: 'ltr' },
  headerSearchIconBtn: { padding: 6 },
  headerSearchIcon: { fontSize: 18, color: '#888' },
  headerNotificationBtn: { 
    padding: 8, 
    marginLeft: 4, 
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerNotificationIcon: { fontSize: 22, color: '#fff' },
  headerNotificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerNotificationCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  filterBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', direction: 'ltr' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 7, marginRight: 10, height: 38 },
  filterBtnText: { color: '#222', fontWeight: '600', fontSize: 15 },
  filterBtnSortFilter: {
    backgroundColor: 'transparent', // No background
    borderWidth: 0, // No border
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderRadius: 0, // No pill/circle
    paddingHorizontal: 14,
    height: 38,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBtnSortFilterText: { color: '#900C3F', fontWeight: '700', fontSize: 15, marginLeft: 2 },
  filterBtnSortIcon: { color: '#900C3F', fontSize: 18, marginRight: 4, fontWeight: '700' },
  filterBtnFilterIcon: { color: '#900C3F', fontSize: 18, marginRight: 4, fontWeight: '700' },
  filterIconBadgeWrapper: { position: 'relative', marginRight: 2, justifyContent: 'center', alignItems: 'center' },
  filterBadge: { position: 'absolute', top: -7, right: -10, backgroundColor: '#e11d48', borderRadius: 8, width: 18, height: 18, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  filterBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  resultsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', direction: 'ltr' },
  resultsText: { color: '#444', fontSize: 14, fontWeight: '400' },
  saveSearch: { color: '#4076A4', fontWeight: '400', fontSize: 14 },
  scrollContent: { padding: 12, paddingBottom: 80 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'visible',
    borderWidth: 2,
    borderColor: '#f3f4f6',
    shadowColor: '#900C3F', // lighter blue shadow
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 }, // bottom-only shadow
    elevation: 7, // Android
    position: 'relative',
  },
  sellerInfo: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sellerInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sellerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  sellerOrganization: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  sellerBadge: {
    marginLeft: 4,
  },
  sellerBadgeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 20, direction: 'ltr' },
  cardImageWrapper: { width: 150, height: 130, borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: '#e11d48', marginRight: 24, position: 'relative', backgroundColor: '#fff' },
  cardImage: { width: '100%', height: '100%' },
  starBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FE5C63',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  starBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12, textAlign: 'center' },
  newBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#900C3F', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 0, zIndex: 2 },
  newBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  userCreatedBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#10b981', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, zIndex: 2 },
  userCreatedBadgeText: { color: '#fff', fontWeight: '700', fontSize: 10, textTransform: 'uppercase' },
  featuredBadge: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingHorizontal: 4, 
    paddingVertical: 0, 
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    overflow: 'visible',
    zIndex: 2 
  },
  featuredBadgeIconOut: {
    position: 'absolute',
    left: -10,
    top: '36%',
    transform: [{ translateY: -13 }],
    width: 34,
    height: 34,
    resizeMode: 'contain',
    zIndex: 2,
  },
  featuredBadgeTextContainer: {
    paddingLeft: 18,
    paddingRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredBadgeText: { 
    color: '#222', 
    fontWeight: '700', 
    fontSize: 11 
  },
  imageCount: { position: 'absolute', left: 6, bottom: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 0 },
  imageCountText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  cardMainContent: { flex: 1, minHeight: 130, justifyContent: 'center', gap: 7 },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#222' },
  cardPrice: { fontWeight: '700', fontSize: 18, color: '#900C3F', marginBottom: 2, marginTop: -4 },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, columnGap: 6, },
  cardInfoIcon: { fontSize: 15, color: '#888', marginRight: 0 },
  cardInfoText: { color: '#888', fontSize: 14, marginRight: 10 },
  heartButton: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  heartText: { color: '#4076A4', fontSize: 18, fontWeight: '700' },
  badgesRow: { flexDirection: 'row', alignItems: 'center', marginTop: 0, marginLeft: 10, marginBottom: 8, direction: 'ltr' },
  badge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: { fontSize: 20, color: '#e11d48', marginRight: 4 },
  badgeText: { color: '#222222', fontWeight: '700', fontSize: 11 },
  certifiedBadgeIcon: { width: 22, height: 22, marginRight: 4, resizeMode: 'contain' },
  inspectionCard: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 2, marginBottom: 18, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  inspectionCardTitle: { fontWeight: '700', fontSize: 18, color: '#900C3F', marginBottom: 4 },
  inspectionCardDesc: { color: '#444', fontSize: 15, marginBottom: 6 },
  inspectionCardLink: { color: '#1275D7', fontSize: 15, fontWeight: '500', marginTop: 2 },
  sellButton: { position: 'absolute', bottom: 50, right: 24, backgroundColor: '#900C3F', borderRadius: 32, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', elevation: 8, zIndex: 10, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  sellButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  badgeTextBg: { backgroundColor: '#f3f4f6', paddingHorizontal: 6, borderRadius: 6, alignSelf: 'center', marginLeft: -4 },
  // Bidding styles
  biddingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: '#fde68a',
    maxWidth: 120,
  },
  biddingIcon: {
    fontSize: 12,
    marginRight: 3,
  },
  biddingText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#d97706',
    textTransform: 'uppercase',
  },
  biddingTimer: {
    fontSize: 8,
    color: '#d97706',
    fontWeight: '600',
    marginLeft: 3,
  },
  biddingInfo: {
    marginTop: 4,
    padding: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  biddingCurrentBid: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d97706',
    marginBottom: 2,
  },
  biddingCount: {
    fontSize: 10,
    color: '#666',
  },
  biddingBadgeRow: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  biddingBadgeIcon: {
    fontSize: 16,
    color: '#d97706',
    marginRight: 4,
  },
  biddingBadgeTextBg: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'center',
    marginLeft: -4,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  biddingBadgeText: {
    color: '#d97706',
    fontWeight: '700',
    fontSize: 10,
  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    direction: 'ltr',
  },
  stickyHeader: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  aiSearchInfo: {
    backgroundColor: '#f0f8ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  aiSearchInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#900C3F',
    marginBottom: 2,
  },
  aiSearchInfoSubtext: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default CarListScreen; 