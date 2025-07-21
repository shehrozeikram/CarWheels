import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { isUserLoggedIn } from '../screens/auth/AuthUtils';
import { addBidNotification } from '../utils/NotificationUtils';
import { updateCarBidding } from '../utils/CarDataManager';
import SuccessModal from './SuccessModal';

const BiddingModal = ({ 
  visible, 
  onClose, 
  car, 
  onBidPlaced,
  currentUser 
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successBidAmount, setSuccessBidAmount] = useState(0);

  useEffect(() => {
    if (visible && car?.biddingEnabled) {
      // Set initial bid amount (minimum 5% higher than current bid)
      const minBid = car.currentBid * 1.05;
      setBidAmount(Math.ceil(minBid).toString());
      
      // Start timer
      const timer = setInterval(() => {
        const now = Date.now();
        const endTime = car.biddingEndTime;
        
        if (endTime <= now) {
          setTimeLeft('Auction ended');
          clearInterval(timer);
          return;
        }
        
        const timeDiff = endTime - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [visible, car]);

  const handlePlaceBid = async () => {
    if (!isUserLoggedIn()) {
      Alert.alert('Login Required', 'Please log in to place a bid.');
      return;
    }

    const bid = parseFloat(bidAmount);
    const minBid = car.currentBid * 1.05; // Minimum 5% higher than current bid
    
    if (isNaN(bid) || bid < minBid) {
      Alert.alert('Invalid Bid', `Your bid must be at least PKR ${Math.ceil(minBid).toLocaleString()}`);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update car bidding information globally
      const updatedCar = updateCarBidding(car.id, bid, currentUser?.name || 'Anonymous');

      // Add notification for the car owner
      addBidNotification(updatedCar || car, bid, currentUser?.name || 'Anonymous');

      onBidPlaced(updatedCar || car);
      onClose();
      
      // Show success modal instead of alert
      setSuccessBidAmount(bid);
      setSuccessModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to place bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBidHistory = () => {
    if (!car.bids || car.bids.length === 0) {
      return [];
    }
    
    return car.bids
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5); // Show last 5 bids
  };

  if (!car) return null;

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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Place Your Bid</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Car Info */}
          <View style={styles.carInfo}>
            <Text style={styles.carTitle}>{car.title}</Text>
            <Text style={styles.carPrice}>Asking Price: {car.price}</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Time Remaining:</Text>
              <Text style={styles.timer}>{timeLeft}</Text>
            </View>
          </View>

          {/* Current Bid Info */}
          <View style={styles.currentBidContainer}>
            <Text style={styles.currentBidLabel}>Current Highest Bid:</Text>
            <Text style={styles.currentBidAmount}>
              PKR {car.currentBid?.toLocaleString() || '0'}
            </Text>
            {car.highestBidder && (
              <Text style={styles.highestBidder}>
                by {car.highestBidder}
              </Text>
            )}
          </View>

          {/* Bid Input */}
          <View style={styles.bidInputContainer}>
            <Text style={styles.bidInputLabel}>Your Bid Amount (PKR)</Text>
            <TextInput
              style={styles.bidInput}
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
              placeholder="Enter your bid"
              placeholderTextColor="#999"
            />
            <Text style={styles.minBidText}>
              Minimum bid: PKR {Math.ceil(car.currentBid * 1.05).toLocaleString()}
            </Text>
          </View>

          {/* Bid History */}
          <View style={styles.bidHistoryContainer}>
            <Text style={styles.bidHistoryTitle}>Recent Bids</Text>
            {formatBidHistory().length > 0 ? (
              formatBidHistory().map((bid, index) => (
                <View key={bid.id} style={styles.bidHistoryItem}>
                  <Text style={styles.bidHistoryAmount}>
                    PKR {bid.amount.toLocaleString()}
                  </Text>
                  <Text style={styles.bidHistoryBidder}>{bid.bidder}</Text>
                  <Text style={styles.bidHistoryTime}>
                    {new Date(bid.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noBidsText}>No bids yet. Be the first to bid!</Text>
            )}
          </View>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsTitle}>Bidding Terms:</Text>
            <Text style={styles.termsText}>• Minimum bid is 5% higher than current bid</Text>
            <Text style={styles.termsText}>• You will be notified if outbid</Text>
            <Text style={styles.termsText}>• Highest bidder wins when auction ends</Text>
            <Text style={styles.termsText}>• Bids are binding and cannot be withdrawn</Text>
          </View>
        </ScrollView>

        {/* Place Bid Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.placeBidButton, isLoading && styles.placeBidButtonDisabled]}
            onPress={handlePlaceBid}
            disabled={isLoading || car.biddingEndTime <= Date.now()}
          >
            <Text style={styles.placeBidButtonText}>
              {isLoading ? 'Placing Bid...' : 
               car.biddingEndTime <= Date.now() ? 'Auction Ended' : 'Place Bid'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Success Modal */}
        <SuccessModal
          visible={successModalVisible}
          onClose={() => setSuccessModalVisible(false)}
          title="Bid Placed Successfully!"
          message={`Your bid of PKR ${successBidAmount.toLocaleString()} has been placed. You will be notified if someone outbids you.`}
          action="continue"
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  carInfo: {
    marginTop: 20,
    marginBottom: 24,
  },
  carTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  timer: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d97706',
  },
  currentBidContainer: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  currentBidLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  currentBidAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#d97706',
    marginBottom: 4,
  },
  highestBidder: {
    fontSize: 14,
    color: '#666',
  },
  bidInputContainer: {
    marginBottom: 24,
  },
  bidInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  bidInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  minBidText: {
    fontSize: 14,
    color: '#666',
  },
  bidHistoryContainer: {
    marginBottom: 24,
  },
  bidHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bidHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bidHistoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bidHistoryBidder: {
    fontSize: 14,
    color: '#666',
  },
  bidHistoryTime: {
    fontSize: 12,
    color: '#999',
  },
  noBidsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  placeBidButton: {
    backgroundColor: '#d97706',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeBidButtonDisabled: {
    backgroundColor: '#ccc',
  },
  placeBidButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default BiddingModal; 