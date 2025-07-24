import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, SafeAreaView, Image, I18nManager, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const popularCars = [
  'Daihatsu Mira',
  'Honda City',
  'Honda Civic',
  'Suzuki Alto',
  'Suzuki Cultus',
  'Suzuki Mehran',
  'Toyota Corolla',
  'Toyota Land Cruiser',
  'Toyota Prado',
  'Toyota Vitz',
];

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

const SearchUsedCars = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredCars, setFilteredCars] = useState(popularCars);
  const [searchParams, setSearchParams] = useState(null);
  const [isAISearch, setIsAISearch] = useState(false);

  const handleSearch = (text) => {
    setSearchText(text);
    
    if (text.trim() === '') {
      setFilteredCars(popularCars);
      setSearchParams(null);
      setIsAISearch(false);
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
                               text.includes('used');

      if (isNaturalLanguage) {
        // Use AI search
        const aiResult = processAISearch(text);
        setFilteredCars(aiResult.cars);
        setSearchParams(aiResult.searchParams);
        setIsAISearch(true);
      } else {
        // Use traditional search
        const filtered = popularCars.filter(car => 
          car.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCars(filtered);
        setSearchParams(null);
        setIsAISearch(false);
      }
    }
  };

  const handleCarSelect = (car) => {
    if (isAISearch && searchParams) {
      // Navigate with AI search parameters
      navigation.navigate('CarListScreen', { 
        model: car,
        aiSearchParams: searchParams,
        originalQuery: searchText
      });
    } else {
      // Navigate normally
      navigation.navigate('CarListScreen', { model: car });
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim() === '') return;
    
    // If it's an AI search, navigate to the first matched car or a general search
    if (isAISearch && searchParams && filteredCars.length > 0) {
      navigation.navigate('CarListScreen', { 
        model: filteredCars[0],
        aiSearchParams: searchParams,
        originalQuery: searchText
      });
    } else if (filteredCars.length > 0) {
      // If it's a regular search, navigate to the first result
      navigation.navigate('CarListScreen', { model: filteredCars[0] });
    } else {
      // If no results, show a message or navigate to a general search
      Alert.alert(
        'No Results',
        `No cars found for "${searchText}". Try different keywords.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { direction: 'ltr' }]}>
      <View style={[styles.container, { direction: 'ltr' }]}>
        {/* Blue Top Bar for Safe Area, matching Home.js */}
        <View style={styles.topBlueBar} />
        {/* Search Bar with Back Arrow */}
        <View style={styles.searchBarContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/images/back_arrow.png')} style={styles.backArrowImage} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder=""
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus
            textAlign="left"
            textAlignVertical="center"
            writingDirection="ltr"
          />
          <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* AI Search Indicator */}
        {isAISearch && (
          <View style={styles.aiSearchIndicator}>
            <Text style={styles.aiSearchText}>🤖 AI Search: Understanding your query</Text>
          </View>
        )}

        {/* Advanced Search Link - only show when no search is active */}
        {searchText.trim() === '' && (
          <TouchableOpacity style={styles.advancedSearchWrapper}>
            <Text style={styles.advancedSearchText}>Advanced Search</Text>
          </TouchableOpacity>
        )}

        {/* Search Examples */}
        {searchText.trim() === '' && (
          <View style={styles.searchExamples}>
            <Text style={styles.examplesTitle}>Try searching naturally:</Text>
            <View style={styles.examplesList}>
              <Text style={styles.exampleText}>• "cheap Honda in Karachi"</Text>
              <Text style={styles.exampleText}>• "SUV under 1 crore"</Text>
              <Text style={styles.exampleText}>• "new Toyota 2024"</Text>
              <Text style={styles.exampleText}>• "fuel efficient cars"</Text>
              <Text style={styles.exampleText}>• "luxury cars in Lahore"</Text>
            </View>
          </View>
        )}

        {/* Popular Used Cars */}
        <ScrollView 
          style={{ flex: 1, direction: 'ltr' }}
          contentContainerStyle={[styles.scrollContent, { direction: 'ltr' }]} 
          showsVerticalScrollIndicator={true}
        >
          <Text style={[
            styles.sectionTitle,
            searchText.trim() !== '' && styles.searchResultsTitle
          ]}>
            {searchText.trim() === '' ? 'Popular Used Cars' : `Search Results (${filteredCars.length})`}
          </Text>
          <View style={styles.popularListWrapper}>
            {filteredCars.length > 0 ? (
              filteredCars.map((car, idx) => (
                <TouchableOpacity key={car} style={styles.popularCarItem} onPress={() => handleCarSelect(car)}>
                  <Text style={styles.popularCarText}>{car}</Text>
                  {isAISearch && (
                    <Text style={styles.aiMatchText}>AI matched</Text>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No cars found for "{searchText}"</Text>
                <Text style={styles.noResultsSubtext}>Try searching with different keywords or natural language</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#900C3F', direction: 'ltr' },
  container: { flex: 1, backgroundColor: '#f9fafd', direction: 'ltr' },
  topBlueBar: {
    backgroundColor: '#900C3F',
    height: Platform.OS === 'android' ? 36 : 0, // mimic Home.js safe area blue
    width: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    direction: 'ltr',
  },
  backButton: {
    paddingRight: 8,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowIcon: {
    marginLeft: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    paddingLeft: 4,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  advancedSearchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28, // increased for more even spacing
    marginBottom: 18, // keep as is for balance
},
  advancedSearchText: {
    color: '#900C3F',
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
    // no underline, no background, no border radius
},
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '500', // less bold
    color: '#444',
    marginBottom: 12,
    marginLeft: 8, // add left margin
  },
  popularListWrapper: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  popularCarItem: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  popularCarText: {
    fontSize: 17,
    color: '#222',
  },
  unicodeBackArrow: {
    fontSize: 32,
    color: '#900C3F',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  backArrowImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginLeft: 2,
  },
  noResultsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
    marginBottom: 5,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#888',
  },
  searchResultsTitle: {
    fontSize: 18, // Reduced font size for search results
  },
  searchButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 18,
    color: '#900C3F',
  },
  aiSearchIndicator: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSearchText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  searchExamples: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  examplesList: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
  },
  exampleText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  aiMatchText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default SearchUsedCars; 