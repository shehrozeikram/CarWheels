import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';

const CarModelModal = ({ visible, onClose, onSelectModel }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentView, setCurrentView] = useState('years'); // 'years' or 'models'

  const carYears = [
    { year: 2025, models: ['Toyota Corolla Cross', 'Honda City VX', 'Suzuki Swift VXL', 'KIA Stonic', 'MG HS', 'BYD Atto 3', 'Changan Oshan X7'] },
    { year: 2024, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2023, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2022, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2021, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2020, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2019, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2018, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2017, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2016, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2015, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2014, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2013, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2012, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2011, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2010, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2009, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2008, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2007, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2006, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2005, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2004, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2003, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2002, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2001, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 2000, models: ['Toyota Corolla Altis', 'Honda Civic RS', 'Suzuki Alto VXL', 'KIA Sportage', 'MG ZS', 'Hyundai Tucson', 'Toyota Fortuner'] },
    { year: 1999, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1998, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1997, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1996, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1995, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1994, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1993, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1992, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1991, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1990, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1989, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1988, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1987, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1986, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1985, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1984, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1983, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1982, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1981, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1980, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1979, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1978, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1977, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1976, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1975, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1974, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1973, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1972, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1971, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1970, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1969, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1968, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1967, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1966, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1965, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1964, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1963, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1962, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1961, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
    { year: 1960, models: ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Pride', 'Hyundai Santro', 'Daihatsu Mira'] },
  ];

  const handleYearSelect = (yearData) => {
    setSelectedYear(yearData);
    setCurrentView('models');
  };

  const handleModelSelect = (model) => {
    const fullModel = `${model} ${selectedYear.year}`;
    onSelectModel(fullModel);
    onClose();
    // Reset state
    setSelectedYear(null);
    setCurrentView('years');
  };

  const handleBack = () => {
    if (currentView === 'models') {
      setCurrentView('years');
      setSelectedYear(null);
    } else {
      onClose();
    }
  };

  const renderYears = () => (
    <ScrollView style={styles.listContainer}>
      {carYears.map((yearData, index) => (
        <TouchableOpacity
          key={index}
          style={styles.listItem}
          onPress={() => handleYearSelect(yearData)}
        >
          <Text style={styles.listItemText}>{yearData.year}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderModels = () => (
    <ScrollView style={styles.listContainer}>
      {selectedYear?.models.map((model, index) => (
        <TouchableOpacity
          key={index}
          style={styles.listItem}
          onPress={() => handleModelSelect(model)}
        >
          <Text style={styles.listItemText}>{model}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {currentView === 'years' ? 'Select Year' : selectedYear?.year}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        {currentView === 'years' ? renderYears() : renderModels()}
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
  backIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 18,
    color: '#ccc',
  },
});

export default CarModelModal; 