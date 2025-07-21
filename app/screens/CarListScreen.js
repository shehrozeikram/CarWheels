import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, TextInput, Alert, I18nManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SellModal from '../modals/SellModal';
import AuthModal from '../modals/AuthModal';
import SuccessModal from '../modals/SuccessModal';
import { isUserLoggedIn } from './auth/AuthUtils';
import { Header, SearchBar, CarCard, LoadingSpinner, EmptyState } from '../components';
import { getCarsForModel, initializeCarData, addModelUpdateListener } from '../utils/CarDataManager';

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
  'Honda Civic': [
    {
      id: 1,
      title: 'Honda Civic 2023 RS Turbo',
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
      title: 'Honda Civic 2022 RS',
      price: 'PKR 78 lacs',
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
    {
      id: 3,
      title: 'Honda Civic 2021 RS',
      price: 'PKR 72 lacs',
      year: '2021',
      km: '42,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
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
  'Suzuki Cultus': [
    {
      id: 1,
      title: 'Suzuki Cultus 2023 VXL',
      price: 'PKR 35 lacs',
      year: '2023',
      km: '10,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '8.8',
    },
    {
      id: 2,
      title: 'Suzuki Cultus 2022 VXL',
      price: 'PKR 32 lacs',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.6',
    },
    {
      id: 3,
      title: 'Suzuki Cultus 2021 VXL',
      price: 'PKR 28 lacs',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: false,
      isStarred: false,
      imagesCount: 10,
      managed: false,
      inspected: null,
    },
  ],
  'Suzuki Mehran': [
    {
      id: 1,
      title: 'Suzuki Mehran 2023 VX',
      price: 'PKR 18 lacs',
      year: '2023',
      km: '5,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 8,
      managed: true,
      inspected: '8.5',
    },
    {
      id: 2,
      title: 'Suzuki Mehran 2022 VX',
      price: 'PKR 16 lacs',
      year: '2022',
      km: '22,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 6,
      managed: true,
      inspected: '8.3',
    },
    {
      id: 3,
      title: 'Suzuki Mehran 2021 VX',
      price: 'PKR 14 lacs',
      year: '2021',
      km: '35,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 5,
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
  'Toyota Land Cruiser': [
    {
      id: 1,
      title: 'Toyota Land Cruiser 2023 V8',
      price: 'PKR 3.2 crore',
      year: '2023',
      km: '8,000 km',
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
      title: 'Toyota Land Cruiser 2022 V8',
      price: 'PKR 2.8 crore',
      year: '2022',
      km: '25,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.3',
    },
    {
      id: 3,
      title: 'Toyota Land Cruiser 2021 V8',
      price: 'PKR 2.5 crore',
      year: '2021',
      km: '42,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 16,
      managed: false,
      inspected: null,
    },
  ],
  'Toyota Prado': [
    {
      id: 1,
      title: 'Toyota Prado 2023 V6',
      price: 'PKR 2.1 crore',
      year: '2023',
      km: '12,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.4',
    },
    {
      id: 2,
      title: 'Toyota Prado 2022 V6',
      price: 'PKR 1.9 crore',
      year: '2022',
      km: '28,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.2',
    },
    {
      id: 3,
      title: 'Toyota Prado 2021 V6',
      price: 'PKR 1.7 crore',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: false,
      inspected: null,
    },
  ],
  'Toyota Vitz': [
    {
      id: 1,
      title: 'Toyota Vitz 2023 1.3L',
      price: 'PKR 42 lacs',
      year: '2023',
      km: '8,000 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 14,
      managed: true,
      inspected: '9.0',
    },
    {
      id: 2,
      title: 'Toyota Vitz 2022 1.3L',
      price: 'PKR 38 lacs',
      year: '2022',
      km: '25,000 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: false,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '8.8',
    },
    {
      id: 3,
      title: 'Toyota Vitz 2021 1.3L',
      price: 'PKR 35 lacs',
      year: '2021',
      km: '38,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 10,
      managed: false,
      inspected: null,
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
    {
      id: 3,
      title: 'Mercedes C-Class 2019',
      price: 'PKR 1.2 crore',
      year: '2019',
      km: '58,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 14,
      managed: false,
      inspected: null,
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
    {
      id: 3,
      title: 'Jeep Compass 2020',
      price: 'PKR 75 lacs',
      year: '2020',
      km: '52,000 km',
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
    {
      id: 3,
      title: 'Toyota Camry Hybrid 2021',
      price: 'PKR 95 lacs',
      year: '2021',
      km: '35,000 km',
      city: 'Islamabad',
      fuel: 'Hybrid',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: true,
      imagesCount: 11,
      managed: false,
      inspected: null,
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
    {
      id: 3,
      title: 'Mitsubishi L200 2021',
      price: 'PKR 1.1 crore',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Diesel',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 12,
      managed: false,
      inspected: null,
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
    {
      id: 3,
      title: 'Suzuki Swift 2020 Duplicate',
      price: 'PKR 42 lacs',
      year: '2020',
      km: '52,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 6,
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
    {
      id: 3,
      title: 'Suzuki Alto 2021 Urgent',
      price: 'PKR 28 lacs',
      year: '2021',
      km: '35,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: false,
      isStarred: false,
      imagesCount: 9,
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
    {
      id: 3,
      title: 'Suzuki Carry 2021 Daba',
      price: 'PKR 18 lacs',
      year: '2021',
      km: '45,000 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: false,
      isStarred: false,
      imagesCount: 5,
      managed: false,
      inspected: null,
    },
  ],
  'New Cars': [
    {
      id: 1,
      title: 'Toyota Corolla Cross 2024',
      price: 'PKR 1.2 crore',
      year: '2024',
      km: '0 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: true,
      imagesCount: 20,
      managed: true,
      inspected: '9.8',
    },
    {
      id: 2,
      title: 'Honda City 2024 VX',
      price: 'PKR 85 lacs',
      year: '2024',
      km: '0 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/civic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 18,
      managed: true,
      inspected: '9.7',
    },
    {
      id: 3,
      title: 'Suzuki Swift 2024 VXL',
      price: 'PKR 65 lacs',
      year: '2024',
      km: '0 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/alto.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 16,
      managed: true,
      inspected: '9.6',
    },
  ],
  'Bikes': [
    {
      id: 1,
      title: 'Honda CG 125 2024',
      price: 'PKR 2.8 lacs',
      year: '2024',
      km: '0 km',
      city: 'Karachi',
      fuel: 'Petrol',
      image: require('../assets/images/mg.webp'),
      isNew: true,
      isStarred: true,
      imagesCount: 12,
      managed: true,
      inspected: '9.5',
    },
    {
      id: 2,
      title: 'Yamaha YBR 125 2024',
      price: 'PKR 3.2 lacs',
      year: '2024',
      km: '0 km',
      city: 'Lahore',
      fuel: 'Petrol',
      image: require('../assets/images/stonic.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 10,
      managed: true,
      inspected: '9.4',
    },
    {
      id: 3,
      title: 'Suzuki GS 150 2024',
      price: 'PKR 2.5 lacs',
      year: '2024',
      km: '0 km',
      city: 'Islamabad',
      fuel: 'Petrol',
      image: require('../assets/images/vitz.jpg'),
      isNew: true,
      isStarred: false,
      imagesCount: 8,
      managed: false,
      inspected: null,
    },
  ],
  'Autostore': [
    {
      id: 1,
      title: 'All Purpose Cleaner',
      price: 'PKR 1,200',
      year: '2024',
      km: 'New',
      city: 'Karachi',
      fuel: 'Product',
      image: require('../assets/images/cleaner.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 6,
      managed: true,
      inspected: null,
    },
    {
      id: 2,
      title: 'Car Care Kit Premium',
      price: 'PKR 2,500',
      year: '2024',
      km: 'New',
      city: 'Lahore',
      fuel: 'Product',
      image: require('../assets/images/carecarkit.jpg'),
      isNew: true,
      isStarred: true,
      imagesCount: 8,
      managed: true,
      inspected: null,
    },
    {
      id: 3,
      title: 'Car Wax & Polish',
      price: 'PKR 1,800',
      year: '2024',
      km: 'New',
      city: 'Islamabad',
      fuel: 'Product',
      image: require('../assets/images/sonata.jpeg'),
      isNew: true,
      isStarred: false,
      imagesCount: 5,
      managed: false,
      inspected: null,
    },
  ],
};

const CarListScreen = ({ navigation, route }) => {
  const { model, showSuccessMessage, newListing } = route.params;
  const insets = useSafeAreaInsets();

  // Sticky bar state
  const [showStickyBar, setShowStickyBar] = useState(false);
  const scrollY = useRef(0);
  
  // Sell modal state
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Car data state - now using state to trigger re-renders
  const [cars, setCars] = useState([]);

  // Initialize car data manager with static data
  useEffect(() => {
    initializeCarData(carData);
    
    // Get initial cars for this model
    const initialCars = getCarsForModel(model, carData);
    setCars(initialCars);
    
    // Listen for updates to any car in this model
    const unsubscribe = addModelUpdateListener(model, carData, (updatedCars) => {
      setCars(updatedCars);
    });
    
    return unsubscribe;
  }, [model]);

  // Show success message if coming from new ad creation
  useEffect(() => {
    if (showSuccessMessage && newListing) {
      setSuccessModalVisible(true);
    }
  }, [showSuccessMessage, newListing]);

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

  // Handler for scroll event
  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    scrollY.current = y;
    setShowStickyBar(y > 60); // Show sticky bar after scrolling 60px
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
              <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>{model}</Text></TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.resultsRow}>
            <Text style={styles.resultsText}>{cars.length} results</Text>
            <TouchableOpacity><Text style={styles.saveSearch}>Save Search</Text></TouchableOpacity>
          </View>
        </View>
      )}
      {/* Top Blue Bar for iOS inside SafeAreaView, for Android as before */}
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
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBackBtn}>
            <Image source={require('../assets/images/back_arrow.png')} style={styles.headerBackArrow} />
          </TouchableOpacity>
          <View style={styles.headerSearchWrapper}>
            <TextInput
              style={styles.headerSearchInput}
              placeholder="Search for used cars"
              placeholderTextColor="#444"
              editable={false}
              textAlign="left"
              textAlignVertical="center"
              writingDirection="ltr"
            />
            <TouchableOpacity style={styles.headerSearchIconBtn}>
              <Text style={styles.headerSearchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.headerHeartBtn}>
            <Text style={styles.headerHeartIcon}>♡</Text>
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
            <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterBtnText}>{model}</Text></TouchableOpacity>
          </ScrollView>
        </View>
        {/* Results Row */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>{cars.length} results</Text>
          <TouchableOpacity><Text style={styles.saveSearch}>Save Search</Text></TouchableOpacity>
        </View>
        {/* Car List */}
        {cars.map((car) => (
          <TouchableOpacity
            key={car.id}
            style={styles.card}
            onPress={() => navigation.navigate('CarDetailScreen', { car: car })}
          >
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
                {car.isUserCreated && (
                  <View style={styles.userCreatedBadge}><Text style={styles.userCreatedBadgeText}>Just Posted</Text></View>
                )}
                {car.isFeatured && (
                  <View style={styles.featuredBadge}>
                    <Image source={require('../assets/images/badge.png')} style={styles.featuredBadgeIconOut} />
                    <View style={styles.featuredBadgeTextContainer}>
                      <Text style={styles.featuredBadgeText}>FEATURED</Text>
                    </View>
                  </View>
                )}
                <View style={styles.imageCount}><Text style={styles.imageCountText}>{car.imagesCount}</Text></View>
                
                {car.biddingEnabled && (
                  <View style={styles.biddingBadge}>
                    <Text style={styles.biddingIcon}>🏷️</Text>
                    <Text style={styles.biddingText}>BIDDING</Text>
                    {car.biddingEndTime > Date.now() && (
                      <Text style={styles.biddingTimer}>
                        {Math.floor((car.biddingEndTime - Date.now()) / (1000 * 60 * 60 * 24))}d {Math.floor(((car.biddingEndTime - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h
                      </Text>
                    )}
                  </View>
                )}
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
                
                {car.biddingEnabled && (
                  <View style={styles.biddingInfo}>
                    <Text style={styles.biddingCurrentBid}>
                      Current Bid: PKR {car.currentBid?.toLocaleString() || '0'}
                    </Text>
                    <Text style={styles.biddingCount}>
                      {car.bids?.length || 0} bids placed
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.heartButton}>
                <Text style={styles.heartText}>♡</Text>
              </TouchableOpacity>
            </View>
            {(car.managed || car.certified || car.biddingEnabled) && (
              <>
                <View style={{ height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, marginBottom: 8 }} />
                <View style={styles.badgesRow}>
                  {car.managed && (
                    <View style={styles.badge}><Text style={styles.badgeIcon}>🛞</Text><View style={styles.badgeTextBg}><Text style={styles.badgeText}>MANAGED BY PAKWHEELS</Text></View></View>
                  )}
                  {car.certified && (
                    <View style={styles.badge}>
                      <Image source={require('../assets/images/certified_badge.png')} style={styles.certifiedBadgeIcon} />
                      <View style={styles.badgeTextBg}><Text style={styles.badgeText}>{`INSPECTED ${Math.floor(Math.random() * 6) + 5}/10`}</Text></View>
                    </View>
                  )}
                  {car.biddingEnabled && (
                    <View style={styles.biddingBadgeRow}>
                      <Text style={styles.biddingBadgeIcon}>🏷️</Text>
                      <View style={styles.biddingBadgeTextBg}>
                        <Text style={styles.biddingBadgeText}>LIVE BIDDING</Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </TouchableOpacity>
        ))}
        {/* Car inspection card (static, as in screenshot) */}
        <View style={styles.inspectionCard}>
          <Text style={styles.inspectionCardTitle}>Car inspection</Text>
          <Text style={styles.inspectionCardDesc}>Get your car inspected by our expert over 200 checkpoints</Text>
          <TouchableOpacity><Text style={styles.inspectionCardLink}>Get a car inspected 👨‍🔧</Text></TouchableOpacity>
        </View>
        {/* More car cards for sticky header testing */}
        {cars.map((car, idx) => (
          <TouchableOpacity
            key={`extra-${car.id}-${idx}`}
            style={styles.card}
            onPress={() => navigation.navigate('CarDetailScreen', { car: car })}
          >
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
                {car.isUserCreated && (
                  <View style={styles.userCreatedBadge}><Text style={styles.userCreatedBadgeText}>Just Posted</Text></View>
                )}
                {car.isFeatured && (
                  <View style={styles.featuredBadge}>
                    <Image source={require('../assets/images/badge.png')} style={styles.featuredBadgeIconOut} />
                    <View style={styles.featuredBadgeTextContainer}>
                      <Text style={styles.featuredBadgeText}>FEATURED</Text>
                    </View>
                  </View>
                )}
                <View style={styles.imageCount}><Text style={styles.imageCountText}>{car.imagesCount}</Text></View>
                
                {car.biddingEnabled && (
                  <View style={styles.biddingBadge}>
                    <Text style={styles.biddingIcon}>🏷️</Text>
                    <Text style={styles.biddingText}>BIDDING</Text>
                    {car.biddingEndTime > Date.now() && (
                      <Text style={styles.biddingTimer}>
                        {Math.floor((car.biddingEndTime - Date.now()) / (1000 * 60 * 60 * 24))}d {Math.floor(((car.biddingEndTime - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View style={styles.cardMainContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{car.title} (Extra)</Text>
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
                
                {car.biddingEnabled && (
                  <View style={styles.biddingInfo}>
                    <Text style={styles.biddingCurrentBid}>
                      Current Bid: PKR {car.currentBid?.toLocaleString() || '0'}
                    </Text>
                    <Text style={styles.biddingCount}>
                      {car.bids?.length || 0} bids placed
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.heartButton}>
                <Text style={styles.heartText}>♡</Text>
              </TouchableOpacity>
            </View>
            {(car.managed || car.certified || car.biddingEnabled) && (
              <>
                <View style={{ height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, marginBottom: 8 }} />
                <View style={styles.badgesRow}>
                  {car.managed && (
                    <View style={styles.badge}><Text style={styles.badgeIcon}>🛞</Text><View style={styles.badgeTextBg}><Text style={styles.badgeText}>MANAGED BY PAKWHEELS</Text></View></View>
                  )}
                  {car.certified && (
                    <View style={styles.badge}>
                      <Image source={require('../assets/images/certified_badge.png')} style={styles.certifiedBadgeIcon} />
                      <View style={styles.badgeTextBg}><Text style={styles.badgeText}>{`INSPECTED ${Math.floor(Math.random() * 6) + 5}/10`}</Text></View>
                    </View>
                  )}
                  {car.biddingEnabled && (
                    <View style={styles.biddingBadgeRow}>
                      <Text style={styles.biddingBadgeIcon}>🏷️</Text>
                      <View style={styles.biddingBadgeTextBg}>
                        <Text style={styles.biddingBadgeText}>LIVE BIDDING</Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </TouchableOpacity>
        ))}
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
            returnScreen: 'CarListScreen',
            returnParams: route.params,
            action: 'sell'
          });
        }}
        onSignUp={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignUpScreen', {
            returnScreen: 'CarListScreen',
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
    height: Platform.OS === 'android' ? 36 : 0, // mimic Home.js safe area blue
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#900C3F',
    height: 60,
    paddingHorizontal: 12,
    direction: 'ltr',
    // Remove paddingTop logic, handled by topBlueBar
  },
  headerBackBtn: { padding: 8, marginRight: 4 },
  headerBackArrow: { width: 22, height: 22, resizeMode: 'contain', tintColor: '#fff' },
  headerSearchWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 6, height: 38 },
  headerSearchInput: { flex: 1, fontSize: 16, color: '#222', paddingHorizontal: 10, height: 38, textAlign: 'left', writingDirection: 'ltr' },
  headerSearchIconBtn: { padding: 6 },
  headerSearchIcon: { fontSize: 18, color: '#888' },
  headerHeartBtn: { padding: 8, marginLeft: 4 },
  headerHeartIcon: { fontSize: 22, color: '#fff' },
  filterBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', direction: 'ltr' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 7, marginRight: 10, height: 38 },
  filterBtnText: { color: '#222', fontWeight: '600', fontSize: 15 },
  filterBtnSortFilter: {
    backgroundColor: 'transparent', // No background
    borderWidth: 0, // No border
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderRadius: 0, // No pill/circle
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
  scrollContent: { padding: 12, paddingBottom: 80 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'visible',
    borderWidth: 2,
    borderColor: '#f3f4f6',
    shadowColor: '#900C3F', // lighter blue shadow
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 }, // bottom-only shadow
    elevation: 7, // Android
    position: 'relative',
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
  userCreatedBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#10b981', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, zIndex: 2 },
  userCreatedBadgeText: { color: '#fff', fontWeight: '700', fontSize: 10, textTransform: 'uppercase' },
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
  badge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: { fontSize: 20, color: '#e11d48', marginRight: 4 },
  badgeText: { color: '#222222', fontWeight: '700', fontSize: 11 },
  certifiedBadgeIcon: { width: 22, height: 22, marginRight: 4, resizeMode: 'contain' },
  inspectionCard: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 2, marginBottom: 18, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  inspectionCardTitle: { fontWeight: '700', fontSize: 18, color: '#900C3F', marginBottom: 4 },
  inspectionCardDesc: { color: '#444', fontSize: 15, marginBottom: 6 },
  inspectionCardLink: { color: '#1275D7', fontSize: 15, fontWeight: '500', marginTop: 2 },
  sellButton: { position: 'absolute', bottom: 50, right: 24, backgroundColor: '#900C3F', borderRadius: 32, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', elevation: 8, zIndex: 10, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  sellButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  badgeTextBg: { backgroundColor: '#f3f4f6', paddingHorizontal: 6, borderRadius: 6, alignSelf: 'center', marginLeft: -4 },
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
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    direction: 'ltr',
  },
  stickyHeader: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
});

export default CarListScreen; 