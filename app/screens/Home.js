import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, SafeAreaView, Image, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import {  StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import SellModal from '../modals/SellModal';

const categories = [
  { label: 'Automatic cars', image: require('../assets/images/automatic_icon.png') },
  { label: 'Imported cars', image: require('../assets/images/imported_cars_icon.webp') },
  { label: 'Jeep', image: require('../assets/images/jeep_icon.jpg') },
  { label: 'Hybrid cars', image: require('../assets/images/hybrid_car_icon.webp') },
  { label: 'Diesel cars', image: require('../assets/images/diesel_cars_icon.jpg') },
  { label: 'Duplicate File', image: require('../assets/images/power_steering_icon.png') },
  { label: 'Urgent', image: require('../assets/images/power_steering_icon.png') },
  { label: 'Carry Daba', image: require('../assets/images/carry_daba_icon.png') },
];

const offerings = [
  {
    title: 'SELL IT FOR ME',
    icon: '🔑',
    subtitle: 'PAKWHEELS',
  },
  {
    title: 'CAR INSPECTION',
    icon: '🔍',
    subtitle: 'PAKWHEELS',
  },
  {
    title: 'AUCTION SHEET VERIFICATION',
    icon: '📄',
    subtitle: 'PAKWHEELS',
  },
  {
    title: 'AUTOSTORE',
    icon: '🛒',
    subtitle: 'PAKWHEELS',
  },
  {
    title: 'CAR FINANCE',
    icon: '💰',
    subtitle: 'PAKWHEELS',
  },
  {
    title: 'CAR INSURANCE',
    icon: '🛡️',
    subtitle: 'PAKWHEELS',
  },
];

// Add NewCarsSection component for the 'New Cars' tab
const carBrands = [
  { name: 'Suzuki', image: require('../assets/images/suzuki_logo.webp') },
  { name: 'Toyota', image: require('../assets/images/toyota_logo.jpg') },
  { name: 'Honda', image: require('../assets/images/honda_logo.jpg') },
  { name: 'KIA', image: require('../assets/images/kia_logo.png') },
  { name: 'Hyundai', image: require('../assets/images/hyundai_logo.jpeg') },
  { name: 'MG', image: require('../assets/images/mg_logo.png') },
  { name: 'BYD', image: require('../assets/images/byd_logo.png') },
  { name: 'Changan', image: require('../assets/images/changan_logo.png') },
];

const popularNewCars = [
  {
    name: 'Toyota Corolla',
    image: require('../assets/images/toyota_corolla_new_car.jpg'),
    price: 'PKR 59.7 - 75.5 lacs',
    rating: 3.5,
  },
  {
    name: 'Suzuki Alto',
    image: require('../assets/images/alto_new_car.png'),
    price: 'PKR 23.3 - 31.4 lacs',
    rating: 3.5,
  },
];

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) stars.push(<Text key={i} style={{color: '#FFD600', fontSize: 18}}>★</Text>);
  if (halfStar) stars.push(<Text key={'half'} style={{color: '#FFD600', fontSize: 18}}>★</Text>);
  for (let i = stars.length; i < 5; i++) stars.push(<Text key={i+10} style={{color: '#bbb', fontSize: 18}}>★</Text>);
  return (
    <View style={{ flexDirection: 'row', marginTop: 10 }}>{stars}</View>
  );
}

