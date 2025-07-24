import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, SafeAreaView, Image, Linking, I18nManager } from 'react-native';
import { WebView } from 'react-native-webview';
import {  StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import SuccessModal from '../modals/SuccessModal';
import { SearchBar } from '../components';
import { getCarsForModel, initializeCarData, addModelUpdateListener } from '../utils/CarDataManager';
import featuredVehiclesService from '../services/featuredVehiclesService';
import certifiedVehiclesService from '../services/certifiedVehiclesService';
import managedVehiclesService from '../services/managedVehiclesService';

const carData = {
  'Daihatsu Mira': [
    {
      id: 1,
      title: 'Daihatsu Mira X SA III',
      price: 'PKR 32 lacs',
      year: '2022',
      km: '36,281 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '9.1',
    },
    {
      id: 2,
      title: 'Daihatsu Mira X Memorial Edition',
      price: 'PKR 29.5 lacs',
      year: '2017',
      km: '86,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 9,
      managed: false,
      inspected: null,
    },
    {
      id: 3,
      title: 'Daihatsu Mira X Limited ER',
      price: 'PKR 23.26 lacs',
      year: '2013',
      km: '152,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 17,
      managed: false,
      inspected: null,
    },
  ],
  'Honda City': [
    {
      id: 1,
      title: 'Honda City 2023 VX',
      price: 'PKR 45 lacs',
      year: '2023',
      km: '18,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.8',
    },
    {
      id: 2,
      title: 'Honda City 2022 VX',
      price: 'PKR 42 lacs',
      year: '2022',
      km: '32,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: false,
      isStarred: true,
      imagesCount: 15,
      managed: true,
      inspected: '9.0',
    },
    {
      id: 3,
      title: 'Honda City 2021 VX',
      price: 'PKR 38 lacs',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 10,
      managed: false,
      inspected: null,
    },
  ],
  'Suzuki Alto': [
    {
      id: 1,
      title: 'Suzuki Alto 2023 VXL',
      price: 'PKR 28 lacs',
      year: '2023',
      km: '8,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.9',
      biddingEnabled: true,
      biddingEndTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
      currentBid: 2500000, // PKR 25 lacs
      bids: [
        { id: 1, amount: 2500000, bidder: 'Ahmed Khan', timestamp: Date.now() - 3600000 },
        { id: 2, amount: 2400000, bidder: 'Fatima Ali', timestamp: Date.now() - 7200000 },
      ],
      highestBidder: 'Ahmed Khan',
    },
    {
      id: 2,
      title: 'Suzuki Alto 2022 VXL',
      price: 'PKR 25 lacs',
      year: '2022',
      km: '25,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 10,
      managed: true,
      inspected: '8.7',
      biddingEnabled: true,
      biddingEndTime: Date.now() + (5 * 24 * 60 * 60 * 1000), // 5 days from now
      currentBid: 2200000, // PKR 22 lacs
      bids: [
        { id: 1, amount: 2200000, bidder: 'Muhammad Hassan', timestamp: Date.now() - 1800000 },
      ],
      highestBidder: 'Muhammad Hassan',
    },
    {
      id: 3,
      title: 'Suzuki Alto 2021 VXL',
      price: 'PKR 22 lacs',
      year: '2021',
      km: '38,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 8,
      managed: false,
      inspected: null,
    },
  ],
  'Toyota Corolla': [
    {
      id: 1,
      title: 'Toyota Corolla Altis 2023',
      price: 'PKR 75 lacs',
      year: '2023',
      km: '15,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.2',
    },
    {
      id: 2,
      title: 'Toyota Corolla Altis 2022',
      price: 'PKR 68 lacs',
      year: '2022',
      km: '32,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '9.0',
    },
    {
      id: 3,
      title: 'Toyota Corolla Altis 2021',
      price: 'PKR 62 lacs',
      year: '2021',
      km: '48,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 12,
      managed: false,
      inspected: null,
    },
  ],
  'Automatic cars': [
    {
      id: 1,
      title: 'Honda Civic 2023 Automatic',
      price: 'PKR 85 lacs',
      year: '2023',
      km: '12,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.3',
    },
    {
      id: 2,
      title: 'Toyota Corolla 2022 Automatic',
      price: 'PKR 68 lacs',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: false,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.1',
    },
  ],
  'Imported cars': [
    {
      id: 1,
      title: 'Toyota Land Cruiser 2020',
      price: 'PKR 2.5 crore',
      year: '2020',
      km: '45,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 20,
      managed: true,
      inspected: '9.5',
    },
    {
      id: 2,
      title: 'BMW X5 2021 Imported',
      price: 'PKR 1.8 crore',
      year: '2021',
      km: '32,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.3',
    },
  ],
  'Jeep': [
    {
      id: 1,
      title: 'Jeep Wrangler 2022',
      price: 'PKR 1.5 crore',
      year: '2022',
      km: '25,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.0',
    },
    {
      id: 2,
      title: 'Jeep Cherokee 2021',
      price: 'PKR 95 lacs',
      year: '2021',
      km: '38,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.7',
    },
  ],
  'Hybrid cars': [
    {
      id: 1,
      title: 'Toyota Prius 2023 Hybrid',
      price: 'PKR 1.1 crore',
      year: '2023',
      km: '12,000 km',
      city: 'Karachi',
      fuel: 'Hybrid',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 15,
      managed: true,
      inspected: '9.4',
    },
    {
      id: 2,
      title: 'Honda Insight 2022',
      price: 'PKR 85 lacs',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Hybrid',
      image: require('../assets/images/stonic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 13,
      managed: true,
      inspected: '9.1',
    },
  ],
  'Diesel cars': [
    {
      id: 1,
      title: 'Toyota Hilux 2023 Diesel',
      price: 'PKR 1.8 crore',
      year: '2023',
      km: '18,000 km',
      city: 'Karachi',
      fuel: 'Diesel',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 17,
      managed: true,
      inspected: '9.2',
    },
    {
      id: 2,
      title: 'Ford Ranger 2022 Diesel',
      price: 'PKR 1.4 crore',
      year: '2022',
      km: '32,000 km',
      city: 'Lahore',
      fuel: 'Diesel',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '8.9',
    },
  ],
  'Duplicate File': [
    {
      id: 1,
      title: 'Honda Civic 2022 Duplicate',
      price: 'PKR 65 lacs',
      year: '2022',
      km: '25,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 10,
      managed: false,
      inspected: null,
    },
    {
      id: 2,
      title: 'Toyota Corolla 2021 Duplicate',
      price: 'PKR 58 lacs',
      year: '2021',
      km: '38,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 8,
      managed: false,
      inspected: null,
    },
  ],
  'Urgent': [
    {
      id: 1,
      title: 'Toyota Vitz 2023 Urgent Sale',
      price: 'PKR 35 lacs',
      year: '2023',
      km: '8,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 12,
      managed: false,
      inspected: null,
    },
    {
      id: 2,
      title: 'Honda City 2022 Urgent',
      price: 'PKR 48 lacs',
      year: '2022',
      km: '22,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 15,
      managed: false,
      inspected: null,
    },
  ],
  'Carry Daba': [
    {
      id: 1,
      title: 'Suzuki Carry 2023 Daba',
      price: 'PKR 25 lacs',
      year: '2023',
      km: '12,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: false,
      imagesCount: 8,
      managed: false,
      inspected: null,
    },
    {
      id: 2,
      title: 'Daihatsu Hijet 2022 Daba',
      price: 'PKR 22 lacs',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 6,
      managed: false,
      inspected: null,
    },
  ],
};

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
  {
    title: 'AFFILIATION & BADGES',
    icon: '🏢',
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
  <ScrollView style={{ flex: 1, direction: 'ltr' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, direction: 'ltr' }}>
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
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#900C3F', marginHorizontal: 3 }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 3 }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 3 }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 3 }} />
        </View>
    </View>
    <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginVertical: 10, color: '#222' }}>Popular New Cars</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
        <View style={{ flexDirection: 'row', marginTop: 10, direction: 'ltr' }}>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
        <View style={{ flexDirection: 'row', marginTop: 10, direction: 'ltr' }}>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
        <View style={{ flexDirection: 'row', marginTop: 10, direction: 'ltr' }}>
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
        <Text style={{ color: '#900C3F', fontWeight: '600', fontSize: 15 }}>View All</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
        <View style={{ flexDirection: 'row', marginTop: 10, direction: 'ltr' }}>
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
        <Text style={{ color: '#900C3F', fontWeight: '600', fontSize: 15 }}>View All</Text>
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
        <TouchableOpacity><Text style={{ color: '#900C3F', fontWeight: '600', fontSize: 15 }}>View All</Text></TouchableOpacity>
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
    <ScrollView style={{ flex: 1, direction: 'ltr' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, direction: 'ltr' }}>
      <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
        {/* Search Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 10 : 0, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 2, direction: 'ltr' }}>
          <TextInput
            style={{ flex: 1, height: 40, fontSize: 16, color: '#222', backgroundColor: 'transparent' }}
            placeholder="Search used bikes"
            placeholderTextColor="#888"
            editable={false}
            pointerEvents="none"
            textAlign="left"
            textAlignVertical="center"
            writingDirection="ltr"
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
            <TouchableOpacity key={tab} style={{ marginRight: 24, paddingBottom: 4, borderBottomWidth: activeTab === tab ? 2 : 0, borderBottomColor: activeTab === tab ? '#900C3F' : 'transparent' }} onPress={() => setActiveTab(tab)}>
              <Text style={{ color: activeTab === tab ? '#900C3F' : '#444', fontSize: 16, fontWeight: activeTab === tab ? '700' : '400' }}>{tab}</Text>
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
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#900C3F', marginHorizontal: 3 }} />
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
          <View style={[styles.cardRow, { direction: 'ltr' }]}>
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
  <ScrollView style={{ flex: 1, direction: 'ltr' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, direction: 'ltr' }}>
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
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#900C3F', marginHorizontal: 3 }} />
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
const Home = ({ navigation, route }) => {
  // Add state for selected tab
  const [selectedTab, setSelectedTab] = useState('Used Cars');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSignInSuccess, setShowSignInSuccess] = useState(false);
  const [newListing, setNewListing] = useState(null);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const [certifiedVehicles, setCertifiedVehicles] = useState([]);
  const [isLoadingCertified, setIsLoadingCertified] = useState(false);
  const [managedVehicles, setManagedVehicles] = useState([]);
  const [isLoadingManaged, setIsLoadingManaged] = useState(false);

  // Initialize car data manager with static data
  useEffect(() => {
    initializeCarData(carData);
  }, []);

  // Load featured vehicles
  useEffect(() => {
    const loadFeaturedVehicles = async () => {
      setIsLoadingFeatured(true);
      try {
        const response = await featuredVehiclesService.getFeaturedVehicles(10);
        console.log('Featured Vehicles Response:', response);
        
        if (response && response.data) {
          // Transform API data to match our car format
          // The API returns vehicles grouped by condition, so we need to flatten them
          const allVehicles = [];
          
          // Add vehicles from each condition group
          if (response.data.new) allVehicles.push(...response.data.new);
          if (response.data.used) allVehicles.push(...response.data.used);
          if (response.data['certified-pre-owned']) allVehicles.push(...response.data['certified-pre-owned']);
          if (response.data.salvage) allVehicles.push(...response.data.salvage);
          
          console.log('All vehicles from API:', allVehicles);
          
          const transformedVehicles = allVehicles.map(vehicle => ({
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
          }));
          
          console.log('Transformed Featured Vehicles:', transformedVehicles);
          setFeaturedVehicles(transformedVehicles);
        } else {
          console.log('No featured vehicles data, using fallback');
          setFeaturedVehicles([]);
        }
      } catch (error) {
        console.error('Error loading featured vehicles:', error);
        setFeaturedVehicles([]);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    loadFeaturedVehicles();
  }, []);

  // Load certified vehicles
  useEffect(() => {
    const loadCertifiedVehicles = async () => {
      setIsLoadingCertified(true);
      try {
        const response = await certifiedVehiclesService.getCertifiedVehicles(10);
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
          setCertifiedVehicles([]);
          return;
        }
        
        console.log('Vehicles data to transform:', vehiclesData);
        
        if (vehiclesData && vehiclesData.length > 0) {
          // Transform API data to match our car format
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
          setCertifiedVehicles(transformedVehicles);
        } else {
          console.log('No certified vehicles data, using fallback');
          setCertifiedVehicles([]);
        }
      } catch (error) {
        console.error('Error loading certified vehicles:', error);
        setCertifiedVehicles([]);
      } finally {
        setIsLoadingCertified(false);
      }
    };

    loadCertifiedVehicles();
  }, []);

  // Load managed vehicles
  useEffect(() => {
    const loadManagedVehicles = async () => {
      setIsLoadingManaged(true);
      try {
        const response = await managedVehiclesService.getManagedVehicles(10);
        console.log('Managed Vehicles Response:', response);
        
        console.log('Managed Vehicles Response Structure:', {
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
          setManagedVehicles([]);
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
            managed: true, // Mark as managed
            inspected: null,
            sellerEmail: vehicle.user?.email,
            sellerName: vehicle.user?.name,
            biddingEnabled: false,
            biddingEndTime: null,
            currentBid: null,
            bids: [],
            highestBidder: null,
            isCertified: vehicle.is_certified || false,
          }));
          
          console.log('Transformed Managed Vehicles:', transformedVehicles);
          setManagedVehicles(transformedVehicles);
        } else {
          console.log('No managed vehicles data, using fallback');
          setManagedVehicles([]);
        }
      } catch (error) {
        console.error('Error loading managed vehicles:', error);
        setManagedVehicles([]);
      } finally {
        setIsLoadingManaged(false);
      }
    };

    loadManagedVehicles();
  }, []);

  // Get cars from global data manager with real-time updates
  const getCarsForCategory = (category) => {
    return getCarsForModel(category, carData);
  };

  // Handle new listing from SellYourCarScreen
  React.useEffect(() => {
    if (route.params?.newListing) {
      setNewListing(route.params.newListing);
      setShowSuccessMessage(true);
      // Clear the params to prevent showing message again
      navigation.setParams({ newListing: undefined, showSuccessMessage: undefined });
    }
  }, [route.params?.newListing]);

  // Handle sign-in success
  React.useEffect(() => {
    if (route.params?.fromSignIn) {
      setShowSignInSuccess(true);
      // Clear the params to prevent showing message again
      navigation.setParams({ fromSignIn: undefined });
      
      // Auto-hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSignInSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [route.params?.fromSignIn]);

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
      <View style={[styles.container, { direction: 'ltr' }]}>
        {/* Top Navigation Tabs */}
        <View style={[styles.topTabsWrapper, { direction: 'ltr' }]}>
          {/* Notification Badge */}
          {global.notifications && global.notifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{global.notifications.length}</Text>
            </View>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.topTabs, { direction: 'ltr' }]}>
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
          <SearchBar
            placeholder={selectedTab === 'New Cars' ? 'Search new cars' : 'Search used cars'}
            editable={false}
            locationText="All Cities"
            onPress={() => navigation.navigate('SearchUsedCars')}
          />
        )}

        {/* Dynamic Content */}
        {selectedTab === 'Used Cars' ? (
          <ScrollView style={{ flex: 1, direction: 'ltr' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, direction: 'ltr' }}>
            {/* Success Message */}
            {showSuccessMessage && newListing && (
              <View style={styles.successMessageContainer}>
                <View style={styles.successMessage}>
                  <Text style={styles.successIcon}>✅</Text>
                  <Text style={styles.successText}>Your car ad has been posted successfully!</Text>
                </View>
              </View>
            )}

            {/* Sign In Success Message */}
            {showSignInSuccess && (
              <View style={styles.successMessageContainer}>
                <View style={styles.successMessage}>
                  <Text style={styles.successIcon}>🎉</Text>
                  <Text style={styles.successText}>Welcome back! You have successfully signed in.</Text>
                  <TouchableOpacity 
                    style={styles.successMessageClose}
                    onPress={() => setShowSignInSuccess(false)}
                  >
                    <Text style={styles.successMessageCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Your Newly Posted Ad */}
            {newListing && (
              <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Your Newly Posted Ad</Text>
                  <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.cardRow}>
                    <TouchableOpacity style={styles.carCard} onPress={() => navigation.navigate('CarDetailScreen', { carId: newListing.id })}>
                      <Image source={newListing.image} style={styles.carImage} resizeMode="contain" />
                      <Text style={styles.carCardTitle}>{newListing.title}</Text>
                      <Text style={styles.carCardPrice}>{newListing.price}</Text>
                      <Text style={styles.carCardCity}>{newListing.city}</Text>
                      <Text style={styles.carCardDetails}>{newListing.year} | {newListing.km} | {newListing.fuel}</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )}

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
                  <TouchableOpacity 
                    key={off.title} 
                    style={styles.offeringCardGrid}
                    onPress={() => {
                      if (off.title === 'AFFILIATION & BADGES') {
                        navigation.navigate('AffiliationScreen');
                      }
                    }}
                  >
                    <View style={styles.offeringIconWrapper}>
                      <Text style={styles.offeringIcon}>{off.icon}</Text>
                    </View>
                    <Text style={styles.offeringSubtitle}>{off.subtitle}</Text>
                    <Text style={styles.offeringTitle}>{off.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* PakWheels Certified Cars Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>PakWheels Certified Cars</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CertifiedCarsScreen')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              
              {isLoadingCertified ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading certified vehicles...</Text>
                </View>
              ) : certifiedVehicles.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
                  <View style={[styles.cardRow, { direction: 'ltr' }]}>
                    {certifiedVehicles.slice(0, 10).map((vehicle) => (
                      <TouchableOpacity 
                        key={vehicle.id} 
                        style={styles.carCard}
                        onPress={() => navigation.navigate('CarDetailScreen', { car: vehicle })}
                      >
                        <View style={styles.imageContainer}>
                          <Image source={vehicle.image} style={styles.carImage} resizeMode="cover" />
                          {vehicle.isCertified && (
                            <View style={styles.certifiedBadge}>
                              <Text style={styles.certifiedText}>CERTIFIED</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.carCardTitle}>{vehicle.title}</Text>
                        <Text style={styles.carCardPrice}>{vehicle.price}</Text>
                        <Text style={styles.carCardCity}>{vehicle.city}</Text>
                        <Text style={styles.carCardDetails}>{vehicle.year} | {vehicle.km} | {vehicle.fuel}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No certified vehicles available</Text>
                </View>
              )}
            </View>

            {/* Managed by PakWheels Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Managed by PakWheels</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ManagedCarsScreen')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              
              {isLoadingManaged ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading managed vehicles...</Text>
                </View>
              ) : managedVehicles.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
                  <View style={[styles.cardRow, { direction: 'ltr' }]}>
                    {managedVehicles.slice(0, 10).map((vehicle) => (
                      <TouchableOpacity 
                        key={vehicle.id} 
                        style={styles.carCard}
                        onPress={() => navigation.navigate('CarDetailScreen', { car: vehicle })}
                      >
                        <View style={styles.imageContainer}>
                          <Image source={vehicle.image} style={styles.carImage} resizeMode="cover" />
                          {vehicle.isCertified && (
                            <View style={styles.certifiedBadge}>
                              <Text style={styles.certifiedText}>CERTIFIED</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.carCardTitle}>{vehicle.title}</Text>
                        <Text style={styles.carCardPrice}>{vehicle.price}</Text>
                        <Text style={styles.carCardCity}>{vehicle.city}</Text>
                        <Text style={styles.carCardDetails}>{vehicle.year} | {vehicle.km} | {vehicle.fuel}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No managed vehicles available</Text>
                </View>
              )}
            </View>

            {/* Featured Used Cars Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Featured Used Cars</Text>
                <TouchableOpacity onPress={() => navigation.navigate('FeaturedCarsScreen')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              
              {isLoadingFeatured ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading featured vehicles...</Text>
                </View>
              ) : featuredVehicles.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
                  <View style={[styles.cardRow, { direction: 'ltr' }]}>
                    {featuredVehicles.map((vehicle) => (
                      <TouchableOpacity 
                        key={vehicle.id} 
                        style={styles.carCard}
                        onPress={() => navigation.navigate('CarDetailScreen', { car: vehicle })}
                      >
                        <Image source={vehicle.image} style={styles.carImage} resizeMode="cover" />
                        <Text style={styles.carCardTitle}>{vehicle.title}</Text>
                        <Text style={styles.carCardPrice}>{vehicle.price}</Text>
                        <Text style={styles.carCardCity}>{vehicle.city}</Text>
                        <Text style={styles.carCardDetails}>{vehicle.year} | {vehicle.km} | {vehicle.fuel}</Text>
                        
                        {/* Bidding Badge if enabled */}
                        {vehicle.biddingEnabled && (
                          <>
                            <View style={styles.biddingBadge}>
                              <Text style={styles.biddingIcon}>🏷️</Text>
                              <Text style={styles.biddingText}>Live Bidding</Text>
                              {vehicle.biddingEndTime > Date.now() && (
                                <Text style={styles.biddingTimer}>
                                  {Math.floor((vehicle.biddingEndTime - Date.now()) / (1000 * 60 * 60 * 24))}d {Math.floor(((vehicle.biddingEndTime - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h left
                                </Text>
                              )}
                            </View>
                            <Text style={styles.biddingCurrentBid}>Current: PKR {vehicle.currentBid?.toLocaleString() || '0'}</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No featured vehicles available</Text>
                </View>
              )}
            </View>

            {/* PakWheels Autostore Section */}
            <View style={[styles.sectionWithCards, styles.sectionSpacing]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>PakWheels Autostore</Text>
                <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ direction: 'ltr' }}>
                <View style={[styles.cardRow, { direction: 'ltr' }]}>
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


      </View>
      
              {/* Success Message */}
        {showSuccessMessage && (
          <View style={styles.successMessage}>
            <Text style={styles.successMessageText}>✅ Your car ad has been posted successfully!</Text>
                          <TouchableOpacity 
                style={styles.successMessageClose}
                onPress={() => setShowSuccessMessage(false)}
              >
              <Text style={styles.successMessageCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#900C3F', paddingBottom: 40 },
  container: { flex: 1, backgroundColor: '#f9fafd', direction: 'ltr' },
  topTabsWrapper: {
    backgroundColor: '#900C3F',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 10,
    direction: 'ltr',
  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: Platform.select({ android: 32, ios: 18 }), // more space on Android
    direction: 'ltr',
  },
  tab: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, marginRight: 10, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  tabActive: { backgroundColor: '#900C3F', elevation: 4, shadowOpacity: 0.15 },
  tabText: { color: '#900C3F', fontWeight: '500', fontSize: 15 },
  tabTextActive: { color: '#fff', fontWeight: '700', fontSize: 15 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 10, borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 10 : 0, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 2, direction: 'ltr' },
  searchInput: { flex: 1, height: 40, fontSize: 16, color: '#222', backgroundColor: 'transparent' },
  cityFilter: { paddingLeft: 8 },
  cityFilterText: { color: '#888', fontSize: 15 },
  section: { marginTop: 18, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginVertical: 10, color: '#222', marginBottom: 20 },
  browseTabs: { flexDirection: 'row', marginBottom: 14, marginTop: 10 },
  browseTab: { marginRight: 24, paddingBottom: 4 },
  browseTabActive: { borderBottomWidth: 2, borderBottomColor: '#900C3F' },
  browseTabText: { color: '#444', fontSize: 16 },
  browseTabTextActive: { color: '#900C3F', fontSize: 16, fontWeight: '700' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 6 },
  categoryItem: { width: '23%', backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', paddingVertical: 20, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  categoryIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e6edfa', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryIcon: { width: 44, height: 44, marginBottom: 8 },
  categoryLabel: { fontSize: 13, textAlign: 'center', color: '#222', fontWeight: '500' },
  offeringsScroll: { paddingLeft: 16, marginTop: 10 },
  offeringCard: { width: 170, height: 150, backgroundColor: '#fff', borderRadius: 16, marginRight: 18, alignItems: 'center', justifyContent: 'center', padding: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  offeringIconWrapper: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e6edfa', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  offeringIcon: { fontSize: 32 },
  offeringSubtitle: { color: '#900C3F', fontWeight: '700', fontSize: 13, marginBottom: 2 },
  offeringTitle: { fontWeight: '700', fontSize: 16, color: '#222', textAlign: 'center' },

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
    color: '#900C3F',
    fontWeight: '600',
    fontSize: 15,
  },
  cardRow: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 8,
    direction: 'ltr',
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
    color: '#900C3F',
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
  biddingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  biddingIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  biddingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#d97706',
    marginRight: 4,
  },
  biddingTimer: {
    fontSize: 9,
    color: '#d97706',
    fontWeight: '500',
  },
  biddingCurrentBid: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
    marginTop: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 32 : 18,
    right: 16,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  notificationCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
  successMessageContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  successIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  successText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  successMessageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  successMessageClose: {
    padding: 4,
  },
  successMessageCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  certifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  certifiedText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
  },
});

export default Home;
