import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Platform, Animated } from 'react-native';
import { isUserLoggedIn, getAuthPromptMessage } from './auth/AuthUtils';
import InfoModal from '../modals/InfoModal';

const CarDetailScreen = ({ navigation, route }) => {
  // Use car data from route params if available, otherwise use placeholder data
  const car = route.params?.car || {
    title: 'Suzuki Alto VXL AGS',
    price: 'PKR 2,800,000',
    location: 'Nazimabad, Karachi',
    image: require('../assets/images/alto.webp'),
    badges: [
      { label: 'MANAGED BY PAKWHEELS', icon: require('../assets/images/badge.png') },
      { label: 'CERTIFIED', icon: require('../assets/images/certified_badge.png') },
    ],
    featured: true,
    managedText: 'The sale of this car is managed by Pakwheels to provide you with the best deal.',
  };

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [infoIcon, setInfoIcon] = useState('ℹ️');
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleContactAction = (action) => {
    if (!isUserLoggedIn()) {
      // This will be handled by the AuthModal system
      return;
    }

    // Handle the actual contact action
    switch (action) {
      case 'call':
        setInfoTitle('Call Seller');
        setInfoMessage('Calling seller...');
        setInfoIcon('📞');
        setInfoModalVisible(true);
        break;
      case 'sms':
        setInfoTitle('SMS');
        setInfoMessage('Sending SMS...');
        setInfoIcon('💬');
        setInfoModalVisible(true);
        break;
      case 'chat':
        setInfoTitle('Chat');
        setInfoMessage('Opening chat...');
        setInfoIcon('💭');
        setInfoModalVisible(true);
        break;
      case 'whatsapp':
        setInfoTitle('WhatsApp');
        setInfoMessage('Opening WhatsApp...');
        setInfoIcon('📱');
        setInfoModalVisible(true);
        break;
      default:
        break;
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const y = event.nativeEvent.contentOffset.y;
        setShowStickyHeader(y > 220); // Show sticky header after image
      },
    }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sticky Header */}
      {showStickyHeader && (
        <View style={styles.stickyHeader}>
          <TouchableOpacity style={styles.stickyBackButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/images/back_arrow.png')} style={styles.stickyBackArrowImage} />
          </TouchableOpacity>
          <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{car.title}</Text>
          <View style={styles.stickyHeaderIcons}>
            <TouchableOpacity style={styles.stickyHeaderIconCircle}>
              <Image source={require('../assets/images/share.webp')} style={styles.stickyHeaderIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.stickyHeaderIconCircle}>
              <Text style={styles.stickyHeaderHeart}>♡</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.container}>
        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          {/* Top Image and Title (now inside scrollable area) */}
          <View style={styles.imageHeaderWrapper}>
            <Image source={car.image} style={styles.mainCarImage} resizeMode="contain" />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Image source={require('../assets/images/back_arrow.png')} style={styles.headerBackArrowImage} />
            </TouchableOpacity>
            <Text style={styles.carTitle} numberOfLines={1}>{car.title}</Text>
            {car.featured && (
              <View style={styles.featuredBadge}>
                <Image source={require('../assets/images/badge.png')} style={styles.featuredBadgeIconOut} />
                <View style={styles.featuredBadgeTextContainer}>
                  <Text style={styles.featuredBadgeText}>FEATURED</Text>
                </View>
              </View>
            )}
            <View style={styles.topRightButtons}>
              <TouchableOpacity style={styles.iconCircle}>
                <Image source={require('../assets/images/share.webp')} style={styles.shareIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <Text style={styles.iconText}>♡</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageCount}><Text style={styles.imageCountText}>1/14</Text></View>
          </View>
          {/* Badges Row */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}><Text style={styles.badgeIcon}>🛞</Text><Text style={styles.badgeText}>MANAGED BY PAKWHEELS</Text></View>
            <View style={styles.badge}>
              <Image source={require('../assets/images/certified_badge.png')} style={styles.certifiedBadgeIcon} />
              <Text style={styles.badgeText}>CERTIFIED</Text>
            </View>
          </View>
          {/* Title, Price, Location */}
          <View style={styles.detailBlock}>
            <Text style={styles.detailTitle}>{car.title}</Text>
            <Text style={styles.detailPrice}>{car.price}</Text>
            <Text style={styles.detailLocation}>📍 {car.location}</Text>
          </View>
          {/* Managed by PakWheels Section */}
          <View style={styles.managedSection}>
            <View style={styles.managedRow}>
              <Text style={styles.managedIcon}>🛞</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.managedTitle}>MANAGED BY PAKWHEELS</Text>
                <Text style={styles.managedDesc}>{car.managedText}</Text>
                <Text style={styles.managedLink}>I also want to sell through PakWheels experts⚡</Text>
              </View>
            </View>
          </View>
          {/* Inspection Score Card (separate card) */}
          <View style={styles.inspectionCard}>
            <View style={styles.inspectionCardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inspectionCardLabel}>Inspection score</Text>
                <View style={styles.inspectionCardScoreRow}>
                  <Text style={styles.inspectionCardShield}>🛡️</Text>
                  <Text style={styles.inspectionCardScore}>8.4/10</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.inspectionCardArrowBtn}>
                <Text style={styles.inspectionCardArrow}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Details Table Section (no inspection score here, not in a card) */}
          <View style={styles.detailsIconsRow}>
            <View style={styles.detailsIconCol}><Text style={styles.detailsIcon}>📅</Text><Text style={styles.detailsIconLabel}>2022</Text></View>
            <View style={styles.detailsIconCol}><Text style={styles.detailsIcon}>⏱️</Text><Text style={styles.detailsIconLabel}>70,298 km</Text></View>
            <View style={styles.detailsIconCol}><Text style={styles.detailsIcon}>⛽</Text><Text style={styles.detailsIconLabel}>Petrol</Text></View>
            <View style={styles.detailsIconCol}><Text style={styles.detailsIcon}>⚙️</Text><Text style={styles.detailsIconLabel}>Automatic</Text></View>
          </View>
          <View style={styles.detailsTableRow}><Text style={styles.detailsTableLabel}>Registered In</Text><Text style={styles.detailsTableValue}>Sindh</Text></View>
          <View style={styles.detailsTableRow}><Text style={styles.detailsTableLabel}>Exterior Color</Text><Text style={styles.detailsTableValue}>Grey</Text></View>
          <View style={styles.detailsTableRow}><Text style={styles.detailsTableLabel}>Assembly</Text><Text style={styles.detailsTableValue}>Local</Text></View>
          <View style={styles.detailsTableRow}><Text style={styles.detailsTableLabel}>Engine Capacity</Text><Text style={styles.detailsTableValue}>660</Text></View>
          <View style={styles.detailsTableRow}><Text style={styles.detailsTableLabel}>Body Type</Text><Text style={styles.detailsTableValue}>Hatchback</Text></View>
          <View style={styles.detailsTableRow}><Text style={styles.detailsTableLabel}>Last Updated</Text><Text style={styles.detailsTableValue}>08 Jul 2025</Text></View>
          <View style={styles.detailsTableRow}><Text style={styles.detailsTableLabel}>Ad ID</Text><Text style={styles.detailsTableValue}>10214120</Text></View>
          <View style={styles.detailsTableRow}><Text style={styles.detailsTableLabel}>Date of Inspection</Text><Text style={styles.detailsTableValue}>18 Jun 2025</Text></View>
          {/* Divider after details table */}
          <View style={styles.detailsDivider} />
          {/* PakWheels Inspection Report Section (no card, more spacing) */}
          <View style={styles.inspectionReportSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 26, marginTop: 16 }}>
              <Text style={styles.inspectionReportTitle}>PakWheels Inspection Report</Text>
              <Image source={require('../assets/images/certified_badge.png')} style={styles.inspectionReportCertifiedBadge} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={styles.inspectionReportOverallLabel}>Overall Rating</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.inspectionReportOverallScore}>8.7/10</Text>
            </View>
            <View style={[styles.inspectionReportBar, { width: '87%' }]} />
            {/* Progress Bars */}
            <View style={{ marginBottom: 16, marginTop: 10 }}>
              <View style={styles.inspectionReportRow}><Text style={styles.inspectionReportItem}>Exterior & Body</Text><Text style={styles.inspectionReportPercent}>59%</Text></View>
              <View style={[styles.inspectionReportBar, { width: '59%' }]} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <View style={styles.inspectionReportRow}><Text style={styles.inspectionReportItem}>Engine/Transmission/Clutch</Text><Text style={styles.inspectionReportPercent}>100%</Text></View>
              <View style={[styles.inspectionReportBar, { width: '100%' }]} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <View style={styles.inspectionReportRow}><Text style={styles.inspectionReportItem}>Suspension/Steering</Text><Text style={styles.inspectionReportPercent}>100%</Text></View>
              <View style={[styles.inspectionReportBar, { width: '100%' }]} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <View style={styles.inspectionReportRow}><Text style={styles.inspectionReportItem}>Interior</Text><Text style={styles.inspectionReportPercent}>97%</Text></View>
              <View style={[styles.inspectionReportBar, { width: '97%' }]} />
            </View>
            <View style={{ marginBottom: 24 }}>
              <View style={styles.inspectionReportRow}><Text style={styles.inspectionReportItem}>AC/Heater</Text><Text style={styles.inspectionReportPercent}>100%</Text></View>
              <View style={[styles.inspectionReportBar, { width: '100%' }]} />
            </View>
            {/* View Full Report Button */}
            <TouchableOpacity style={styles.inspectionReportBtn}><Text style={styles.inspectionReportBtnText}>View Full Report</Text></TouchableOpacity>
          </View>
          {/* Seller Comments Section */}
          <View style={styles.sellerCommentsCard}>
            <View style={styles.sellerCommentsHeader}>
              <Text style={styles.sellerCommentsTitle}>Seller Comments</Text>
              <TouchableOpacity>
                <Text style={styles.sellerCommentsShowMore}>Show more</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sellerCommentsText}>
              PakWheels inspected car{"\n"}
              Inspection report attached{"\n"}
              Number plates available{"\n"}
              Token Tax Paid{"\n"}
              2nd Owner{"\n"}
              Manufacture 2022{"\n"}
              Registered 2022{"\n"}
              Documents not checked by PAKWHEELS
            </Text>
          </View>
          {/* Features Section */}
          <View style={styles.featuresCard}>
            <View style={styles.featuresHeader}>
              <Text style={styles.featuresTitle}>Features</Text>
              <TouchableOpacity>
                <Text style={styles.featuresShowMore}>Show more</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.featuresGrid}>
              <View style={styles.featuresGridRow}>
                <View style={styles.featureItemBetter}>
                  <View style={styles.featureIconCircle}><Text style={styles.featureIconBetter}>🛞</Text></View>
                  <Text style={styles.featureLabelBetter}>ABS</Text>
                </View>
                <View style={styles.featureItemBetter}>
                  <View style={styles.featureIconCircle}><Text style={styles.featureIconBetter}>🛡️</Text></View>
                  <Text style={styles.featureLabelBetter}>Air Bags</Text>
                </View>
              </View>
              <View style={styles.featuresGridRow}>
                <View style={styles.featureItemBetter}>
                  <View style={styles.featureIconCircle}><Text style={styles.featureIconBetter}>📻</Text></View>
                  <Text style={styles.featureLabelBetter}>AM/FM Radio</Text>
                </View>
                <View style={styles.featureItemBetter}>
                  <View style={styles.featureIconCircle}><Text style={styles.featureIconBetter}>❄️</Text></View>
                  <Text style={styles.featureLabelBetter}>Air Conditioning</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Seller Detail Section */}
          <View style={styles.sellerDetailCardBetter}>
            <View style={styles.sellerDetailHeaderBetter}>
              <Text style={styles.sellerDetailTitleBetter}>Seller Detail</Text>
              <TouchableOpacity>
                <Text style={styles.sellerDetailProfileBetter}>View Seller profile</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sellerDetailRowBetter}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sellerDetailNameBetter}>PakWheels Karachi</Text>
                <View style={styles.sellerDetailInfoRow}><Text style={styles.sellerDetailInfoIcon}>📍</Text><Text style={styles.sellerDetailAddressBetter}>Suit No : 303 Third Floor Tariq Centre Main Tariq Road</Text></View>
                <View style={styles.sellerDetailInfoRow}><Text style={styles.sellerDetailInfoIcon}>🕒</Text><Text style={styles.sellerDetailHoursBetter}>09:00 AM to 09:00 PM</Text></View>
              </View>
              <View style={styles.sellerDetailLogoWrapper}>
                <Image source={require('../assets/images/badge.png')} style={styles.sellerDetailLogoBetter} />
              </View>
            </View>
          </View>
          {/* Info/Ad Cards Section (moved here) */}
          <View style={styles.infoCardBetter}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoCardTitleBetter}>Apply for car loan</Text>
              <Text style={styles.infoCardSubtitleBetter}>Finance starts at PKR 46,259 per month</Text>
              <Text style={styles.infoCardCtaBetter}>Apply right away <Text style={styles.infoCardCtaIcon}>✅</Text></Text>
            </View>
            <View style={styles.infoCardImageCircle}><Text style={styles.infoCardImageBetter}>🚗💸</Text></View>
          </View>
          <View style={styles.infoCardBetter}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoCardTitleBetter}>Explore car insurance</Text>
              <Text style={styles.infoCardSubtitleBetter}>Insurance starts at PKR 37,800 per year</Text>
              <Text style={styles.infoCardCtaBetter}>View plan details <Text style={styles.infoCardCtaIcon}>✅</Text></Text>
            </View>
            <View style={styles.infoCardImageCircle}><Image source={require('../assets/images/car_insurance.jpg')} style={styles.infoCardImageBetter} resizeMode="contain" /></View>
          </View>
          <View style={styles.infoCardBetter}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoCardTitleBetter}>Sell today!</Text>
              <Text style={styles.infoCardSubtitleBetter}>Post your ad to find the best offer from our verified buyers</Text>
              <Text style={styles.infoCardCtaBetter}>Post an ad right away<Text style={styles.infoCardCtaIcon}>💥</Text></Text>
            </View>
            <View style={styles.infoCardImageCircle}><Image source={require('../assets/images/sell_today.jpg')} style={styles.infoCardImageBetter} resizeMode="contain" /></View>
          </View>
          <View style={styles.adCardBetter}>
            <View style={styles.adCardLogoCircle}><Image source={require('../assets/images/caltex_logo.jpg')} style={styles.adCardLogoBetter} resizeMode="contain" /></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.adCardTitleBetter}>FIND THE RIGHT OIL FOR YOUR</Text>
              <Text style={styles.adCardSubtitleBetter}>Best Engine Oil</Text>
              <Text style={styles.adCardCtaBetter}>Caltex Oil Finder <Text style={styles.adCardCtaArrow}>➔</Text></Text>
            </View>
            <View style={styles.adCardImageCircle}><Image source={require('../assets/images/caltex_oil.png')} style={styles.adCardImageBetter} resizeMode="contain" /></View>
          </View>
          {/* Similar Ads Section (copied from Home.js) */}
          <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Similar Ads</Text>
              <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cardRow}>
                <TouchableOpacity 
                  style={styles.carCard}
                  onPress={() => navigation.navigate('CarDetailScreen', { 
                    car: {
                      title: 'Hyundai Sonata 2021',
                      price: 'PKR 80.0 lacs',
                      location: 'Karachi',
                      image: require('../assets/images/sonata.jpeg'),
                      badges: [
                        { label: 'MANAGED BY PAKWHEELS', icon: require('../assets/images/badge.png') },
                        { label: 'CERTIFIED', icon: require('../assets/images/certified_badge.png') },
                      ],
                      featured: true,
                      managedText: 'The sale of this car is managed by Pakwheels to provide you with the best deal.',
                    }
                  })}
                >
                  <Image source={require('../assets/images/sonata.jpeg')} style={styles.carImage} resizeMode="contain" />
                  <Text style={styles.carCardTitle}>Hyundai Sonata 2021</Text>
                  <Text style={styles.carCardPrice}>PKR 80.0 lacs</Text>
                  <Text style={styles.carCardCity}>Karachi</Text>
                  <Text style={styles.carCardDetails}>2021 | 84,061 km | Petrol</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.carCard}
                  onPress={() => navigation.navigate('CarDetailScreen', { 
                    car: {
                      title: 'Suzuki Alto 2023',
                      price: 'PKR 30.0 lacs',
                      location: 'Karachi',
                      image: require('../assets/images/alto.webp'),
                      badges: [
                        { label: 'MANAGED BY PAKWHEELS', icon: require('../assets/images/badge.png') },
                        { label: 'CERTIFIED', icon: require('../assets/images/certified_badge.png') },
                      ],
                      featured: false,
                      managedText: 'The sale of this car is managed by Pakwheels to provide you with the best deal.',
                    }
                  })}
                >
                  <Image source={require('../assets/images/alto.webp')} style={styles.carImage} resizeMode="contain" />
                  <Text style={styles.carCardTitle}>Suzuki Alto 2023</Text>
                  <Text style={styles.carCardPrice}>PKR 30.0 lacs</Text>
                  <Text style={styles.carCardCity}>Karachi</Text>
                  <Text style={styles.carCardDetails}>2023 | 41,387 km | Petrol</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          {/* Similar parts Section  */}
          <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Parts of this car</Text>
              <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cardRow}>
                <TouchableOpacity style={styles.carCard}>
                  <Image source={require('../assets/images/sonata.jpeg')} style={styles.carImage} resizeMode="contain" />
                  <Text style={styles.carCardTitle}>Hyundai Sonata 2021</Text>
                  <Text style={styles.carCardPrice}>PKR 80.0 lacs</Text>
                  <Text style={styles.carCardCity}>Karachi</Text>
                  <Text style={styles.carCardDetails}>2021 | 84,061 km | Petrol</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.carCard}>
                  <Image source={require('../assets/images/alto.webp')} style={styles.carImage} resizeMode="contain" />
                  <Text style={styles.carCardTitle}>Suzuki Alto 2023</Text>
                  <Text style={styles.carCardPrice}>PKR 30.0 lacs</Text>
                  <Text style={styles.carCardCity}>Karachi</Text>
                  <Text style={styles.carCardDetails}>2023 | 41,387 km | Petrol</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Animated.ScrollView>
        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.callSellerBtn}
            onPress={() => handleContactAction('call')}
          >
            <Text style={styles.callSellerBtnText}>📞 Call seller</Text>
          </TouchableOpacity>
          <View style={styles.bottomActionsRow}>
            <TouchableOpacity 
              style={styles.bottomAction}
              onPress={() => handleContactAction('sms')}
            >
              <Text style={styles.bottomActionText}>💬 SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.bottomAction}
              onPress={() => handleContactAction('chat')}
            >
              <Text style={styles.bottomActionText}>💬 Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.bottomAction}
              onPress={() => handleContactAction('whatsapp')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../assets/images/whatsapp_icon.webp')} style={styles.whatsappIcon} />
                <Text style={styles.bottomActionText}> WhatsApp</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Info Modal */}
      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={infoTitle}
        message={infoMessage}
        icon={infoIcon}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#193A7A',
    paddingBottom: Platform.OS === 'android' ? 40 : 0, // match Home.js bottom safe area
  },
  container: { flex: 1, backgroundColor: '#f9fafd' },
  imageHeaderWrapper: {
    position: 'relative',
    backgroundColor: '#222',
    height: 320, // increased height for bigger image
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCarImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    ...(Platform.OS === 'ios' && {
      // iOS-specific styling to ensure proper image display
      backgroundColor: 'transparent',
    }),
  },
  carImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 28 : 12,
    left: 12,
    zIndex: 10,
    // Remove backgroundColor, borderRadius, width, height, elevation
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackArrowImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#fff', // make arrow white
  },
  carTitle: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 28 : 12,
    // top: 28,
    left: 60,
    right: 100,
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuredBadge: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 34 : 18,
    // top: 28,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 4, // reduced from 10
    paddingVertical: 0, // reduced from 2
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    overflow: 'visible',
  },
  featuredBadgeIcon: {
    width: 26,
    height: 24,
    marginRight: 5,
    resizeMode: 'contain',
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
    color: '#222', // black text
    fontWeight: '700',
    fontSize: 11, // smaller text size
  },
  topRightButtons: {
    position: 'absolute',
    right: 12,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 2,
  },
  iconText: {
    fontSize: 20,
    color: '#193A7A',
  },
  shareIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  imageCount: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    opacity: 0.85,
  },
  imageCountText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 0, // remove horizontal padding
    marginLeft: 16, // align with title
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  badgeIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '400', // less bold
    color: '#222',
    marginHorizontal: 16,
    marginTop: 8,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: '500', // less bold
    color: '#193A7A',
    marginHorizontal: 16,
    marginTop: 4,
  },
  detailLocation: {
    fontSize: 15,
    color: '#888',
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  detailBlock: {
    marginLeft: 16,
  },
  managedSection: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  managedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  managedIcon: {
    fontSize: 38,
    color: '#e11d48',
    marginRight: 10,
    marginTop: 2,
  },
  managedTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  managedDesc: {
    color: '#444',
    fontSize: 14,
    marginBottom: 4,
  },
  managedLink: {
    color: '#1275D7',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    elevation: 10,
    zIndex: 20,
  },
  callSellerBtn: {
    backgroundColor: '#1275D7',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
    elevation: 2,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  callSellerBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  bottomActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 2,
  },
  bottomAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomActionText: {
    color: '#1275D7',
    fontWeight: '600',
    fontSize: 16,
  },
  certifiedBadgeIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
    tintColor: '#123F60',
    resizeMode: 'contain',
  },
  whatsappIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 110 : 80,
    backgroundColor: '#193A7A',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 64 : 18,
  },
  stickyBackButton: {
    padding: 8,
    marginRight: 4,
  },
  stickyBackArrowImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  stickyHeaderTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
  stickyHeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyHeaderIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  stickyHeaderIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  stickyHeaderHeart: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  inspectionScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inspectionScoreLeft: {},
  inspectionScoreLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  inspectionScoreValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectionScoreShield: {
    fontSize: 16,
    color: '#1275D7',
    marginRight: 4,
  },
  inspectionScoreValue: {
    color: '#1275D7',
    fontWeight: '700',
    fontSize: 16,
  },
  inspectionScoreRight: {
    padding: 6,
  },
  inspectionScoreArrow: {
    color: '#888',
    fontSize: 20,
    fontWeight: '700',
  },
  detailsIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 18,
  },
  detailsIconCol: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  detailsIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  detailsIconLabel: {
    fontSize: 12,
    color: '#444',
  },
  detailsTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailsTableLabel: {
    color: '#888',
    fontSize: 15,
    width: '48%',
    textAlign: 'left',
  },
  detailsTableValue: {
    color: '#888',
    fontSize: 15,
    // fontWeight: '500',
    width: '48%',
    textAlign: 'right',
  },
  inspectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 18,
    marginBottom: 24,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  inspectionCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectionCardLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  inspectionCardScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectionCardShield: {
    fontSize: 16,
    color: '#27ae60',
    marginRight: 4,
  },
  inspectionCardScore: {
    color: '#1275D7',
    fontWeight: '700',
    fontSize: 16,
  },
  inspectionCardArrowBtn: {
    padding: 6,
  },
  inspectionCardArrow: {
    color: '#888',
    fontSize: 20,
    fontWeight: '700',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 18,
  },
  inspectionReportSection: {
    backgroundColor: '#eaf4ff',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 24,
  },
  inspectionReportTitle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  inspectionReportCertifiedBadge: {
    width: 60,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 8,
    tintColor: undefined,
  },
  inspectionReportOverallLabel: {
    fontWeight: '500',
    fontSize: 18,
    color: '#222',
  },
  inspectionReportOverallScore: {
    fontWeight: '500',
    fontSize: 20,
    color: '#193A7A',
  },
  inspectionReportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inspectionReportItem: {
    flex: 2.2,
    fontSize: 16,
    color: '#222',
  },
  inspectionReportPercent: {
    flex: 0.7,
    fontSize: 14,
    color: '#222',
    textAlign: 'right',
  },
  inspectionReportBar: {
    height: 2,
    backgroundColor: '#1275D7',
    borderRadius: 2,
    marginTop: 6,
  },
  inspectionReportBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1275D7',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  inspectionReportBtnText: {
    color: '#1275D7',
    fontWeight: '400',
    fontSize: 16,
  },
  sellerCommentsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sellerCommentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sellerCommentsTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
  },
  sellerCommentsShowMore: {
    color: '#1275D7',
    fontSize: 13,
    fontWeight: '500',
  },
  sellerCommentsText: {
    color: '#444',
    fontSize: 14,
    lineHeight: 20,
  },
  featuresCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featuresTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
  },
  featuresShowMore: {
    color: '#1275D7',
    fontSize: 13,
    fontWeight: '500',
  },
  featuresGrid: {
    marginTop: 12,
    gap: 0,
  },
  featuresGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  featureItemBetter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  featureIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f6fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e6ef',
  },
  featureIconBetter: {
    fontSize: 26,
    color: '#193A7A',
    fontWeight: '600',
  },
  featureLabelBetter: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  sellerDetailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sellerDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sellerDetailTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
  },
  sellerDetailProfile: {
    color: '#1275D7',
    fontSize: 13,
    fontWeight: '500',
  },
  sellerDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  sellerDetailName: {
    fontWeight: '700',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  sellerDetailAddress: {
    color: '#444',
    fontSize: 13,
    marginBottom: 2,
  },
  sellerDetailHours: {
    color: '#888',
    fontSize: 13,
  },
  sellerDetailLogo: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  sellerDetailCardBetter: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e6eaf0',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  sellerDetailHeaderBetter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sellerDetailTitleBetter: {
    fontWeight: '700',
    fontSize: 18,
    color: '#193A7A',
    letterSpacing: 0.2,
  },
  sellerDetailProfileBetter: {
    color: '#1275D7',
    fontSize: 14,
    fontWeight: '600',
  },
  sellerDetailRowBetter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  sellerDetailNameBetter: {
    fontWeight: '700',
    fontSize: 17,
    color: '#222',
    marginBottom: 8,
  },
  sellerDetailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerDetailInfoIcon: {
    fontSize: 15,
    marginRight: 6,
    color: '#1275D7',
  },
  sellerDetailAddressBetter: {
    color: '#444',
    fontSize: 14,
    flexShrink: 1,
  },
  sellerDetailHoursBetter: {
    color: '#888',
    fontSize: 14,
  },
  sellerDetailLogoWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e6ef',
    padding: 6,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerDetailLogoBetter: {
    width: 54,
    height: 36,
    resizeMode: 'contain',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 10,
    marginBottom: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  infoCardTitle: {
    color: '#193A7A',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  infoCardSubtitle: {
    color: '#444',
    fontSize: 14,
    marginBottom: 6,
  },
  infoCardCta: {
    color: '#1275D7',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  infoCardImageWrapper: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardImage: {
    fontSize: 44,
  },
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 18,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  adCardLogoWrapper: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  adCardLogo: {
    fontSize: 22,
  },
  adCardTitle: {
    color: '#222',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  adCardSubtitle: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
  },
  adCardCta: {
    color: '#1275D7',
    fontSize: 14,
    fontWeight: '500',
  },
  adCardImageWrapper: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adCardImage: {
    fontSize: 38,
  },
  infoCardBetter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e6eaf0',
    marginHorizontal: 10,
    marginBottom: 18,
    paddingVertical: 22,
    paddingHorizontal: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  infoCardTitleBetter: {
    color: '#193A7A',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 2,
  },
  infoCardSubtitleBetter: {
    color: '#444',
    fontSize: 15,
    marginBottom: 8,
  },
  infoCardCtaBetter: {
    color: '#1275D7',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  infoCardCtaIcon: {
    fontSize: 16,
    marginLeft: 2,
  },
  infoCardImageCircle: {
    marginLeft: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    padding: 4,
  },
  infoCardImageBetter: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  adCardBetter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6eaf0',
    marginHorizontal: 10,
    marginBottom: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  adCardLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  adCardLogoBetter: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  adCardTitleBetter: {
    color: '#222',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  adCardSubtitleBetter: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
  },
  adCardCtaBetter: {
    color: '#1275D7',
    fontSize: 15,
    fontWeight: '700',
  },
  adCardCtaArrow: {
    fontSize: 16,
    marginLeft: 2,
  },
  adCardImageCircle: {
    marginLeft: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    padding: 4,
  },
  adCardImageBetter: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  sectionWithCards: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionSpacing: {
    marginTop: 36,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  viewAll: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 15,
  },
  cardRow: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 10,
  },
  carCard: {
    width: 210,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  carImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  carCardTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  carCardPrice: {
    fontWeight: '700',
    fontSize: 15,
    color: '#2563eb',
    marginBottom: 2,
  },
  carCardCity: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  carCardDetails: {
    color: '#888',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#193A7A',
    letterSpacing: 0.2,
    marginBottom: 8,
    marginTop: 2,
  },
});

export default CarDetailScreen; 