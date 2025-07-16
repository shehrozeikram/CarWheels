import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, ScrollView, TextInput, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LocationModal from '../../../modals/LocationModal';
import CarModelModal from '../../../modals/CarModelModal';
import RegistrationModal from '../../../modals/RegistrationModal';
import BodyColorModal from '../../../modals/BodyColorModal';
import ErrorModal from '../../../modals/ErrorModal';
import { getCurrentUser } from '../../auth/AuthUtils';

// Global state for car listings - this would ideally be in a proper state management solution
global.carListings = global.carListings || {};

const SellYourCarScreen = ({ navigation }) => {
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [carModelModalVisible, setCarModelModalVisible] = useState(false);
  const [selectedCarModel, setSelectedCarModel] = useState('');
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState('');
  const [bodyColorModalVisible, setBodyColorModalVisible] = useState(false);
  const [selectedBodyColor, setSelectedBodyColor] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [kmsDriven, setKmsDriven] = useState('');
  const [price, setPrice] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formFields = [
    { icon: '🏢', label: 'Location', hasChevron: true },
    { icon: '🚗', label: 'Car Model', hasChevron: true },
    { icon: '🏢', label: 'Registered In', hasChevron: true },
    { icon: '🎨', label: 'Body Color', hasChevron: true },
  ];

  const suggestionTags = [
    'Alloy Rims',
    'Army Officer Car',
    'Auction Sheet Available'
  ];

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 10,
      quality: 0.8,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setErrorMessage('Failed to select image. Please try again.');
        setErrorModalVisible(true);
      } else if (response.assets) {
        const newImages = response.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...newImages]);
      }
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    return selectedLocation && 
           selectedCarModel && 
           selectedRegistration && 
           selectedBodyColor && 
           descriptionText && 
           selectedImages.length > 0 &&
           kmsDriven.trim() !== '' &&
           price.trim() !== '';
  };

  // Function to get category from car model
  const getCategoryFromModel = (model) => {
    // Extract the brand and model from the full model string
    // Example: "Honda Civic 2023" -> "Honda Civic"
    const parts = model.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`;
    }
    return model;
  };

  // Function to add new listing to global state
  const addNewListingToCategory = (newListing) => {
    const category = getCategoryFromModel(selectedCarModel);
    
    // Initialize category if it doesn't exist
    if (!global.carListings[category]) {
      global.carListings[category] = [];
    }
    
    // Add the new listing to the category
    global.carListings[category].unshift(newListing); // Add to beginning of array
    
    console.log(`Added new listing to category: ${category}`);
    console.log('Updated global car listings:', global.carListings);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../../../assets/images/back_arrow.png')} style={styles.backArrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sell Your Car</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image Upload Section */}
          <View style={styles.imageUploadSection}>
            <Text style={styles.sectionTitle}>Photos *</Text>
            
            {/* Selected Images Grid */}
            {selectedImages.length > 0 && (
              <View style={styles.selectedImagesContainer}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Add Photo Button */}
            <TouchableOpacity 
              style={[
                styles.imageUploadArea,
                selectedImages.length === 0 && styles.imageUploadAreaRequired
              ]}
              onPress={pickImage}
            >
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              <Text style={[
                styles.addPhotoText,
                selectedImages.length === 0 && styles.addPhotoTextRequired
              ]}>
                {selectedImages.length === 0 ? 'Add Photo (Required)' : 'Add More Photos'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.imageInstructions}>
              {selectedImages.length === 0 
                ? 'At least one photo is required to post your ad.'
                : 'Tap on images to edit them. To reorder, select the image, hold and drag.'
              }
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Location Field */}
            <TouchableOpacity 
              style={styles.formField}
              onPress={() => setLocationModalVisible(true)}
            >
              <Text style={styles.fieldIcon}>🏢</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Location</Text>
                {selectedLocation ? (
                  <Text style={styles.fieldValue}>{selectedLocation}</Text>
                ) : (
                  <Text style={styles.fieldPlaceholder}>Select location</Text>
                )}
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>

            {/* Car Model Field */}
            <TouchableOpacity 
              style={styles.formField}
              onPress={() => setCarModelModalVisible(true)}
            >
              <Text style={styles.fieldIcon}>🚗</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Car Model</Text>
                {selectedCarModel ? (
                  <Text style={styles.fieldValue}>{selectedCarModel}</Text>
                ) : (
                  <Text style={styles.fieldPlaceholder}>Select car model</Text>
                )}
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>

            {/* Registered In Field */}
            <TouchableOpacity 
              style={styles.formField}
              onPress={() => setRegistrationModalVisible(true)}
            >
              <Text style={styles.fieldIcon}>🏢</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Registered In</Text>
                {selectedRegistration ? (
                  <Text style={styles.fieldValue}>{selectedRegistration}</Text>
                ) : (
                  <Text style={styles.fieldPlaceholder}>Select registration city</Text>
                )}
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>

            {/* Body Color Field */}
            <TouchableOpacity 
              style={styles.formField}
              onPress={() => setBodyColorModalVisible(true)}
            >
              <Text style={styles.fieldIcon}>🎨</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Body Color</Text>
                {selectedBodyColor ? (
                  <Text style={styles.fieldValue}>{selectedBodyColor}</Text>
                ) : (
                  <Text style={styles.fieldPlaceholder}>Select body color</Text>
                )}
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>

            {/* Other form fields */}
            {formFields.slice(4).map((field, index) => (
              <TouchableOpacity key={index + 4} style={styles.formField}>
                <Text style={styles.fieldIcon}>{field.icon}</Text>
                <View style={styles.fieldContent}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                </View>
                {field.hasChevron && <Text style={styles.chevronIcon}>›</Text>}
              </TouchableOpacity>
            ))}

            {/* KMs Driven */}
            <View style={styles.formField}>
              <Text style={styles.fieldIcon}>🔄</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>KMs Driven</Text>
                <TextInput 
                  style={styles.inputField}
                  placeholder="Specify KMs Driven"
                  placeholderTextColor="#999"
                  value={kmsDriven}
                  onChangeText={setKmsDriven}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Price */}
            <View style={styles.formField}>
              <Text style={styles.fieldIcon}>💰</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Price (PKR)</Text>
                <TextInput 
                  style={styles.inputField}
                  placeholder="Set a price"
                  placeholderTextColor="#999"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.formField}>
              <Text style={styles.fieldIcon}>☰</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput 
                  style={styles.descriptionInput}
                  placeholder="For Example: Alloy Rims, First Owner, etc."
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={descriptionText}
                  onChangeText={setDescriptionText}
                />
              </View>
            </View>

            {/* Suggestion Tags */}
            <View style={styles.suggestionTagsContainer}>
              {suggestionTags.map((tag, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.suggestionTag,
                    selectedTags.includes(tag) && styles.suggestionTagSelected
                  ]}
                  onPress={() => {
                    if (selectedTags.includes(tag)) {
                      // Remove tag if already selected
                      const newTags = selectedTags.filter(t => t !== tag);
                      setSelectedTags(newTags);
                      // Remove from description
                      const newDescription = descriptionText.replace(`**${tag}**`, '').trim();
                      setDescriptionText(newDescription);
                    } else {
                      // Add tag if not selected
                      const newTags = [...selectedTags, tag];
                      setSelectedTags(newTags);
                      // Add to description with bold formatting
                      const newDescription = descriptionText + (descriptionText ? ' ' : '') + `**${tag}**`;
                      setDescriptionText(newDescription);
                    }
                  }}
                >
                  <Text style={[
                    styles.suggestionTagText,
                    selectedTags.includes(tag) && styles.suggestionTagTextSelected
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.viewAllSuggestions}>
              <Text style={styles.viewAllText}>View All Suggestions</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Information Section */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            {/* Name */}
            <View style={styles.formField}>
              <Text style={styles.fieldIcon}>👤</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Name</Text>
                <Text style={styles.fieldValue}>Shehroze Ikram</Text>
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.formField}>
              <Text style={styles.fieldIcon}>📱</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <Text style={styles.fieldValue}>03214554035</Text>
              </View>
            </View>

            {/* WhatsApp Contact */}
            <View style={styles.formField}>
              <Text style={styles.fieldIcon}>💚</Text>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Allow WhatsApp Contact</Text>
              </View>
              <TouchableOpacity 
                style={[styles.toggle, whatsappEnabled && styles.toggleActive]}
                onPress={() => setWhatsappEnabled(!whatsappEnabled)}
              >
                <View style={[styles.toggleThumb, whatsappEnabled && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Post Ad Button */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity 
              style={[
                styles.postAdButton,
                !isFormValid() && styles.postAdButtonDisabled
              ]}
              onPress={() => {
                if (isFormValid()) {
                  // Create new car listing
                  const newCarListing = {
                    id: Date.now(), // Generate unique ID
                    title: selectedCarModel,
                    price: `PKR ${price} lacs`, // Use actual price
                    year: selectedCarModel.split(' ').pop(), // Extract year from model
                    km: `${kmsDriven} km`, // Use actual KMs driven
                    city: selectedLocation.split(',')[0], // Extract city from location
                    fuel: 'Petrol', // Default fuel type
                    image: selectedImages.length > 0 ? { uri: selectedImages[0] } : require('../../../assets/images/alto.webp'), // Use first selected image or default
                    isNew: true,
                    isStarred: false,
                    isUserCreated: true, // Mark as user-created
                    status: 'active', // Set initial status
                    imagesCount: selectedImages.length,
                    managed: false,
                    inspected: null,
                    description: descriptionText,
                    bodyColor: selectedBodyColor,
                    registeredIn: selectedRegistration,
                    location: selectedLocation,
                    selectedImages: selectedImages, // Store all selected images
                    // Add form data
                    formData: {
                      location: selectedLocation,
                      carModel: selectedCarModel,
                      registeredIn: selectedRegistration,
                      bodyColor: selectedBodyColor,
                      kmsDriven: kmsDriven, // Use actual KMs driven
                      price: price, // Use actual price
                      description: descriptionText,
                      images: selectedImages, // Include images in form data
                      contactInfo: {
                        name: getCurrentUser()?.name || 'Shehroze Ikram',
                        email: getCurrentUser()?.email || 'shehroze@example.com',
                        mobile: getCurrentUser()?.mobile || '03214554035',
                        whatsappEnabled: whatsappEnabled
                      }
                    }
                  };

                  // Add the new listing to the appropriate category
                  addNewListingToCategory(newCarListing);

                  // Get the category for navigation
                  const category = getCategoryFromModel(selectedCarModel);

                  // Navigate to the specific category list with success message
                  navigation.navigate('CarListScreen', { 
                    model: category,
                    showSuccessMessage: true,
                    newListing: newCarListing
                  });
                }
              }}
              disabled={!isFormValid()}
            >
              <Text style={[
                styles.postAdButtonText,
                !isFormValid() && styles.postAdButtonTextDisabled
              ]}>
                Post Your Ad
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Location Modal */}
      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onSelectLocation={setSelectedLocation}
      />

      {/* Car Model Modal */}
      <CarModelModal
        visible={carModelModalVisible}
        onClose={() => setCarModelModalVisible(false)}
        onSelectModel={setSelectedCarModel}
      />

      {/* Registration Modal */}
      <RegistrationModal
        visible={registrationModalVisible}
        onClose={() => setRegistrationModalVisible(false)}
        onSelectRegistration={setSelectedRegistration}
      />

      {/* Body Color Modal */}
      <BodyColorModal
        visible={bodyColorModalVisible}
        onClose={() => setBodyColorModalVisible(false)}
        onSelectColor={setSelectedBodyColor}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="Error"
        message={errorMessage}
        action="try_again"
      />
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
  content: {
    flex: 1,
  },
  imageUploadSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageUploadArea: {
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  imageUploadAreaRequired: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  cameraIcon: {
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraIconText: {
    fontSize: 32,
    marginBottom: 4,
  },
  plusIcon: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: 'bold',
    position: 'absolute',
    top: 8,
    right: -8,
  },
  addPhotoText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  addPhotoTextRequired: {
    color: '#ef4444',
  },
  imageInstructions: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  formSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fieldIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: '#666',
  },
  fieldPlaceholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  inputField: {
    fontSize: 14,
    color: '#222',
    padding: 0,
  },
  descriptionInput: {
    fontSize: 14,
    color: '#222',
    padding: 0,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  chevronIcon: {
    fontSize: 18,
    color: '#ccc',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  suggestionTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 8,
  },
  suggestionTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionTagSelected: {
    backgroundColor: '#2563eb',
  },
  suggestionTagText: {
    fontSize: 12,
    color: '#666',
  },
  suggestionTagTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  viewAllSuggestions: {
    marginTop: 8,
  },
  viewAllText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  contactSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  toggle: {
    width: 40,
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  bottomButtonContainer: {
    padding: 16,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  postAdButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAdButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postAdButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postAdButtonTextDisabled: {
    color: '#999',
  },
});

export default SellYourCarScreen; 