const NewCarsSection = ({ navigation }) => (
  <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
    <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginVertical: 10, color: '#222' }}>Browse New Cars By Brand</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 6 }}>
        {carBrands.map((brand, idx) => (
          <TouchableOpacity
            key={brand.name}
            style={{ width: '23%', backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', paddingVertical: 20, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }}
            onPress={() => navigation.navigate('BrandModelsScreen', { brand: brand.name })}
          >
            <Image source={brand.image} style={{ width: 44, height: 44, borderRadius: 22, marginBottom: 8 }} resizeMode="contain" />
            <Text style={{ fontSize: 13, textAlign: 'center', color: '#222', fontWeight: '500' }}>{brand.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Pagination dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb', marginHorizontal: 3 }} />
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 3 }} />
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 3 }} />
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 3 }} />
      </View>
    </View>
    <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginVertical: 10, color: '#222' }}>Popular New Cars</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {popularNewCars.map((car, idx) => (
            <View
              key={car.name}
              style={{
                width: 220,
                backgroundColor: '#fcfcfc',
                borderRadius: 18,
                marginRight: 16,
                borderWidth: 1,
                borderColor: '#eee',
                elevation: 1,
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                padding: 0,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              <Image
                source={car.image}
                style={{ width: '100%', height: 110, borderTopLeftRadius: 18, borderTopRightRadius: 18, marginBottom: 12, alignSelf: 'center' }}
                resizeMode="cover"
              />
              <View style={{ paddingHorizontal: 14, width: '100%' }}>
                <Text style={{ fontWeight: '600', fontSize: 16, color: '#222', marginTop: 6, marginBottom: 4, textAlign: 'left' }}>{car.name}</Text>
                <Text style={{ fontWeight: '700', fontSize: 17, color: '#222', marginBottom: 6, textAlign: 'left' }}>{car.price}</Text>
                {renderStars(car.rating)}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
    {/* Newly Launched Cars Section */}
    <View style={{ marginTop: 32, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginVertical: 10, color: '#222' }}>Newly Launched Cars</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {popularNewCars.map((car, idx) => (
            <View
              key={car.name + '-newly'}
              style={{
                width: 220,
                backgroundColor: '#fcfcfc',
                borderRadius: 18,
                marginRight: 16,
                borderWidth: 1,
                borderColor: '#eee',
                elevation: 1,
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                padding: 0,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              <Image
                source={car.image}
                style={{ width: '100%', height: 110, borderTopLeftRadius: 18, borderTopRightRadius: 18, marginBottom: 12, alignSelf: 'center' }}
                resizeMode="cover"
              />
              <View style={{ paddingHorizontal: 14, width: '100%', paddingBottom: 16 }}>
                <Text style={{ fontWeight: '600', fontSize: 16, color: '#222', marginTop: 12, marginBottom: 6, textAlign: 'left' }}>{car.name}</Text>
                <Text style={{ fontWeight: '700', fontSize: 17, color: '#222', marginBottom: 0, textAlign: 'left' }}>{car.price}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
    {/* Upcoming New Cars Section */}
    <View style={{ marginTop: 32, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginVertical: 10, color: '#222' }}>Upcoming New Cars</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {popularNewCars.map((car, idx) => (
            <View
              key={car.name + '-upcoming'}
              style={{
                width: 220,
                backgroundColor: '#fcfcfc',
                borderRadius: 18,
                marginRight: 16,
                borderWidth: 1,
                borderColor: '#eee',
                elevation: 1,
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                padding: 0,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              <Image
                source={car.image}
                style={{ width: '100%', height: 110, borderTopLeftRadius: 18, borderTopRightRadius: 18, marginBottom: 12, alignSelf: 'center' }}
                resizeMode="cover"
              />
              <View style={{ paddingHorizontal: 14, width: '100%', paddingBottom: 16 }}>
                <Text style={{ fontWeight: '600', fontSize: 16, color: '#222', marginTop: 12, marginBottom: 6, textAlign: 'left' }}>{car.name}</Text>
                <Text style={{ fontWeight: '700', fontSize: 17, color: '#222', marginBottom: 0, textAlign: 'left' }}>{car.price}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
    {/* Car Comparison Section */}
    <View style={{ marginTop: 32, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: '#222' }}>Car Comparison</Text>
        <Text style={{ color: '#2563eb', fontWeight: '600', fontSize: 15 }}>View All</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {/* First comparison card */}
          <TouchableOpacity 
            style={{ width: 320,  backgroundColor: '#fff', borderRadius: 18, marginRight: 16, borderWidth: 1, borderColor: '#eee', elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, padding: 0, alignItems: 'center', justifyContent: 'center', height: 180 }}
            onPress={() => navigation.navigate('CarComparisonScreen', {
              car1: { name: 'Suzuki Alto', image: require('../assets/images/alto_new_car.png') },
              car2: { name: 'Toyota Corolla', image: require('../assets/images/toyota_corolla_new_car.jpg') }
            })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 24 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/images/alto_new_car.png')} style={{ width: 100, height: 70, resizeMode: 'contain' }} />
              </View>
              <View style={{ width: 40, alignItems: 'center' }}>
                <View style={{ borderLeftWidth: 1, borderColor: '#bbb', height: 50, position: 'absolute', left: 19, top: 10 }} />
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>VS</Text>
                </View>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/images/toyota_corolla_new_car.jpg')} style={{ width: 100, height: 70, resizeMode: 'contain' }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 24, marginBottom: 16 }}>
              <Text style={{ fontSize: 15, color: '#222', fontWeight: '500', flex: 1, textAlign: 'center' }}>Suzuki Alto</Text>
              <Text style={{ fontSize: 15, color: '#222', fontWeight: '500', flex: 1, textAlign: 'center' }}>Toyota Corolla</Text>
            </View>
          </TouchableOpacity>
          {/* Second comparison card */}
          <TouchableOpacity 
            style={{ width: 320, backgroundColor: '#fff', borderRadius: 18, marginRight: 16, borderWidth: 1, borderColor: '#eee', elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, padding: 0, alignItems: 'center', justifyContent: 'center', height: 180 }}
            onPress={() => navigation.navigate('CarComparisonScreen', {
              car1: { name: 'Toyota Corolla', image: require('../assets/images/toyota_corolla_new_car.jpg') },
              car2: { name: 'Suzuki Alto', image: require('../assets/images/alto_new_car.png') }
            })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 24 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/images/toyota_corolla_new_car.jpg')} style={{ width: 100, height: 70, resizeMode: 'contain' }} />
              </View>
              <View style={{ width: 40, alignItems: 'center' }}>
                <View style={{ borderLeftWidth: 1, borderColor: '#bbb', height: 50, position: 'absolute', left: 19, top: 10 }} />
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>VS</Text>
                </View>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/images/alto_new_car.png')} style={{ width: 100, height: 70, resizeMode: 'contain' }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 24, marginBottom: 16 }}>
              <Text style={{ fontSize: 15, color: '#222', fontWeight: '500', flex: 1, textAlign: 'center' }}>Toyota Corolla</Text>
              <Text style={{ fontSize: 15, color: '#222', fontWeight: '500', flex: 1, textAlign: 'center' }}>Suzuki Alto</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
    {/* Car Reviews Section */}
    <View style={{ marginTop: 32, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: '#222' }}>Car Reviews</Text>
        <Text style={{ color: '#2563eb', fontWeight: '600', fontSize: 15 }}>View All</Text>
      </View>
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
        <View style={{ flexDirection: 'column' , marginTop: 10 }}>
          {/* Example review card */}
          <View style={{ width: 340, backgroundColor: '#fff', borderRadius: 18, marginRight: 16, marginBottom: 20, borderWidth: 1, borderColor: '#eee', elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, padding: 0, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
              <Image source={require('../assets/images/alto_new_car.png')} style={{ width: 54, height: 36, resizeMode: 'contain', marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 16, color: '#222' }}>Excellent choice</Text>
                <Text style={{ fontSize: 13, color: '#444', marginTop: 2 }}>2022 Changan Oshan X7 FutureSense</Text>
                <Text style={{ fontSize: 12, color: '#888', marginTop: 1 }}>By: Dr zeeshan | Jul 10, 2025</Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
              <View style={{ flexDirection: 'row', marginBottom: 4, marginLeft: 60 }}>
                {[1,2,3,4,5].map(i => <Text key={i} style={{ color: '#FFD600', fontSize: 18 }}>★</Text>)}
              </View>
              <Text style={{ fontSize: 14, color: '#222', marginBottom: 16 }}>
                Great car , a lot of features and comfortable ride , it has the highest acceleration ever i experienced and compared with its other competitors, i think it worth to buy , and therefore i bought another one also for me . its resale value is also very fast in Pakistan, it has become a popular vehicle due to style , reliability, practicality and Performance also best fuel average
              </Text>
            </View>
          </View>

          <View style={{ width: 340, backgroundColor: '#fff', borderRadius: 18, marginRight: 16, marginBottom: 20, borderWidth: 1, borderColor: '#eee', elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, padding: 0, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
              <Image source={require('../assets/images/alto_new_car.png')} style={{ width: 54, height: 36, resizeMode: 'contain', marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 16, color: '#222' }}>Excellent choice</Text>
                <Text style={{ fontSize: 13, color: '#444', marginTop: 2 }}>2022 Changan Oshan X7 FutureSense</Text>
                <Text style={{ fontSize: 12, color: '#888', marginTop: 1 }}>By: Dr zeeshan | Jul 10, 2025</Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
              <View style={{ flexDirection: 'row', marginBottom: 4, marginLeft: 60 }}>
                {[1,2,3,4,5].map(i => <Text key={i} style={{ color: '#FFD600', fontSize: 18 }}>★</Text>)}
              </View>
              <Text style={{ fontSize: 14, color: '#222', marginBottom: 16 }}>
                Great car , a lot of features and comfortable ride , it has the highest acceleration ever i experienced and compared with its other competitors, i think it worth to buy , and therefore i bought another one also for me . its resale value is also very fast in Pakistan, it has become a popular vehicle due to style , reliability, practicality and Performance also best fuel average
              </Text>
            </View>
          </View>
        </View>
      {/* </ScrollView> */}
    </View>
    {/* Latest Videos Section */}
    <View style={{ marginTop: 32, marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 6 }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: '#222' }}>Latest Videos</Text>
        <TouchableOpacity><Text style={{ color: '#2563eb', fontWeight: '600', fontSize: 15 }}>View All</Text></TouchableOpacity>
      </View>
      {/* Featured Video */}
      <View style={{ backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginTop: 10, marginBottom: 12, paddingBottom: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
        <WebView
          style={{ width: '100%', height: 200, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden', backgroundColor: '#000' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: 'https://www.youtube.com/embed/aMLNYwwNLPQ' }}
        />
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#222', marginHorizontal: 10, marginBottom: 6 }}>
          Fully Modified Honda Civic RS Turbo - Owner Review
        </Text>
      </View>
      {/* Video List */}
      <View style={{ marginHorizontal: 16, marginTop: 2 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=N5KTyWaBAtw')}>
          <View style={{ width: 110, height: 70, backgroundColor: '#cfd8dc', borderRadius: 12, marginRight: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <Image source={require('../assets/images/forgotten_cars_thumb.jpg')} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
            <View style={{ position: 'absolute', top: '30%', left: '35%', width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, color: '#fff', marginLeft: 2 }}>{'▶️'}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 15, color: '#222', flex: 1, flexWrap: 'wrap', fontWeight: '400' }}>Forgotten Cars of Pakistan - Episode 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=c0C5Vl1CNQs')}>
          <View style={{ width: 110, height: 70, backgroundColor: '#cfd8dc', borderRadius: 12, marginRight: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <Image source={require('../assets/images/achay_driver_thumb.webp')} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
            <View style={{ position: 'absolute', top: '30%', left: '35%', width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, color: '#fff', marginLeft: 2 }}>{'▶️'}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 15, color: '#222', flex: 1, flexWrap: 'wrap', fontWeight: '400' }}>Achay Driver Kaisay Banay?</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);

const bikeCategories = [
  { label: 'Standard', icon: require('../assets/images/standard.png') },
  { label: '4 Stroke', icon: require('../assets/images/standard.png') },
  { label: '2 Stroke', icon: require('../assets/images/standard.png') },
  { label: 'Sportsbike', icon: require('../assets/images/standard.png') },
  { label: 'Scooter', icon: require('../assets/images/standard.png') },
  { label: 'Electric', icon: require('../assets/images/standard.png') },
  { label: 'Cruiser', icon: require('../assets/images/standard.png') },
  { label: 'ATV', icon: require('../assets/images/standard.png') },
];

const BikesSection = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Category');
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
        {/* Search Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 10 : 0, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 2 }}>
          <TextInput
            style={{ flex: 1, height: 40, fontSize: 16, color: '#222', backgroundColor: 'transparent' }}
            placeholder="Search used bikes"
            placeholderTextColor="#888"
            editable={false}
            pointerEvents="none"
          />
          <TouchableOpacity style={{ paddingLeft: 8 }} pointerEvents="none">
            <Text style={{ color: '#888', fontSize: 15 }}>| <Text >All Cities</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Browse Used Bikes */}
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 10 }}>Browse Used Bikes</Text>
        <View style={{ flexDirection: 'row', marginBottom: 14, marginTop: 10 }}>
          {['Category', 'Brand', 'Model', 'Cities'].map(tab => (
            <TouchableOpacity key={tab} style={{ marginRight: 24, paddingBottom: 4, borderBottomWidth: activeTab === tab ? 2 : 0, borderBottomColor: activeTab === tab ? '#2563eb' : 'transparent' }} onPress={() => setActiveTab(tab)}>
              <Text style={{ color: activeTab === tab ? '#2563eb' : '#444', fontSize: 16, fontWeight: activeTab === tab ? '700' : '400' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Category Grid */}
        {activeTab === 'Category' && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 6 }}>
            {bikeCategories.map((cat, idx) => (
              <View key={cat.label} style={{ width: '23%', backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', paddingVertical: 20, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }}>
                <Image source={cat.icon} style={{ width: 36, height: 36, marginBottom: 8 }} resizeMode="contain" />
                <Text style={{ fontSize: 13, textAlign: 'center', color: '#222', fontWeight: '500' }}>{cat.label}</Text>
              </View>
            ))}
          </View>
        )}
        {/* Pagination dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb', marginHorizontal: 3 }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 3 }} />
        </View>
      </View>
      {/* Browse More */}
      <View style={{ marginTop: 18, paddingHorizontal: 16, }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 20 }}>Browse More</Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <Image source={require('../assets/images/standard.png')} style={{ width: 24, height: 24, marginRight: 10,  }} />
          <View>
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#222' }}>New Bikes</Text>
            <Text style={{ color: '#888', fontSize: 14 }}>Get information about latest bikes</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <Image source={require('../assets/images/standard.png')} style={{ width: 24, height: 24, marginRight: 10, }} />
          <View>
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#222' }}>New Bike Prices</Text>
            <Text style={{ color: '#888', fontSize: 14 }}>The most frequently updated new prices</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <Image source={require('../assets/images/standard.png')} style={{ width: 24, height: 24, marginRight: 10,  }} />
          <View>
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#222' }}>Maintain Your Bike</Text>
            <Text style={{ color: '#888', fontSize: 14 }}>Tips and tricks for bike maintenance</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Featured Used Cars Section (copied from Used Cars tab) */}
      <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured Used Cars</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.carCard}>
              <Image source={require('../assets/images/stonic.jpg')} style={styles.carImage} resizeMode="contain" />
              <Text style={styles.carCardTitle}>KIA Stonic 2025</Text>
              <Text style={styles.carCardPrice}>PKR 61.5 lacs</Text>
              <Text style={styles.carCardCity}>Lahore</Text>
              <Text style={styles.carCardDetails}>2025 | 30 km | Petrol</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.carCard}>
              <Image source={require('../assets/images/mg.webp')} style={styles.carImage} resizeMode="contain" />
              <Text style={styles.carCardTitle}>MG HS 2025</Text>
              <Text style={styles.carCardPrice}>PKR 97.8 lacs</Text>
              <Text style={styles.carCardCity}>Lahore</Text>
              <Text style={styles.carCardDetails}>2025 | 30 km | Hybrid</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {/* Latest Videos Section (copied from Used Cars tab) */}
      <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Latest Videos</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>
        {/* Featured Video */}
        <View style={styles.featuredVideoCard}>
          <WebView
            style={styles.featuredVideoWebview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: 'https://www.youtube.com/embed/aMLNYwwNLPQ' }}
          />
          <Text style={styles.featuredVideoTitle}>
            Fully Modified Honda Civic RS Turbo - Owner Review
          </Text>
        </View>
        {/* Video List */}
        <View style={styles.videoList}>
          <TouchableOpacity style={styles.videoListItem} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=N5KTyWaBAtw')}>
            <View style={styles.videoThumb}>
              <Image source={require('../assets/images/forgotten_cars_thumb.jpg')} style={styles.videoThumbImage} resizeMode="cover" />
              <View style={styles.playButtonOverlaySmall}>
                <Text style={styles.playButtonIconSmall}>{'▶️'}</Text>
              </View>
            </View>
            <Text style={styles.videoListTitle}>Forgotten Cars of Pakistan - Episode 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.videoListItem} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=c0C5Vl1CNQs')}>
            <View style={styles.videoThumb}>
              <Image source={require('../assets/images/achay_driver_thumb.webp')} style={styles.videoThumbImage} resizeMode="cover" />
              <View style={styles.playButtonOverlaySmall}>
                <Text style={styles.playButtonIconSmall}>{'▶️'}</Text>
              </View>
            </View>
            <Text style={styles.videoListTitle}>Achay Driver Kaisay Banay?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const autostoreCategories = [
  { label: 'Tyres & Wheels', image: require('../assets/images/carecarkit.jpg') },
  { label: 'Audio / Video', image: require('../assets/images/carecarkit.jpg') },
  { label: 'Lights & Elec...', image: require('../assets/images/carecarkit.jpg') },
  { label: 'Car Care', image: require('../assets/images/carecarkit.jpg') },
  { label: 'Exterior', image: require('../assets/images/carecarkit.jpg') },
  { label: 'Engine & Me...', image: require('../assets/images/carecarkit.jpg') },
];

const AutostoreSection = () => (
  <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
    {/* Shop by category */}
    <View style={{ marginTop: 32, paddingHorizontal: 0 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 20, marginLeft: 16 }}>Shop by category</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        {autostoreCategories.map((cat, idx) => (
          <View key={cat.label} style={{ width: '30%', backgroundColor: '#fff', borderRadius: 18, alignItems: 'center', paddingVertical: 22, marginBottom: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, marginRight: (idx % 3 !== 2) ? 10 : 0 }}>
            <Image source={cat.image} style={{ width: 60, height: 60, marginBottom: 10, borderRadius: 12 }} resizeMode="contain" />
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#222', fontWeight: '500' }}>{cat.label}</Text>
          </View>
        ))}
      </View>
      {/* Pagination dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb', marginHorizontal: 3 }} />
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 3 }} />
      </View>
    </View>
    {/* My Garage, my store card */}
    <View style={{ backgroundColor: '#fff', borderRadius: 18, marginHorizontal: 16, marginTop: 18, padding: 18, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 6 }}>My Garage, my store</Text>
        <Text style={{ fontSize: 15, color: '#444' }}>Add your ride to your Garage for personalised recommendations</Text>
      </View>
      <Image source={require('../assets/images/sonata.jpeg')} style={{ width: 80, height: 80, borderRadius: 10, marginLeft: 10 }} resizeMode="contain" />
    </View>
  </ScrollView>
);

// Accept navigation prop
const Home = ({ navigation }) => {
  // Add state for selected tab
  const [selectedTab, setSelectedTab] = useState('Used Cars');
  const [sellModalVisible, setSellModalVisible] = useState(false);

  const handleSellOption = (option) => {
    setSellModalVisible(false);
    // Handle different sell options here
    console.log('Selected sell option:', option);
    // You can navigate to different screens based on the option
    switch (option) {
      case 'car':
        // Navigate to car selling screen
        break;
      case 'bike':
        // Navigate to bike selling screen
        break;
      case 'autoparts':
        // Navigate to auto parts selling screen
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Tabs */}
        <View style={styles.topTabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topTabs}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'Used Cars' ? styles.tabActive : null]}
              onPress={() => setSelectedTab('Used Cars')}
            >
              <Text style={selectedTab === 'Used Cars' ? styles.tabTextActive : styles.tabText}>Used Cars</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'New Cars' ? styles.tabActive : null]}
              onPress={() => setSelectedTab('New Cars')}
            >
              <Text style={selectedTab === 'New Cars' ? styles.tabTextActive : styles.tabText}>New Cars</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'Bikes' ? styles.tabActive : null]}
              onPress={() => setSelectedTab('Bikes')}
            >
              <Text style={selectedTab === 'Bikes' ? styles.tabTextActive : styles.tabText}>Bikes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'Autostore' ? styles.tabActive : null]}
              onPress={() => setSelectedTab('Autostore')}
            >
              <Text style={selectedTab === 'Autostore' ? styles.tabTextActive : styles.tabText}>Autostore</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Search Bar */}
        {selectedTab !== 'Bikes' && (
          <View style={styles.searchBarContainer}>
            <TouchableOpacity
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 10 }}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SearchUsedCars')}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={selectedTab === 'New Cars' ? 'Search new cars' : 'Search used cars'}
              placeholderTextColor="#888"
              editable={false}
              pointerEvents="none"
            />
            <TouchableOpacity style={styles.cityFilter} pointerEvents="none">
              <Text style={styles.cityFilterText}>| All Cities</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dynamic Content */}
        {selectedTab === 'Used Cars' ? (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            {/* Browse Used Cars */}
            <View style={[styles.section, styles.sectionSpacingSmall]}>
              <Text style={styles.sectionTitle}>Browse Used Cars</Text>
              <View style={styles.browseTabs}>
                <TouchableOpacity style={[styles.browseTab, styles.browseTabActive]}><Text style={styles.browseTabTextActive}>Category</Text></TouchableOpacity>
                <TouchableOpacity style={styles.browseTab}><Text style={styles.browseTabText}>Budget</Text></TouchableOpacity>
                <TouchableOpacity style={styles.browseTab}><Text style={styles.browseTabText}>Brand</Text></TouchableOpacity>
                <TouchableOpacity style={styles.browseTab}><Text style={styles.browseTabText}>Model</Text></TouchableOpacity>
              </View>
              <View style={styles.categoryGrid}>
                {categories.map((cat, idx) => (
                  <TouchableOpacity
                    key={cat.label}
                    style={styles.categoryItem}
                    onPress={() => navigation.navigate('CarListScreen', { model: cat.label })}
                  >
                    <Image source={cat.image} style={styles.categoryIcon} resizeMode="contain" />
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* PakWheels Offerings */}
            <View style={styles.sectionSpacing}>
              <Text style={[styles.sectionTitle, styles.sectionTitleMarginLeft]}>PakWheels offerings</Text>
              <View style={styles.offeringsGrid}>
                {offerings.map((off, idx) => (
                  <View key={off.title} style={styles.offeringCardGrid}>
                    <View style={styles.offeringIconWrapper}>
                      <Text style={styles.offeringIcon}>{off.icon}</Text>
                    </View>
                    <Text style={styles.offeringSubtitle}>{off.subtitle}</Text>
                    <Text style={styles.offeringTitle}>{off.title}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* PakWheels Certified Cars Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>PakWheels Certified Cars</Text>
                <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.cardRow}>
                  <TouchableOpacity style={styles.carCard} onPress={() => navigation.navigate('CarDetailScreen', { carId: 'sonata2021' })}>
                    <Image source={require('../assets/images/sonata.jpeg')} style={styles.carImage} resizeMode="contain" />
                    <Text style={styles.carCardTitle}>Hyundai Sonata 2021</Text>
                    <Text style={styles.carCardPrice}>PKR 80.0 lacs</Text>
                    <Text style={styles.carCardCity}>Karachi</Text>
                    <Text style={styles.carCardDetails}>2021 | 84,061 km | Petrol</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.carCard} onPress={() => navigation.navigate('CarDetailScreen', { carId: 'alto2023' })}>
                    <Image source={require('../assets/images/alto.webp')} style={styles.carImage} resizeMode="contain" />
                    <Text style={styles.carCardTitle}>Suzuki Alto 2023</Text>
                    <Text style={styles.carCardPrice}>PKR 30.0 lacs</Text>
                    <Text style={styles.carCardCity}>Karachi</Text>
                    <Text style={styles.carCardDetails}>2023 | 41,387 km | Petrol</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {/* Managed by PakWheels Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Managed by PakWheels</Text>
                <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.cardRow}>
                  <TouchableOpacity style={styles.carCard}>
                    <Image source={require('../assets/images/vitz.jpg')} style={styles.carImage} resizeMode="contain" />
                    <Text style={styles.carCardTitle}>Toyota Vitz 2018</Text>
                    <Text style={styles.carCardPrice}>PKR 45.0 lacs</Text>
                    <Text style={styles.carCardCity}>Lahore</Text>
                    <Text style={styles.carCardDetails}>2018 | 52,000 km | Petrol</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.carCard}>
                    <Image source={require('../assets/images/civic.jpg')} style={styles.carImage} resizeMode="contain" />
                    <Text style={styles.carCardTitle}>Honda Civic 2020</Text>
                    <Text style={styles.carCardPrice}>PKR 70.0 lacs</Text>
                    <Text style={styles.carCardCity}>Islamabad</Text>
                    <Text style={styles.carCardDetails}>2020 | 30,000 km | Petrol</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {/* Featured Used Cars Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Featured Used Cars</Text>
                <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.cardRow}>
                  <TouchableOpacity style={styles.carCard}>
                    <Image source={require('../assets/images/stonic.jpg')} style={styles.carImage} resizeMode="contain" />
                    <Text style={styles.carCardTitle}>KIA Stonic 2025</Text>
                    <Text style={styles.carCardPrice}>PKR 61.5 lacs</Text>
                    <Text style={styles.carCardCity}>Lahore</Text>
                    <Text style={styles.carCardDetails}>2025 | 30 km | Petrol</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.carCard}>
                    <Image source={require('../assets/images/mg.webp')} style={styles.carImage} resizeMode="contain" />
                    <Text style={styles.carCardTitle}>MG HS 2025</Text>
                    <Text style={styles.carCardPrice}>PKR 97.8 lacs</Text>
                    <Text style={styles.carCardCity}>Lahore</Text>
                    <Text style={styles.carCardDetails}>2025 | 30 km | Hybrid</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {/* PakWheels Autostore Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>PakWheels Autostore</Text>
                <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.cardRow}>
                  <TouchableOpacity style={styles.carCard}>
                    <Image source={require('../assets/images/cleaner.jpg')} style={styles.carImage} resizeMode="contain" />
                    <Text style={styles.carCardTitle}>All Purpose Cleaner</Text>
                    <Text style={styles.carCardPrice}>31% off</Text>
                    <Text style={styles.carCardCity}>New Launch</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.carCard}>
                    <Image source={require('../assets/images/carecarkit.jpg')} style={styles.carImage} resizeMode="contain" />
                    <Text style={styles.carCardTitle}>Car Care Kit</Text>
                    <Text style={styles.carCardPrice}>30% off</Text>
                    <Text style={styles.carCardCity}>-</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {/* Latest Videos Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Latest Videos</Text>
                <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              {/* Featured Video */}
              <View style={styles.featuredVideoCard}>
                <WebView
                  style={styles.featuredVideoWebview}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  source={{ uri: 'https://www.youtube.com/embed/aMLNYwwNLPQ' }}
                />
                <Text style={styles.featuredVideoTitle}>
                  Fully Modified Honda Civic RS Turbo - Owner Review
                </Text>
              </View>
              {/* Video List */}
              <View style={styles.videoList}>
                <TouchableOpacity style={styles.videoListItem} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=N5KTyWaBAtw')}>
                  <View style={styles.videoThumb}>
                    <Image source={require('../assets/images/forgotten_cars_thumb.jpg')} style={styles.videoThumbImage} resizeMode="cover" />
                    <View style={styles.playButtonOverlaySmall}>
                      <Text style={styles.playButtonIconSmall}>{'▶️'}</Text>
                    </View>
                  </View>
                  <Text style={styles.videoListTitle}>Forgotten Cars of Pakistan - Episode 1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.videoListItem} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=c0C5Vl1CNQs')}>
                  <View style={styles.videoThumb}>
                    <Image source={require('../assets/images/achay_driver_thumb.webp')} style={styles.videoThumbImage} resizeMode="cover" />
                    <View style={styles.playButtonOverlaySmall}>
                      <Text style={styles.playButtonIconSmall}>{'▶️'}</Text>
                    </View>
                  </View>
                  <Text style={styles.videoListTitle}>Achay Driver Kaisay Banay?</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Current Fuel Prices Section */}
            <View style={[styles.sectionSpacing, {paddingHorizontal: 8}]}>
              <View style={styles.fuelCard}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                  <View style={styles.fuelIconCircle}>
                    <Text style={styles.fuelIcon}>{'⛽'}</Text>
                  </View>
                  <View style={{marginLeft: 8}}>
                    <Text style={styles.fuelTitle}>Current Fuel Prices</Text>
                    <Text style={styles.fuelUpdated}>Last updated 1 Jul, 2025</Text>
                  </View>
                </View>
                <View style={styles.fuelTableHeader}>
                  <Text style={styles.fuelTableHeaderText}>Type</Text>
                  <Text style={[styles.fuelTableHeaderText, styles.fuelTableHeaderTextRight]}>Price Per Liter</Text>
                </View>
                <View style={styles.fuelTableRow}><Text style={styles.fuelType}>Petrol (Super)</Text><Text style={styles.fuelPriceRight}><Text style={styles.fuelPKR}>PKR</Text><Text>  </Text><Text style={styles.fuelPrice}>266.79</Text></Text></View>
                <View style={styles.fuelTableRow}><Text style={styles.fuelType}>High Speed Diesel</Text><Text style={styles.fuelPriceRight}><Text style={styles.fuelPKR}>PKR</Text><Text>  </Text><Text style={styles.fuelPrice}>272.98</Text></Text></View>
                <View style={styles.fuelTableRow}><Text style={styles.fuelType}>Light Speed Diesel</Text><Text style={styles.fuelPriceRight}><Text style={styles.fuelPKR}>PKR</Text><Text>  </Text><Text style={styles.fuelPrice}>155.81</Text></Text></View>
                <View style={styles.fuelTableRow}><Text style={styles.fuelType}>Kerosene Oil</Text><Text style={styles.fuelPriceRight}><Text style={styles.fuelPKR}>PKR</Text><Text>  </Text><Text style={styles.fuelPrice}>171.65</Text></Text></View>
                <View style={styles.fuelTableRow}><Text style={styles.fuelType}>CNG Region-I*</Text><Text style={styles.fuelPriceRight}><Text style={styles.fuelPKR}>PKR</Text><Text>  </Text><Text style={styles.fuelPrice}>190.00</Text></Text></View>
                <View style={styles.fuelTableRow}><Text style={styles.fuelType}>CNG Region-II**</Text><Text style={styles.fuelPriceRight}><Text style={styles.fuelPKR}>PKR</Text><Text>  </Text><Text style={styles.fuelPrice}>190.00</Text></Text></View>
                <View style={styles.fuelPoweredRow}>
                  <Text style={styles.fuelPoweredText}>Powered By :</Text>
                  <Text style={styles.fuelPoweredLogo}>{'🧭'}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : selectedTab === 'New Cars' ? (
          <NewCarsSection navigation={navigation} />
        ) : selectedTab === 'Bikes' ? (
          <BikesSection navigation={navigation} />
        ) : selectedTab === 'Autostore' ? (
          <AutostoreSection />
        ) : null}

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={styles.bottomNavIcon}>🏠</Text>
            <Text style={styles.bottomNavLabelActive}>Home</Text>
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#193A7A', paddingBottom: 40 },
  container: { flex: 1, backgroundColor: '#f9fafd' },
  topTabsWrapper: {
    backgroundColor: '#193A7A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 10,
  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: Platform.select({ android: 32, ios: 18 }), // more space on Android
  },
  tab: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, marginRight: 10, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  tabActive: { backgroundColor: '#2563eb', elevation: 4, shadowOpacity: 0.15 },
  tabText: { color: '#193A7A', fontWeight: '500', fontSize: 15 },
  tabTextActive: { color: '#fff', fontWeight: '700', fontSize: 15 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 10, borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 10 : 0, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 2 },
  searchInput: { flex: 1, height: 40, fontSize: 16, color: '#222', backgroundColor: 'transparent' },
  cityFilter: { paddingLeft: 8 },
  cityFilterText: { color: '#888', fontSize: 15 },
  section: { marginTop: 18, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginVertical: 10, color: '#222', marginBottom: 20 },
  browseTabs: { flexDirection: 'row', marginBottom: 14, marginTop: 10 },
  browseTab: { marginRight: 24, paddingBottom: 4 },
  browseTabActive: { borderBottomWidth: 2, borderBottomColor: '#2563eb' },
  browseTabText: { color: '#444', fontSize: 16 },
  browseTabTextActive: { color: '#2563eb', fontSize: 16, fontWeight: '700' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 6 },
  categoryItem: { width: '23%', backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', paddingVertical: 20, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  categoryIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e6edfa', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryIcon: { width: 44, height: 44, marginBottom: 8 },
  categoryLabel: { fontSize: 13, textAlign: 'center', color: '#222', fontWeight: '500' },
  offeringsScroll: { paddingLeft: 16, marginTop: 10 },
  offeringCard: { width: 170, height: 150, backgroundColor: '#fff', borderRadius: 16, marginRight: 18, alignItems: 'center', justifyContent: 'center', padding: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  offeringIconWrapper: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e6edfa', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  offeringIcon: { fontSize: 32 },
  offeringSubtitle: { color: '#2563eb', fontWeight: '700', fontSize: 13, marginBottom: 2 },
  offeringTitle: { fontWeight: '700', fontSize: 16, color: '#222', textAlign: 'center' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 70, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', zIndex: 10, elevation: 10 },
  bottomNavItem: { alignItems: 'center', flex: 1 },
  bottomNavIcon: { fontSize: 24, marginBottom: 2 },
  bottomNavLabel: { fontSize: 12, color: '#888' },
  bottomNavLabelActive: { fontSize: 12, color: '#2563eb', fontWeight: '700' },
  sellNowButton: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', marginBottom: 30, zIndex: 20, elevation: 6, shadowColor: '#2563eb', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  sellNowPlus: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: -2 },
  sectionTitleCenter: { textAlign: 'center' },
  sectionTitleMarginLeft: { marginLeft: 16 },
  offeringsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 10,
  },
  offeringCardGrid: {
    width: '47%',
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionWithCards: {
    marginTop: 10,
    marginBottom: 10,
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
    marginBottom: 10,
  },
  carImagePlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 8,
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
  sectionSpacing: {
    marginTop: 36,
  },
  sectionSpacingSmall: {
    marginTop: 18,
  },
  featuredVideoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  featuredVideoWebview: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  featuredVideoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginHorizontal: 10,
    marginBottom: 6,
  },
  videoList: {
    marginHorizontal: 16,
    marginTop: 2,
  },
  videoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  videoThumb: {
    width: 110,
    height: 70,
    backgroundColor: '#cfd8dc',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playButtonOverlaySmall: {
    position: 'absolute',
    top: '30%',
    left: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonIconSmall: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 2,
  },
  videoListTitle: {
    fontSize: 15,
    color: '#222',
    flex: 1,
    flexWrap: 'wrap',
    fontWeight: '400',
  },
  videoListWebview: {
    width: 110,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  videoThumbImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  fuelCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 28,
    marginHorizontal: 2,
    marginBottom: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fuelIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fuelIcon: {
    fontSize: 24,
  },
  fuelTitle: {
    fontWeight: '700',
    fontSize: 22,
    color: '#222',
    marginBottom: 2,
  },
  fuelUpdated: {
    color: '#888',
    fontSize: 13,
    marginTop: 1,
  },
  fuelTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    borderRadius: 6,
    marginTop: 22,
    marginBottom: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  fuelTableHeaderText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    flex: 1,
  },
  fuelTableHeaderTextRight: {
    marginLeft: 30,
    textAlign: 'right',
  },
  fuelTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  fuelType: {
    color: '#222',
    fontSize: 16,
    flex: 1,
  },
  fuelPriceRight: {
    marginLeft: 30,
    textAlign: 'right',
    minWidth: 90,
  },
  fuelPKR: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  fuelPrice: {
    color: '#222',
    fontWeight: '700',
    fontSize: 17,
  },
  fuelPoweredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 2,
  },
  fuelPoweredText: {
    color: '#888',
    fontSize: 14,
    marginRight: 6,
  },
  fuelPoweredLogo: {
    fontSize: 22,
    color: '#e11d48',
  },
});

export default Home;
