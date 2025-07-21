import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, Image, Modal, I18nManager } from 'react-native';
import SellModal from '../modals/SellModal';
import AuthModal from '../modals/AuthModal';
import SuccessModal from '../modals/SuccessModal';
import InfoModal from '../modals/InfoModal';
import { isUserLoggedIn, getCurrentUser } from './auth/AuthUtils';
import { addCarToManager, updateCarData } from '../utils/CarDataManager';

const AdsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Active');
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [userAds, setUserAds] = useState([]);
  const [promotionModalVisible, setPromotionModalVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Get current user info from global session
  const getCurrentUserInfo = () => {
    return getCurrentUser() || {
      name: 'Shehroze Ikram',
      mobile: '03214554035'
    };
  };

  // Promotion options data
  const promotionOptions = [
    {
      id: 'featured',
      title: 'Featured Badge',
      price: 500,
      icon: '⭐',
      description: 'Get featured placement at the top of search results',
      benefits: ['Higher visibility', 'Premium placement', 'More inquiries'],
      color: '#fde68a',
      textColor: '#d97706'
    },
    {
      id: 'managed',
      title: 'Managed by CarWheels',
      price: 1000,
      icon: '🛞',
      description: 'Professional management of your ad by our experts',
      benefits: ['Expert handling', 'Quality assurance', 'Professional support'],
      color: '#dbeafe',
      textColor: '#1d4ed8'
    },
    {
      id: 'inspected',
      title: 'Inspected by CarWheels',
      price: 1500,
      icon: '🔍',
      description: 'Comprehensive vehicle inspection and quality report',
      benefits: ['Quality verification', 'Buyer confidence', 'Detailed report'],
      color: '#dcfce7',
      textColor: '#16a34a'
    },
    {
      id: 'bidding',
      title: 'Enable Bidding',
      price: 300,
      icon: '🏷️',
      description: 'Allow users to bid on your vehicle with automatic timer',
      benefits: ['Competitive pricing', 'Quick sale', 'Real-time updates'],
      color: '#fef3c7',
      textColor: '#d97706'
    },
    {
      id: 'all',
      title: 'Complete Package',
      price: 2800,
      icon: '🚀',
      description: 'All features combined for maximum visibility and trust',
      benefits: ['All features included', 'Best value', 'Maximum exposure'],
      color: '#fef3c7',
      textColor: '#d97706'
    }
  ];

  // Get all ads created by the current user
  const getUserAds = () => {
    const allAds = [];
    const currentUser = getCurrentUserInfo();
    
    console.log('Current user:', currentUser);
    console.log('Global car listings:', global.carListings);
    
    // Check global car listings for user-created ads
    if (global.carListings) {
      Object.keys(global.carListings).forEach(category => {
        const categoryAds = global.carListings[category];
        console.log(`Category ${category} has ${categoryAds.length} ads`);
        
        const userCategoryAds = categoryAds.filter(ad => {
          const isUserCreated = ad.isUserCreated;
          const nameMatch = ad.formData?.contactInfo?.name === currentUser.name;
          const mobileMatch = ad.formData?.contactInfo?.mobile === currentUser.mobile;
          
          console.log(`Ad ${ad.id}: isUserCreated=${isUserCreated}, nameMatch=${nameMatch}, mobileMatch=${mobileMatch}`);
          console.log(`Ad contact info:`, ad.formData?.contactInfo);
          
          return isUserCreated && nameMatch && mobileMatch;
        });
        
        // Get the latest bidding data from global car data manager
        const updatedUserAds = userCategoryAds.map(ad => {
          if (global.carDataManager && global.carDataManager.cars && global.carDataManager.cars[ad.id]) {
            const updatedAd = global.carDataManager.cars[ad.id];
            return {
              ...ad,
              currentBid: updatedAd.currentBid,
              highestBidder: updatedAd.highestBidder,
              bids: updatedAd.bids,
              biddingEnabled: updatedAd.biddingEnabled,
              biddingEndTime: updatedAd.biddingEndTime
            };
          }
          return ad;
        });
        
        console.log(`Found ${updatedUserAds.length} user ads in category ${category}`);
        allAds.push(...updatedUserAds);
      });
    }
    
    console.log(`Total user ads found: ${allAds.length}`);
    return allAds;
  };

  // Filter ads based on active tab
  const getFilteredAds = () => {
    const allUserAds = getUserAds();
    
    let filteredAds;
    switch (activeTab) {
      case 'Active':
        filteredAds = allUserAds.filter(ad => ad.status !== 'removed' && ad.status !== 'pending');
        break;
      case 'Pending':
        filteredAds = allUserAds.filter(ad => ad.status === 'pending');
        break;
      case 'Removed':
        filteredAds = allUserAds.filter(ad => ad.status === 'removed');
        break;
      default:
        filteredAds = allUserAds;
    }
    
    // Sort ads: Featured ads first, then by date (newest first)
    return filteredAds.sort((a, b) => {
      // First priority: Featured ads come first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // Second priority: Newer ads come first (higher ID = newer)
      return b.id - a.id;
    });
  };

  // Update ads when component mounts or global state changes
  useEffect(() => {
    const updateAds = () => {
      const ads = getFilteredAds();
      setUserAds(ads);
    };
    
    updateAds();
    
    // Set up interval to check for updates (in a real app, use proper state management)
    const interval = setInterval(updateAds, 1000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleSellOption = (option) => {
    setSellModalVisible(false);
    console.log('Selected sell option:', option);
    // Handle different sell options here
  };

  const handleSellButtonPress = () => {
    if (!isUserLoggedIn()) {
      setAuthModalVisible(true);
      return;
    }
    
    setSellModalVisible(true);
  };

  const handleAdAction = (ad, action) => {
    switch (action) {
      case 'edit':
        // Navigate to edit screen (you can implement this later)
        setInfoTitle('Edit Ad');
        setInfoMessage('Edit functionality coming soon!');
        setInfoModalVisible(true);
        break;
      case 'remove':
        // Mark ad as removed
        ad.status = 'removed';
        // Update in global car data manager
        if (ad.id) {
          updateCarData(ad.id, { status: 'removed' });
        }
        setUserAds(getFilteredAds());
        setSuccessModalVisible(true);
        break;
      case 'view':
        navigation.navigate('CarDetailScreen', { car: ad });
        break;
      case 'promote':
        showPromotionOptions(ad);
        break;
    }
  };

  const showPromotionOptions = (ad) => {
    setSelectedAd(ad);
    setPromotionModalVisible(true);
  };

  const applyPromotion = (promotionType) => {
    if (!selectedAd) return;

    // Prepare updates object
    const updates = {};

    // Apply the promotion
    switch (promotionType) {
      case 'featured':
        updates.isFeatured = true;
        break;
      case 'managed':
        updates.managed = true;
        break;
      case 'inspected':
        updates.inspected = '9.2'; // Random inspection score
        break;
      case 'bidding':
        updates.biddingEnabled = true;
        updates.biddingStartTime = Date.now();
        updates.biddingEndTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days from now
        updates.currentBid = parseFloat(selectedAd.price.replace(/[^\d.]/g, '')) * 0.8; // 80% of asking price as starting bid
        updates.bids = [];
        updates.highestBidder = null;
        break;
      case 'all':
        updates.isFeatured = true;
        updates.managed = true;
        updates.inspected = '9.2';
        updates.biddingEnabled = true;
        updates.biddingStartTime = Date.now();
        updates.biddingEndTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
        updates.currentBid = parseFloat(selectedAd.price.replace(/[^\d.]/g, '')) * 0.8;
        updates.bids = [];
        updates.highestBidder = null;
        break;
    }
    
    // Update the ad locally
    Object.assign(selectedAd, updates);
    
    // Update in global car data manager
    if (selectedAd.id) {
      updateCarData(selectedAd.id, updates);
    }
    
    setUserAds(getFilteredAds());
    setPromotionModalVisible(false);
    setSelectedAd(null);
    
    setInfoTitle('Promotion Applied!');
    setInfoMessage(`Your ad now has ${promotionType.toUpperCase()} promotion. It will be more visible to potential buyers!`);
    setInfoModalVisible(true);
  };

  const renderPromotionModal = () => (
    <Modal
      visible={promotionModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setPromotionModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={() => setPromotionModalVisible(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Promote Your Ad</Text>
          <View style={styles.modalSpacer} />
        </View>

        {/* Ad Preview */}
        {selectedAd && (
          <View style={styles.adPreview}>
            <Image 
              source={selectedAd.image} 
              style={styles.adPreviewImage}
              resizeMode="cover"
            />
            <View style={styles.adPreviewInfo}>
              <Text style={styles.adPreviewTitle}>{selectedAd.title}</Text>
              <Text style={styles.adPreviewPrice}>{selectedAd.price}</Text>
            </View>
          </View>
        )}

        {/* Promotion Options */}
        <ScrollView style={styles.promotionOptionsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Choose a Promotion</Text>
          <Text style={styles.sectionSubtitle}>Boost your ad visibility and get more inquiries</Text>
          
          {promotionOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.promotionOption}
              onPress={() => applyPromotion(option.id)}
            >
              <View style={[styles.promotionIconContainer, { backgroundColor: option.color }]}>
                <Text style={styles.promotionOptionIcon}>{option.icon}</Text>
              </View>
              
              <View style={styles.promotionOptionContent}>
                <View style={styles.promotionOptionHeader}>
                  <Text style={styles.promotionOptionTitle}>{option.title}</Text>
                  <Text style={styles.promotionOptionPrice}>PKR {option.price}</Text>
                </View>
                
                <Text style={styles.promotionOptionDescription}>{option.description}</Text>
                
                <View style={styles.benefitsContainer}>
                  {option.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Text style={styles.benefitIcon}>✓</Text>
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.promotionArrow}>
                <Text style={styles.promotionArrowIcon}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.modalFooter}>
          <Text style={styles.modalFooterText}>
            All promotions are applied immediately and valid for the lifetime of your ad
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderAdCard = (ad) => (
    <View key={`${ad.id}-${ad.currentBid}-${ad.bids?.length || 0}`} style={styles.adCard}>
      <TouchableOpacity 
        style={styles.adCardContent}
        onPress={() => handleAdAction(ad, 'view')}
      >
        <Image 
          source={ad.image} 
          style={styles.adImage}
          resizeMode="cover"
        />
        <View style={styles.adInfo}>
          <View style={styles.adHeader}>
            <Text style={styles.adTitle} numberOfLines={2}>{ad.title}</Text>
            {ad.isFeatured && (
              <View style={styles.featuredBadge}>
                <Image source={require('../assets/images/badge.png')} style={styles.featuredBadgeIconOut} />
                <View style={styles.featuredBadgeTextContainer}>
                  <Text style={styles.featuredBadgeText}>FEATURED</Text>
                </View>
              </View>
            )}
          </View>
          <Text style={styles.adPrice}>{ad.price}</Text>
          <View style={styles.adDetails}>
            <Text style={styles.adDetail}>{ad.year} • {ad.km}</Text>
            <Text style={styles.adDetail}>{ad.city}</Text>
          </View>
          <View style={styles.adStatus}>
            <View style={[styles.statusBadge, styles.statusActive]}>
              <Text style={styles.statusText}>Active</Text>
            </View>
            <Text style={styles.adDate}>Posted {new Date(ad.id).toLocaleDateString()}</Text>
          </View>
          
          {/* Promotion Badges */}
          <View style={styles.promotionBadges}>
            {ad.managed && (
              <View style={styles.promotionBadge}>
                <Text style={styles.promotionIcon}>🛞</Text>
                <Text style={styles.promotionText}>Managed</Text>
              </View>
            )}
            {ad.inspected && (
              <View style={styles.promotionBadge}>
                <Image 
                  source={require('../assets/images/certified_badge.png')} 
                  style={styles.certifiedIcon}
                />
                <Text style={styles.promotionText}>Inspected {ad.inspected}/10</Text>
              </View>
            )}
            {ad.biddingEnabled && (
              <View style={styles.biddingBadge}>
                <Text style={styles.biddingIcon}>🏷️</Text>
                <Text style={styles.biddingText}>Bidding Active</Text>
                <Text style={styles.biddingTimer}>
                  {ad.biddingEndTime > Date.now() ? 
                    `${Math.floor((ad.biddingEndTime - Date.now()) / (1000 * 60 * 60 * 24))}d ${Math.floor(((ad.biddingEndTime - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h left` : 
                    'Ended'
                  }
                </Text>
              </View>
            )}
          </View>
          
          {/* Bidding Information */}
          {ad.biddingEnabled && (
            <View style={styles.biddingInfo}>
              <Text style={styles.biddingCurrentBid}>
                Current Bid: PKR {ad.currentBid?.toLocaleString() || '0'}
              </Text>
              {ad.highestBidder && (
                <Text style={styles.biddingBidder}>
                  Highest Bidder: {ad.highestBidder}
                </Text>
              )}
              <Text style={styles.biddingCount}>
                {ad.bids?.length || 0} bids placed
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <View style={styles.adActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleAdAction(ad, 'edit')}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleAdAction(ad, 'promote')}
        >
          <Text style={styles.actionButtonText}>Promote</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleAdAction(ad, 'remove')}
        >
          <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    const filteredAds = getFilteredAds();
    
    if (filteredAds.length === 0) {
      return (
        <View style={styles.contentArea}>
          {/* Placeholder Graphic */}
          <View style={styles.placeholderContainer}>
            <View style={styles.placeholderItem}>
              <View style={styles.placeholderImage} />
              <View style={styles.placeholderTextLines}>
                <View style={styles.textLine} />
                <View style={styles.textLine} />
              </View>
            </View>
            <View style={styles.placeholderItem}>
              <View style={styles.placeholderTextLines}>
                <View style={styles.textLine} />
                <View style={styles.textLine} />
              </View>
            </View>
            <View style={styles.placeholderItem}>
              <View style={styles.placeholderTextLines}>
                <View style={styles.textLine} />
                <View style={styles.textLine} />
              </View>
            </View>
          </View>
          
          <Text style={styles.noAdsTitle}>
            {activeTab === 'Active' ? 'No Active Ads' : 
             activeTab === 'Pending' ? 'No Pending Ads' : 'No Removed Ads'}
          </Text>
          <Text style={styles.noAdsSubtitle}>
            {activeTab === 'Active' ? 
              "You haven't posted anything yet. Would you like to sell something?" :
              activeTab === 'Pending' ?
              "No ads are currently pending approval." :
              "No ads have been removed."
            }
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.adsList} showsVerticalScrollIndicator={false}>
        {filteredAds.map(renderAdCard)}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { direction: 'ltr' }]}>
      <View style={[styles.container, { direction: 'ltr' }]}>
        {/* iOS blue status bar area */}
        {Platform.OS === 'ios' && <SafeAreaView style={{ backgroundColor: '#900C3F' }} />}
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Ads</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Active' && styles.activeTab]} 
            onPress={() => setActiveTab('Active')}
          >
            <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>
              Active ({getUserAds().filter(ad => ad.status !== 'removed' && ad.status !== 'pending').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Pending' && styles.activeTab]} 
            onPress={() => setActiveTab('Pending')}
          >
            <Text style={[styles.tabText, activeTab === 'Pending' && styles.activeTabText]}>
              Pending ({getUserAds().filter(ad => ad.status === 'pending').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Removed' && styles.activeTab]} 
            onPress={() => setActiveTab('Removed')}
          >
            <Text style={[styles.tabText, activeTab === 'Removed' && styles.activeTabText]}>
              Removed ({getUserAds().filter(ad => ad.status === 'removed').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Promotional Features Section */}
        <View style={styles.promotionSection}>
          <Text style={styles.promotionTitle}>Boost Your Ad Visibility</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promotionScroll} contentContainerStyle={{ direction: 'ltr' }}>
            <View style={styles.promotionCard}>
              <Text style={styles.promotionCardIcon}>⭐</Text>
              <Text style={styles.promotionCardTitle}>Featured Badge</Text>
              <Text style={styles.promotionCardPrice}>PKR 500</Text>
              <Text style={styles.promotionCardDesc}>Get featured placement</Text>
            </View>
            <View style={styles.promotionCard}>
              <Text style={styles.promotionCardIcon}>🛞</Text>
              <Text style={styles.promotionCardTitle}>Managed by CarWheels</Text>
              <Text style={styles.promotionCardPrice}>PKR 1000</Text>
              <Text style={styles.promotionCardDesc}>Professional management</Text>
            </View>
            <View style={styles.promotionCard}>
              <Text style={styles.promotionCardIcon}>🔍</Text>
              <Text style={styles.promotionCardTitle}>Inspected by CarWheels</Text>
              <Text style={styles.promotionCardPrice}>PKR 1500</Text>
              <Text style={styles.promotionCardDesc}>Quality assurance</Text>
            </View>
          </ScrollView>
        </View>

        {/* Content Area */}
        {renderContent()}

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.bottomNavIcon}>🏠</Text>
            <Text style={styles.bottomNavLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={styles.bottomNavIcon}>📢</Text>
            <Text style={styles.bottomNavLabelActive}>My Ads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellNowButton} onPress={handleSellButtonPress}>
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

      {/* Auth Modal */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSignIn={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignInScreen', {
            returnScreen: 'AdsScreen',
            returnParams: route.params,
            action: 'sell'
          });
        }}
        onSignUp={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignUpScreen', {
            returnScreen: 'AdsScreen',
            returnParams: route.params,
            action: 'sell'
          });
        }}
        action="sell"
        navigation={navigation}
      />

      {/* Promotion Modal */}
      {renderPromotionModal()}

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Ad Removed Successfully!"
        message="Your ad has been removed from the marketplace."
        action="dismiss"
      />

      {/* Info Modal */}
      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={infoTitle}
        message={infoMessage}
        icon="ℹ️"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#900C3F', paddingBottom: 40, direction: 'ltr' },
  container: { flex: 1, backgroundColor: '#fff', direction: 'ltr' },
  header: {
    backgroundColor: '#900C3F',
    paddingTop: Platform.OS === 'ios' ? 10 : 36,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    direction: 'ltr',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333',
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  adsList: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  adCardContent: {
    flexDirection: 'row',
    padding: 16,
    direction: 'ltr',
  },
  adImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  adInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  adHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    direction: 'ltr',
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  featuredBadge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    overflow: 'visible',
  },
  featuredBadgeIconOut: {
    position: 'absolute',
    left: -10,
    top: '20%',
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
    fontSize: 11,
  },
  adPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#900C3F',
    marginBottom: 4,
  },
  adDetails: {
    marginBottom: 8,
  },
  adDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  adStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    direction: 'ltr',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  adDate: {
    fontSize: 12,
    color: '#999',
  },
  promotionBadges: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    direction: 'ltr',
  },
  promotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  promotionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  promotionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#900C3F',
  },
  certifiedIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  biddingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  biddingIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  biddingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
    marginRight: 4,
  },
  biddingTimer: {
    fontSize: 10,
    color: '#d97706',
    fontWeight: '500',
  },
  biddingInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  biddingCurrentBid: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d97706',
    marginBottom: 2,
  },
  biddingBidder: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  biddingCount: {
    fontSize: 12,
    color: '#666',
  },
  promotionSection: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 10,
  },
  promotionScroll: {
    flexDirection: 'row',
  },
  promotionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 10,
    marginTop: 10,
  },
  promotionCardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  promotionCardTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  promotionCardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#900C3F',
    marginBottom: 4,
  },
  promotionCardDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  adActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#900C3F',
  },
  removeButton: {
    borderRightWidth: 0, // Remove right border for last button
  },
  removeButtonText: {
    color: '#dc2626',
  },
  placeholderContainer: {
    marginBottom: 24,
  },
  placeholderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderTextLines: {
    flex: 1,
  },
  textLine: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 8,
    width: '80%',
  },
  noAdsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noAdsSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Bottom Navigation Styles
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
    direction: 'ltr'
  },
  bottomNavItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  bottomNavIcon: { 
    fontSize: 24, 
    marginBottom: 2 
  },
  bottomNavLabel: { 
    fontSize: 12, 
    color: '#888' 
  },
  bottomNavLabelActive: { 
    fontSize: 12, 
    color: '#900C3F', 
    fontWeight: '700' 
  },
  sellNowButton: { 
    width: 62, 
    height: 62, 
    borderRadius: 31, 
    backgroundColor: '#900C3F', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30, 
    zIndex: 20, 
    elevation: 6, 
    shadowColor: '#900C3F', 
    shadowOpacity: 0.18, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 2 } 
  },
  sellNowPlus: { 
    color: '#fff', 
    fontSize: 36, 
    fontWeight: 'bold', 
    marginTop: -2 
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalCloseButton: {
    padding: 10,
  },
  modalCloseIcon: {
    fontSize: 24,
    color: '#666',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  modalSpacer: {
    width: 40,
  },
  adPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 10,
  },
  adPreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  adPreviewInfo: {
    flex: 1,
  },
  adPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  adPreviewPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#193A7A',
  },
  promotionOptionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  promotionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  promotionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  promotionOptionIcon: {
    fontSize: 28,
  },
  promotionOptionContent: {
    flex: 1,
  },
  promotionOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  promotionOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  promotionOptionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#193A7A',
  },
  promotionOptionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 5,
    color: '#16a34a',
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
  },
  promotionArrow: {
    marginLeft: 10,
  },
  promotionArrowIcon: {
    fontSize: 20,
    color: '#999',
  },
  modalFooter: {
    alignItems: 'center',
    marginTop: 20,
  },
  modalFooterText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default AdsScreen; 