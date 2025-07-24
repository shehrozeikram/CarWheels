import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, TextInput, Alert, I18nManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SellModal from '../modals/SellModal';
import AuthModal from '../modals/AuthModal';
import SuccessModal from '../modals/SuccessModal';
import { isUserLoggedIn } from './auth/AuthUtils';
import { Header, SearchBar, CarCard, LoadingSpinner, EmptyState } from '../components';
import { getUserAffiliation, getUserBadge } from '../utils/AffiliationManager';
import certifiedVehiclesService from '../services/certifiedVehiclesService';

const CertifiedCarsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  // Sticky bar state
  const [showStickyBar, setShowStickyBar] = useState(false);
  const scrollY = useRef(0);
  
  // Sell modal state
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Car data state
  const [certifiedCars, setCertifiedCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  
  // Search state
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Notification state
  const [notificationCount, setNotificationCount] = useState(global.notifications?.length || 0);
  
  // API loading state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Load certified vehicles
  useEffect(() => {
    const loadCertifiedVehicles = async () => {
      setIsLoading(true);
      setApiError(null);
      
      try {
        console.log('Loading certified vehicles...');
        const response = await certifiedVehiclesService.getCertifiedVehicles(50); // Get more certified vehicles
        console.log('Certified Vehicles Response:', response);
        
        console.log('Certified Vehicles Response Structure:', {
          response: response,
          responseType: typeof response,
          hasData: !!response.data,
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          keys: response ? Object.keys(response) : 'no response'
        });
        
        // Handle different possible response structures
        let vehiclesData = null;
        if (response && response.data && Array.isArray(response.data)) {
          vehiclesData = response.data;
        } else if (response && Array.isArray(response)) {
          vehiclesData = response;
        } else if (response && response.data && typeof response.data === 'object') {
          // If data is an object, try to find the vehicles array
          vehiclesData = response.data.vehicles || response.data.data || response.data.items || [];
        } else {
          console.log('No valid vehicles data found in response');
          setCertifiedCars([]);
          setFilteredCars([]);
          return;
        }
        
        console.log('Vehicles data to transform:', vehiclesData);
        
        if (vehiclesData && vehiclesData.length > 0) {
          const transformedVehicles = vehiclesData.map(vehicle => ({
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
            managed: false,
            inspected: null,
            sellerEmail: vehicle.user?.email,
            sellerName: vehicle.user?.name,
            biddingEnabled: false,
            biddingEndTime: null,
            currentBid: null,
            bids: [],
            highestBidder: null,
            isCertified: true, // Mark as certified
          }));
          
          console.log('Transformed Certified Vehicles:', transformedVehicles);
          setCertifiedCars(transformedVehicles);
          setFilteredCars(transformedVehicles);
        } else {
          console.log('No certified vehicles data');
          setCertifiedCars([]);
          setFilteredCars([]);
        }
      } catch (error) {
        console.error('Error loading certified vehicles:', error);
        setApiError(error.message);
        setCertifiedCars([]);
        setFilteredCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertifiedVehicles();
  }, []);

  // Update notification count when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setNotificationCount(global.notifications?.length || 0);
    });
    return unsubscribe;
  }, [navigation]);

  const handleSellOption = (option) => {
    setSellModalVisible(false);
    console.log('Selected sell option:', option);
    switch (option) {
      case 'car':
        break;
      case 'bike':
        break;
      case 'autoparts':
        break;
    }
  };

  // Handler for scroll event
  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    scrollY.current = y;
    setShowStickyBar(y > 60);
  };

  // Search function
  const handleSearch = (text) => {
    setSearchText(text);
    setIsSearching(text.trim() !== '');
    
    if (text.trim() === '') {
      setFilteredCars(certifiedCars);
    } else {
      const searchLower = text.toLowerCase();
      const searchResults = certifiedCars.filter(car => {
        if (car.title.toLowerCase().includes(searchLower)) return true;
        if (car.price.toLowerCase().includes(searchLower)) return true;
        if (car.city.toLowerCase().includes(searchLower)) return true;
        if (car.year.toLowerCase().includes(searchLower)) return true;
        if (car.fuel.toLowerCase().includes(searchLower)) return true;
        if (car.sellerName && car.sellerName.toLowerCase().includes(searchLower)) return true;
        if (car.sellerEmail && car.sellerEmail.toLowerCase().includes(searchLower)) return true;
        return false;
      });
      setFilteredCars(searchResults);
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
              <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>Certified</Text></TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.resultsRow}>
            <Text style={styles.resultsText}>{certifiedCars.length} certified results</Text>
            <TouchableOpacity><Text style={styles.saveSearch}>Save Search</Text></TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Top Blue Bar */}
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
              placeholder="Search certified cars"
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
            <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>Certified</Text></TouchableOpacity>
          </ScrollView>
        </View>

        {/* Results Row */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            {isSearching ? `Search results: ${filteredCars.length}` : `${filteredCars.length} certified results`}
          </Text>
          <TouchableOpacity><Text style={styles.saveSearch}>Save Search</Text></TouchableOpacity>
        </View>
        
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
            <Text style={styles.loadingText}>Loading certified vehicles...</Text>
          </View>
        )}
        
        {/* Error State */}
        {apiError && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ API Error: {apiError}</Text>
            <Text style={styles.errorSubtext}>Unable to load certified vehicles</Text>
          </View>
        )}
        
        {/* Empty State */}
        {!isLoading && !apiError && filteredCars.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No certified vehicles found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
          </View>
        )}
        
        {/* Certified Cars List */}
        {filteredCars.map((car) => (
          <TouchableOpacity
            key={car.id}
            style={styles.card}
            onPress={() => navigation.navigate('CarDetailScreen', { car: car })}
          >
            {/* Seller Information */}
            {(car.sellerName || car.sellerEmail) && (
              <View style={styles.sellerInfo}>
                <View style={styles.sellerInfoHeader}>
                  <View style={styles.sellerNameContainer}>
                    <Text style={styles.sellerName}>
                      {car.sellerName || car.sellerEmail}
                    </Text>
                    {car.sellerEmail && (() => {
                      const sellerBadge = getUserBadge(car.sellerEmail);
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
                {car.sellerEmail && (() => {
                  const sellerAffiliation = getUserAffiliation(car.sellerEmail);
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
                {car.isCertified && (
                  <View style={styles.certifiedBadge}>
                    <Text style={styles.certifiedText}>CERTIFIED</Text>
                  </View>
                )}
                <View style={styles.imageCount}><Text style={styles.imageCountText}>{car.imagesCount}</Text></View>
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
              </View>
            </View>
            
            {/* Certified Badge */}
            <View style={{ height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, marginBottom: 8 }} />
            <View style={styles.badgesRow}>
              <View style={styles.certifiedBadgeRow}>
                <Image source={require('../assets/images/badge.png')} style={styles.certifiedBadgeIcon} />
                <View style={styles.certifiedBadgeTextBg}>
                  <Text style={styles.certifiedBadgeText}>CERTIFIED</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* Car inspection card */}
        <View style={styles.inspectionCard}>
          <Text style={styles.inspectionCardTitle}>Car inspection</Text>
          <Text style={styles.inspectionCardDesc}>Get your car inspected by our expert over 200 checkpoints</Text>
          <TouchableOpacity><Text style={styles.inspectionCardLink}>Get a car inspected 👨‍🔧</Text></TouchableOpacity>
        </View>
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
            returnScreen: 'CertifiedCarsScreen',
            returnParams: route.params,
            action: 'sell'
          });
        }}
        onSignUp={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignUpScreen', {
            returnScreen: 'CertifiedCarsScreen',
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
    height: Platform.OS === 'android' ? 36 : 0,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#900C3F',
    height: 60,
    paddingHorizontal: 12,
    direction: 'ltr',
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
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderRadius: 0,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'visible',
    borderWidth: 2,
    borderColor: '#f3f4f6',
    shadowColor: '#900C3F',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 7,
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
  certifiedBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#10B981', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 0, zIndex: 2 },
  certifiedText: { color: '#fff', fontWeight: '700', fontSize: 13 },
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
  certifiedBadgeRow: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  certifiedBadgeIcon: { width: 22, height: 22, marginRight: 4, resizeMode: 'contain' },
  certifiedBadgeTextBg: { backgroundColor: '#f3f4f6', paddingHorizontal: 6, borderRadius: 6, alignSelf: 'center', marginLeft: -4 },
  certifiedBadgeText: { color: '#222222', fontWeight: '700', fontSize: 11 },
  inspectionCard: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 2, marginBottom: 18, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  inspectionCardTitle: { fontWeight: '700', fontSize: 18, color: '#900C3F', marginBottom: 4 },
  inspectionCardDesc: { color: '#444', fontSize: 15, marginBottom: 6 },
  inspectionCardLink: { color: '#1275D7', fontSize: 15, fontWeight: '500', marginTop: 2 },
  sellButton: { position: 'absolute', bottom: 50, right: 24, backgroundColor: '#900C3F', borderRadius: 32, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', elevation: 8, zIndex: 10, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  sellButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    direction: 'ltr',
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default CertifiedCarsScreen; 