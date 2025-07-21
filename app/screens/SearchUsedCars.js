import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, SafeAreaView, Image, I18nManager } from 'react-native';
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

const SearchUsedCars = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredCars, setFilteredCars] = useState(popularCars);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredCars(popularCars);
    } else {
      const filtered = popularCars.filter(car => 
        car.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCars(filtered);
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
            placeholder="Search used cars"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={handleSearch}
            autoFocus
            textAlign="left"
            textAlignVertical="center"
            writingDirection="ltr"
          />
        </View>

        {/* Advanced Search Link - only show when no search is active */}
        {searchText.trim() === '' && (
          <TouchableOpacity style={styles.advancedSearchWrapper}>
            <Text style={styles.advancedSearchText}>Advanced Search</Text>
          </TouchableOpacity>
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
                <TouchableOpacity key={car} style={styles.popularCarItem} onPress={() => navigation.navigate('CarListScreen', { model: car })}>
                  <Text style={styles.popularCarText}>{car}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No cars found for "{searchText}"</Text>
                <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
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
});

export default SearchUsedCars; 