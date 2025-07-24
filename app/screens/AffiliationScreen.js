import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAffiliationStats, getAllOrganizations } from '../utils/AffiliationManager';
import Badge from '../components/Badge';

const AffiliationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalAffiliations: 0,
    totalAffiliatedUsers: 0
  });

  useEffect(() => {
    updateStats();
  }, []);

  const updateStats = () => {
    const currentStats = getAffiliationStats();
    setStats(currentStats);
  };

  const handleOrganizationRegistration = () => {
    navigation.navigate('OrganizationRegistrationScreen');
  };

  const handleEmployeeAffiliation = () => {
    navigation.navigate('EmployeeAffiliationScreen');
  };

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
        <Text style={styles.headerTitle}>Affiliation & Badges</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Affiliation Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalOrganizations}</Text>
              <Text style={styles.statLabel}>Organizations</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalAffiliations}</Text>
              <Text style={styles.statLabel}>Affiliations</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalAffiliatedUsers}</Text>
              <Text style={styles.statLabel}>Verified Users</Text>
            </View>
          </View>
        </View>

        {/* Badge Types Section */}
        <View style={styles.badgeSection}>
          <Text style={styles.sectionTitle}>Badge Types</Text>
          
          <View style={styles.badgeCard}>
            <View style={styles.badgeHeader}>
              <Badge type="organization" size="large" />
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Organization Badge</Text>
                <Text style={styles.badgeDescription}>
                  Golden badge for verified organizations and companies
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.badgeAction}
              onPress={handleOrganizationRegistration}
            >
              <Text style={styles.badgeActionText}>Register Organization</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.badgeCard}>
            <View style={styles.badgeHeader}>
              <Badge type="affiliated" size="large" />
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Affiliated User Badge</Text>
                <Text style={styles.badgeDescription}>
                  Blue badge for users affiliated with verified organizations
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.badgeAction}
              onPress={handleEmployeeAffiliation}
            >
              <Text style={styles.badgeActionText}>Get Affiliated</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Register Your Organization</Text>
              <Text style={styles.stepDescription}>
                Organizations can register to get a golden verification badge
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Affiliate Employees</Text>
              <Text style={styles.stepDescription}>
                Employees can affiliate with their organization to get blue badges
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Build Trust</Text>
              <Text style={styles.stepDescription}>
                Verified badges help build trust and credibility in the community
              </Text>
            </View>
          </View>
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
  statsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#900C3F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  badgeSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  badgeCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  badgeAction: {
    backgroundColor: '#900C3F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  badgeActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  howItWorksSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#900C3F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default AffiliationScreen; 