import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  FlatList 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  getAllOrganizations, 
  createAffiliation, 
  getUserAffiliation,
  cleanupDuplicateOrganizations
} from '../utils/AffiliationManager';
import { getCurrentUser } from './auth/AuthUtils';
import Badge from '../components/Badge';

const EmployeeAffiliationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadOrganizations();
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || ''
      }));
    }
  }, []);

  const loadOrganizations = () => {
    // Clean up any duplicate organizations in storage
    const cleanedCount = cleanupDuplicateOrganizations();
    console.log(`Cleaned up ${cleanedCount} organizations`);
    
    const orgs = getAllOrganizations();
    console.log('Loaded organizations:', orgs.map(org => ({ id: org.id, name: org.name })));
    setOrganizations(orgs);
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!selectedOrg) {
      Alert.alert('Error', 'Please select an organization');
      return false;
    }
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!formData.position.trim()) {
      Alert.alert('Error', 'Position is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const affiliation = createAffiliation(formData.email, selectedOrg.id, formData);
      
      Alert.alert(
        'Success!',
        `You have been successfully affiliated with ${selectedOrg.name} and will receive a blue verification badge.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create affiliation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOrganization = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.orgCard,
        selectedOrg?.id === item.id && styles.orgCardSelected
      ]}
      onPress={() => setSelectedOrg(item)}
    >
      <View style={styles.orgCardHeader}>
        <Badge type="organization" size="medium" />
        <View style={styles.orgCardInfo}>
          <Text style={styles.orgCardName}>{item.name}</Text>
          <Text style={styles.orgCardDescription}>
            {item.description || 'No description available'}
          </Text>
        </View>
      </View>
      {selectedOrg?.id === item.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>✓ Selected</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get Affiliated</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Badge Preview */}
        <View style={styles.badgePreview}>
          <Badge type="affiliated" size="large" />
          <Text style={styles.badgePreviewText}>
            You will receive this blue verification badge upon affiliation
          </Text>
        </View>

        {/* Organization Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Organization</Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search organizations..."
              placeholderTextColor="#9ca3af"
            />
          </View>

          {filteredOrganizations.length > 0 ? (
            <FlatList
              data={filteredOrganizations}
              renderItem={renderOrganization}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.orgList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No organizations found matching your search.' : 'No organizations available for affiliation.'}
              </Text>
            </View>
          )}
        </View>

        {/* Affiliation Form */}
        {selectedOrg && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Position *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.position}
                onChangeText={(value) => handleInputChange('position', value)}
                placeholder="Enter your position/title"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Department</Text>
              <TextInput
                style={styles.textInput}
                value={formData.department}
                onChangeText={(value) => handleInputChange('department', value)}
                placeholder="Enter your department"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        )}

        {/* Submit Button */}
        {selectedOrg && (
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Creating Affiliation...' : 'Create Affiliation'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            • Your affiliation request will be reviewed{'\n'}
            • Upon approval, you'll receive a blue verification badge{'\n'}
            • Your badge will appear on your profile and car listings{'\n'}
            • This helps build trust and credibility in the community
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#1f2937',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  badgePreview: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  badgePreviewText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  orgList: {
    marginBottom: 16,
  },
  orgCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  orgCardSelected: {
    borderColor: '#900C3F',
    backgroundColor: '#fef2f2',
  },
  orgCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orgCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orgCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  orgCardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  selectedIndicator: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#900C3F',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#900C3F',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default EmployeeAffiliationScreen; 