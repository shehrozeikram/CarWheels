import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, Image } from 'react-native';

const ChoosePlanScreen = ({ navigation }) => {
  const handleSellMyself = () => {
    // Navigate to sell it myself flow
    console.log('Sell It Myself selected');
    navigation.navigate('SellYourCarScreen');
  };

  const handleSellForMe = () => {
    // Navigate to sell it for me flow
    console.log('Sell It For Me selected');
    // navigation.navigate('SellForMeScreen');
  };

  const handleLearnMore = () => {
    // Show learn more information
    console.log('Learn more clicked');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../../../assets/images/back_arrow.png')} style={styles.backArrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose a plan</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.mainTitle}>How do you want to sell your car?</Text>

          {/* Sell It Myself Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>Sell It Myself!</Text>
                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.benefitText}>Post an Ad in 2 minutes</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.benefitText}>20 Million users</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.benefitText}>Connect Directly with Buyers</Text>
                  </View>
                </View>
              </View>
                            <View style={styles.cardRight}>
                <View style={styles.illustration}>
                  <Image 
                    source={require('../../../assets/images/sell_it_myself.jpg')} 
                    style={styles.sellMyselfImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={handleSellMyself}>
              <Text style={styles.actionButtonText}>Post your ad</Text>
            </TouchableOpacity>
          </View>

          {/* Sell It For Me Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Sell It For Me</Text>
                  <TouchableOpacity onPress={handleLearnMore}>
                    <Text style={styles.learnMoreLink}>Learn more</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.benefitText}>Sell your car without hassle</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.benefitText}>Free Inspection & Featured Ad</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.benefitText}>Maximize offer with sales agent</Text>
                  </View>
                </View>
                <Text style={styles.disclaimer}>*Available only in limited cities</Text>
              </View>
              <View style={styles.cardRight}>
                <View style={styles.illustration}>
                  <Image 
                    source={require('../../../assets/images/sell_it_for_me.jpg')} 
                    style={styles.sellForMeImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={handleSellForMe}>
              <Text style={styles.actionButtonText}>Help me sell my car!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#193A7A',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
  },
  cardLeft: {
    flex: 1,
    marginRight: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  learnMoreLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  benefitsList: {
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  cardRight: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellMyselfImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  sellForMeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChoosePlanScreen; 