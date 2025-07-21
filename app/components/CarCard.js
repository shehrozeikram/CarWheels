import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { addCarUpdateListener, addCarToManager } from '../utils/CarDataManager';

const CarCard = ({ 
  id,
  title, 
  price, 
  year, 
  km, 
  city, 
  fuel, 
  image, 
  showHeart = true, 
  onHeartPress,
  biddingEnabled = false,
  biddingEndTime,
  currentBid,
  bids,
  ...props 
}) => {
  const [carData, setCarData] = useState({
    id,
    title,
    price,
    year,
    km,
    city,
    fuel,
    image,
    biddingEnabled,
    biddingEndTime,
    currentBid,
    bids,
    ...props
  });

  // Add car to global manager and listen for updates
  useEffect(() => {
    if (id) {
      addCarToManager(id, carData);
      
      // Listen for updates to this car
      const unsubscribe = addCarUpdateListener(id, (updatedCar) => {
        setCarData(updatedCar);
      });
      
      return unsubscribe;
    }
  }, [id]);

  // Use carData instead of individual props
  const {
    title: carTitle,
    price: carPrice,
    year: carYear,
    km: carKm,
    city: carCity,
    fuel: carFuel,
    image: carImage,
    biddingEnabled: carBiddingEnabled,
    biddingEndTime: carBiddingEndTime,
    currentBid: carCurrentBid,
    bids: carBids,
  } = carData;

  return (
    <TouchableOpacity style={styles.card} {...props}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardImageWrapper}>
          <Image source={carImage} style={styles.cardImage} resizeMode="cover" />
          
          {carBiddingEnabled && (
            <View style={styles.biddingBadge}>
              <Text style={styles.biddingIcon}>🏷️</Text>
              <Text style={styles.biddingText}>BIDDING</Text>
              {carBiddingEndTime > Date.now() && (
                <Text style={styles.biddingTimer}>
                  {Math.floor((carBiddingEndTime - Date.now()) / (1000 * 60 * 60 * 24))}d {Math.floor(((carBiddingEndTime - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h
                </Text>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.cardMainContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{carTitle}</Text>
          <Text style={styles.cardPrice}>{carPrice}</Text>
          
          <View style={styles.cardInfoRow}>
            <Text style={styles.cardInfoIcon}>📅</Text>
            <Text style={styles.cardInfoText}>{carYear}</Text>
            <Text style={styles.cardInfoIcon}>⏱️</Text>
            <Text style={styles.cardInfoText}>{carKm}</Text>
          </View>
          
          <View style={styles.cardInfoRow}>
            <Text style={styles.cardInfoIcon}>⛽</Text>
            <Text style={styles.cardInfoText}>{carFuel}</Text>
            <Text style={styles.cardInfoIcon}>📍</Text>
            <Text style={styles.cardInfoText}>{carCity}</Text>
          </View>
          
          {carBiddingEnabled && (
            <View style={styles.biddingInfo}>
              <Text style={styles.biddingCurrentBid}>
                Current Bid: PKR {carCurrentBid?.toLocaleString() || '0'}
              </Text>
              <Text style={styles.biddingCount}>
                {carBids?.length || 0} bids placed
              </Text>
            </View>
          )}
        </View>
        
        {showHeart && (
          <TouchableOpacity style={styles.heartButton} onPress={onHeartPress}>
            <Text style={styles.heartText}>♡</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  cardTopRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    padding: 20, 
    direction: 'ltr' 
  },
  cardImageWrapper: { 
    width: 150, 
    height: 130, 
    borderRadius: 14, 
    overflow: 'hidden', 
    borderWidth: 2, 
    borderColor: '#e11d48', 
    marginRight: 24, 
    position: 'relative', 
    backgroundColor: '#fff' 
  },
  cardImage: { 
    width: '100%', 
    height: '100%' 
  },
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
  },
  starBadgeText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 12, 
    textAlign: 'center' 
  },
  newBadge: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    backgroundColor: '#900C3F', 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 0, 
    zIndex: 2 
  },
  newBadgeText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 13 
  },
  userCreatedBadge: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    backgroundColor: '#10b981', 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    zIndex: 2 
  },
  userCreatedBadgeText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 10, 
    textTransform: 'uppercase' 
  },
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
  imageCount: { 
    position: 'absolute', 
    left: 6, 
    bottom: 6, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    borderRadius: 8, 
    paddingHorizontal: 6, 
    paddingVertical: 0 
  },
  imageCountText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 13 
  },
  cardMainContent: { 
    flex: 1, 
    minHeight: 130, 
    justifyContent: 'center', 
    gap: 7 
  },
  cardTitle: { 
    fontWeight: '700', 
    fontSize: 16, 
    color: '#222' 
  },
  cardPrice: { 
    fontWeight: '700', 
    fontSize: 18, 
    color: '#900C3F', 
    marginBottom: 2, 
    marginTop: -4 
  },
  cardInfoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 2, 
    columnGap: 6 
  },
  cardInfoIcon: { 
    fontSize: 15, 
    color: '#888', 
    marginRight: 0 
  },
  cardInfoText: { 
    color: '#888', 
    fontSize: 14, 
    marginRight: 10 
  },
  heartButton: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    borderRadius: 16, 
    width: 32, 
    height: 32, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 2 
  },
  heartText: { 
    color: '#4076A4', 
    fontSize: 18, 
    fontWeight: '700' 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#f0f0f0', 
    marginHorizontal: 10, 
    marginBottom: 8 
  },
  badgesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 0, 
    marginLeft: 10, 
    marginBottom: 8, 
    direction: 'ltr' 
  },
  badge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: { 
    fontSize: 20, 
    color: '#e11d48', 
    marginRight: 4 
  },
  badgeText: { 
    color: '#222222', 
    fontWeight: '700', 
    fontSize: 11 
  },
  certifiedBadgeIcon: { 
    width: 22, 
    height: 22, 
    marginRight: 4, 
    resizeMode: 'contain' 
  },
  badgeTextBg: { 
    backgroundColor: '#f3f4f6', 
    paddingHorizontal: 6, 
    borderRadius: 6, 
    alignSelf: 'center', 
    marginLeft: -4 
  },
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
});

export default CarCard; 