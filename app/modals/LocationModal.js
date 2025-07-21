import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, Platform, StatusBar, Image } from 'react-native';

const LocationModal = ({ visible, onClose, onSelectLocation }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentView, setCurrentView] = useState('cities'); // 'cities' or 'subLocations'

  const pakistaniCities = [
    {
      name: 'Islamabad',
      subLocations: [
        'F-6 Markaz', 'F-7 Markaz', 'F-8 Markaz', 'F-10 Markaz', 'F-11 Markaz',
        'G-6 Markaz', 'G-7 Markaz', 'G-8 Markaz', 'G-9 Markaz', 'G-10 Markaz',
        'I-8 Markaz', 'I-9 Markaz', 'I-10 Markaz', 'I-11 Markaz',
        'Blue Area', 'Jinnah Super Market', 'Aabpara Market', 'Melody Market',
        'Saddar', 'Rawalpindi Cantt', 'DHA Phase 1', 'DHA Phase 2'
      ]
    },
    {
      name: 'Karachi',
      subLocations: [
        'Clifton', 'Defence Housing Authority (DHA)', 'Gulshan-e-Iqbal', 'Gulistan-e-Jauhar',
        'North Nazimabad', 'Garden East', 'Garden West', 'Saddar', 'Lyari', 'Malir',
        'Korangi', 'Landhi', 'Bin Qasim', 'Shah Faisal Town', 'Gulberg Town',
        'Liaquatabad', 'Nazimabad', 'Orangi Town', 'SITE Town', 'Baldia Town'
      ]
    },
    {
      name: 'Lahore',
      subLocations: [
        'Gulberg', 'Defence Housing Authority (DHA)', 'Model Town', 'Johar Town',
        'Faisal Town', 'Iqbal Town', 'Samnabad', 'Shadman', 'Cantt', 'Anarkali',
        'Mall Road', 'Liberty Market', 'MM Alam Road', 'Harbanspura', 'Raiwind',
        'Wagah', 'Kot Lakhpat', 'Sundar', 'Kahna', 'Jallo'
      ]
    },
    {
      name: 'Rawalpindi',
      subLocations: [
        'Cantt', 'Saddar', 'Raja Bazaar', 'Moti Bazaar', 'Bhabra Bazaar',
        'Lalkurti', 'Westridge', 'DHA Phase 1', 'DHA Phase 2', 'Bahria Town',
        'Askari 14', 'Askari 10', 'Askari 11', 'Askari 12', 'Askari 13',
        'Chaklala', 'Chaklala Cantt', 'Peshawar Road', 'Grand Trunk Road'
      ]
    },
    {
      name: 'Faisalabad',
      subLocations: [
        'D Ground', 'Gulberg', 'Madina Town', 'Jinnah Colony', 'Peoples Colony',
        'Samundri Road', 'Jaranwala Road', 'Sargodha Road', 'Sheikhupura Road',
        'Lyallpur Town', 'Iqbal Town', 'Millat Town', 'Jinnah Town'
      ]
    },
    {
      name: 'Multan',
      subLocations: [
        'Cantt', 'Gulgasht', 'Shah Rukn-e-Alam', 'Bosan Road', 'Vehari Road',
        'Khanewal Road', 'Lodhran Road', 'Dera Ghazi Khan Road', 'Bahawalpur Road'
      ]
    },
    {
      name: 'Peshawar',
      subLocations: [
        'Cantt', 'University Town', 'Hayatabad', 'Gulbahar', 'Saddar',
        'Namak Mandi', 'Qissa Khwani Bazaar', 'Jalozai', 'Charsadda Road'
      ]
    },
    {
      name: 'Quetta',
      subLocations: [
        'Cantt', 'Saddar', 'Jinnah Road', 'Prince Road', 'Mastung Road',
        'Sariab Road', 'Brewery Road', 'Hanna Valley', 'Koh-e-Murdar'
      ]
    },
    {
      name: 'Sialkot',
      subLocations: [
        'Cantt', 'Saddar', 'Daska Road', 'Gujranwala Road', 'Wazirabad Road',
        'Pasrur Road', 'Narowal Road', 'Sambrial', 'Chawinda'
      ]
    },
    {
      name: 'Gujranwala',
      subLocations: [
        'Cantt', 'Saddar', 'Model Town', 'Peoples Colony', 'Satellite Town',
        'Civil Lines', 'Alipur Road', 'Sialkot Road', 'Lahore Road'
      ]
    }
  ];

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentView('subLocations');
  };

  const handleSubLocationSelect = (subLocation) => {
    const fullLocation = `${selectedCity.name}, ${subLocation}`;
    onSelectLocation(fullLocation);
    onClose();
    // Reset state
    setSelectedCity(null);
    setCurrentView('cities');
  };

  const handleBack = () => {
    if (currentView === 'subLocations') {
      setCurrentView('cities');
      setSelectedCity(null);
    } else {
      onClose();
    }
  };

  const renderCities = () => (
    <ScrollView style={styles.listContainer}>
      {pakistaniCities.map((city, index) => (
        <TouchableOpacity
          key={index}
          style={styles.listItem}
          onPress={() => handleCitySelect(city)}
        >
          <Text style={styles.listItemText}>{city.name}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSubLocations = () => (
    <ScrollView style={styles.listContainer}>
      {selectedCity?.subLocations.map((subLocation, index) => (
        <TouchableOpacity
          key={index}
          style={styles.listItem}
          onPress={() => handleSubLocationSelect(subLocation)}
        >
          <Text style={styles.listItemText}>{subLocation}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image source={require('../assets/images/back_arrow.png')} style={styles.backArrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {currentView === 'cities' ? 'Select City' : selectedCity?.name}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        {currentView === 'cities' ? renderCities() : renderSubLocations()}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#193A7A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backArrowImage: {
    width: 22,
    height: 22,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 18,
    color: '#ccc',
  },
});

export default LocationModal; 