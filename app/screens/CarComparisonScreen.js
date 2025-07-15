import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'react-native';
import SellModal from '../modals/SellModal';

const CarComparisonScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Specifications');
  const [hideCommonSpecs, setHideCommonSpecs] = useState(true);
  const [sellModalVisible, setSellModalVisible] = useState(false);

  const handleSellOption = (option) => {
    setSellModalVisible(false);
    console.log('Selected sell option:', option);
    // Handle different sell options here
  };

  // Get car data from route params or use default
  const routeCar1 = route.params?.car1;
  const routeCar2 = route.params?.car2;
  
  const car1 = routeCar1 || {
    name: 'Chery Tiggo 8 Pro',
    variant: '1.6 DEX Plus',
    price: 'PKR 95.85 lacs',
    image: require('../assets/images/alto_new_car.png'),
  };

  const car2 = routeCar2 || {
    name: 'Chery Tiggo 4 Pro',
    variant: 'DEX Plus 1.5T',
    price: 'PKR 69.30 lacs',
    image: require('../assets/images/toyota_corolla_new_car.jpg'),
  };

  const specifications = [
    { name: 'Overall Length', value1: '4722 mm', value2: '4318 mm' },
    { name: 'Overall Width', value1: '1860 mm', value2: '1830 mm' },
    { name: 'Overall Height', value1: '1705 mm', value2: '1670 mm' },
    { name: 'Wheel Base', value1: '2710 mm', value2: '2630 mm' },
    { name: 'Ground Clearance', value1: '194 mm', value2: '185 mm' },
    { name: 'Kerb Weight', value1: '1565 KG', value2: '1346 KG' },
    { name: 'Boot Space', value1: '1179 L', value2: '340 L' },
    { name: 'Seating Capacity', value1: '7 persons', value2: '5 persons' },
    { name: 'No. of Doors', value1: '5 doors', value2: '5 doors' },
  ];

  const expandableSpecs = [
    'Engine/ Motor',
    'Transmission',
    'Steering',
    'Suspension & Brakes',
    'Wheels and Tyres',
    'Fuel Economy',
  ];

  const moreComparisons = [
    {
      car1: { name: 'KIA Sorento', image: require('../assets/images/stonic.jpg') },
      car2: { name: 'Chery Tiggo 8 Pro', image: require('../assets/images/alto_new_car.png') },
    },
    {
      car1: { name: 'Toyota Corolla', image: require('../assets/images/toyota_corolla_new_car.jpg') },
      car2: { name: 'Honda Civic', image: require('../assets/images/civic.jpg') },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {car1.name} VS {car2.name}
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareIcon}>↗</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Car Comparison Overview */}
          <View style={styles.comparisonOverview}>
            <View style={styles.carSection}>
              <Image source={car1.image} style={styles.carImage} resizeMode="contain" />
              <Text style={styles.carName}>{car1.name}</Text>
              <Text style={styles.carVariant}>{car1.variant}</Text>
              <Text style={styles.carPrice}>{car1.price}</Text>
              <TouchableOpacity>
                <Text style={styles.usedCarLink}>Used {car1.name}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.vsSection}>
              <View style={styles.vsLine} />
              <View style={styles.vsCircle}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              <View style={styles.vsLine} />
            </View>

            <View style={styles.carSection}>
              <Image source={car2.image} style={styles.carImage} resizeMode="contain" />
              <Text style={styles.carName}>{car2.name}</Text>
              <Text style={styles.carVariant}>{car2.variant}</Text>
              <Text style={styles.carPrice}>{car2.price}</Text>
              <TouchableOpacity>
                <Text style={styles.usedCarLink}>Used {car2.name}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Specifications' && styles.activeTab]}
                onPress={() => setActiveTab('Specifications')}
              >
                <Text style={[styles.tabText, activeTab === 'Specifications' && styles.activeTabText]}>
                  Specifications
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Features' && styles.activeTab]}
                onPress={() => setActiveTab('Features')}
              >
                <Text style={[styles.tabText, activeTab === 'Features' && styles.activeTabText]}>
                  Features
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hide Common Specs Row */}
          <View style={styles.hideCommonRow}>
            <Text style={styles.hideCommonText}>Hide common specs</Text>
            <TouchableOpacity
              style={[styles.toggle, hideCommonSpecs && styles.toggleActive]}
              onPress={() => setHideCommonSpecs(!hideCommonSpecs)}
            >
              <View style={[styles.toggleThumb, hideCommonSpecs && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          {/* Specifications Content */}
          {activeTab === 'Specifications' && (
            <View style={styles.specificationsContent}>
                             {/* Individual Specification Rows */}
               {specifications.map((spec, index) => (
                 <View key={index} style={styles.specRowWithSpacing}>
                   <Text style={styles.specValue}>{spec.value1}</Text>
                   <Text style={styles.specName}>{spec.name}</Text>
                   <Text style={styles.specValue}>{spec.value2}</Text>
                 </View>
               ))}

              

                             {/* Expandable Sections */}
               {expandableSpecs.map((spec, index) => (
                 <View key={index} style={styles.expandableRow}>
                   <Text style={styles.expandableSpecName}>{spec}</Text>
                   <Text style={styles.chevronIcon}>›</Text>
                 </View>
               ))}
            </View>
          )}

          {/* Features Content */}
          {activeTab === 'Features' && (
            <View style={styles.featuresContent}>
              <Text style={styles.comingSoon}>Features comparison coming soon...</Text>
            </View>
          )}

          {/* More Car Comparisons */}
          <View style={styles.moreComparisonsSection}>
            <Text style={styles.moreComparisonsTitle}>More car comparisons</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {moreComparisons.map((comparison, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.comparisonCard}
                  onPress={() => navigation.navigate('CarComparisonScreen', {
                    car1: comparison.car1,
                    car2: comparison.car2
                  })}
                >
                  <View style={styles.comparisonCardContent}>
                    <Image source={comparison.car1.image} style={styles.comparisonCarImage} resizeMode="contain" />
                    <View style={styles.comparisonVsSection}>
                      <View style={styles.comparisonVsLine} />
                      <View style={styles.comparisonVsCircle}>
                        <Text style={styles.comparisonVsText}>VS</Text>
                      </View>
                      <View style={styles.comparisonVsLine} />
                    </View>
                    <Image source={comparison.car2.image} style={styles.comparisonCarImage} resizeMode="contain" />
                  </View>
                  <View style={styles.comparisonCardNames}>
                    <Text style={styles.comparisonCarName}>{comparison.car1.name}</Text>
                    <Text style={styles.comparisonCarName}>{comparison.car2.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.bottomNavIcon}>🏠</Text>
            <Text style={styles.bottomNavLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('AdsScreen')}>
            <Text style={styles.bottomNavIcon}>📢</Text>
            <Text style={styles.bottomNavLabel}>My Ads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellNowButton} onPress={() => setSellModalVisible(true)}>
            <Text style={styles.sellNowPlus}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('ChatScreen')}>
            <Text style={styles.bottomNavIcon}>💬</Text>
            <Text style={styles.bottomNavLabel}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('ProfileScreen')}>
            <Text style={styles.bottomNavIcon}>☰</Text>
            <Text style={styles.bottomNavLabel}>More</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Sell Modal */}
      <SellModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onSelectOption={handleSellOption}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#193A7A',
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafd',
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
  backIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    padding: 8,
  },
  shareIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  comparisonOverview: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 18,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  carSection: {
    flex: 1,
    alignItems: 'center',
  },
  carImage: {
    width: 100,
    height: 70,
    marginBottom: 8,
  },
  carName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginBottom: 4,
  },
  carVariant: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 8,
  },
  usedCarLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  vsSection: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsLine: {
    width: 1,
    height: 50,
    backgroundColor: '#bbb',
    borderStyle: 'dashed',
  },
  vsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  vsText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    transform: [{ scale: 1.02 }],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  hideCommonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 10,
  },
  hideCommonText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '400',
    marginRight: 8,
    marginLeft: 200,
  },
  toggle: {
    width: 40,
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  specificationsContent: {
    paddingHorizontal: 16,
  },
  specSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  specSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  specSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  specRowWithSpacing: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginTop: 8,
  },
  specName: {
    flex: 2,
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginLeft: 40,
  },
  expandableSpecName: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    marginLeft: 8,
  },
  specValue: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  expandableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginTop: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevronIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  featuresContent: {
    padding: 32,
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  moreComparisonsSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  moreComparisonsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  comparisonCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 80
  },
  comparisonCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonCarImage: {
    width: 80,
    height: 60,
    flex: 1,
  },
  comparisonVsSection: {
    width: 40,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  comparisonVsLine: {
    width: 1,
    height: 30,
    backgroundColor: '#bbb',
    borderStyle: 'dashed',
  },
  comparisonVsCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  comparisonVsText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  comparisonCardNames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonCarName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 10,
    elevation: 10,
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
  },
  bottomNavIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#888',
  },
  sellNowButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    zIndex: 20,
    elevation: 6,
    shadowColor: '#2563eb',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sellNowPlus: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default CarComparisonScreen; 