import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, Platform, StatusBar, TextInput, Image } from 'react-native';

const RegistrationModal = ({ visible, onClose, onSelectRegistration }) => {
  const [searchText, setSearchText] = useState('');

  const registrationData = [
    {
      category: 'Unregistered',
      items: ['Unregistered']
    },
    {
      category: 'Provinces',
      items: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Jammu and Kashmir']
    },
    {
      category: 'Popular Cities',
      items: ['Islamabad', 'Karachi', 'Lahore', 'Peshawar', 'Quetta', 'Rawalpindi', 'Faisalabad', 'Multan', 'Sialkot', 'Gujranwala']
    },
    {
      category: 'Other Cities',
      items: [
        'Abbottabad', 'Abdul Hakeem', 'Adda jahan khan', 'Ahmadpur East', 'Ahmed Nager Chatha', 'Ali Khan Abad',
        'Alipur', 'Arifwala', 'Attock', 'Baddomalhi', 'Bagh', 'Bahawalnagar', 'Bahawalpur', 'Bhakkar',
        'Bhalwal', 'Burewala', 'Chakwal', 'Chaman', 'Charsadda', 'Chiniot', 'Chishtian', 'Daska',
        'Dera Ghazi Khan', 'Dera Ismail Khan', 'Dera Murad Jamali', 'Dera Bugti', 'Dijkot', 'Dina',
        'Dinga', 'Dipalpur', 'Faisalabad', 'Fateh Jang', 'Ghotki', 'Gilgit', 'Gojra', 'Gujranwala',
        'Gujrat', 'Gwadar', 'Hafizabad', 'Haripur', 'Haroonabad', 'Hasilpur', 'Haveli Lakha',
        'Hazro', 'Hunza', 'Hyderabad', 'Islamabad', 'Jacobabad', 'Jahanian', 'Jalalpur Jattan',
        'Jampur', 'Jaranwala', 'Jhang', 'Jhelum', 'Kallar Kahar', 'Kalat', 'Kamalia', 'Kamoke',
        'Kandhkot', 'Karachi', 'Karak', 'Kasur', 'Khanewal', 'Khanpur', 'Kharian', 'Khushab',
        'Khuzdar', 'Kohat', 'Kot Addu', 'Kotli', 'Lahore', 'Lakki Marwat', 'Larkana', 'Layyah',
        'Lodhran', 'Mandi Bahauddin', 'Mangla', 'Mardan', 'Mianwali', 'Mirpur', 'Mirpur Khas',
        'Mithi', 'Multan', 'Muzaffarabad', 'Muzaffargarh', 'Nankana Sahib', 'Narowal', 'Naushahro Feroze',
        'Nawabshah', 'Okara', 'Pakpattan', 'Peshawar', 'Pind Dadan Khan', 'Pindi Bhattian',
        'Pindi Gheb', 'Quetta', 'Rahim Yar Khan', 'Rajanpur', 'Rawalpindi', 'Sadiqabad',
        'Sahiwal', 'Sanghar', 'Sargodha', 'Shahdadkot', 'Shahdadpur', 'Sheikhupura', 'Shikarpur',
        'Sialkot', 'Sibi', 'Skardu', 'Sukkur', 'Swabi', 'Swat', 'Tando Adam', 'Tando Allahyar',
        'Toba Tek Singh', 'Vehari', 'Wah Cantonment', 'Wazirabad', 'Zhob'
      ]
    }
  ];

  const handleSelectRegistration = (item) => {
    onSelectRegistration(item);
    onClose();
  };

  const filteredData = registrationData.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.toLowerCase().includes(searchText.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const renderItem = (item) => (
    <TouchableOpacity
      key={item}
      style={styles.listItem}
      onPress={() => handleSelectRegistration(item)}
    >
      <Text style={styles.listItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCategory = (category) => (
    <View key={category.category} style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{category.category}</Text>
      {category.items.map(renderItem)}
    </View>
  );

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
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Image source={require('../assets/images/back_arrow.png')} style={styles.backArrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Registration City</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Type to refine search"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              textAlign="left"
              textAlignVertical="center"
              writingDirection="ltr"
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.listContainer}>
          {filteredData.map(renderCategory)}
        </ScrollView>
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 16,
    color: '#999',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  listContainer: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
});

export default RegistrationModal; 