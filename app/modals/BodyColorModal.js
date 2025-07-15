import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Platform, StatusBar } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const BodyColorModal = ({ visible, onClose, onSelectColor }) => {
  const colors = [
    { name: 'White', color: '#FFFFFF', borderColor: '#E0E0E0' },
    { name: 'Silver', color: '#C0C0C0' },
    { name: 'Black', color: '#000000' },
    { name: 'Grey', color: '#808080' },
    { name: 'Blue', color: '#0000FF' },
    { name: 'Green', color: '#008000' },
    { name: 'Red', color: '#FF0000' },
    { name: 'Gold', color: '#FFD700' },
    { name: 'Maroon', color: '#800000' },
    { name: 'Beige', color: '#F5F5DC', borderColor: '#E0E0E0' },
    { name: 'Pink', color: '#FFC0CB' },
    { name: 'Brown', color: '#A52A2A' },
    { name: 'Burgundy', color: '#800020' },
    { name: 'Yellow', color: '#FFFF00' },
    { name: 'Bronze', color: '#CD7F32' },
    { name: 'Purple', color: '#800080' },
    { name: 'Turquoise', color: '#40E0D0' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Indigo', color: '#4B0082' },
    { name: 'Magenta', color: '#FF00FF' },
    { name: 'Unlisted', color: '#F0F0F0', pattern: true }
  ];

  const handleSelectColor = (colorName) => {
    onSelectColor(colorName);
    onClose();
  };

  const renderColorSwatch = (colorData, index) => (
    <TouchableOpacity
      key={index}
      style={styles.colorItem}
      onPress={() => handleSelectColor(colorData.name)}
    >
      <View style={[
        styles.colorSwatch,
        { backgroundColor: colorData.color },
        colorData.borderColor && { borderColor: colorData.borderColor, borderWidth: 1 },
        colorData.pattern && styles.unlistedPattern
      ]} />
      <Text style={styles.colorName}>{colorData.name}</Text>
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Body Color</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Color Grid */}
        <View style={styles.colorGrid}>
          {colors.map((colorData, index) => renderColorSwatch(colorData, index))}
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  colorItem: {
    width: '18%',
    alignItems: 'center',
    marginBottom: 20,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  unlistedPattern: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  colorName: {
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default BodyColorModal; 