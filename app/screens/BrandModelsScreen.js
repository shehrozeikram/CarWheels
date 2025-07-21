import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, TouchableOpacity, Platform, StatusBar, Linking, ScrollView, I18nManager } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const suzukiModels = [
  {
    name: 'Suzuki Ravi',
    price: 'PKR 19.0 - 19.8 lacs',
    rating: 2,
    image: require('../assets/images/alto_new_car.png'),
  },
  {
    name: 'Suzuki Every',
    price: 'PKR 29.1 - 29.7 lacs',
    rating: 3,
    image: require('../assets/images/alto_new_car.png'),
  },
  {
    name: 'Suzuki Alto',
    price: 'PKR 29.9 - 33.3 lacs',
    rating: 3,
    image: require('../assets/images/alto_new_car.png'),
  },
  {
    name: 'Suzuki Cultus',
    price: 'PKR 40.9 - 45.9 lacs',
    rating: 3,
    image: require('../assets/images/stonic.jpg'),
  },
  {
    name: 'Suzuki Swift',
    price: 'PKR 44.6 - 47.7 lacs',
    rating: 3,
    image: require('../assets/images/civic.jpg'),
  },
];

function renderStars(rating) {
  return (
    <View style={{ flexDirection: 'row', marginTop: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={{ color: i <= rating ? '#FFD600' : '#bbb', fontSize: 18 }}>★</Text>
      ))}
    </View>
  );
}

const BrandModelsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { brand } = route.params || { brand: 'Brand' };

  // For now, only Suzuki is implemented
  const models = brand === 'Suzuki' ? suzukiModels : [];

  return (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#900C3F', direction: 'ltr' }}>
      {/* Top blue bar for Android, SafeArea for iOS */}
              <View style={{ backgroundColor: '#900C3F', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, direction: 'ltr' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: Platform.OS === 'ios' ? 60 : 56, paddingHorizontal: 12, backgroundColor: '#900C3F', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2, direction: 'ltr' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginRight: 8 }}>
            <Image source={require('../assets/images/back_arrow.png')} style={{ width: 22, height: 22, tintColor: '#fff', resizeMode: 'contain' }} />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{brand} Models</Text>
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: '#f9fafd', direction: 'ltr' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, direction: 'ltr' }} style={{ direction: 'ltr' }}>
          <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 2 }}>Local</Text>
            <Text style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>These variants are listed with ex-factory prices</Text>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            {models.map((item, idx) => (
              <View key={item.name} style={styles.modelCard}>
                <Image source={item.image} style={styles.modelImage} resizeMode="contain" />
                <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                  <Text style={styles.modelName}>{item.name}</Text>
                  <Text style={styles.modelPrice}>{item.price}</Text>
                  {renderStars(item.rating)}
                </View>
              </View>
            ))}
          </View>
          {/* Latest Videos Section */}
          <View style={{ marginTop: 32, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 6, direction: 'ltr' }}>
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
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, direction: 'ltr' }} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=N5KTyWaBAtw')}>
                <View style={{ width: 110, height: 70, backgroundColor: '#cfd8dc', borderRadius: 12, marginRight: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image source={require('../assets/images/forgotten_cars_thumb.jpg')} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
                  <View style={{ position: 'absolute', top: '30%', left: '35%', width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: '#fff', marginLeft: 2 }}>{'▶️'}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 15, color: '#222', flex: 1, flexWrap: 'wrap', fontWeight: '400' }}>Forgotten Cars of Pakistan - Episode 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, direction: 'ltr' }} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=c0C5Vl1CNQs')}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    height: 130,
    direction: 'ltr',
  },
  modelImage: {
    width: 140,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  modelPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginTop: 2,
  },
});

export default BrandModelsScreen; 